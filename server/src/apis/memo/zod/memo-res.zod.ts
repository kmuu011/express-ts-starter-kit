import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const MemoModelSchema = z.object({
  idx: z.number().describe('메모 고유 번호')
    .openapi({ example: 1 }),
  memberIdx: z.number().describe('회원 고유 번호')
    .openapi({ example: 1 }),
  content: z.string().describe('메모 내용')
    .openapi({ example: '오늘 할 일을 정리해보자' }),
  createdAt: z.string().describe('생성일시')
    .openapi({ example: '2024-01-01T00:00:00.000Z' }),
  updatedAt: z.string().describe('수정일시')
    .openapi({ example: '2024-01-01T00:00:00.000Z' })
});

export const MemoListResponseSchema = z.object({
  itemList: z.array(MemoModelSchema).describe('메모 목록'),
  page: z.number().describe('현재 페이지')
    .openapi({ example: 1 }),
  count: z.number().describe('페이지당 항목 수')
    .openapi({ example: 10 }),
  totalCount: z.number().describe('전체 항목 수')
    .openapi({ example: 25 }),
  totalPage: z.number().describe('전체 페이지 수')
    .openapi({ example: 3 })
});

export const MemoCreateResponseSchema = z.object({
  idx: z.number().describe('생성된 메모 고유 번호')
    .openapi({ example: 1 })
});

export const MemoUpdateResponseSchema = z.object({
  result: z.boolean().describe('요청 성공 여부')
    .openapi({ example: true })
});

export const MemoDeleteResponseSchema = z.object({
  result: z.boolean().describe('요청 성공 여부')
    .openapi({ example: true })
});

export const ErrorResponseSchema = z.object({
  status: z.number().describe('HTTP 상태 코드')
    .openapi({ example: 400 }),
  errors: z.string().describe('에러 타입')
    .openapi({ example: 'Invalid input data' }),
  message: z.string().describe('에러 메시지')
    .openapi({ example: 'content: Invalid input: expected string, received undefined' })
});
