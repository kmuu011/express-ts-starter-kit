import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const LoginResponseSchema = z.object({
  sessionKey: z.string().describe('JWT 토큰 코드')
    .openapi({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
});

export const SignupResponseSchema = z.object({
  result: z.boolean().describe('요청 성공 여부')
    .openapi({ example: true })
});

export const DuplicateCheckResponseSchema = z.object({
  isDuplicated: z.boolean().describe('중복 여부')
    .openapi({ example: false })
});

export const MemberResponseSchema = z.object({
  idx: z.number().describe('사용자 고유 번호')
    .openapi({ example: 1 }),
  id: z.string().describe('사용자 아이디')
    .openapi({ example: 'testuser' }),
  createdAt: z.string().describe('생성일시')
    .openapi({ example: '2024-01-01T00:00:00.000Z' }),
  updatedAt: z.string().describe('수정일시')
    .openapi({ example: '2024-01-01T00:00:00.000Z' })
});

export const LogoutResponseSchema = z.object({
  result: z.boolean().describe('요청 성공 여부')
    .openapi({ example: true })
});

export const ErrorResponseSchema = z.object({
  status: z.number().describe('HTTP 상태 코드')
    .openapi({ example: 400 }),
  errors: z.string().describe('에러 타입')
    .openapi({ example: 'Invalid input data' }),
  message: z.string().describe('에러 메시지')
    .openapi({ example: 'id: Invalid input: expected string, received undefined' })
});
