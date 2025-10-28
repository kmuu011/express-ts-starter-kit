import "reflect-metadata";
import {Container} from "inversify";
import {MemberDao} from "../../apis/member/member.dao";
import {Database} from "../../utils/Database";
import {DI_TYPES} from "./DI_TYPES";
import {MemberService} from "../../apis/member/member.service";
import {TokenService} from "../token/token.service";
import {SessionService} from "../session/session.service";
import {CacheService} from "../cache/cache.service";
import {MemoService} from "../../apis/memo/memo.service";
import {MemoDao} from "../../apis/memo/memo.dao";
import {MemberMiddleware} from "../../middleWare/MemberMiddleware";
import {MemoController} from "../../apis/memo/memo.controller";
import {MemberController} from "../../apis/member/member.controller";
import {cacheServiceInstance} from "../cache/cache.instance";
import {DbMiddleware} from "../../middleWare/DbMiddleware";
import {FileDao} from "../../apis/file/file.dao";
import {FileService} from "../../apis/file/file.service";
import {FileController} from "../../apis/file/file.controller";

const container = new Container();

container.bind<Database>(DI_TYPES.Database).to(Database).inRequestScope();
container.bind<CacheService>(DI_TYPES.CacheService).toConstantValue(cacheServiceInstance);
container.bind<TokenService>(DI_TYPES.TokenService).to(TokenService);
container.bind<SessionService>(DI_TYPES.SessionService).to(SessionService);
container.bind<DbMiddleware>(DI_TYPES.DbMiddleWare).to(DbMiddleware);

container.bind<MemberMiddleware>(DI_TYPES.MemberMiddleware).to(MemberMiddleware);
container.bind<MemberDao>(DI_TYPES.MemberDao).to(MemberDao);
container.bind<MemberService>(DI_TYPES.MemberService).to(MemberService);
container.bind<MemberController>(DI_TYPES.MemberController).to(MemberController);

container.bind<MemoDao>(DI_TYPES.MemoDao).to(MemoDao);
container.bind<MemoService>(DI_TYPES.MemoService).to(MemoService);
container.bind<MemoController>(DI_TYPES.MemoController).to(MemoController);

container.bind<FileDao>(DI_TYPES.FileDao).to(FileDao);
container.bind<FileService>(DI_TYPES.FileService).to(FileService);
container.bind<FileController>(DI_TYPES.FileController).to(FileController);

export {container};
