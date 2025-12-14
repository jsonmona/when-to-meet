import express from 'express';

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
