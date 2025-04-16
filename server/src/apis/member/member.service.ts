import {Request, Response} from "express";
import {MemberDao} from "./member.dao";
import {EncryptUtility} from "../../utils/EncryptUtility";
import {TokenService} from "../../common/token/token.service";
import {inject, injectable} from "inversify";
import {DI_TYPES} from "../../common/inversify/DI_TYPES";
import {Utility} from "../../utils/Utility";
import {CookieUtility} from "../../utils/CookieUtility";
import {Message} from "../../utils/MessageUtility";
import {keyDescriptionObj} from "../../constants/keyDescriptionObj";

const duplicateCheckType = [
  "id"
];

@injectable()
export class MemberService {
  constructor(
    @inject(DI_TYPES.MemberDao) private readonly memberDao: MemberDao,
    @inject(DI_TYPES.TokenService) private readonly tokenService: TokenService
  ) {
  }

  public async login(
    req: Request,
    res: Response
  ): Promise<string> {
    const {
      id,
      password
    } = req.body;

    const encryptedPassword = EncryptUtility.encryptMemberPassword(password);

    const memberInfo = await this.memberDao.selectOne({
      db: req.db!,
      id,
      encryptedPassword
    });

    const userInfo = Utility.getIpUserAgent(req);

    const token = await this.tokenService.createMemberToken(
      memberInfo,
      userInfo.userAgent,
    );

    const tokenCode = await this.tokenService.cacheMemberToken(token);

    CookieUtility.setCookieMemberToken(
      res,
      tokenCode
    );

    return tokenCode;
  }

  public async duplicateCheck(
    req: Request,
  ): Promise<boolean> {
    const {
      value,
      type
    } = req.query;

    const typeNumber = parseInt(type as string);

    const valueKey = duplicateCheckType[typeNumber];

    if (!valueKey) throw Message.WRONG_PARAM(keyDescriptionObj.type);

    const memberInfo = await this.memberDao.selectOne({
      db: req.db!,
      [valueKey]: value
    });

    return !!memberInfo;
  }

  public async signup(
    req: Request,
  ): Promise<void> {
    const {
      id,
      password
    } = req.body;

    const duplicatedMemberInfo = await this.memberDao.selectOne({
      db: req.db!,
      id
    });

    if (duplicatedMemberInfo) {
      throw Message.ALREADY_EXIST(keyDescriptionObj.id);
    }

    const encryptedPassword = EncryptUtility.encryptMemberPassword(password);

    await this.memberDao.insert({
      db: req.db!,
      id,
      encryptedPassword
    });
  }

  public async logout(
    req: Request,
    res: Response
  ): Promise<void> {
    await this.tokenService.deleteMemberToken(req.tokenCode!);
    CookieUtility.deleteCookieMemberToken(res);
  }
}