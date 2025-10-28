import { MemberDao } from "./member.dao";
import { EncryptUtility } from "../../utils/EncryptUtility";
import { SessionService } from "../../common/session/session.service";
import { inject, injectable } from "inversify";
import { DI_TYPES } from "../../common/inversify/DI_TYPES";
import { Message } from "../../utils/MessageUtility";
import { keyDescriptionObj } from "../../constants/keyDescriptionObj";

const duplicateCheckType = [
  "id"
];

@injectable()
export class MemberService {
  constructor(
    @inject(DI_TYPES.MemberDao) private readonly memberDao: MemberDao,
    @inject(DI_TYPES.SessionService) private readonly sessionService: SessionService
  ) {
  }

  public async login(
    db: any,
    id: string,
    password: string,
    userAgent: string
  ): Promise<{ sessionKey: string; memberInfo: any }> {
    const encryptedPassword = EncryptUtility.encryptMemberPassword(password);

    const memberInfo = await this.memberDao.selectOne({
      db,
      id,
      encryptedPassword
    });

    if (!memberInfo) {
      throw Message.NOT_EXIST(keyDescriptionObj.member);
    }

    // 세션을 생성하고 세션 키 반환
    const sessionKey = await this.sessionService.createSession(
      memberInfo,
      userAgent,
    );

    return { sessionKey, memberInfo };
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
    sessionKey: string
  ): Promise<void> {
    await this.sessionService.deleteSession(sessionKey);
  }
}