import {createHash} from "node:crypto";
import {config} from "../config";

export class EncryptUtility {
  public static encryptMemberPassword(password: string): string {
    return createHash(config.memberAuth.hashAlgorithm)
      .update(password + config.memberAuth.salt)
      .digest("hex");
  }
}