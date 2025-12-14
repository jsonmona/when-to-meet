import { axiosClient } from '../constants';
import { z } from 'zod';
import {
  CountResponse,
  CreateAppointmentRequest,
  CreateAppointmentResponse,
} from '@when-to-meet/api';

/**
 * GET /api/appointment/count
 *
 * @returns 서버상에 존재하는 약속의 총 개수
 */
export async function getAppointmentCount(): Promise<number> {
  const res = await axiosClient.get('/appointment/count');
  if (res.status !== 200) {
    throw new Error('Failed to fetch appointment count');
  }

  const data = res.data as z.input<typeof CountResponse>;
  return data.count;
}

/**
 * POST /api/appointment
 *
 * @returns 새롭게 생성된 약속 key값
 */
export async function createAppointment(
  req: z.input<typeof CreateAppointmentRequest>
): Promise<string> {
  const res = await axiosClient.post('/appointment', req);
  if (res.status !== 201) {
    throw new Error('Failed to create appointment');
  }

  const data = res.data as z.input<typeof CreateAppointmentResponse>;
  return data.key;
}
