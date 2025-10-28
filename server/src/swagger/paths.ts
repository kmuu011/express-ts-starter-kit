import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { registerMemberPaths } from '../apis/member/member.paths';
// import { registerMemoPaths } from './memo.paths'; // 나중에 추가
// import { registerFilePaths } from './file.paths'; // 나중에 추가

// 모든 API 경로를 등록하는 함수
export const registerAllPaths = (registry: OpenAPIRegistry) => {
  registerMemberPaths(registry);
  // registerMemoPaths(registry); // 나중에 추가
  // registerFilePaths(registry); // 나중에 추가
};
