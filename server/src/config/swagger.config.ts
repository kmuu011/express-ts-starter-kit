import swaggerJsdoc from "swagger-jsdoc";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import { getMetadataStorage } from "class-validator";
import path from "path";

const schemas = validationMetadatasToSchemas({
  classValidatorMetadataStorage: getMetadataStorage(),
  refPointerPrefix: "#/components/schemas/",
});

export const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DocConnect EMR API Docs",
      version: "2.0.0",
      description: "자동 생성된 DTO 기반 Swagger 문서",
    },
    components: {
      schemas, // DTO 기반으로 생성된 스키마 자동 주입
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
          description: '쿠키 기반 인증 토큰'
        }
      }
    },
    servers: [
      { url: "http://localhost:8100", description: "Dev server" },
    ],
  },
  apis: [
    path.resolve(__dirname, "../apis/**/*.router.ts"),
    path.resolve(__dirname, "../apis/**/*.dto.ts")
  ],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
