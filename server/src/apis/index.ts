import express, {Errback, NextFunction, Response, Request} from 'express';
import multer from "multer";
import {TextUtility} from "../utils/TextUtility";
import {FileUtility} from "../utils/FileUtility";
import {Message} from "../utils/MessageUtility";
import memberRouter from "./member/member.router";
import memoRouter from "./memo/memo.router";
import {container} from "../common/inversify/container";
import {DbMiddleware} from "../middleWare/DbMiddleware";
import {DI_TYPES} from "../common/inversify/DI_TYPES";
import {XssChecker} from "../utils/XssChecker";
import fileRouter from "./file/file.router";

const dbMiddleware = container.get<DbMiddleware>(DI_TYPES.DbMiddleWare);
const upload = multer({});
const router = express.Router();

const validateRequestData = (req: Request) => {
  XssChecker.xssCheck(req.query);
  XssChecker.xssCheck(req.body);

  TextUtility.deactivateQuestionMarkInCollections(req.query);
  TextUtility.deactivateQuestionMarkInCollections(req.body);
}

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

router.use(dbMiddleware.attachDb());

router.use("/file", fileRouter);
router.use("/member", memberRouter);
router.use("/memo", memoRouter);

//next가 없을경우 에러가 정상적으로 처리되지 않음.
router.use(async (err: Errback | Message, req: Request, res: Response, next: NextFunction) => {
  console.log(err);

  if (err instanceof Message) {
    const status = err.status >= 1000 ? 400 : err.status;

    res.status(status).json(err);
    return
  }

  // Message를 경유한 예상된 처리가 아닐경우 보안을 위해 SERVER_ERROR로 처리
  res.status(500).json(Message.SERVER_ERROR);
});

export default router;
