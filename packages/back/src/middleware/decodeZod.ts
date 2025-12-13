import type { Request, Response, NextFunction } from 'express';
import z from 'zod';

export const decodeZod =
  (schema: z.ZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: z.treeifyError(result.error),
      });
    }

    req.body = result.data;
    next();
  };
