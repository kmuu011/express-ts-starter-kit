import {NextFunction, Request, Response} from "express";
import {TokenService} from "../common/token/token.service";
import {inject, injectable} from "inversify";
import {DI_TYPES} from "../common/inversify/DI_TYPES";
import {Utility} from "../utils/Utility";
import {CookieUtility} from "../utils/CookieUtility";

@injectable()
export class MemberMiddleware {
  constructor(
    @inject(DI_TYPES.TokenService) private readonly tokenService: TokenService,
  ) {
  }

  public loginCheck = () => async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const {
      tokenCode,
      isTokenExpiring
    } = await this.tokenService.tokenCodeValidation(req);

    if (!isTokenExpiring) {
      next();
      return;
    }

    const userInfo = Utility.getIpUserAgent(req);

    const newToken = await this.tokenService.createMemberToken(
      req.memberInfo!,
      userInfo.userAgent
    );

    const newTokenCode = await this.tokenService.cacheMemberToken(newToken);

    CookieUtility.setCookieMemberToken(
      res,
      newTokenCode,
    );

    res.header("new-token-code", newTokenCode);

    await this.tokenService.deleteMemberToken(tokenCode);

    next();
  }
}