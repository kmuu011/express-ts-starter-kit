import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { LoginDto, SignupDto, DuplicateCheckDto } from './zod/member-req.zod';
import { LoginResponseDto, SignupResponseDto, DuplicateCheckResponseDto, LogoutResponseDto, ErrorResponseDto } from './zod/member-res.zod';

// Member API 경로 등록 함수
export const registerMemberPaths = (registry: OpenAPIRegistry) => {
  // 로그인 API
  registry.registerPath({
    method: 'post',
    path: '/api/member/login',
    summary: '사용자 로그인',
    description: '아이디와 비밀번호로 사용자 로그인을 수행합니다.',
    tags: ['Member'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: LoginDto
          }
        }
      }
    },
    responses: {
      200: {
        description: '로그인 성공',
        content: {
          'application/json': {
            schema: LoginResponseDto
          }
        }
      },
      400: {
        description: '잘못된 요청 데이터',
        content: {
          'application/json': {
            schema: ErrorResponseDto
          }
        }
      },
      401: {
        description: '인증 실패',
        content: {
          'application/json': {
            schema: ErrorResponseDto
          }
        }
      }
    }
  });

  // 회원가입 API
  registry.registerPath({
    method: 'post',
    path: '/api/member/signup',
    summary: '사용자 회원가입',
    description: '새로운 사용자 계정을 생성합니다.',
    tags: ['Member'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: SignupDto
          }
        }
      }
    },
    responses: {
      200: {
        description: '회원가입 성공',
        content: {
          'application/json': {
            schema: SignupResponseDto
          }
        }
      },
      400: {
        description: '잘못된 요청 데이터',
        content: {
          'application/json': {
            schema: ErrorResponseDto
          }
        }
      },
    }
  });

  // 중복 체크 API
  registry.registerPath({
    method: 'get',
    path: '/api/member/duplicateCheck',
    summary: '중복 체크',
    description: '아이디 또는 이메일의 중복 여부를 확인합니다.',
    tags: ['Member'],
    request: {
      query: DuplicateCheckDto
    },
    responses: {
      200: {
        description: '중복 체크 결과',
        content: {
          'application/json': {
            schema: DuplicateCheckResponseDto
          }
        }
      },
      400: {
        description: '잘못된 요청 데이터',
        content: {
          'application/json': {
            schema: ErrorResponseDto
          }
        }
      }
    }
  });

  // 로그아웃 API
  registry.registerPath({
    method: 'post',
    path: '/api/member/logout',
    summary: '사용자 로그아웃',
    description: '현재 로그인된 사용자를 로그아웃 처리합니다.',
    tags: ['Member'],
    security: [{ cookieAuth: [] }],
    responses: {
      200: {
        description: '로그아웃 성공',
        content: {
          'application/json': {
            schema: LogoutResponseDto
          }
        }
      },
      401: {
        description: '인증되지 않은 사용자',
        content: {
          'application/json': {
            schema: ErrorResponseDto
          }
        }
      }
    }
  });
};
