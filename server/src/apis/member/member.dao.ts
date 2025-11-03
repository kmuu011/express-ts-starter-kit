import { inject, injectable } from "inversify";
import { BaseDao } from "../../common/base/base.dao";
import { SqlBuilder } from "../../utils/SqlBuilder";
import { ResultSetHeader } from "mysql2";
import { MemberModelType } from "./member.types";
import { DI_TYPES } from "../../common/inversify/DI_TYPES";
import { DatabaseProvider } from "../../infra/db/DBProvider";

@injectable()
export class MemberDao extends BaseDao {
  constructor(
    @inject(DI_TYPES.DatabaseProvider) private readonly dbProvider: DatabaseProvider
  ) {
    super();
  }

  async selectOne(
    {
      id,
      encryptedPassword,
      idx
    }: {
      id?: string,
      encryptedPassword?: string,
      idx?: number
    }
  ): Promise<MemberModelType | undefined> {
    const db = this.dbProvider.get();

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

    return (await db.query({ sql }))[0] as MemberModelType | undefined;
  }

  async insert(
    {
      id,
      encryptedPassword,
    }: {
      id: string,
      encryptedPassword: string
    }
  ): Promise<ResultSetHeader> {
    const db = this.dbProvider.get();
    
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