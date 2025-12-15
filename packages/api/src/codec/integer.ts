import z from 'zod';
import bs58 from 'bs58';

export const bigintStr = z.codec(z.string(), z.bigint(), {
  decode: (str) => BigInt(str),
  encode: (bigint) => bigint.toString(),
});

export const appointmentKey = z.codec(
  z.string().regex(/[0-9A-Za-z]{1,20}/),
  z.tuple([z.bigint(), z.number()]),
  {
    decode: (key, ctx): [bigint, number] => {
      try {
        const buffer = bs58.decode(key);
        const view = new DataView(normalizeBuffer(buffer).buffer);

        const id = view.getBigUint64(0, true);
        const nonce = view.getUint16(8, true);
        return [id, nonce];
      } catch (err) {
        ctx.issues.push({
          code: 'invalid_format',
          format: 'regex',
          input: key,
          message: 'invalid key format',
        });
        return z.NEVER;
      }
    },
    encode: ([id, nonce]) => {
      const buffer = new ArrayBuffer(10);
      const view = new DataView(buffer);
      view.setBigUint64(0, id, true);
      view.setUint16(8, nonce, true);

      return bs58.encode(new Uint8Array(buffer));
    },
  }
);

function normalizeBuffer(inputView: Uint8Array): Uint8Array {
  const TARGET_LENGTH = 10;

  const outputView = new Uint8Array(TARGET_LENGTH);
  const currentLength = inputView.length;

  if (currentLength < TARGET_LENGTH) {
    outputView.set(inputView, TARGET_LENGTH - currentLength);
  } else {
    const startOffset = currentLength - TARGET_LENGTH;
    const trimmedParams = inputView.subarray(startOffset);
    outputView.set(trimmedParams, 0);
  }

  return outputView;
}
