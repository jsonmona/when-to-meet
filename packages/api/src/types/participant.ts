import z from 'zod';

export const Participant = z.object({
  id: z.string(),
  name: z.string().max(30),
});
