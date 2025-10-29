
import * as memberReqSchemas from '../apis/member/zod/member-req.zod';
import * as memberResSchemas from '../apis/member/zod/member-res.zod';
import * as memoReqSchemas from '../apis/memo/zod/memo-req.zod';
import * as memoResSchemas from '../apis/memo/zod/memo-res.zod';
import * as fileReqSchemas from '../apis/file/zod/file-req.zod';
import * as fileResSchemas from '../apis/file/zod/file-res.zod';

// 모든 스키마를 하나로 합치기
export const allSchemas = {
  ...memberReqSchemas,
  ...memberResSchemas,
  ...memoReqSchemas,
  ...memoResSchemas,
  ...fileReqSchemas,
  ...fileResSchemas
};
