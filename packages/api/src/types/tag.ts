import z from 'zod';

export const tagString = z
  .string()
  .max(30)
  .refine((str) => str === str.normalize('NFC'));
