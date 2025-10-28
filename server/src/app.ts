require('express-async-errors');
require("./global");

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import api_logger from 'morgan';
import swaggerUi from 'swagger-ui-express';

import apis from "./apis";
import { swaggerSpec } from "./swagger/swagger.config";

const options = {etag: false};
const app = express();

app.set("etag", false);

app.use(cors());
app.use(helmet());
app.use(helmet.contentSecurityPolicy());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

app.use(async (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'DELETE, GET, POST, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  res.header("Access-Control-Expose-Headers", "new-session-key");
  res.header('Content-Security-Policy', "frame-ancestors 'self' http://127.0.0.1:3000");

  next();
});

app.use(api_logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static("./static", options));

app.use('/api', apis);

// Swagger UI 설정
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'DocConnect EMR API Docs'
}));

app.use((req, res, next) => {
  res.status(404).json({
    message: 'NOT FOUND',
  });
});

export default app;
