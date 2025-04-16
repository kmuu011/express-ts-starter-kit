import {Router, Request, Response, NextFunction} from "express";
import {container} from "../../common/inversify/container";
import {MemberController} from "./member.controller";
import {DI_TYPES} from "../../common/inversify/DI_TYPES";
import {MemberMiddleware} from "../../middleWare/MemberMiddleware";
import {ValidatorUtility} from "../../utils/ValidatorUtility";

const router = Router();

const memberMiddleware = container.get<MemberMiddleware>(DI_TYPES.MemberMiddleware);
const memberController = container.get<MemberController>(DI_TYPES.MemberController);

router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  ValidatorUtility.stringValidate(
    "id, password",
    req.body
  );

  await memberController.login(req, res, next);
});

router.get("/duplicateCheck", async (req: Request, res: Response, next: NextFunction) => {
  ValidatorUtility.stringValidate(
    "value",
    req.query
  );

  ValidatorUtility.intValidate(
    "type",
    req.query
  );

  await memberController.duplicateCheck(req, res, next);
})

router.post("/signup", async (req: Request, res: Response, next: NextFunction) => {
  ValidatorUtility.stringValidate(
    "id, password",
    req.body
  );

  await memberController.signup(req, res, next);
});

router.post("/logout", memberMiddleware.loginCheck(), async (req: Request, res: Response, next: NextFunction) => {
  await memberController.logout(req, res, next);
});

export default router;