import { inject, injectable } from "inversify";
import { DI_TYPES } from "../../common/inversify/DI_TYPES";
import { FileService } from "./file.service";
import { NextFunction, Request, Response, Router } from "express";
import { BaseController } from "../../common/base/base.controller";
import { MemberMiddleware } from "../../middleWare/MemberMiddleware";
import multer from "multer";
import { config } from "../../config";
import { mkdirSync } from "fs";
import { KeyUtility } from "../../utils/KeyUtility";
import { existsSync } from "node:fs";
import { Message } from "../../utils/MessageUtility";
import { keyDescriptionObj } from "../../constants/keyDescriptionObj";
import { validateQuery, validateParams } from "../../common/middleware/zod-validation.middleware";
import { FileListQuerySchema, FileParamsSchema } from "./zod/file-req.zod";
import { DatabaseProvider } from "../../infra/db/DBProvider";

@injectable()
export class FileController extends BaseController {
  private memberMiddleware: MemberMiddleware;
  private upload: multer.Multer;

  constructor(
    @inject(DI_TYPES.FileService) private readonly fileService: FileService,
    @inject(DI_TYPES.MemberMiddleware) memberMiddleware: MemberMiddleware,
    @inject(DI_TYPES.DatabaseProvider) private readonly dbProvider: DatabaseProvider
  ) {
    super();
    this.memberMiddleware = memberMiddleware;
    this.upload = this.createMulterUpload();
  }

  private createMulterUpload() {
    const storage = multer.diskStorage({
      destination: async (req: Request, file: MulterFile, cb) => {
        const fileType = (file.originalname.substring(file.originalname.lastIndexOf('.') + 1)).toLowerCase();
        const fileName = file.originalname.substring(0, file.originalname.lastIndexOf('.'));
        const path = config.staticPath + config.filePath.file;

        file.fileName = fileName;
        file.fileType = fileType;

        mkdirSync(path, { recursive: true });

        cb(null, path);
      },
      filename: async (req, file, cb) => {
        const db = this.dbProvider.get();
        const fileType = (file.originalname.substring(file.originalname.lastIndexOf('.') + 1)).toLowerCase();
        const path = `${config.filePath.file}/`;

        const fileKey = (await KeyUtility.createKey({
          db,
          tableName: "file",
          columnKey: "fileKey",
          path,
          includeDate: true,
          suffixText: `.${fileType}`
        })).replace(path, "");

        cb(null, fileKey);
      }
    });

    return multer({
      storage: storage,
      limits: { fileSize: 30 * 1024 * 1024 * 1024 }
    });
  }

  public getRouter(): Router {
    const router = Router();

    router.use(this.memberMiddleware.loginCheck());

    router.get("/", validateQuery(FileListQuerySchema), async (req: Request, res: Response, next: NextFunction) => {
      await this.getList(req, res, next);
    });

    router.post("/upload", this.upload.any(), async (req: Request, res: Response, next: NextFunction) => {
      await this.uploadFile(req, res, next);
    });

    router.use("/:fileIdx(\\d+)", validateParams(FileParamsSchema), (() => {
      const subRouter = Router({
        mergeParams: true,
      });

      subRouter.use(async (req: Request, res: Response, next: NextFunction) => {
        await this.getOne(req, res, next);
        next();
      });

      subRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
        res.json(req.fileInfo);
      });

      subRouter.post("/download", async (req: Request, res: Response, next: NextFunction) => {
        const fileInfo = req.fileInfo;
        const filePath = config.staticPath + fileInfo?.fileKey;

        if (!existsSync(filePath)) {
          throw Message.NOT_EXIST(keyDescriptionObj.file);
        }

        res.download(
          filePath,
          `${fileInfo?.fileName}.${fileInfo?.fileType}`,
          (err) => {
            if (!res.headersSent) {
              console.log(err);
              throw Message.SERVER_ERROR;
            }
          }
        )
      });

      subRouter.delete("/", async (req: Request, res: Response, next: NextFunction) => {
        await this.delete(req, res, next);
      });

      return subRouter;
    })());

    return router;
  }

  public async getList(req: Request, res: Response, next: NextFunction) {
    const memberIdx = req.memberInfo!.idx;
    const { page, count } = req.validated?.query as { page: number; count: number };

    const result = await this.fileService.selectList(page, count, memberIdx);

    res.json(result);
  }

  public async getOne(req: Request, res: Response, next: NextFunction) {
    const memberIdx = req.memberInfo!.idx;
    const { fileIdx } = req.validated?.params as { fileIdx: number };

    req.fileInfo = await this.fileService.selectOne(fileIdx, memberIdx);
  }

  public async uploadFile(req: Request, res: Response, next: NextFunction) {
    const memberIdx = req.memberInfo!.idx;
    const fileList = req?.files as MulterFile[];

    await this.fileService.insert(memberIdx, fileList);

    this.sendSuccess(res);
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    const memberIdx = req.memberInfo!.idx;
    const fileInfo = req.fileInfo;

    await this.fileService.delete(fileInfo, memberIdx);

    this.sendSuccess(res);
  }
}