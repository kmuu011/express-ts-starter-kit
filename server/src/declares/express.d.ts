import { Database } from "../utils/Database";
import { MemberModelType } from "../apis/member/member.types";
import { MemoModelType } from "../apis/memo/memo.types";
import { FileModelType } from "../apis/file/file.types";

declare module 'express' {
  export interface Request {
    validated?: {
      body?: unknown;
      query?: unknown;
      params?: unknown;
    };
    db?: Database;
    tokenCode?: string;
    organizedFileList?: Record<string, OrganizedFile[]>;
    memberInfo?: MemberModelType;
    memoInfo?: MemoModelType;
    fileInfo?: FileModelType;
  }
}