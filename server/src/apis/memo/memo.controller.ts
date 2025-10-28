import { NextFunction, Request, Response } from "express";
import { MemoService } from "./memo.service";
import { BaseController } from "../../common/base/base.controller";
import { DI_TYPES } from "../../common/inversify/DI_TYPES";
import { inject, injectable } from "inversify";
import { MemoListQueryType, MemoCreateType, MemoUpdateType, MemoParamsType } from "./memo.types";

@injectable()
export class MemoController extends BaseController {
  constructor(
    @inject(DI_TYPES.MemoService) private readonly memoService: MemoService,
  ) {
    super();
  }

  public async getList(req: Request, res: Response, next: NextFunction) {
    const { page, count } = req.validated?.query as MemoListQueryType;
    const memberIdx = req.memberInfo!.idx;

    const result = await this.memoService.selectList(req.db!, page, count, memberIdx);

    res.json(result);
  }

  public async getOne(req: Request, res: Response, next: NextFunction) {
    const { memoIdx } = req.validated?.params as MemoParamsType;

    req.memoInfo = await this.memoService.selectOne(req.db!, memoIdx);
  }

  public async insert(req: Request, res: Response, next: NextFunction) {
    const { content } = req.validated?.body as MemoCreateType;
    const memberIdx = req.memberInfo!.idx;

    const result = await this.memoService.insert(req.db!, memberIdx, content);

    res.json(result);
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    const idx = req.memoInfo?.idx!;
    const { content } = req.validated?.body as MemoUpdateType;

    await this.memoService.update(req.db!, idx, content);

    this.sendSuccess(res);
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    const idx = req.memoInfo?.idx!;

    await this.memoService.delete(req.db!, idx);

    this.sendSuccess(res);
  }
}

