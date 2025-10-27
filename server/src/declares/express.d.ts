import { MemoModel } from "../apis/memo/memo.model";
import { MemberModel } from "../apis/member/member.model";
import { Database } from "../utils/Database";
import { FileModel } from "../apis/file/file.model";

declare module 'express' {
  export interface Request {
    validatedData?: any;
    db?: Database,
    tokenCode?: string,
    organizedFileList?: Record<string, OrganizedFile[]>,
    memberInfo?: MemberModel,
    memoInfo?: MemoModel,
    fileInfo?: FileModel
  }
}