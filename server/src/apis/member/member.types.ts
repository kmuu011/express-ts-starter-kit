import { z } from 'zod';
import { 
  LoginDto, 
  SignupDto, 
  DuplicateCheckDto 
} from './zod/member-req.zod';
import { 
  LoginResponseDto, 
  SignupResponseDto, 
  DuplicateCheckResponseDto, 
  MemberResponseDto, 
  ErrorResponseDto 
} from './zod/member-res.zod';

// 요청 타입들
export type LoginDtoType = z.infer<typeof LoginDto>;
export type SignupDtoType = z.infer<typeof SignupDto>;
export type DuplicateCheckDtoType = z.infer<typeof DuplicateCheckDto>;

// 응답 타입들
export type LoginResponseType = z.infer<typeof LoginResponseDto>;
export type SignupResponseType = z.infer<typeof SignupResponseDto>;
export type DuplicateCheckResponseType = z.infer<typeof DuplicateCheckResponseDto>;
export type MemberResponseType = z.infer<typeof MemberResponseDto>;
export type ErrorResponseType = z.infer<typeof ErrorResponseDto>;
