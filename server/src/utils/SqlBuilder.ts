import mysql from "mysql2";

export interface SqlColumnData {
  col: string;
  val: string;
  set: string;
}

export class SqlBuilder {
  public static readonly dateColumns: {
    createdAtOnly: SqlColumnData;
    updatedAtOnly: SqlColumnData;
    both: SqlColumnData;
  } = {
    createdAtOnly: {col: 'createdAt', val: 'NOW()', set: 'createdAt = NOW()'},
    updatedAtOnly: {col: 'updatedAt', val: 'NOW()', set: 'updatedAt = NOW()'},
    both: {col: 'createdAt, updatedAt', val: 'NOW(), NOW()', set: 'createdAt = NOW(), updatedAt = NOW()'},
  };

  private static buildSqlFragments(
    data: AnyObject,
    keyList: string[],
    isOptional: boolean = false
  ): { sqlCol: string; sqlVal: string; sqlSet: string, sqlWhere: string } {
    let sqlCol = "";
    let sqlVal = "";
    let sqlSet = "";
    let sqlWhere = "";

    for (const key of keyList) {
      if (isOptional && data[key] === undefined) continue;

      sqlCol += `\`${key}\`, `;
      sqlVal += mysql.format(`?, `, [data[key]]);
      sqlSet += mysql.format(`\`${key}\` = ?, `, [data[key]]);
      sqlWhere += mysql.format(`AND \`${key}\` = ? `, [data[key]]);
    }

    return {sqlCol, sqlVal, sqlSet, sqlWhere};
  }

  public static buildSqlQuery(
    {
      data,
      requiredKeys,
      optionalKeys,
      timestampData,
      removeTailingComma
    }: {
      data: AnyObject,
      requiredKeys?: string | string[],
      optionalKeys?: string | string[],
      timestampData?: SqlColumnData,
      removeTailingComma?: boolean
    }
  ): { sqlCol: string; sqlVal: string; sqlSet: string, sqlWhere: string } {
    let sqlCol = "";
    let sqlVal = "";
    let sqlSet = "";
    let sqlWhere = "";

    if (requiredKeys) {
      const keyList: string[] =
        typeof requiredKeys === "string"
          ? requiredKeys.replace(/\s/g, "").split(",")
          : requiredKeys;

      const fragments = this.buildSqlFragments(data, keyList);
      sqlCol += fragments.sqlCol;
      sqlVal += fragments.sqlVal;
      sqlSet += fragments.sqlSet;
      sqlWhere += fragments.sqlWhere;
    }

    if (optionalKeys) {
      const keyList: string[] =
        typeof optionalKeys === "string"
          ? optionalKeys.replace(/\s/g, "").split(",")
          : optionalKeys;

      const fragments = this.buildSqlFragments(data, keyList, true);
      sqlCol += fragments.sqlCol;
      sqlVal += fragments.sqlVal;
      sqlSet += fragments.sqlSet;
      sqlWhere += fragments.sqlWhere;
    }

    if (timestampData) {
      sqlCol += timestampData.col;
      sqlVal += timestampData.val;
      sqlSet += timestampData.set;
    }

    if (removeTailingComma) {
      sqlCol = sqlCol.substring(0, sqlCol.lastIndexOf(","));
      sqlVal = sqlVal.substring(0, sqlVal.lastIndexOf(","));
      sqlSet = sqlSet.substring(0, sqlSet.lastIndexOf(","));
    }

    return {sqlCol, sqlVal, sqlSet, sqlWhere};
  }
}
