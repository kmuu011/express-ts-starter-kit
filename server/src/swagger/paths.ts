import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { registerMemberPaths } from '../apis/member/member.paths';
import { registerMemoPaths } from '../apis/memo/memo.paths';
import { registerFilePaths } from '../apis/file/file.paths';

// 모든 API 경로를 등록하는 함수
export const registerAllPaths = (registry: OpenAPIRegistry) => {
  registerMemberPaths(registry);
  registerMemoPaths(registry);
  registerFilePaths(registry);
};
