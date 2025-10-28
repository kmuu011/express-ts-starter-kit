import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { MemoListQuerySchema, MemoCreateSchema, MemoUpdateSchema, MemoParamsSchema } from './zod/memo-req.zod';
import { MemoListResponseSchema, MemoModelSchema, MemoCreateResponseSchema, MemoUpdateResponseSchema, MemoDeleteResponseSchema, ErrorResponseSchema } from './zod/memo-res.zod';

// Memo API 경로 등록 함수
export const registerMemoPaths = (registry: OpenAPIRegistry) => {
  // 메모 목록 조회 API
  registry.registerPath({
    method: 'get',
    path: '/api/memo',
    summary: '메모 목록 조회',
    description: '사용자의 메모 목록을 페이지네이션으로 조회합니다.',
    tags: ['Memo'],
    security: [{ cookieAuth: [] }],
    request: {
      query: MemoListQuerySchema
    },
    responses: {
      200: {
        description: '메모 목록 조회 성공',
        content: {
          'application/json': {
            schema: MemoListResponseSchema
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

  // 메모 상세 조회 API
  registry.registerPath({
    method: 'get',
    path: '/api/memo/{memoIdx}',
    summary: '메모 상세 조회',
    description: '특정 메모의 상세 정보를 조회합니다.',
    tags: ['Memo'],
    security: [{ cookieAuth: [] }],
    request: {
      params: MemoParamsSchema
    },
    responses: {
      200: {
        description: '메모 상세 조회 성공',
        content: {
          'application/json': {
            schema: MemoModelSchema
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
        description: '메모를 찾을 수 없음',
        content: {
          'application/json': {
            schema: ErrorResponseSchema
          }
        }
      }
    }
  });

  // 메모 생성 API
  registry.registerPath({
    method: 'post',
    path: '/api/memo',
    summary: '메모 생성',
    description: '새로운 메모를 생성합니다.',
    tags: ['Memo'],
    security: [{ cookieAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: MemoCreateSchema
          }
        }
      }
    },
    responses: {
      200: {
        description: '메모 생성 성공',
        content: {
          'application/json': {
            schema: MemoCreateResponseSchema
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

  // 메모 수정 API
  registry.registerPath({
    method: 'put',
    path: '/api/memo/{memoIdx}',
    summary: '메모 수정',
    description: '기존 메모의 내용을 수정합니다.',
    tags: ['Memo'],
    security: [{ cookieAuth: [] }],
    request: {
      params: MemoParamsSchema,
      body: {
        content: {
          'application/json': {
            schema: MemoUpdateSchema
          }
        }
      }
    },
    responses: {
      200: {
        description: '메모 수정 성공',
        content: {
          'application/json': {
            schema: MemoUpdateResponseSchema
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
        description: '메모를 찾을 수 없음',
        content: {
          'application/json': {
            schema: ErrorResponseSchema
          }
        }
      }
    }
  });

  // 메모 삭제 API
  registry.registerPath({
    method: 'delete',
    path: '/api/memo/{memoIdx}',
    summary: '메모 삭제',
    description: '기존 메모를 삭제합니다.',
    tags: ['Memo'],
    security: [{ cookieAuth: [] }],
    request: {
      params: MemoParamsSchema
    },
    responses: {
      200: {
        description: '메모 삭제 성공',
        content: {
          'application/json': {
            schema: MemoDeleteResponseSchema
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
        description: '메모를 찾을 수 없음',
        content: {
          'application/json': {
            schema: ErrorResponseSchema
          }
        }
      }
    }
  });
};
