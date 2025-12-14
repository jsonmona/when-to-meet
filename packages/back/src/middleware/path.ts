import { appointmentKey } from '@when-to-meet/api/src/codec/integer.ts';
import type { Request, Response, NextFunction } from 'express';
import z from 'zod';

/**
 * `key`를 [bigint, number]로, `id`를 bigint로 변환
 */
export const parsePathParam = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.parsedParam = {};

  if ('key' in req.params) {
    const result = appointmentKey.safeParse(req.params.key);
    if (!result.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: z.treeifyError(result.error),
      });
    }
    req.parsedParam.key = result.data;
  }

  if ('id' in req.params) {
    try {
      req.parsedParam.id = BigInt(req.params.id);
    } catch (e) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: 'id is not an integer',
      });
    }
  }

  next();
};
