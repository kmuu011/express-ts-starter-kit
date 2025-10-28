import { NextFunction, Request, Response } from "express";
import { SessionService } from "../common/session/session.service";
import { inject, injectable } from "inversify";
import { DI_TYPES } from "../common/inversify/DI_TYPES";
import { Utility } from "../utils/Utility";
import { CookieUtility } from "../utils/CookieUtility";

@injectable()
export class MemberMiddleware {
  constructor(
    @inject(DI_TYPES.SessionService) private readonly sessionService: SessionService,
  ) {
  }

  public loginCheck = () => async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const {
      sessionKey,
      isExpiring
    } = await this.sessionService.validateSession(req);

    if (!isExpiring) {
      next();
      return;
    }

    const userInfo = Utility.getIpUserAgent(req);

    // 세션 갱신
    const newSessionKey = await this.sessionService.createSession(
      req.memberInfo!,
      userInfo.userAgent
    );

    CookieUtility.setCookieMemberToken(
      res,
      newSessionKey,
    );

    res.header("new-session-key", newSessionKey);

    await this.sessionService.deleteSession(sessionKey);

    next();
  }
}