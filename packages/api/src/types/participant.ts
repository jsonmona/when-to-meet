import z from 'zod';
import { bigintStr } from '../codec/integer.ts';

export const Participant = z.object({
  id: bigintStr,
  name: z.string().max(30),
});
