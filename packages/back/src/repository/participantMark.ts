import { prisma } from './prisma.ts';
import type { ParticipantMarkModel } from '../prisma-generated/models.ts';
import type { ParticipantTagPair } from '../model/calendar.ts';

export interface IParticipantMarkRepository {
  /**
   * 캘린더에서 특정 범위를 불러옴.
   *
   * @param appointmentId 약속 ID
   * @param startDate 시작날짜 (포함)
   * @param endDate 종료날짜 (포함)
   *
   * @returns 참가자가 각 날짜에 표시한 정보. 날짜순으로 정렬되어 있음.
   */
  getCalendarRange(
    appointmentId: bigint,
    startDate: Date,
    endDate: Date
  ): Promise<ParticipantTagPair[]>;

  /**
   * 캘린더 내용을 갱신함.
   * 주어진 참가자가 기록한 태그 중 업데이트 내역에 포함된 날짜들은
   * 전부 지워진 후에 주어진 내용으로 덮어써짐.
   *
   * @param participantId 참가자 ID
   * @param updates 수정내용. [날짜, 태그 ID들]의 배열 형태.
   */
  updateCalendar(
    participantId: bigint,
    updates: [Date, string[]][]
  ): Promise<void>;
}

export class ParticipantMarkRepository implements IParticipantMarkRepository {
  constructor() {}

  async getCalendarRange(
    appointmentId: bigint,
    startDate: Date,
    endDate: Date
  ): Promise<ParticipantTagPair[]> {
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
      select: {
        calendarDate: true,
        participantId: true,
        tag: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        calendarDate: 'asc',
      },
    });

    return data.map((x) => ({ ...x, tag: x.tag.name }));
  }

  async updateCalendar(
    participantId: bigint,
    updates: [Date, string[]][]
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const tagNameToId = new Map<string, bigint>();
      const tagMap = await tx.tag.findMany({
        where: {
          name: {
            in: updates.flatMap(([_, tagName]) => tagName),
          },
        },
        select: {
          id: true,
          name: true,
        },
      });

      for (const mapping of tagMap) {
        tagNameToId.set(mapping.name, mapping.id);
      }
      const updateContents = updates.flatMap(([date, tagNames]) =>
        tagNames.map((tagName) => {
          const tagId = tagNameToId.get(tagName!);
          if (tagId === undefined) throw Error('unknown tag');

          return {
            participantId,
            calendarDate: date,
            tagId,
          };
        })
      );

      await tx.participantMark.deleteMany({
        where: {
          participantId,
          calendarDate: {
            in: updates.map((x) => x[0]),
          },
        },
      });

      await tx.participantMark.createMany({
        data: updateContents,
      });
    });
  }
}

export const participantMarkRepository = new ParticipantMarkRepository();
