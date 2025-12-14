import z from 'zod';
import { tagString } from '../../types/tag.ts';

// GET /api/tag/default
// 기본으로 활성화 되어 있어야 할 태그 목록
export const TagDefaultResponse = z.object({
  tags: z.array(tagString),
});

// GET /api/tag/search?q=prefix
// 검색 문자열로 시작하는 태그를 최대 10개 반환
export const TagSearchResponse = z.object({
  tags: z.array(tagString),
});

// POST /api/tag
export const TagCreateRequest = z.object({
  name: z.string().max(30),
  isDefault: z.boolean().default(false),
});
