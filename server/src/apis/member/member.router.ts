import { Router, Request, Response, NextFunction } from "express";
import { container } from "../../common/inversify/container";
import { MemberController } from "./member.controller";
import { DI_TYPES } from "../../common/inversify/DI_TYPES";
import { MemberMiddleware } from "../../middleWare/MemberMiddleware";
import { validateBody, validateQuery } from "../../common/middleware/zod-validation.middleware";
import {
  LoginSchema,
  SignupSchema,
  DuplicateCheckSchema
} from "./zod/member-req.zod";

const router = Router();

const memberMiddleware = container.get<MemberMiddleware>(DI_TYPES.MemberMiddleware);
const memberController = container.get<MemberController>(DI_TYPES.MemberController);

router.post("/login", validateBody(LoginSchema), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  await memberController.login(req, res, next);
});

router.get("/duplicateCheck", validateQuery(DuplicateCheckSchema), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  await memberController.duplicateCheck(req, res, next);
});

router.post("/signup", validateBody(SignupSchema), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  await memberController.signup(req, res, next);
});

router.post("/logout", memberMiddleware.loginCheck(), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  await memberController.logout(req, res, next);
});

export default router;