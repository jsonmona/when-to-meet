import z from 'zod';

export const bigintStr = z.codec(z.string(), z.bigint(), {
  decode: (str) => BigInt(str),
  encode: (bigint) => bigint.toString(),
});

export const appointmentKey = z.codec(
  z.string().regex(/\d+-\d+/),
  z.tuple([z.bigint(), z.number()]),
  {
    decode: (key, ctx): [bigint, number] => {
      try {
        const [id, nonce] = key.split('-');

        // regex 확인했기 때문에 undefined일 수 없음
        const parsedId = BigInt(id!);
        const parsedNonce = parseInt(nonce!);
        return [parsedId, parsedNonce];
      } catch (err: any) {
        ctx.issues.push({
          code: 'invalid_format',
          format: 'regex',
          input: key,
          message: err.message,
        });
        return z.NEVER;
      }
    },
    encode: ([id, nonce]) => `${id}-${nonce}`,
  }
);
