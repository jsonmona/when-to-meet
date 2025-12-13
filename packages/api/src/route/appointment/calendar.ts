import z from 'zod';
import { isoDate } from '../../codec/datetime.ts';

// GET /api/appointment/:key/calendar/:year/:month
export const GetAppointmentCalendarMonthResponse = z.object({
  /**
   * 해당 월의 날짜 순으로 되어있는 배열 (tags[0] = X월 1일, tags[1] = X월 2일, ...)
   *
   * 각 날짜는 다음 예시와 같은 형식을 가짐:
   * [
   *   ["1", "2"],
   *   ["3", "4"],
   * ]
   * 위 예시에서는 participantId=1이 tagId=2를 달고, participantId=3이 tagId=4를 단 것임.
   */
  tags: z.array(z.array(z.tuple([z.string(), z.string()]))),
});

// PUT /api/appointment/:key/calendar
export const UpdateAppointmentCalendarRequest = z.object({
  /**
   * 수정하고자 하는 참가자 ID
   */
  participantId: z.string(),

  /**
   * [날짜, 태그 ID]의 배열
   * 예:
   * [
   *   ["2020-12-30", []],
   *   ["2020-12-31", ["1", "2"]],
   * ]
   * 위 예시에서는 29일의 태그를 초기화하고, 30일에 태그 1과 2를 달았음.
   * 30일에 기존에 있던 태그 중 수정하고자 하는 참가자가 기존에 단 태그는 모두 지워지고 1과 2만 남음.
   */
  tags: z.array(z.tuple([isoDate, z.array(z.string())])),
});
