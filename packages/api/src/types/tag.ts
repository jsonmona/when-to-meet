import z from 'zod';

export const Tag = z.object({
  id: z.string(),
  name: z.string().max(30),
});
