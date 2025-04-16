import {Database} from "./Database";
import {Utility} from "./Utility";
import mysql from "mysql2";

export class KeyUtility {
  public static async createKey(
    {
      db,
      tableName,
      columnKey,
      length = 32,
      path,
      includeDate,
      prefixText,
      suffixText,
    }: {
      db: Database;
      tableName: string;
      columnKey: string;
      length?: number;
      path?: string;
      includeDate?: Boolean;
      prefixText?: string;
      suffixText?: string;
    }
  ): Promise<string> {
    let randomKey: string;

    while (true) {
      randomKey = Utility.createRandomString(length);
      randomKey =
        (path ? path : '') +
        (prefixText ? prefixText : '') +
        randomKey +
        (includeDate ? '_' + Date.now() : '') +
        (suffixText ? suffixText : '');

      const sql = mysql.format(
        `SELECT ?? FROM ${tableName} WHERE ?? = ?`,
        [columnKey, columnKey, randomKey]
      );

      const selectedInfo = await db.query({sql});

      if (selectedInfo.length === 0) break;
    }

    return randomKey;
  }
}