import type { RequestHandler } from 'express';

export const forgeCsrf: RequestHandler = async (req, res) => {
  res.setHeader('X-CSRF-Token', req.csrfToken());
  res.sendStatus(200);
};
