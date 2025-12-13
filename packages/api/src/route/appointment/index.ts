import z from 'zod';
import { Participant } from '../../types/participant.ts';

export * from './calendar.ts';

// GET /api/appointment/count
export const CountResponse = z.object({
  count: z.number(),
});

// POST /api/appointment
export const CreateAppointmentRequest = z.object({
  name: z.string().max(80),
  startDate: z.iso.date(),
  endDate: z.iso.date(),
});

export const CreateAppointmentResponse = z.object({
  key: z.string(),
});

// GET /api/appointment/:key
export const GetAppointmentResponse = z.object({
  key: z.string(),
  name: z.string(),
  startDate: z.iso.date(),
  endDate: z.iso.date(),

  participants: z.array(Participant),
});

// PUT /api/appointment/:key  (no response body)
export const UpdateAppointmentRequest = CreateAppointmentRequest.partial();

// DELETE /api/appointment/:key  (no request & response body)
