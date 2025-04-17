import {Router, Request, Response, NextFunction} from "express";
import {container} from "../../common/inversify/container";
import {MemberMiddleware} from "../../middleWare/MemberMiddleware";
import {DI_TYPES} from "../../common/inversify/DI_TYPES";
import {FileController} from "./file.controller";
import multer from "multer";
import {config} from "../../config";
import {mkdirSync} from "fs";
import {KeyUtility} from "../../utils/KeyUtility";
import {existsSync} from "node:fs";
import {Message} from "../../utils/MessageUtility";
import {keyDescriptionObj} from "../../constants/keyDescriptionObj";

const router = Router();

const memberMiddleware = container.get<MemberMiddleware>(DI_TYPES.MemberMiddleware);
const fileController = container.get<FileController>(DI_TYPES.FileController);

const storage = multer.diskStorage({
  destination: async (req: Request, file: MulterFile, cb) => {
    const fileType = (file.originalname.substring(file.originalname.lastIndexOf('.') + 1)).toLowerCase();
    const fileName = file.originalname.substring(0, file.originalname.lastIndexOf('.'));
    const path = config.staticPath + config.filePath.file;

    file.fileName = fileName;
    file.fileType = fileType;

    mkdirSync(path, {recursive: true});

    cb(null, path);
  },
  filename: async (req, file, cb) => {
    const db = req.db!;
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

const upload = multer({
  storage: storage,
  limits: {fileSize: 30 * 1024 * 1024 * 1024}
});

router.use(memberMiddleware.loginCheck());

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  await fileController.getList(req, res, next);
});

router.post("/upload", upload.any(), async (req: Request, res: Response, next: NextFunction) => {
  await fileController.upload(req, res, next);
});

router.use("/:fileIdx(\\d+)", (() => {
  const router = Router({
    mergeParams: true,
  });

  router.use(async (req: Request, res: Response, next: NextFunction) => {
    await fileController.getOne(req, res, next);
    next();
  });

  router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    res.json(req.fileInfo);
  });

  router.post("/download", async (req: Request, res: Response, next: NextFunction) => {
    const fileInfo = req.fileInfo;
    const filePath = config.staticPath + fileInfo?.fileKey;

    if (!existsSync(filePath)) {
      throw Message.NOT_EXIST(keyDescriptionObj.file);
    }

    res.download(
      filePath,
      `${fileInfo?.fileName}.${fileInfo?.fileType}`,
      (err) => {
        if(!res.headersSent){
          console.log(err);
          throw Message.SERVER_ERROR;
        }
      }
    )
  });

  router.delete("/", async (req: Request, res: Response, next: NextFunction) => {
    await fileController.delete(req, res, next);
  });

  return router;
})());

export default router;