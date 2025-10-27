import { Request, Response } from 'express';

export interface SwaggerRouteOptions {
  summary?: string;
  description?: string;
  tags?: string[];
  requestBody?: {
    description?: string;
    required?: boolean;
    content?: {
      [mediaType: string]: {
        schema: any;
      };
    };
  };
  parameters?: Array<{
    name: string;
    in: 'query' | 'path' | 'header' | 'cookie';
    description?: string;
    required?: boolean;
    schema?: any;
  }>;
  responses?: {
    [statusCode: string]: {
      description: string;
      content?: {
        [mediaType: string]: {
          schema: any;
        };
      };
    };
  };
}

export function SwaggerRoute(options: SwaggerRouteOptions) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    // 메타데이터를 저장하기 위한 간단한 구현
    if (!target.constructor.__swaggerRoutes) {
      target.constructor.__swaggerRoutes = {};
    }
    target.constructor.__swaggerRoutes[propertyKey] = options;
    
    return descriptor;
  };
}

export function SwaggerController(tag: string, description?: string) {
  return function (target: any) {
    target.__swaggerTag = tag;
    target.__swaggerDescription = description;
  };
}
