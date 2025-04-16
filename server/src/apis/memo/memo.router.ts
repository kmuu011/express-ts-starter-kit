import {Router, Request, Response, NextFunction} from "express";
import {MemberMiddleware} from "../../middleWare/MemberMiddleware";
import {MemoController} from "./memo.controller";
import {container} from "../../common/inversify/container";
import {DI_TYPES} from "../../common/inversify/DI_TYPES";
import {ValidatorUtility} from "../../utils/ValidatorUtility";

const memberMiddleware = container.get<MemberMiddleware>(DI_TYPES.MemberMiddleware);
const memoController = container.get<MemoController>(DI_TYPES.MemoController);

const router = Router();

router.use(memberMiddleware.loginCheck());

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  await memoController.getList(req, res, next);
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  ValidatorUtility.stringValidate(
    "content",
    req.body
  );

  await memoController.insert(req, res, next);
});

router.use("/:memoIdx(\\d+)", (() => {
  const router = Router({
    mergeParams: true
  });

  router.use(async (req: Request, res: Response, next: NextFunction) => {
    await memoController.getOne(req, res, next);

    next();
  });

  router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    res.json(req.memoInfo);
  });

  router.patch("/", async (req: Request, res: Response, next: NextFunction) => {
    ValidatorUtility.stringValidate(
      "content",
      req.body
    );

    await memoController.update(req, res, next);
  });

  router.delete("/", async (req: Request, res: Response, next: NextFunction) => {
    await memoController.delete(req, res, next);
  });

  return router;
})());

export default router;