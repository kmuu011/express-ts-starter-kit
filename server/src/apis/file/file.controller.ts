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
    const result = await this.fileService.selectList({req});

    res.json(result);
  }

  public async upload(req: Request, res: Response, next: NextFunction) {
    await this.fileService.insert({req});

    this.sendSuccess(res);
  }
}