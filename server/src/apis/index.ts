import express, { Errback, NextFunction, Response, Request } from 'express';
import multer from "multer";
import { ZodError } from "zod";
import { TextUtility } from "../utils/TextUtility";
import { FileUtility } from "../utils/FileUtility";
import { Message } from "../utils/MessageUtility";
import { container } from "../common/inversify/container";
import { DI_TYPES } from "../common/inversify/DI_TYPES";
import { XssChecker } from "../utils/XssChecker";
import { FileController } from "./file/file.controller";
import { MemoController } from "./memo/memo.controller";
import { MemberController } from "./member/member.controller";
import { DBContext } from '../infra/db/DBContext';
import { Database } from '../utils/Database';
import onFinished from 'on-finished';

const fileController = container.get<FileController>(DI_TYPES.FileController);
const memoController = container.get<MemoController>(DI_TYPES.MemoController);
const memberController = container.get<MemberController>(DI_TYPES.MemberController);
const upload = multer({});
const router = express.Router();

const validateRequestData = (req: Request) => {
  XssChecker.xssCheck(req.query);
  XssChecker.xssCheck(req.body);

  TextUtility.deactivateQuestionMarkInCollections(req.query);
  TextUtility.deactivateQuestionMarkInCollections(req.body);
};

const uploadExceptionUrlList = [
  "/api/file/upload"
];

router.use(async (req: Request, res: Response, next: NextFunction) => {
  const url = req.originalUrl;

  if (uploadExceptionUrlList.includes(url)) {
    next();
    return;
  }

  const contentType = req.headers["content-type"];

  if (contentType && contentType.startsWith("multipart/form-data")) {
    upload.any()(req, res, () => {
      FileUtility.organizeFiles(req);
      validateRequestData(req);

      next();
    })
  } else {
    validateRequestData(req);

    next();
  }
});

router.use((req, res, next) => {
  const db = container.get<Database>(DI_TYPES.Database); // 여기서 “요청용 DB 연결/세션”을 확보
  DBContext.run(db, () => {
    onFinished(res, async () => {
      try { await db.release(); } catch {}
    });
    next();
  });
});

router.use("/file", fileController.getRouter());
router.use("/member", memberController.getRouter());
router.use("/memo", memoController.getRouter());

//next가 없을경우 에러가 정상적으로 처리되지 않음.
router.use(async (err: Errback | Message | ZodError, req: Request, res: Response, next: NextFunction) => {
  console.log(err);

  if (err instanceof Message) {
    const status = err.status >= 1000 ? 400 : err.status;

    res.status(status).json(err);
    return
  }

  if (err instanceof ZodError) {
    const errorMessages = err.issues.map((issue: any) => {
      const path = issue.path.join('.');
      return `${path}: ${issue.message}`;
    });

    res.status(400).json({
      status: 400,
      errors: 'Invalid input data',
      message: errorMessages.join(', '),
    });
    return;
  }

  // Message를 경유한 예상된 처리가 아닐경우 보안을 위해 SERVER_ERROR로 처리
  res.status(500).json(Message.SERVER_ERROR);
});

export default router;
