import z from 'zod';
import { tagString } from '../../types/tag.ts';

// GET /api/tag/search?q=prefix
// 검색 문자열로 시작하는 태그를 최대 10개 반환
export const TagSearchResponse = z.object({
  tags: z.array(tagString),
});
