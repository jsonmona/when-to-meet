import type { RequestHandler } from 'express';
import z from 'zod';
import { LocalDate } from 'js-joda';
import { calendarService } from '../service/calendar.ts';
import {
  GetAppointmentCalendarMonthResponse,
  UpdateAppointmentCalendarRequest,
} from '@when-to-meet/api';
import type { ParticipantTagPair } from '../model/calendar.ts';

export const getCalendarMonth: RequestHandler<
  { key: string; year: string; month: string },
  z.input<typeof GetAppointmentCalendarMonthResponse>
> = async (req, res) => {
  //TODO: nonce가 유효한지 체크하기
  const [id, nonce] = req.parsedParam.key!;
  const year = parseInt(req.params.year);
  const month = parseInt(req.params.month);

  if (!Number.isInteger(year) || !Number.isInteger(month)) {
    return res.sendStatus(400);
  }

  const data = await calendarService.getCalendarMonth(id, year, month);

  if (data === null) {
    return res.sendStatus(404);
  }

  const tags = organizeMarkPair(year, month, data);

  res.json(GetAppointmentCalendarMonthResponse.encode({ tags }));
  return;
};

export const updateCalendar: RequestHandler<
  { key: string },
  unknown,
  z.infer<typeof UpdateAppointmentCalendarRequest>
> = async (req, res) => {
  await calendarService.updateCalendar(req.body.participantId, req.body.tags);
  res.sendStatus(200);
};

/**
 * 날짜순으로 되어있는 쌍 데이터를 날짜별로 정리함
 */
function organizeMarkPair(
  year: number,
  month: number,
  pairs: ParticipantTagPair[]
): [bigint, string][][] {
  const output: [bigint, string][][] = [[]];
  let date = LocalDate.of(year, month, 1);

  for (const { calendarDate, participantId, tag } of pairs) {
    while (
      date.dayOfMonth() < calendarDate.getDate() &&
      date.monthValue() == month
    ) {
      output.push([]);
      date = date.plusDays(1);
    }

    output[output.length - 1]!.push([participantId, tag]);
  }

  while (date.monthValue() == month) {
    output.push([]);
    date = date.plusDays(1);
  }

  return output;
}
