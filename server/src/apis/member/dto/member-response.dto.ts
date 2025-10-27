import { Exclude, Expose } from 'class-transformer';

/**
 * @swagger
 * components:
 *   schemas:
 *     MemberResponseDto:
 *       type: object
 *       properties:
 *         idx:
 *           type: integer
 *           description: 사용자 고유 번호
 *           example: 1
 *         id:
 *           type: string
 *           description: 사용자 아이디
 *           example: testuser
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 생성일시
 *           example: '2024-01-01T00:00:00.000Z'
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 수정일시
 *           example: '2024-01-01T00:00:00.000Z'
 */
export class MemberResponseDto {
  @Expose()
  idx!: number;

  @Expose()
  id!: string;

  @Exclude()
  password?: string;

  @Expose()
  createdAt!: string;

  @Expose()
  updatedAt!: string;

  constructor(partial: Partial<MemberResponseDto>) {
    Object.assign(this, partial);
  }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginResponseDto:
 *       type: object
 *       properties:
 *         tokenCode:
 *           type: string
 *           description: JWT 토큰 코드
 *           example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 *         member:
 *           $ref: '#/components/schemas/MemberResponseDto'
 */
export class LoginResponseDto {
  @Expose()
  tokenCode!: string;

  @Expose()
  member!: MemberResponseDto;

  constructor(partial: Partial<LoginResponseDto>) {
    Object.assign(this, partial);
  }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     DuplicateCheckResponseDto:
 *       type: object
 *       properties:
 *         isDuplicated:
 *           type: boolean
 *           description: 중복 여부
 *           example: false
 */
export class DuplicateCheckResponseDto {
  @Expose()
  isDuplicated!: boolean;

  constructor(partial: Partial<DuplicateCheckResponseDto>) {
    Object.assign(this, partial);
  }
}
