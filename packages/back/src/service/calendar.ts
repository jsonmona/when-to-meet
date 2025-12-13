import { convert, LocalDate } from 'js-joda';
import {
  participantMarkRepository,
  type IParticipantMarkRepository,
} from '../repository/participantMark.ts';
import type { ParticipantMarkModel } from '../prisma-generated/models.ts';

export interface ICalendarService {
  /**
   * 캘린더에 표시된 내용 한달치를 가져옴
   *
   * @param key 약속 key값
   * @param year 해당 연도
   * @param month 해당 월
   *
   * @returns 캘린더 내용. 만약 해당 약속이 존재하지 않으면 null.
   */
  getCalendarMonth(
    key: string,
    year: number,
    month: number
  ): Promise<ParticipantMarkModel[] | null>;

  /**
   * 캘린더 내용을 갱신함
   *
   * @param id 수정하고자 하는 참가자 ID
   * @param updates 수정내용. [날짜, 태그 ID들]의 배열 형태.
   */
  updateCalendar(id: string, updates: [Date, string[]][]): Promise<void>;
}

export class CalendarService implements ICalendarService {
  repository: IParticipantMarkRepository;

  constructor(repository: IParticipantMarkRepository) {
    this.repository = repository;
  }

  async getCalendarMonth(
    key: string,
    year: number,
    month: number
  ): Promise<ParticipantMarkModel[] | null> {
    const intKey = parseInt(key);
    if (isNaN(intKey)) {
      return null;
    }

    const startDate = LocalDate.of(year, month, 1);
    const endDate = startDate.plusMonths(1).minusDays(1);

    return await this.repository.getCalendarRange(
      intKey,
      convert(startDate).toDate(),
      convert(endDate).toDate()
    );
  }

  async updateCalendar(id: string, updates: [Date, string[]][]): Promise<void> {
    const participantId = parseInt(id);
    if (isNaN(participantId)) {
      throw new Error('invalid id format');
    }

    await this.repository.updateCalendar(
      participantId,
      updates.map(([date, tags]) => [
        date,
        tags.map((tagId) => parseInt(tagId)),
      ])
    );
  }
}

export const calendarService = new CalendarService(participantMarkRepository);
