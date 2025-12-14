import { axiosClient } from '../constants';
import z from 'zod';
import {
  CreateParticipantRequest,
  CreateParticipantResponse,
  UpdateParticipantRequest,
} from '@when-to-meet/api';

/**
 * POST /api/participant
 *
 * @returns 새롭게 생성된 참가자의 ID
 */
export async function addParticipant(
  req: z.input<typeof CreateParticipantRequest>
): Promise<string> {
  const res = await axiosClient.post('/participant', req);
  if (res.status !== 201) {
    throw new Error('Failed to create participant');
  }

  const data = res.data as z.input<typeof CreateParticipantResponse>;
  return data.id;
}

/**
 * PUT /api/participant/:id
 */
export async function updateParticipant(
  req: z.input<typeof UpdateParticipantRequest> & { id: string }
): Promise<void> {
  const { id, ...payload } = req;
  const res = await axiosClient.put(`/participant/${id}`, payload);
  if (res.status !== 200) {
    throw new Error('Failed to update participant');
  }
}

/**
 * DELETE /api/participant/:id
 */
export async function deleteParticipant(id: string): Promise<void> {
  const res = await axiosClient.delete(`/participant/${id}`);
  if (res.status !== 200) {
    throw new Error('Failed to delete participant');
  }
}
