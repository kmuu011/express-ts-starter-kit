import {NextFunction, Request, Response} from "express";
import {MemberService} from "./member.service";
import {BaseController} from "../../common/base/base.controller";
import {DI_TYPES} from "../../common/inversify/DI_TYPES";
import {inject, injectable} from "inversify";

@injectable()
export class MemberController extends BaseController {
  constructor(
    @inject(DI_TYPES.MemberService) private readonly memberService: MemberService,
  ) {
    super();
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    const tokenCode = await this.memberService.login(req, res);

    res.json({
      tokenCode
    });
  }

  public async signup(req: Request, res: Response, next: NextFunction) {
    await this.memberService.signup(req);

    this.sendSuccess(res);
  }

  public async duplicateCheck(req: Request, res: Response, next: NextFunction) {
    const isDuplicated = await this.memberService.duplicateCheck(req);

    res.json({isDuplicated});
  }

  public async logout(req: Request, res: Response, next: NextFunction) {
    await this.memberService.logout(req, res);

    this.sendSuccess(res);
  }
}