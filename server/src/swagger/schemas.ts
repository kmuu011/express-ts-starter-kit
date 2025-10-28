
import * as memberReqSchemas from '../apis/member/zod/member-req.zod';
import * as memberResSchemas from '../apis/member/zod/member-res.zod';

// 모든 스키마를 하나로 합치기
export const allSchemas = {
  ...memberReqSchemas,
  ...memberResSchemas
};
