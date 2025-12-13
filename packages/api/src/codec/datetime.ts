import z from 'zod';

export const isoDate = z.codec(z.iso.date(), z.date(), {
  decode: (isoString) => new Date(isoString),
  encode: (date) => date.toISOString().substring(0, 10),
});
