import { NextFunction, Request, Response, Router } from "express";
import { MemberService } from "./member.service";
import { BaseController } from "../../common/base/base.controller";
import { DI_TYPES } from "../../common/inversify/DI_TYPES";
import { inject, injectable } from "inversify";
import { Utility } from "../../utils/Utility";
import { CookieUtility } from "../../utils/CookieUtility";
import { LoginType } from "./member.types";
import { SignupType } from "./member.types";
import { DuplicateCheckType } from "./member.types";
import { MemberMiddleware } from "../../middleWare/MemberMiddleware";
import { validateBody, validateQuery } from "../../common/middleware/zod-validation.middleware";
import {
  LoginSchema,
  SignupSchema,
  DuplicateCheckSchema
} from "./zod/member-req.zod";

@injectable()
export class MemberController extends BaseController {
  private memberMiddleware: MemberMiddleware;

  constructor(
    @inject(DI_TYPES.MemberService) private readonly memberService: MemberService,
    @inject(DI_TYPES.MemberMiddleware) memberMiddleware: MemberMiddleware
  ) {
    super();
    this.memberMiddleware = memberMiddleware;
  }

  public getRouter(): Router {
    const router = Router();

    router.post("/login", validateBody(LoginSchema), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      await this.login(req, res, next);
    });

    router.get("/duplicateCheck", validateQuery(DuplicateCheckSchema), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      await this.duplicateCheck(req, res, next);
    });

    router.post("/signup", validateBody(SignupSchema), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      await this.signup(req, res, next);
    });

    router.post("/logout", this.memberMiddleware.loginCheck(), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      await this.logout(req, res, next);
    });

    return router;
  }

  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id, password } = req.validated?.body as LoginType;
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
    const { id, password } = req.validated?.body as SignupType;

    await this.memberService.signup(req.db!, id, password);

    this.sendSuccess(res);
  }

  public async duplicateCheck(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { value, type } = req.validated?.query as DuplicateCheckType;

    const isDuplicated = await this.memberService.duplicateCheck(
      req.db!,
      value,
      type
    );

    res.json({ isDuplicated });
  }

  public async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.memberService.logout(req.tokenCode!);

    CookieUtility.deleteCookieMemberToken(res);

    this.sendSuccess(res);
  }
}