import * as dotenv from "dotenv"
import * as path from "node:path";
import * as fs from "node:fs";

if (!process.env.npm_lifecycle_event) {
  throw "npm_lifecycle_event 환경 변수가 설정되어 있지 않습니다.";
}

const serverType = process.env.npm_lifecycle_event?.split(':')[0];

const dirPath = __dirname.substring(0, __dirname.lastIndexOf('server') + 'server'.length);

dotenv.config({path: `${dirPath}/env/.env.${serverType}`});

const loadEnvFiles = () => {
  const envDir = path.join(__dirname, '../../../');

  const envFiles = [
    path.join(envDir, '.env'),
    path.join(envDir, `.env.${serverType}`),
  ];

  envFiles.forEach(envFile => {
    if (fs.existsSync(envFile)) {
      console.log(`Loading environment file: ${envFile}`);
      require('dotenv').config({ path: envFile });
    }
  });
};

loadEnvFiles();

const envConfig = process.env;

const config = {
  serverType,
  port: envConfig.SERVER_PORT,

  memberAuth: {
    salt: 'thisIsSalt',
    jwtSecret: 'JWTSecret',
    hashAlgorithm: 'sha512',
    expireTime: 60 * 60 * 24 * 30,
    refreshTime: 60 * 60 * 24 * 28
  },

  mysql: {
    database: envConfig.DB_DATABASE,
    user: envConfig.DB_USER,
    password: envConfig.DB_PASSWORD,
    host: envConfig.DB_HOST,
    charset: 'utf8mb4',
    port: Number(envConfig.DB_PORT),
    multipleStatements: false,
    waitForConnections: true,
    queueLimit: 40,
    connectionLimit: 40,
  },

  redis: {
    host: envConfig.REDIS_HOST,
    port: 6379,
    defaultTTL: 60 * 60 * 24
  },

  basePath: dirPath + '/',
  staticPath: dirPath + '/static/',

  multerOptions: {
    limits: {
      fileNameSize: 200,
      fileSize: 1024 * 1024 * 100,
      fields: 10,
      files: 10,
    }
  },

  filePath: {
    file: "files/"
  }
}

export {
  config
};
