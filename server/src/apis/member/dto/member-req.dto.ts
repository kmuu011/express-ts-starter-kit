import { IsString, IsNotEmpty, MinLength, MaxLength, Matches, IsNumber, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginDto:
 *       type: object
 *       required:
 *         - id
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: 사용자 아이디
 *           example: testuser
 *           minLength: 2
 *           maxLength: 20
 *           pattern: '^[a-zA-Z0-9_]+$'
 *         password:
 *           type: string
 *           description: 사용자 비밀번호
 *           example: password123
 *           minLength: 2
 *           maxLength: 50
 */
export class LoginDto {
  @IsString({ message: '아이디는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '아이디는 필수입니다.' })
  @MinLength(2, { message: '아이디는 최소 2자 이상이어야 합니다.' })
  @MaxLength(20, { message: '아이디는 최대 20자까지 가능합니다.' })
  @Matches(/^[a-zA-Z0-9_]+$/, { message: '아이디는 영문, 숫자, 언더스코어만 사용 가능합니다.' })
  id!: string;

  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '비밀번호는 필수입니다.' })
  @MinLength(2, { message: '비밀번호는 최소 2자 이상이어야 합니다.' })
  @MaxLength(50, { message: '비밀번호는 최대 50자까지 가능합니다.' })
  password!: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     SignupDto:
 *       type: object
 *       required:
 *         - id
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: 사용자 아이디
 *           example: newuser
 *           minLength: 2
 *           maxLength: 20
 *           pattern: '^[a-zA-Z0-9_]+$'
 *         password:
 *           type: string
 *           description: 사용자 비밀번호
 *           example: newpassword123
 *           minLength: 2
 *           maxLength: 50
 */
export class SignupDto {
  @IsString({ message: '아이디는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '아이디는 필수입니다.' })
  @MinLength(2, { message: '아이디는 최소 2자 이상이어야 합니다.' })
  @MaxLength(20, { message: '아이디는 최대 20자까지 가능합니다.' })
  @Matches(/^[a-zA-Z0-9_]+$/, { message: '아이디는 영문, 숫자, 언더스코어만 사용 가능합니다.' })
  id!: string;

  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '비밀번호는 필수입니다.' })
  @MinLength(2, { message: '비밀번호는 최소 2자 이상이어야 합니다.' })
  @MaxLength(50, { message: '비밀번호는 최대 50자까지 가능합니다.' })
  password!: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     DuplicateCheckDto:
 *       type: object
 *       required:
 *         - value
 *         - type
 *       properties:
 *         value:
 *           type: string
 *           description: 검증할 값 (아이디 또는 이메일)
 *           example: testuser
 *           minLength: 1
 *           maxLength: 50
 *         type:
 *           type: integer
 *           description: 검증 타입 (1=아이디, 2=이메일)
 *           example: 1
 *           enum: [1, 2]
 */
export class DuplicateCheckDto {
  @IsString({ message: '검증할 값은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '검증할 값은 필수입니다.' })
  @MinLength(1, { message: '검증할 값은 최소 1자 이상이어야 합니다.' })
  @MaxLength(50, { message: '검증할 값은 최대 50자까지 가능합니다.' })
  value!: string;

  @Transform(({ value }) => parseInt(value))
  @IsNumber({}, { message: '검증 타입은 숫자여야 합니다.' })
  @IsIn([1, 2], { message: '검증 타입은 1(id) 또는 2(email)만 가능합니다.' })
  type!: number;
}
