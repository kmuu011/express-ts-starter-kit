const dirPath = __dirname.substring(0, __dirname.lastIndexOf('server') + 'server'.length);
import * as dotenv from "dotenv"

dotenv.config({path: `${dirPath}/env/.env.${SERVER_TYPE}`});

const envConfig = process.env;

const config = {
  port: 8200,

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
