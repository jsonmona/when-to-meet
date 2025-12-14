import z from 'zod';
import { appointmentKey, bigintStr } from '../../codec/integer.ts';

// POST /api/participant
export const CreateParticipantRequest = z.object({
  appointmentKey: appointmentKey,
  name: z.string().max(30),
});

export const CreateParticipantResponse = z.object({
  id: bigintStr,
});

// PUT /api/participant/:id (no response body)
export const UpdateParticipantRequest = z.object({
  name: z.string().max(30),
});

// DELETE /api/participant/:id (no request & response body)
