import { z } from 'zod';
import { 
  FileListQuerySchema, 
  FileParamsSchema, 
  FileUploadSchema 
} from './zod/file-req.zod';
import { 
  FileListResponseSchema, 
  FileModelSchema,
  FileUploadResponseSchema, 
  FileDownloadResponseSchema, 
  FileDeleteResponseSchema, 
  ErrorResponseSchema 
} from './zod/file-res.zod';

// 요청 타입들
export type FileListQueryType = z.infer<typeof FileListQuerySchema>;
export type FileParamsType = z.infer<typeof FileParamsSchema>;
export type FileUploadType = z.infer<typeof FileUploadSchema>;

// 응답 타입들
export type FileListResponseType = z.infer<typeof FileListResponseSchema>;
export type FileUploadResponseType = z.infer<typeof FileUploadResponseSchema>;
export type FileDownloadResponseType = z.infer<typeof FileDownloadResponseSchema>;
export type FileDeleteResponseType = z.infer<typeof FileDeleteResponseSchema>;
export type ErrorResponseType = z.infer<typeof ErrorResponseSchema>;

// 모델 타입들
export type FileModelType = z.infer<typeof FileModelSchema>;
