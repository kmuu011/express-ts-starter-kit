import {MemberDao} from "./member.dao";
import {EncryptUtility} from "../../utils/EncryptUtility";
import {TokenService} from "../../common/token/token.service";
import {inject, injectable} from "inversify";
import {DI_TYPES} from "../../common/inversify/DI_TYPES";
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
    db: any,
    id: string,
    password: string,
    userAgent: string
  ): Promise<{ tokenCode: string; memberInfo: any }> {
    const encryptedPassword = EncryptUtility.encryptMemberPassword(password);

    const memberInfo = await this.memberDao.selectOne({
      db,
      id,
      encryptedPassword
    });

    if(!memberInfo) {
      throw Message.NOT_EXIST(keyDescriptionObj.member);
    }

    const token = await this.tokenService.createMemberToken(
      memberInfo,
      userAgent,
    );

    const tokenCode = await this.tokenService.cacheMemberToken(token);

    return { tokenCode, memberInfo };
  }

  public async duplicateCheck(
    db: any,
    value: string,
    type: string
  ): Promise<boolean> {
    const typeNumber = parseInt(type);

    const valueKey = duplicateCheckType[typeNumber];

    if (!valueKey) throw Message.WRONG_PARAM(keyDescriptionObj.type);

    const memberInfo = await this.memberDao.selectOne({
      db,
      [valueKey]: value
    });

    return !!memberInfo;
  }

  public async signup(
    db: any,
    id: string,
    password: string
  ): Promise<void> {
    const duplicatedMemberInfo = await this.memberDao.selectOne({
      db,
      id
    });

    if (duplicatedMemberInfo) {
      throw Message.ALREADY_EXIST(keyDescriptionObj.id);
    }

    const encryptedPassword = EncryptUtility.encryptMemberPassword(password);

    await this.memberDao.insert({
      db,
      id,
      encryptedPassword
    });
  }

  public async logout(
    tokenCode: string
  ): Promise<void> {
    await this.tokenService.deleteMemberToken(tokenCode);
  }
}