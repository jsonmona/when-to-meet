import { prisma } from './prisma.ts';
import type { ParticipantMarkModel } from '../prisma-generated/models.ts';

export interface IParticipantMarkRepository {
  /**
   * 캘린더에서 특정 범위를 불러옴
   *
   * @param appointmentId 약속 ID
   * @param startDate 시작날짜 (포함)
   * @param endDate 종료날짜 (포함)
   */
  getCalendarRange(
    appointmentId: number,
    startDate: Date,
    endDate: Date
  ): Promise<ParticipantMarkModel[]>;

  /**
   * 캘린더 내용을 갱신함.
   * 주어진 참가자가 기록한 태그 중 업데이트 내역에 포함된 날짜들은
   * 전부 지워진 후에 주어진 내용으로 덮어써짐.
   *
   * @param participantId 참가자 ID
   * @param updates 수정내용. [날짜, 태그 ID들]의 배열 형태.
   */
  updateCalendar(
    participantId: number,
    updates: [Date, number[]][]
  ): Promise<void>;
}

export class ParticipantMarkRepository implements IParticipantMarkRepository {
  constructor() {}

  async getCalendarRange(
    appointmentId: number,
    startDate: Date,
    endDate: Date
  ): Promise<ParticipantMarkModel[]> {
    const data = await prisma.participantMark.findMany({
      where: {
        participant: {
          appointmentId,
        },
        calendarDate: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return data;
  }

  async updateCalendar(
    participantId: number,
    updates: [Date, number[]][]
  ): Promise<void> {
    prisma.$transaction([
      prisma.participantMark.deleteMany({
        where: {
          participantId,
          calendarDate: {
            in: updates.map((x) => x[0]),
          },
        },
      }),
      prisma.participantMark.createMany({
        data: updates.flatMap(([date, tags]) =>
          tags.map((tagId) => ({
            participantId,
            calendarDate: date,
            tagId,
          }))
        ),
      }),
    ]);
  }
}

export const participantMarkRepository = new ParticipantMarkRepository();
