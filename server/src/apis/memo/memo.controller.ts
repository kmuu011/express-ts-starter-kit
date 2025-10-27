import {NextFunction, Request, Response} from "express";
import {MemoService} from "./memo.service";
import {BaseController} from "../../common/base/base.controller";
import {DI_TYPES} from "../../common/inversify/DI_TYPES";
import {inject, injectable} from "inversify";

@injectable()
export class MemoController extends BaseController {
  constructor(
    @inject(DI_TYPES.MemoService) private readonly memoService: MemoService,
  ) {
    super();
  }

  public async getList(req: Request, res: Response, next: NextFunction) {
    const page = parseInt(req.query.page as string, 10) || 1;
    const count = parseInt(req.query.count as string, 10) || 10;
    const memberIdx = req.memberInfo!.idx;

    const result = await this.memoService.selectList(req.db!, page, count, memberIdx);

    res.json(result);
  }

  public async getOne(req: Request, res: Response, next: NextFunction) {
    const memoIdx = Number(req.params.memoIdx);
    
    req.memoInfo = await this.memoService.selectOne(req.db!, memoIdx);
  }

  public async insert(req: Request, res: Response, next: NextFunction) {
    const { content } = req.body;
    const memberIdx = req.memberInfo!.idx;

    const result = await this.memoService.insert(req.db!, memberIdx, content);

    res.json(result);
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    const idx = req.memoInfo?.idx!;
    const { content } = req.body;

    await this.memoService.update(req.db!, idx, content);

    this.sendSuccess(res);
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    const idx = req.memoInfo?.idx!;

    await this.memoService.delete(req.db!, idx);

    this.sendSuccess(res);
  }
}

