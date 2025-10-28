export const DI_TYPES = {
  Database: Symbol.for("Database"),
  TokenService: Symbol.for("TokenService"),
  SessionService: Symbol.for("SessionService"),
  CacheService: Symbol.for("CacheService"),
  DbMiddleWare: Symbol.for("DbMiddleWare"),

  MemberMiddleware: Symbol.for("MemberMiddleware"),
  MemberDao: Symbol.for("MemberDao"),
  MemberService: Symbol.for("MemberService"),
  MemberController: Symbol.for("MemberController"),

  MemoDao: Symbol.for("MemoDao"),
  MemoService: Symbol.for("MemoService"),
  MemoController: Symbol.for("MemoController"),

  FileDao: Symbol.for("FileDao"),
  FileService: Symbol.for("FileService"),
  FileController: Symbol.for("FileController"),
};
