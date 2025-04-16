import {Response} from "express";

export abstract class BaseController {
  protected sendSuccess(res: Response): void {
    res.json({result: true});
  }
}