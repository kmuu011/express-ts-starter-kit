import mysql, { RowDataPacket } from 'mysql2/promise';
import { config } from '../../src/config';

interface TableNameRow extends RowDataPacket {
  TABLE_NAME: string;
}

export async function truncateAllTables() {
  const connection = await mysql.createConnection(config.mysql);

  // 외래키 제약 끄기
  await connection.query('SET FOREIGN_KEY_CHECKS = 0;');

  const [rows] = await connection.query<TableNameRow[]>(
    "SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = DATABASE();"
  );

  for (const row of rows) {
    await connection.query(`TRUNCATE TABLE \`${row.TABLE_NAME}\`;`);
  }

  // 외래키 제약 다시 켜기
  await connection.query('SET FOREIGN_KEY_CHECKS = 1;');
  await connection.end();
}
