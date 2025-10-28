import { z } from 'zod';
import { 
  MemoListQuerySchema, 
  MemoCreateSchema, 
  MemoUpdateSchema, 
  MemoParamsSchema 
} from './zod/memo-req.zod';
import { 
  MemoListResponseSchema, 
  MemoModelSchema,
  MemoCreateResponseSchema, 
  MemoUpdateResponseSchema, 
  MemoDeleteResponseSchema, 
  ErrorResponseSchema 
} from './zod/memo-res.zod';

// 요청 타입들
export type MemoListQueryType = z.infer<typeof MemoListQuerySchema>;
export type MemoCreateType = z.infer<typeof MemoCreateSchema>;
export type MemoUpdateType = z.infer<typeof MemoUpdateSchema>;
export type MemoParamsType = z.infer<typeof MemoParamsSchema>;

// 응답 타입들
export type MemoListResponseType = z.infer<typeof MemoListResponseSchema>;
export type MemoCreateResponseType = z.infer<typeof MemoCreateResponseSchema>;
export type MemoUpdateResponseType = z.infer<typeof MemoUpdateResponseSchema>;
export type MemoDeleteResponseType = z.infer<typeof MemoDeleteResponseSchema>;
export type ErrorResponseType = z.infer<typeof ErrorResponseSchema>;

// 모델 타입들
export type MemoModelType = z.infer<typeof MemoModelSchema>;