import { Router, Request, Response, NextFunction } from "express";
import { MemberMiddleware } from "../../middleWare/MemberMiddleware";
import { MemoController } from "./memo.controller";
import { container } from "../../common/inversify/container";
import { DI_TYPES } from "../../common/inversify/DI_TYPES";
import { validateBody, validateParams, validateQuery } from "../../common/middleware/zod-validation.middleware";
import { MemoListQuerySchema, MemoCreateSchema, MemoUpdateSchema, MemoParamsSchema } from "./zod/memo-req.zod";

const memberMiddleware = container.get<MemberMiddleware>(DI_TYPES.MemberMiddleware);
const memoController = container.get<MemoController>(DI_TYPES.MemoController);

const router = Router();

router.use(memberMiddleware.loginCheck());

router.get("/", validateQuery(MemoListQuerySchema), async (req: Request, res: Response, next: NextFunction) => {
  await memoController.getList(req, res, next);
});

router.post("/", validateBody(MemoCreateSchema), async (req: Request, res: Response, next: NextFunction) => {
  await memoController.insert(req, res, next);
});

router.use("/:memoIdx(\\d+)", validateParams(MemoParamsSchema), (() => {
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

  router.put("/", validateBody(MemoUpdateSchema), async (req: Request, res: Response, next: NextFunction) => {
    await memoController.update(req, res, next);
  });

  router.delete("/", async (req: Request, res: Response, next: NextFunction) => {
    await memoController.delete(req, res, next);
  });

  return router;
})());

export default router;