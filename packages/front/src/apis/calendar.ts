import { axiosClient } from '../constants';
import z from 'zod';
import {
  CreateAppointmentResponse,
  GetAppointmentCalendarMonthResponse,
  GetAppointmentResponse,
  UpdateAppointmentCalendarRequest,
} from '@when-to-meet/api';

/**
 * GET /api/appointment/:key/calendar/:year/:month
 *
 * @returns 해당 월에 존재하는 태그 목록
 */
export async function getCalendarMonth(req: {
  key: string;
  year: number;
  month: number;
}): Promise<z.input<typeof GetAppointmentCalendarMonthResponse>> {
  const { key, year, month } = req;
  const res = await axiosClient.get(
    `/appointment/${key}/calendar/${year}/${month}`
  );
  if (res.status !== 200) {
    throw new Error('Failed to get calendar');
  }

  const data = res.data as z.input<typeof GetAppointmentCalendarMonthResponse>;
  return data;
}

/**
 * PUT /api/appointment/:key/calendar
 */
export async function updateCalendar(
  req: z.input<typeof UpdateAppointmentCalendarRequest> & { key: string }
): Promise<void> {
  const { key, ...payload } = req;
  const res = await axiosClient.put(`/appointment/${key}/calendar`, payload);
  if (res.status !== 200) {
    throw new Error('Failed to update calendar');
  }
}
