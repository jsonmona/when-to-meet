import type { RequestHandler } from 'express';
import z from 'zod';
import { tagService } from '../service/tag.ts';
import { TagDefaultResponse, TagSearchResponse } from '@when-to-meet/api';

export const defaultTag: RequestHandler<
  {},
  z.input<typeof TagDefaultResponse>
> = async (req, res) => {
  const data = await tagService.defaultTag();
  const tags = data.map((tag) => tag.name);

  res.json({ tags });
};

export const searchTag: RequestHandler<
  {},
  z.input<typeof TagSearchResponse>
> = async (req, res) => {
  const searchTerm = req.query.q?.toString() ?? '';

  const data = await tagService.searchTag(searchTerm, 10);
  const tags = data.map((tag) => tag.name);

  res.json({ tags });
};
