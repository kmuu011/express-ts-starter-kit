import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { FileListQuerySchema, FileParamsSchema } from './zod/file-req.zod';
import { FileListResponseSchema, FileModelSchema, FileUploadResponseSchema, FileDownloadResponseSchema, FileDeleteResponseSchema, ErrorResponseSchema } from './zod/file-res.zod';

// File API 경로 등록 함수
export const registerFilePaths = (registry: OpenAPIRegistry) => {
  // 파일 목록 조회 API
  registry.registerPath({
    method: 'get',
    path: '/api/file',
    summary: '파일 목록 조회',
    description: '업로드된 파일 목록을 페이지네이션으로 조회합니다.',
    tags: ['File'],
    security: [{ cookieAuth: [] }],
    request: {
      query: FileListQuerySchema
    },
    responses: {
      200: {
        description: '파일 목록 조회 성공',
        content: {
          'application/json': {
            schema: FileListResponseSchema
          }
        }
      },
      400: {
        description: '잘못된 요청 데이터',
        content: {
          'application/json': {
            schema: ErrorResponseSchema
          }
        }
      },
      401: {
        description: '인증되지 않은 사용자',
        content: {
          'application/json': {
            schema: ErrorResponseSchema
          }
        }
      }
    }
  });

  // 파일 상세 조회 API
  registry.registerPath({
    method: 'get',
    path: '/api/file/{fileIdx}',
    summary: '파일 상세 조회',
    description: '특정 파일의 상세 정보를 조회합니다.',
    tags: ['File'],
    security: [{ cookieAuth: [] }],
    request: {
      params: FileParamsSchema
    },
    responses: {
      200: {
        description: '파일 상세 조회 성공',
        content: {
          'application/json': {
            schema: FileModelSchema
          }
        }
      },
      400: {
        description: '잘못된 요청 데이터',
        content: {
          'application/json': {
            schema: ErrorResponseSchema
          }
        }
      },
      401: {
        description: '인증되지 않은 사용자',
        content: {
          'application/json': {
            schema: ErrorResponseSchema
          }
        }
      },
      404: {
        description: '파일을 찾을 수 없음',
        content: {
          'application/json': {
            schema: ErrorResponseSchema
          }
        }
      }
    }
  });

  // 파일 업로드 API
  registry.registerPath({
    method: 'post',
    path: '/api/file/upload',
    summary: '파일 업로드',
    description: '새로운 파일을 업로드합니다.',
    tags: ['File'],
    security: [{ cookieAuth: [] }],
    request: {
      body: {
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                files: {
                  type: 'array',
                  items: {
                    type: 'string',
                    format: 'binary'
                  },
                  description: '업로드할 파일들'
                }
              },
              required: ['files']
            }
          }
        }
      }
    },
    responses: {
      200: {
        description: '파일 업로드 성공',
        content: {
          'application/json': {
            schema: FileUploadResponseSchema
          }
        }
      },
      400: {
        description: '잘못된 요청 데이터',
        content: {
          'application/json': {
            schema: ErrorResponseSchema
          }
        }
      },
      401: {
        description: '인증되지 않은 사용자',
        content: {
          'application/json': {
            schema: ErrorResponseSchema
          }
        }
      }
    }
  });

  // 파일 다운로드 API
  registry.registerPath({
    method: 'post',
    path: '/api/file/{fileIdx}/download',
    summary: '파일 다운로드',
    description: '특정 파일을 다운로드합니다.',
    tags: ['File'],
    security: [{ cookieAuth: [] }],
    request: {
      params: FileParamsSchema
    },
    responses: {
      200: {
        description: '파일 다운로드 성공',
        content: {
          'application/octet-stream': {
            schema: {
              type: 'string',
              format: 'binary'
            }
          }
        }
      },
      400: {
        description: '잘못된 요청 데이터',
        content: {
          'application/json': {
            schema: ErrorResponseSchema
          }
        }
      },
      401: {
        description: '인증되지 않은 사용자',
        content: {
          'application/json': {
            schema: ErrorResponseSchema
          }
        }
      },
      404: {
        description: '파일을 찾을 수 없음',
        content: {
          'application/json': {
            schema: ErrorResponseSchema
          }
        }
      }
    }
  });

  // 파일 삭제 API
  registry.registerPath({
    method: 'delete',
    path: '/api/file/{fileIdx}',
    summary: '파일 삭제',
    description: '기존 파일을 삭제합니다.',
    tags: ['File'],
    security: [{ cookieAuth: [] }],
    request: {
      params: FileParamsSchema
    },
    responses: {
      200: {
        description: '파일 삭제 성공',
        content: {
          'application/json': {
            schema: FileDeleteResponseSchema
          }
        }
      },
      400: {
        description: '잘못된 요청 데이터',
        content: {
          'application/json': {
            schema: ErrorResponseSchema
          }
        }
      },
      401: {
        description: '인증되지 않은 사용자',
        content: {
          'application/json': {
            schema: ErrorResponseSchema
          }
        }
      },
      404: {
        description: '파일을 찾을 수 없음',
        content: {
          'application/json': {
            schema: ErrorResponseSchema
          }
        }
      }
    }
  });
};
