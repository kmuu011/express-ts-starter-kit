import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny } from 'zod';

type Target = 'body' | 'query' | 'params';

export const validateZod = <S extends ZodTypeAny>(schema: S, target: Target = 'body') =>
  (req: Request, res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req[target]);
    if (!parsed.success) {
      throw parsed.error.message
    }
    (req as any).validated = { ...(req as any).validated, [target]: parsed.data };
    next();
  };

export const validateBody = <S extends ZodTypeAny>(schema: S) =>
  validateZod(schema, 'body');

export const validateQuery = <S extends ZodTypeAny>(schema: S) =>
  validateZod(schema, 'query');

export const validateParams = <S extends ZodTypeAny>(schema: S) =>
  validateZod(schema, 'params');
