import type { RequestHandler } from 'express';

export const health: RequestHandler = (req, res) => {
  res.send('Good');
};
