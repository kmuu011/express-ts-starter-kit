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
export class SessionService {
  constructor(
    @inject(DI_TYPES.CacheService) private readonly cacheService: CacheService,
    @inject(DI_TYPES.MemberDao) private readonly memberDao: MemberDao,
  ) {
  }

  public async createSession(
    memberInfo: MemberModelType,
    userAgent: string
  ): Promise<string> {
    const payload = {
      idx: memberInfo.idx,
      userAgent,
      time: Date.now()
    };

    const sessionKey = await this.cacheService.getCacheUnqKey();

    await this.cacheService.setCache(
      sessionKey,
      JSON.stringify(payload),
      config.memberAuth.expireTime
    );

    return sessionKey;
  }

  public async deleteSession(
    sessionKey: string
  ): Promise<void> {
    await this.cacheService.deleteCache(sessionKey);
  }

  public async validateSession(
    req: express.Request,
  ): Promise<{ sessionKey: string, isExpiring: boolean }> {
    const userInfo = Utility.getIpUserAgent(req);

    const sessionKey = req.headers["session-key"] || req.cookies["session-key"];

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

    // 세션 만료 시간 체크 (payload.time 기준)
    const now = Date.now();
    const sessionAge = now - payload.time;
    const remainingTime = (config.memberAuth.expireTime * 1000) - sessionAge;
    const isExpiring = remainingTime <= (config.memberAuth.refreshTime * 1000); // refreshTime 이하로 남았으면 갱신 필요

    return {
      sessionKey,
      isExpiring,
    };
  }
}
