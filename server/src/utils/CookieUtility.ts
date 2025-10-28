import express from "express";
import {config} from "../config";

export class CookieUtility {
  public static setCookieMemberToken(
    res: express.Response,
    sessionKey: string
  ) {
    res.cookie(
      "session-key",
      sessionKey,
      {
        httpOnly: true,
        secure: SERVER_TYPE !== "dev",
        sameSite: "strict",
        maxAge: config.memberAuth.expireTime * 1000
      }
    )
  }

  public static deleteCookieMemberToken(
    res: express.Response,
  ) {
    res.clearCookie("session-key");
  }
}