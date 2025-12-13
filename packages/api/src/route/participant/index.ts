import z from 'zod';

// POST /api/participant
export const CreateParticipantRequest = z.object({
  appointmentKey: z.string(),
  name: z.string().max(30),
});

export const CreateParticipantResponse = z.object({
  id: z.string(),
});

// GET /api/participant/:id
export const GetParticipantResponse = z.object({
  id: z.string(),
  name: z.string(),
});

// PUT /api/participant/:id (no response body)
export const UpdateParticipantRequest = z.object({
  name: z.string().max(30),
});

// DELETE /api/participant/:id (no request & response body)
