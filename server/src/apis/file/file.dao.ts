import {Database} from "../../utils/Database";
import {FileModel} from "./file.model";
import mysql from "mysql2";
import {PaginatedDaoData} from "../../interfaces/common";
import {SqlBuilder} from "../../utils/SqlBuilder";
import {injectable} from "inversify";

@injectable()
export class FileDao {
  constructor() {
  }

  async selectOne(
    {
      db,
      idx
    }: {
      db: Database,
      idx: number
    }
  ): Promise<FileModel> {
    const sql = mysql.format(
      "SELECT * FROM file WHERE idx = ? ",
      [idx]
    );

    return (await db.query({sql}))[0];
  }

  async selectList(
    {
      db,
      page,
      count,
    }: {
      db: Database,
      page: number,
      count: number,
    }
  ): Promise<PaginatedDaoData<FileModel>> {
    const sql = mysql.format("SELECT * " +
      "FROM file " +
      "ORDER BY idx DESC " +
      "LIMIT ?, ?",
      [(page - 1) * count, count]
    );

    const itemList: FileModel[] = await db.query({sql});

    const cntSql = "SELECT count(*) cnt FROM file";

    const totalCount: number = (await db.query({sql: cntSql}))[0].cnt;

    return {
      itemList,
      totalCount
    }
  }

  async insert(
    {
      db,
      fileKey,
      fileName,
      fileType,
      fileSize,
      memberIdx,
    }: {
      db: Database,
      fileKey: string,
      fileName: string,
      fileType: string,
      fileSize: number,
      memberIdx: number,
    }
  ) {
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
      db,
      idx
    }: {
      db: Database,
      idx: number
    }
  ) {
    const sql = mysql.format("DELETE FROM file WHERE idx = ? ", [idx]);

    return await db.query({
      sql,
      checkAffectedRow: true
    });
  }

}