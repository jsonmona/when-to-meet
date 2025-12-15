import { axiosClient } from '../constants';

/**
 * GET /api/auth/csrf-token
 * 새 CSRF 토큰을 받아온 다음 기본값으로 저장함.
 *
 * @returns 새로 생성된 CSRF 토큰. 보통 직접 사용할 일은 없음.
 */
export async function getCsrfToken(): Promise<string> {
  const res = await axiosClient.get('/auth/csrf-token');
  if (res.status !== 200) {
    throw new Error('Failed to fetch csrf token');
  }

  const token = res.headers['x-csrf-token'];
  axiosClient.defaults.headers.common['x-csrf-token'] = token;

  return token;
}
