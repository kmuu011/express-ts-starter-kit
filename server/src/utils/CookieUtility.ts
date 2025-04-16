import express from "express";
import {config} from "../config";

export class CookieUtility {
  public static setCookieMemberToken(
    res: express.Response,
    tokenCode: string
  ) {
    res.cookie(
      "token-code",
      tokenCode,
      {
        httpOnly: true,
        secure: SERVER_TYPE !== "local",
        sameSite: "strict",
        maxAge: config.memberAuth.expireTime * 1000
      }
    )
  }

  public static deleteCookieMemberToken(
    res: express.Response,
  ) {
    res.clearCookie("token-code");
  }
}