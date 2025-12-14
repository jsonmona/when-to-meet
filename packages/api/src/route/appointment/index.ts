import z from 'zod';
import { Participant } from '../../types/participant.ts';
import { isoDate } from '../../codec/datetime.ts';

export * from './calendar.ts';

// GET /api/appointment/count
export const CountResponse = z.object({
  count: z.number(),
});

// POST /api/appointment
export const CreateAppointmentRequest = z.object({
  name: z.string().max(80),
  startDate: isoDate,
  endDate: isoDate,

  tags: z.array(z.string()),
});

export const CreateAppointmentResponse = z.object({
  key: z.string(),
});

// GET /api/appointment/:key
export const GetAppointmentResponse = z.object({
  name: z.string(),
  startDate: isoDate,
  endDate: isoDate,

  tags: z.array(z.string()),
  participants: z.array(Participant),
});

// PUT /api/appointment/:key  (no response body)
export const UpdateAppointmentRequest = CreateAppointmentRequest;

// DELETE /api/appointment/:key  (no request & response body)
