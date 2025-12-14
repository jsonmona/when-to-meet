import { axiosClient } from '../constants';
import { z } from 'zod';
import { TagDefaultResponse, TagSearchResponse } from '@when-to-meet/api';

/**
 * GET /api/tag/default
 *
 * @returns 기본으로 활성화 되어 있어야 할 태그 목록
 */
export async function getDefaultTag(): Promise<string[]> {
  const res = await axiosClient.get('/tag/default');
  if (res.status !== 200) {
    throw new Error('Failed to fetch default tag');
  }

  const data = res.data as z.infer<typeof TagDefaultResponse>;
  return data.tags;
}

/**
 * GET /api/tag/search?q=prefix
 * 검색 문자열로 시작하는 태그 목록을 가져옴
 *
 * @param prefix 검색 문자열
 * @returns 검색 결과 태그 목록
 */
export async function searchTag(prefix: string): Promise<string[]> {
  const query = new URLSearchParams();
  query.append('q', prefix);

  const res = await axiosClient.get(`/tag/search?${query}`);
  if (res.status !== 200) {
    throw new Error('Failed to search for tag');
  }

  const data = res.data as z.infer<typeof TagSearchResponse>;
  return data.tags;
}
