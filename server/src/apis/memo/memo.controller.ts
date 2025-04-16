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
    const result = await this.memoService.selectList(req);

    res.json(result);
  }

  public async getOne(req: Request, res: Response, next: NextFunction) {
    req.memoInfo = await this.memoService.selectOne(req);
  }

  public async insert(req: Request, res: Response, next: NextFunction) {
    const result = await this.memoService.insert(req);

    res.json(result);
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    await this.memoService.update(req);

    this.sendSuccess(res);
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    await this.memoService.delete(req);

    this.sendSuccess(res);
  }
}

