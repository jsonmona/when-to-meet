import { axiosClient } from '../constants';
import { z } from 'zod';
import { CountResponse } from '@when-to-meet/api';

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

  const data = res.data as z.infer<typeof CountResponse>;
  return data.count;
}
