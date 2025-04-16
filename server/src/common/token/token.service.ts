import {MemberModel} from "../../apis/member/member.model";
import jwt from 'jsonwebtoken';
import {config} from "../../config";
import {CacheService} from "../cache/cache.service";
import express from "express";
import {Message} from "../../utils/MessageUtility";
import {MemberDao} from "../../apis/member/member.dao";
import {inject, injectable} from "inversify";
import {DI_TYPES} from "../inversify/DI_TYPES";
import {Utility} from "../../utils/Utility";

@injectable()
export class TokenService {
  constructor(
    @inject(DI_TYPES.CacheService) private readonly cacheService: CacheService,
    @inject(DI_TYPES.MemberDao) private readonly memberDao: MemberDao,
  ) {
  }

  public async createMemberToken(
    memberInfo: MemberModel,
    userAgent: string
  ): Promise<string> {
    const payload = {
      idx: memberInfo.idx,
      userAgent,
      time: Date.now()
    };

    return jwt.sign(
      payload,
      config.memberAuth.jwtSecret,
      {
        expiresIn: config.memberAuth.expireTime,
      }
    )
  }

  public async cacheMemberToken(
    token: string
  ): Promise<string> {
    const tokenCode = await this.cacheService.getCacheUnqKey();

    await this.cacheService.setCache(
      tokenCode,
      token,
      config.memberAuth.expireTime
    );

    return tokenCode;
  }

  public async deleteMemberToken(
    tokenCode: string
  ): Promise<void> {
    await this.cacheService.deleteCache(tokenCode);
  }

  private async decodeToken(token: string): Promise<TokenContent | undefined> {
    return await new Promise((resolve) => {
      jwt.verify(token, config.memberAuth.jwtSecret, (err, decoded) => {
        if (err) resolve(undefined);

        resolve(decoded as TokenContent);
      });
    })
  }

  public async isTokenExpiring(
    decodedInfo: TokenContent
  ): Promise<boolean> {
    const now = Date.now();

    return ((decodedInfo.exp * 1000 - now) / 1000) < config.memberAuth.tokenRefreshTime;
  }

  public async tokenCodeValidation(
    req: express.Request,
  ): Promise<{ tokenCode: string, isTokenExpiring: boolean }> {
    const userInfo = Utility.getIpUserAgent(req);

    const tokenCode = req.headers["token-code"] || req.cookies["token-code"];

    if (!tokenCode) {
      throw Message.UNAUTHORIZED;
    }

    const token = await this.cacheService.getCache(tokenCode);

    if (!token) {
      throw Message.UNAUTHORIZED;
    }

    const decodedInfo = await this.decodeToken(token);

    if (!decodedInfo?.idx) {
      throw Message.UNAUTHORIZED;
    }

    if (
      decodedInfo?.userAgent !== userInfo?.userAgent
    ) {
      throw Message.FORBIDDEN;
    }

    const memberInfo = await this.memberDao.selectOne({
      db: req.db!,
      idx: decodedInfo.idx
    });

    if (!memberInfo) {
      throw Message.UNAUTHORIZED;
    }

    req.memberInfo = memberInfo;
    req.tokenCode = tokenCode;

    return {
      tokenCode,
      isTokenExpiring: await this.isTokenExpiring(decodedInfo),
    };
  }


}