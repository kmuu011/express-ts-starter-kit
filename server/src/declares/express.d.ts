import {MemoModel} from "../apis/memo/memo.model";
import {MemberModel} from "../apis/member/member.model";
import {Database} from "../utils/Database";

declare module 'express' {
  export interface Request {
    db?: Database,
    tokenCode?: string,
    organizedFileList?: Record<string, OrganizedFile[]>,
    memberInfo?: MemberModel,
    memoInfo?: MemoModel,
  }
}