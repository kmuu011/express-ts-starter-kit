import { config } from "../../config";
import { CacheService } from "../cache/cache.service";
import express from "express";
import { Message } from "../../utils/MessageUtility";
import { MemberDao } from "../../apis/member/member.dao";
import { inject, injectable } from "inversify";
import { DI_TYPES } from "../inversify/DI_TYPES";
import { Utility } from "../../utils/Utility";
import { MemberModelType } from "../../apis/member/member.types";

@injectable()
export class TokenService {
  constructor(
    @inject(DI_TYPES.CacheService) private readonly cacheService: CacheService,
    @inject(DI_TYPES.MemberDao) private readonly memberDao: MemberDao,
  ) {
  }

  public async createMemberToken(
    memberInfo: MemberModelType,
    userAgent: string
  ): Promise<string> {
    const payload = {
      idx: memberInfo.idx,
      userAgent,
      time: Date.now()
    };

    // payload를 직접 세션에 저장하고 세션 키 반환
    const sessionKey = await this.cacheService.getCacheUnqKey();

    await this.cacheService.setCache(
      sessionKey,
      JSON.stringify(payload),
      config.memberAuth.expireTime
    );

    return sessionKey;
  }

  public async deleteMemberToken(
    sessionKey: string
  ): Promise<void> {
    await this.cacheService.deleteCache(sessionKey);
  }


  public async tokenCodeValidation(
    req: express.Request,
  ): Promise<{ tokenCode: string, isTokenExpiring: boolean }> {
    const userInfo = Utility.getIpUserAgent(req);

    const sessionKey = req.headers["token-code"] || req.cookies["token-code"];

    if (!sessionKey) {
      throw Message.UNAUTHORIZED;
    }

    // 세션에서 payload 가져오기
    const payloadString = await this.cacheService.getCache(sessionKey);

    if (!payloadString) {
      throw Message.UNAUTHORIZED;
    }

    const payload = JSON.parse(payloadString);

    if (!payload?.idx) {
      throw Message.UNAUTHORIZED;
    }

    if (payload?.userAgent !== userInfo?.userAgent) {
      throw Message.FORBIDDEN;
    }

    const memberInfo = await this.memberDao.selectOne({
      idx: payload.idx
    });

    if (!memberInfo) {
      throw Message.UNAUTHORIZED;
    }

    req.memberInfo = memberInfo;
    req.tokenCode = sessionKey;

    // 토큰 만료 시간 체크 (payload.time 기준)
    const now = Date.now();
    const tokenAge = now - payload.time;
    const isTokenExpiring = tokenAge > (config.memberAuth.expireTime * 1000 * 0.8); // 80% 지났으면 갱신 필요

    return {
      tokenCode: sessionKey,
      isTokenExpiring,
    };
  }


}