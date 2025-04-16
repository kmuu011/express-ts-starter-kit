import {Database} from "../../utils/Database";
import mysql, {ResultSetHeader} from "mysql2";
import {PaginatedDaoData} from "../../interfaces/common";
import {MemoModel} from "./memo.model";
import {injectable} from "inversify";
import {BaseDao} from "../../common/base/base.dao";
import {SqlBuilder} from "../../utils/SqlBuilder";

@injectable()
export class MemoDao extends BaseDao {
  constructor() {
    super();
  }

  async selectOne(
    {
      db,
      idx
    }: {
      db: Database,
      idx: number
    }
  ): Promise<MemoModel> {
    const sql = mysql.format("SELECT * FROM memo WHERE idx = ? ", [idx]);

    return (await db.query({sql}))[0];
  }

  async selectList(
    {
      db,
      page,
      count,
      memberIdx,
    }: {
      db: Database,
      page: number,
      count: number,
      memberIdx: number,
    }
  ): Promise<PaginatedDaoData<MemoModel>> {
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

    const itemList: MemoModel[] = await db.query({sql});

    const cntSql = "SELECT count(*) cnt FROM memo";

    const totalCount: number = (await db.query({sql: cntSql}))[0].cnt;

    return {
      itemList,
      totalCount
    }
  }

  async insert(
    {
      db,
      memberIdx,
      content,
    }: {
      db: Database,
      memberIdx: number,
      content: string
    }
  ): Promise<ResultSetHeader> {
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
      db,
      idx,
      content,
    }: {
      db: Database,
      idx: number,
      content: string
    }
  ): Promise<ResultSetHeader> {
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
      db,
      idx
    }: {
      db: Database,
      idx: number
    }
  ) {
    const sql = mysql.format("DELETE FROM memo WHERE idx = ? ", [idx]);

    return await db.query({
      sql,
      checkAffectedRow: true
    });
  }
}