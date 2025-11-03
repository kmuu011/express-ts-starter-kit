import mysql, { ResultSetHeader } from "mysql2";
import { PaginatedDaoData } from "../../interfaces/common";
import { inject, injectable } from "inversify";
import { BaseDao } from "../../common/base/base.dao";
import { SqlBuilder } from "../../utils/SqlBuilder";
import { MemoModelType } from "./memo.types";
import { DI_TYPES } from "../../common/inversify/DI_TYPES";
import { DatabaseProvider } from "../../infra/db/DBProvider";
@injectable()
export class MemoDao extends BaseDao {
  constructor(
    @inject(DI_TYPES.DatabaseProvider) private readonly dbProvider: DatabaseProvider
  ) {
    super();
  }

  async selectOne(
    {
      idx
    }: {
      idx: number
    }
  ): Promise<MemoModelType | undefined> {
    const db = this.dbProvider.get();

    const sql = mysql.format("SELECT * FROM memo WHERE idx = ? ", [idx]);

    return (await db.query({ sql }))[0] as MemoModelType | undefined;
  }

  async selectList(
    {
      page,
      count,
      memberIdx,
    }: {
      page: number,
      count: number,
      memberIdx: number,
    }
  ): Promise<PaginatedDaoData<MemoModelType>> {
    const db = this.dbProvider.get();

    const sql = mysql.format("SELECT * " +
      "FROM memo " +
      "WHERE memberIdx = ? " +
      "ORDER BY idx DESC " +
      "LIMIT ?, ?",
      [
        memberIdx,
        (page - 1) * count, count
      ]
    );

    const itemList: MemoModelType[] = await db.query({ sql }) as MemoModelType[];

    const cntSql = "SELECT count(*) cnt FROM memo";

    const totalCount: number = (await db.query({ sql: cntSql }))[0].cnt;

    return {
      itemList,
      totalCount
    }
  }

  async insert(
    {
      memberIdx,
      content,
    }: {
      memberIdx: number,
      content: string
    }
  ): Promise<ResultSetHeader> {
    const db = this.dbProvider.get();

    const dataObj = {
      memberIdx,
      content,
    };

    const sqlObj = SqlBuilder.buildSqlQuery({
      data: dataObj,
      requiredKeys: Object.keys(dataObj),
      removeTailingComma: true
    });

    const sql = `INSERT INTO memo (${sqlObj.sqlCol}) VALUES(${sqlObj.sqlVal})`;

    return await db.query({
      sql,
      checkAffectedRow: true
    });
  }

  async update(
    {
      idx,
      content,
    }: {
      idx: number,
      content: string
    }
  ): Promise<ResultSetHeader> {
    const db = this.dbProvider.get();

    const dataObj = {
      content,
    };

    const sqlObj = SqlBuilder.buildSqlQuery({
      data: dataObj,
      requiredKeys: Object.keys(dataObj),
      timestampData: SqlBuilder.dateColumns.updatedAtOnly
    });

    const sql = mysql.format(
      `UPDATE memo
       SET ${sqlObj.sqlSet}
       WHERE idx = ? `,
      [idx]
    );

    return await db.query({
      sql,
      checkAffectedRow: true
    });
  }

  async delete(
    {
      idx
    }: {
      idx: number
    }
  ) {
    const db = this.dbProvider.get();

    const sql = mysql.format("DELETE FROM memo WHERE idx = ? ", [idx]);

    return await db.query({
      sql,
      checkAffectedRow: true
    });
  }
}