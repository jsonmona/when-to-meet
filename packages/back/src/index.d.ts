import type { Express } from 'express'; // eslint-disable-line @typescript-eslint/no-unused-vars

declare global {
  namespace Express {
    interface Request {
      parsedParam: {
        key?: [bigint, number];
        id?: bigint;
      };
    }
  }
}
