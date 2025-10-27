import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToClass, ClassConstructor } from 'class-transformer';
import { Message } from '../../utils/MessageUtility';

export function validateDto<T extends object>(dtoClass: ClassConstructor<T>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // body 또는 query에서 데이터 추출
      const data = req.method === 'GET' ? req.query : req.body;
      
      // plain object를 DTO 클래스 인스턴스로 변환
      const dto = plainToClass(dtoClass, data);
      
      // 벨리데이션 실행
      const errors: ValidationError[] = await validate(dto);
      
      if (errors.length > 0) {
        const errorMessages = errors.map(error => {
          const constraints = error.constraints;
          return constraints ? Object.values(constraints).join(', ') : '유효하지 않은 값입니다.';
        });
        
        throw Message.CUSTOM_ERROR(errorMessages.join('; '));
      }
      
      // 벨리데이션 통과한 데이터를 request에 저장
      req.validatedData = dto;
      next();
    } catch (error) {
      next(error);
    }
  };
}