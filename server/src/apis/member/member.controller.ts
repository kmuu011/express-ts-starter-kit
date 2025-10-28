import { NextFunction, Request, Response } from "express";
import { MemberService } from "./member.service";
import { BaseController } from "../../common/base/base.controller";
import { DI_TYPES } from "../../common/inversify/DI_TYPES";
import { inject, injectable } from "inversify";
import { Utility } from "../../utils/Utility";
import { CookieUtility } from "../../utils/CookieUtility";

@injectable()
export class MemberController extends BaseController {
  constructor(
    @inject(DI_TYPES.MemberService) private readonly memberService: MemberService,
  ) {
    super();
  }

  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id, password } = req.body;
    const userInfo = Utility.getIpUserAgent(req);

    const { sessionKey } = await this.memberService.login(
      req.db!,
      id,
      password,
      userInfo.userAgent
    );

    CookieUtility.setCookieMemberToken(res, sessionKey);

    res.json({
      sessionKey
    });
  }

  public async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id, password } = req.body;

    await this.memberService.signup(req.db!, id, password);

    this.sendSuccess(res);
  }

  public async duplicateCheck(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { value, type } = req.query;

    const isDuplicated = await this.memberService.duplicateCheck(
      req.db!,
      value as string,
      type as string
    );

    res.json({ isDuplicated });
  }

  public async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.memberService.logout(req.tokenCode!);

    CookieUtility.deleteCookieMemberToken(res);

    this.sendSuccess(res);
  }
}