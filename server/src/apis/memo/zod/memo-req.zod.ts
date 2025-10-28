import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const MemoListQuerySchema = z.object({
  page: z.coerce.number()
    .int()
    .min(1, '페이지는 1 이상이어야 합니다.')
    .describe('페이지 번호')
    .openapi({ example: 1 }),
  count: z.coerce.number()
    .int()
    .min(1, '개수는 1 이상이어야 합니다.')
    .max(100, '개수는 최대 100까지 가능합니다.')
    .describe('페이지당 항목 수')
    .openapi({ example: 10 })
});

export const MemoCreateSchema = z.object({
  content: z.string()
    .min(1, '내용은 최소 1자 이상이어야 합니다.')
    .max(1000, '내용은 최대 1000자까지 가능합니다.')
    .describe('메모 내용')
    .openapi({ example: '오늘 할 일을 정리해보자' })
});

export const MemoUpdateSchema = z.object({
  content: z.string()
    .min(1, '내용은 최소 1자 이상이어야 합니다.')
    .max(1000, '내용은 최대 1000자까지 가능합니다.')
    .describe('메모 내용')
    .openapi({ example: '수정된 메모 내용' })
});

export const MemoParamsSchema = z.object({
  memoIdx: z.coerce.number()
    .int()
    .min(1, '메모 인덱스는 1 이상이어야 합니다.')
    .describe('메모 고유 번호')
    .openapi({ example: 1 })
});
