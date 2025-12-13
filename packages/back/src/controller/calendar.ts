import type { RequestHandler } from 'express';
import z from 'zod';
import { LocalDate, nativeJs } from 'js-joda';
import { calendarService } from '../service/calendar.ts';
import {
  GetAppointmentCalendarMonthResponse,
  UpdateAppointmentCalendarRequest,
} from '@when-to-meet/api';

export const getCalendarMonth: RequestHandler<
  { key: string; year: string; month: string },
  z.input<typeof GetAppointmentCalendarMonthResponse>
> = async (req, res) => {
  const year = parseInt(req.params.year);
  const month = parseInt(req.params.month);

  if (isNaN(year) || isNaN(month)) {
    return res.sendStatus(400);
  }

  const data = await calendarService.getCalendarMonth(
    req.params.key,
    year,
    month
  );

  if (data === null) {
    return res.sendStatus(404);
  }

  const output: [string, string][][] = [];

  let date = LocalDate.of(year, month, 1);
  for (; date.monthValue() === month; date = date.plusDays(1)) {
    const now: [string, string][] = [];
    //TODO: 서비스가 날짜순으로 정렬하여 반환하게 하여 성능 개선
    for (const row of data) {
      if (LocalDate.from(nativeJs(row.calendarDate)).equals(date)) {
        now.push([row.participantId.toString(), row.tagId.toString()]);
      }
    }
    output.push(now);
  }

  res.json(GetAppointmentCalendarMonthResponse.encode({ tags: output }));
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
