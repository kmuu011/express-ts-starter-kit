import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Zod 스키마를 사용한 유효성 검사 미들웨어
 * @param schema - 유효성 검사에 사용할 Zod 스키마
 * @param target - 검사할 대상 ('body' | 'query' | 'params')
 */
export const validateZod = (schema: ZodSchema, target: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = req[target];
      const validatedData = schema.parse(data);
      
      // 검증된 데이터를 원본 위치에 다시 할당
      req[target] = validatedData;
      
      next();
    } catch (error) {
      // 에러를 공통 에러 처리로 넘김
      next(error);
    }
  };
};

/**
 * 요청 본문(body) 유효성 검사 미들웨어
 * @param schema - 유효성 검사에 사용할 Zod 스키마
 */
export const validateBody = (schema: ZodSchema) => validateZod(schema, 'body');

/**
 * 쿼리 파라미터 유효성 검사 미들웨어
 * @param schema - 유효성 검사에 사용할 Zod 스키마
 */
export const validateQuery = (schema: ZodSchema) => validateZod(schema, 'query');

/**
 * URL 파라미터 유효성 검사 미들웨어
 * @param schema - 유효성 검사에 사용할 Zod 스키마
 */
export const validateParams = (schema: ZodSchema) => validateZod(schema, 'params');
