import { MemberDao } from "./member.dao";
import { EncryptUtility } from "../../utils/EncryptUtility";
import { SessionService } from "../../common/session/session.service";
import { inject, injectable } from "inversify";
import { DI_TYPES } from "../../common/inversify/DI_TYPES";
import { Message } from "../../utils/MessageUtility";
import { keyDescriptionObj } from "../../constants/keyDescriptionObj";
import { MemberModelType } from "./member.types";
import { MemoDao } from "../memo/memo.dao";
import { Transactional } from "../../infra/db/Transactional";

const duplicateCheckType = [
  "id"
];

@injectable()
export class MemberService {
  constructor(
    @inject(DI_TYPES.MemberDao) private readonly memberDao: MemberDao,
    @inject(DI_TYPES.MemoDao) private readonly memoDao: MemoDao,
    @inject(DI_TYPES.SessionService) private readonly sessionService: SessionService
  ) {
  }

  public async login(
    id: string,
    password: string,
    userAgent: string
  ): Promise<{ sessionKey: string; memberInfo: MemberModelType }> {
    const encryptedPassword = EncryptUtility.encryptMemberPassword(password);

    const memberInfo = await this.memberDao.selectOne({
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
    value: string,
    type: number
  ): Promise<boolean> {
    const valueKey = duplicateCheckType[type - 1];

    if (!valueKey) throw Message.WRONG_PARAM(keyDescriptionObj.type);

    const memberInfo = await this.memberDao.selectOne({
      [valueKey]: value
    });

    return !!memberInfo;
  }

  @Transactional()
  public async signup(
    id: string,
    password: string
  ): Promise<void> {
    const duplicatedMemberInfo = await this.memberDao.selectOne({
      id
    });

    if (duplicatedMemberInfo) {
      throw Message.ALREADY_EXIST(keyDescriptionObj.id);
    }

    const encryptedPassword = EncryptUtility.encryptMemberPassword(password);

    const result = await this.memberDao.insert({
      id,
      encryptedPassword
    });

    const insertId = result.insertId;

    await this.memoDao.insert({
      memberIdx: insertId,
      content: "안녕하세요. 첫 메모입니다."
    });
  }

  public async logout(
    sessionKey: string
  ): Promise<void> {
    await this.sessionService.deleteSession(sessionKey);
  }
}