import { FileModelType } from "./file.types";
import mysql from "mysql2";
import { PaginatedDaoData } from "../../interfaces/common";
import { SqlBuilder } from "../../utils/SqlBuilder";
import { inject, injectable } from "inversify";
import { DI_TYPES } from "../../common/inversify/DI_TYPES";
import { DatabaseProvider } from "../../infra/db/DBProvider";

@injectable()
export class FileDao {
  constructor(
    @inject(DI_TYPES.DatabaseProvider) private readonly dbProvider: DatabaseProvider
  ) {
  }

  async selectOne(
    {
      idx,
      memberIdx
    }: {
      idx: number
      memberIdx: number
    }
  ): Promise<FileModelType | undefined> {
    const db = this.dbProvider.get();

    const sql = mysql.format(
      "SELECT * FROM file WHERE idx = ? AND memberIdx = ? ",
      [idx, memberIdx]
    );

    return (await db.query({ sql }))[0] as FileModelType | undefined;
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
  ): Promise<PaginatedDaoData<FileModelType>> {
    const db = this.dbProvider.get();

    const sql = mysql.format("SELECT * " +
      "FROM file " +
      "WHERE memberIdx = ? " +
      "ORDER BY idx DESC " +
      "LIMIT ?, ?",
      [memberIdx, (page - 1) * count, count]
    );

    const itemList: FileModelType[] = await db.query({ sql });

    const cntSql = mysql.format("SELECT count(*) cnt FROM file WHERE memberIdx = ?", [memberIdx]);

    const totalCount: number = (await db.query({ sql: cntSql }))[0].cnt;

    return {
      itemList,
      totalCount
    }
  }

  async insert(
    {
      fileKey,
      fileName,
      fileType,
      fileSize,
      memberIdx,
    }: {
      fileKey: string,
      fileName: string,
      fileType: string,
      fileSize: number,
      memberIdx: number,
    }
  ) {
    const db = this.dbProvider.get();

    const dataObj = {
      fileKey,
      fileName,
      fileType,
      fileSize,
      memberIdx
    };

    const sqlObj = SqlBuilder.buildSqlQuery({
      data: dataObj,
      requiredKeys: Object.keys(dataObj),
      removeTailingComma: true
    });

    const sql = `INSERT INTO file (${sqlObj.sqlCol}) 
            VALUES(${sqlObj.sqlVal})`;

    return await db.query({
      sql,
      checkAffectedRow: true
    });
  }

  async delete(
    {
      idx,
      memberIdx
    }: {
      idx: number
      memberIdx: number
    }
  ) {
    const db = this.dbProvider.get();

    const sql = mysql.format(
      "DELETE FROM file WHERE idx = ? AND memberIdx = ? ",
      [idx, memberIdx]
    );

    return await db.query({
      sql,
      checkAffectedRow: true
    });
  }

}