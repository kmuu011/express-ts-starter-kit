import { Database } from "../../utils/Database";
import { injectable } from "inversify";
import { BaseDao } from "../../common/base/base.dao";
import { SqlBuilder } from "../../utils/SqlBuilder";
import { ResultSetHeader } from "mysql2";
import { MemberModel } from "./member.types";

@injectable()
export class MemberDao extends BaseDao {
  constructor() {
    super();
  }

  async selectOne(
    {
      db,
      id,
      encryptedPassword,
      idx
    }: {
      db: Database,
      id?: string,
      encryptedPassword?: string,
      idx?: number
    }
  ): Promise<MemberModel | undefined> {
    this.validateArguments(arguments);

    const dataObj = {
      id,
      password: encryptedPassword,
      idx
    };

    const sqlObj = SqlBuilder.buildSqlQuery({
      data: dataObj,
      optionalKeys: Object.keys(dataObj)
    });

    const sql = `SELECT idx, id, createdAt, updatedAt
      FROM member
      WHERE 1=1 ${sqlObj.sqlWhere}
      `;

    return (await db.query({ sql }))[0] as MemberModel | undefined;
  }

  async insert(
    {
      db,
      id,
      encryptedPassword,
    }: {
      db: Database,
      id: string,
      encryptedPassword: string
    }
  ): Promise<ResultSetHeader> {
    const dataObj = {
      id,
      password: encryptedPassword
    };

    const sqlObj = SqlBuilder.buildSqlQuery({
      data: dataObj,
      requiredKeys: Object.keys(dataObj),
      removeTailingComma: true
    });

    const sql = `INSERT INTO member (${sqlObj.sqlCol}) VALUES(${sqlObj.sqlVal})`;

    return await db.query({
      sql,
      checkAffectedRow: true
    });
  }
}