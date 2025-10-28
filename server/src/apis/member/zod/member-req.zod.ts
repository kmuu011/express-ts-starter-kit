import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const LoginSchema = z.object({
  id: z.string()
    .min(2, '아이디는 최소 2자 이상이어야 합니다.')
    .max(20, '아이디는 최대 20자까지 가능합니다.')
    .regex(/^[a-zA-Z0-9_]+$/, '아이디는 영문, 숫자, 언더스코어만 사용 가능합니다.')
    .describe('사용자 아이디')
    .openapi({ example: 'qa2' }),
  password: z.string()
    .min(2, '비밀번호는 최소 2자 이상이어야 합니다.')
    .max(50, '비밀번호는 최대 50자까지 가능합니다.')
    .describe('사용자 비밀번호')
    .openapi({ example: 'qa2' })
})

export const SignupSchema = z.object({
  id: z.string()
    .min(2, '아이디는 최소 2자 이상이어야 합니다.')
    .max(20, '아이디는 최대 20자까지 가능합니다.')
    .regex(/^[a-zA-Z0-9_]+$/, '아이디는 영문, 숫자, 언더스코어만 사용 가능합니다.')
    .describe('사용자 아이디')
    .openapi({ example: 'qa2' }),
  password: z.string()
    .min(2, '비밀번호는 최소 2자 이상이어야 합니다.')
    .max(50, '비밀번호는 최대 50자까지 가능합니다.')
    .describe('사용자 비밀번호')
    .openapi({ example: 'qa2' })
})

export const DuplicateCheckSchema = z.object({
  value: z.string()
    .min(1, '검증할 값은 최소 1자 이상이어야 합니다.')
    .max(20, '검증할 값은 최대 20자까지 가능합니다.')
    .describe('검증할 값 (아이디)')
    .openapi({ example: 'testuser' }),
  type: z.coerce.number()
    .int()
    .min(1, '검증 타입은 1(id)만 가능합니다.')
    .max(1, '검증 타입은 1(id)만 가능합니다.')
    .describe('검증 타입 (1=아이디')
    .openapi({ example: 1 })
});
