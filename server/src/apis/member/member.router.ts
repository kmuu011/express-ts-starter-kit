import {Router, Request, Response, NextFunction} from "express";
import {container} from "../../common/inversify/container";
import {MemberController} from "./member.controller";
import {DI_TYPES} from "../../common/inversify/DI_TYPES";
import {MemberMiddleware} from "../../middleWare/MemberMiddleware";
import { validateDto } from "../../common/middleware/validation.middleware";
import { DuplicateCheckDto, LoginDto, SignupDto } from "./dto/member-req.dto";

const router = Router();

const memberMiddleware = container.get<MemberMiddleware>(DI_TYPES.MemberMiddleware);
const memberController = container.get<MemberController>(DI_TYPES.MemberController);

/**
 * @swagger
 * /api/member/login:
 *   post:
 *     summary: 사용자 로그인
 *     description: 아이디와 비밀번호로 사용자 로그인을 수행합니다.
 *     tags: [Member]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginDto'
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponseDto'
 *       400:
 *         description: 잘못된 요청 데이터
 *       401:
 *         description: 인증 실패
 */
router.post("/login", validateDto(LoginDto), async (req: Request, res: Response, next: NextFunction) => {
  await memberController.login(req, res, next);
});

/**
 * @swagger
 * /api/member/duplicateCheck:
 *   get:
 *     summary: 중복 체크
 *     description: 아이디 또는 이메일의 중복 여부를 확인합니다.
 *     tags: [Member]
 *     parameters:
 *       - in: query
 *         name: value
 *         required: true
 *         description: 검증할 값 (아이디 또는 이메일)
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *       - in: query
 *         name: type
 *         required: true
 *         description: 검증 타입 (1=아이디, 2=이메일)
 *         schema:
 *           type: integer
 *           enum: [1, 2]
 *     responses:
 *       200:
 *         description: 중복 체크 결과
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DuplicateCheckResponseDto'
 *       400:
 *         description: 잘못된 요청 데이터
 */
router.get("/duplicateCheck", validateDto(DuplicateCheckDto), async (req: Request, res: Response, next: NextFunction) => {
  await memberController.duplicateCheck(req, res, next);
});

/**
 * @swagger
 * /api/member/signup:
 *   post:
 *     summary: 사용자 회원가입
 *     description: 새로운 사용자 계정을 생성합니다.
 *     tags: [Member]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupDto'
 *     responses:
 *       200:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MemberResponseDto'
 *       400:
 *         description: 잘못된 요청 데이터
 *       409:
 *         description: 이미 존재하는 사용자
 */
router.post("/signup", validateDto(SignupDto), async (req: Request, res: Response, next: NextFunction) => {
  await memberController.signup(req, res, next);
});

/**
 * @swagger
 * /api/member/logout:
 *   post:
 *     summary: 사용자 로그아웃
 *     description: 현재 로그인된 사용자를 로그아웃 처리합니다.
 *     tags: [Member]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: 로그아웃 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "로그아웃되었습니다."
 *       401:
 *         description: 인증되지 않은 사용자
 */
router.post("/logout", memberMiddleware.loginCheck(), async (req: Request, res: Response, next: NextFunction) => {
  await memberController.logout(req, res, next);
});

export default router;