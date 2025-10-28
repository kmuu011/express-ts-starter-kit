import { z } from 'zod';
import { 
  LoginSchema, 
  SignupSchema, 
  DuplicateCheckSchema 
} from './zod/member-req.zod';
import { 
  LoginResponseSchema, 
  SignupResponseSchema, 
  DuplicateCheckResponseSchema, 
  MemberResponseSchema, 
  ErrorResponseSchema 
} from './zod/member-res.zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

// 요청 타입들
export type LoginType = z.infer<typeof LoginSchema>;
export type SignupType = z.infer<typeof SignupSchema>;
export type DuplicateCheckType = z.infer<typeof DuplicateCheckSchema>;

// 응답 타입들
export type LoginResponseType = z.infer<typeof LoginResponseSchema>;
export type SignupResponseType = z.infer<typeof SignupResponseSchema>;
export type DuplicateCheckResponseType = z.infer<typeof DuplicateCheckResponseSchema>;
export type MemberResponseType = z.infer<typeof MemberResponseSchema>;
export type ErrorResponseType = z.infer<typeof ErrorResponseSchema>;

export const MemberModelSchema = z.object({
  idx: z.number().describe('사용자 고유 번호')
    .openapi({ example: 1 }),
  id: z.string().describe('사용자 아이디')
    .openapi({ example: 'testuser' }),
  createdAt: z.string().describe('생성일시')
    .openapi({ example: '2024-01-01T00:00:00.000Z' }),
  updatedAt: z.string().describe('수정일시')
    .openapi({ example: '2024-01-01T00:00:00.000Z' })
});

export type MemberModelType = z.infer<typeof MemberModelSchema>;
