import { z } from 'zod';
import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi,
} from '@asteasolutions/zod-to-openapi';

// Zod를 OpenAPI로 확장 (스키마 import 전에 호출해야 함)
extendZodWithOpenApi(z);

import { allSchemas } from "./schemas";
import { registerAllPaths } from "./paths";

// 1) 레지스트리 생성
const registry = new OpenAPIRegistry();

// 2) 스키마 등록
// allSchemas: { [name: string]: z.ZodTypeAny }
Object.entries(allSchemas).forEach(([name, schema]) => {
  registry.register(name, schema);
});

// 3) 보안 스키마 등록 (components.securitySchemes 대체)
registry.registerComponent('securitySchemes', 'cookieAuth', {
  type: 'apiKey',
  in: 'cookie',
  name: 'session-key',
  description: '쿠키 기반 세션 키 인증',
});
registry.registerComponent('securitySchemes', 'headerAuth', {
  type: 'apiKey',
  in: 'header',
  name: 'session-key',
  description: '헤더 기반 세션 키 인증',
});

// 4) 경로 등록
registerAllPaths(registry);

// 5) 문서 생성
const generator = new OpenApiGeneratorV3(registry.definitions);
export const swaggerSpec = generator.generateDocument({
  openapi: '3.0.0',
  info: {
    title: 'DocConnect EMR API Docs',
    version: '2.0.0',
    description: 'Zod 기반 자동 생성 Swagger 문서',
  },
  servers: [{ url: 'http://localhost:8100', description: 'Dev server' }],
  security: [{ cookieAuth: []}, { headerAuth: [] }],
});
