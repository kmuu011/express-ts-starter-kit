import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const FileModelSchema = z.object({
  idx: z.number().describe('파일 고유 번호')
    .openapi({ example: 1 }),
  fileKey: z.string().describe('파일 키')
    .openapi({ example: 'h57f36js6ocv3esvpi96doomlnem2rqw_1761570900908.jpg' }),
  fileName: z.string().describe('파일명')
    .openapi({ example: 'example' }),
  fileType: z.string().describe('파일 타입')
    .openapi({ example: 'jpg' }),
  fileSize: z.number().describe('파일 크기 (바이트)')
    .openapi({ example: 1024000 }),
  memberIdx: z.number().describe('업로드한 회원 고유 번호')
    .openapi({ example: 1 }),
  createdAt: z.string().describe('생성일시')
    .openapi({ example: '2024-01-01T00:00:00.000Z' })
});

export const FileListResponseSchema = z.object({
  itemList: z.array(FileModelSchema).describe('파일 목록'),
  page: z.number().describe('현재 페이지')
    .openapi({ example: 1 }),
  count: z.number().describe('페이지당 항목 수')
    .openapi({ example: 10 }),
  totalCount: z.number().describe('전체 항목 수')
    .openapi({ example: 25 }),
  totalPage: z.number().describe('전체 페이지 수')
    .openapi({ example: 3 })
});

export const FileUploadResponseSchema = z.object({
  result: z.boolean().describe('요청 성공 여부')
    .openapi({ example: true }),
  message: z.string().describe('응답 메시지')
    .openapi({ example: '파일 업로드가 완료되었습니다.' })
});

export const FileDownloadResponseSchema = z.object({
  result: z.boolean().describe('요청 성공 여부')
    .openapi({ example: true }),
  message: z.string().describe('응답 메시지')
    .openapi({ example: '파일 다운로드가 시작됩니다.' })
});

export const FileDeleteResponseSchema = z.object({
  result: z.boolean().describe('요청 성공 여부')
    .openapi({ example: true }),
  message: z.string().describe('응답 메시지')
    .openapi({ example: '파일이 삭제되었습니다.' })
});

export const ErrorResponseSchema = z.object({
  status: z.number().describe('HTTP 상태 코드')
    .openapi({ example: 400 }),
  errors: z.string().describe('에러 타입')
    .openapi({ example: 'Invalid input data' }),
  message: z.string().describe('에러 메시지')
    .openapi({ example: 'fileIdx: Invalid input: expected number, received string' })
});
