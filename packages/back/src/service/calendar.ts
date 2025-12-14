import { convert, LocalDate } from 'js-joda';
import {
  participantMarkRepository,
  type IParticipantMarkRepository,
} from '../repository/participantMark.ts';
import type { ParticipantTagPair } from '../model/calendar.ts';

export interface ICalendarService {
  /**
   * 캘린더에 표시된 내용 한달치를 가져옴
   *
   * @param id 약속 ID
   * @param year 해당 연도
   * @param month 해당 월
   *
   * @returns 날짜순으로 오름차순 정렬된 캘린더 내용. 만약 해당 약속이 존재하지 않으면 null.
   */
  getCalendarMonth(
    id: bigint,
    year: number,
    month: number
  ): Promise<ParticipantTagPair[] | null>;

  /**
   * 캘린더 내용을 갱신함
   *
   * @param id 수정하고자 하는 참가자 ID
   * @param updates 수정내용. [날짜, 태그 ID들]의 배열 형태.
   */
  updateCalendar(id: bigint, updates: [Date, string[]][]): Promise<void>;
}

export class CalendarService implements ICalendarService {
  repository: IParticipantMarkRepository;

  constructor(repository: IParticipantMarkRepository) {
    this.repository = repository;
  }

  async getCalendarMonth(
    id: bigint,
    year: number,
    month: number
  ): Promise<ParticipantTagPair[] | null> {
    const startDate = LocalDate.of(year, month, 1);
    const endDate = startDate.plusMonths(1).minusDays(1);

    return await this.repository.getCalendarRange(
      id,
      convert(startDate).toDate(),
      convert(endDate).toDate()
    );
  }

  async updateCalendar(id: bigint, updates: [Date, string[]][]): Promise<void> {
    await this.repository.updateCalendar(id, updates);
  }
}

export const calendarService = new CalendarService(participantMarkRepository);
