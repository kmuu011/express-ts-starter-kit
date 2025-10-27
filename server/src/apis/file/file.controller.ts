import {inject, injectable} from "inversify";
import {DI_TYPES} from "../../common/inversify/DI_TYPES";
import {FileService} from "./file.service";
import {NextFunction, Request, Response} from "express";
import {BaseController} from "../../common/base/base.controller";

@injectable()
export class FileController extends BaseController {
  constructor(
    @inject(DI_TYPES.FileService) private readonly fileService: FileService
  ) {
    super();
  }

  public async getList(req: Request, res: Response, next: NextFunction) {
    const page = parseInt(req.query.page as string, 10) || 1;
    const count = parseInt(req.query.count as string, 10) || 10;

    const result = await this.fileService.selectList(req.db!, page, count);

    res.json(result);
  }

  public async getOne(req: Request, res: Response, next: NextFunction) {
    const fileIdx = Number(req.params.fileIdx);
    
    req.fileInfo = await this.fileService.selectOne(req.db!, fileIdx);
  }

  public async upload(req: Request, res: Response, next: NextFunction) {
    const memberIdx = req.memberInfo!.idx;
    const fileList = req?.files as MulterFile[];

    await this.fileService.insert(req.db!, memberIdx, fileList);

    this.sendSuccess(res);
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    const fileInfo = req.fileInfo;

    await this.fileService.delete(req.db!, fileInfo);

    this.sendSuccess(res);
  }
}