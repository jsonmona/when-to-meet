import z from 'zod';
import { bigintStr } from '../../codec/integer.ts';

// POST /api/auth/logout (no body)

// POST /api/auth/code
export const LoginCodeRequest = z.object({
  code: z.base64url(),
});

// 로그인 성공시에 공통으로 쓰는 응답
export const LoginSuccessResponse = z.object({
  userId: bigintStr,
});
