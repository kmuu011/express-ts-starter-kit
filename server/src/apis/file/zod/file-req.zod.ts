import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const FileListQuerySchema = z.object({
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

export const FileParamsSchema = z.object({
  fileIdx: z.coerce.number()
    .int()
    .min(1, '파일 인덱스는 1 이상이어야 합니다.')
    .describe('파일 고유 번호')
    .openapi({ example: 1 })
});

export const FileUploadSchema = z.object({
  files: z.array(z.any())
    .min(1, '최소 1개 이상의 파일이 필요합니다.')
    .max(10, '최대 10개까지 업로드 가능합니다.')
    .describe('업로드할 파일들')
    .openapi({ 
      example: [
        {
          fieldname: 'file',
          originalname: 'example.jpg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          size: 1024000
        }
      ]
    })
});
