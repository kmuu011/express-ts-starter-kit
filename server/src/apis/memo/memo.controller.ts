import { NextFunction, Request, Response, Router } from "express";
import { MemoService } from "./memo.service";
import { BaseController } from "../../common/base/base.controller";
import { DI_TYPES } from "../../common/inversify/DI_TYPES";
import { inject, injectable } from "inversify";
import { MemoListQueryType, MemoCreateType, MemoUpdateType, MemoParamsType } from "./memo.types";
import { MemberMiddleware } from "../../middleWare/MemberMiddleware";
import { validateBody, validateParams, validateQuery } from "../../common/middleware/zod-validation.middleware";
import { MemoListQuerySchema, MemoCreateSchema, MemoUpdateSchema, MemoParamsSchema } from "./zod/memo-req.zod";

@injectable()
export class MemoController extends BaseController {
  private memberMiddleware: MemberMiddleware;

  constructor(
    @inject(DI_TYPES.MemoService) private readonly memoService: MemoService,
    @inject(DI_TYPES.MemberMiddleware) memberMiddleware: MemberMiddleware
  ) {
    super();
    this.memberMiddleware = memberMiddleware;
  }

  public getRouter(): Router {
    const router = Router();

    router.use(this.memberMiddleware.loginCheck());

    router.get("/", validateQuery(MemoListQuerySchema), async (req: Request, res: Response, next: NextFunction) => {
      await this.getList(req, res, next);
    });

    router.post("/", validateBody(MemoCreateSchema), async (req: Request, res: Response, next: NextFunction) => {
      await this.insert(req, res, next);
    });

    router.use("/:memoIdx(\\d+)", validateParams(MemoParamsSchema), (() => {
      const subRouter = Router({
        mergeParams: true
      });

      subRouter.use(async (req: Request, res: Response, next: NextFunction) => {
        await this.getOne(req, res, next);
        next();
      });

      subRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
        res.json(req.memoInfo);
      });

      subRouter.put("/", validateBody(MemoUpdateSchema), async (req: Request, res: Response, next: NextFunction) => {
        await this.update(req, res, next);
      });

      subRouter.delete("/", async (req: Request, res: Response, next: NextFunction) => {
        await this.delete(req, res, next);
      });

      return subRouter;
    })());

    return router;
  }

  public async getList(req: Request, res: Response, next: NextFunction) {
    const { page, count } = req.validated?.query as MemoListQueryType;
    const memberIdx = req.memberInfo!.idx;

    const result = await this.memoService.selectList(page, count, memberIdx);

    res.json(result);
  }

  public async getOne(req: Request, res: Response, next: NextFunction) {
    const { memoIdx } = req.validated?.params as MemoParamsType;

    req.memoInfo = await this.memoService.selectOne(memoIdx);
  }

  public async insert(req: Request, res: Response, next: NextFunction) {
    const { content } = req.validated?.body as MemoCreateType;
    const memberIdx = req.memberInfo!.idx;

    const result = await this.memoService.insert(memberIdx, content);

    res.json(result);
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    const idx = req.memoInfo?.idx!;
    const { content } = req.validated?.body as MemoUpdateType;

    await this.memoService.update(idx, content);

    this.sendSuccess(res);
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    const idx = req.memoInfo?.idx!;

    await this.memoService.delete(idx);

    this.sendSuccess(res);
  }
}

