import mysql, {PoolConnection, RowDataPacket} from 'mysql2';
import {config} from "../config";
import {Message} from "./MessageUtility";
import {injectable} from "inversify";

const activateQuestionMark = (text: string) => {
  return text.replace(/\？/g, '?');
};

const pool = mysql.createPool(config.mysql);

@injectable()
export class Database {
  public isReleased: boolean = true;
  private connection: PoolConnection | null = null;
  private isTransactionStarted: Boolean = false;

  constructor() {
  }

  hasConnection(): boolean {
    return this.connection !== null;
  }

  async getConnection(): Promise<PoolConnection> {
    if (this.connection) {
      return this.connection;
    }

    this.connection = await new Promise((resolve, reject) => {
      pool.getConnection((err: any, connection: PoolConnection) => {
        if (err) {
          console.log(err);
          console.error('-------DB CONNECTION ERROR-------');
          return reject(Message.SERVER_ERROR);
        }
        resolve(connection);
      });
    });

    this.isReleased = false;

    return this.connection as PoolConnection;
  }

  async startTransaction(): Promise<void> {
    if (this.isTransactionStarted) {
      throw Message.TRANSACTION_EXIST;
    }

    const connection = await this.getConnection();

    return new Promise<void>((resolve, reject) => {
      connection.beginTransaction((err) => {
        if (err) {
          console.error('Transaction Start Error:', err);
          connection.release();
          this.connection = null; // 연결 초기화
          return reject(Message.SERVER_ERROR);
        }
        this.isTransactionStarted = true;
        resolve();
      });
    });
  }

  async query(
    {
      sql,
      checkAffectedRow
    }: {
      sql: string,
      checkAffectedRow?: boolean
    }
  ): Promise<any> {
    const connection = await this.getConnection();
    return new Promise((resolve, reject) => {
      connection.query(sql, (err, results) => {
        if (err) {
          return reject(err);
        }

        if (!err && results !== undefined && results.constructor === Array) {
          for (const r of results as RowDataPacket[]) {
            for (const k in r) {
              if (r[k] === undefined || r[k] === 'undefined' || r[k] === null || r[k] === 'null') continue;

              if (r[k].constructor === String) {
                r[k] = activateQuestionMark(r[k] as string);
              }
            }
          }
        }

        if (checkAffectedRow && 'affectedRows' in results && results?.affectedRows !== 1) {
          return reject("checkAffectedRow Error");
        }

        resolve(results);
      });
    });
  }

  async commit(): Promise<void> {
    if (!this.connection) {
      throw new Error('No active transaction');
    }

    if (!this.isTransactionStarted) {
      throw Message.TRANSACTION_NOT_EXIST;
    }

    return new Promise<void>((resolve, reject) => {
      this.connection!.commit((err) => {
        if (err) {
          console.error('Commit Error:', err);
          return reject(Message.SERVER_ERROR);
        }

        this.isTransactionStarted = false;
        resolve();
      });
    });
  }

  async rollback(): Promise<void> {
    if (!this.connection) {
      throw new Error('No active transaction');
    }

    if (!this.isTransactionStarted) {
      throw Message.TRANSACTION_NOT_EXIST;
    }

    return new Promise((resolve, reject) => {
      this.connection!.rollback(() => {
        this.connection!.release();
        this.connection = null;
        this.isTransactionStarted = false;
        resolve();
      });
    });
  }

  async release(): Promise<void> {
    if (!this.connection) return;

    if (this.isTransactionStarted) {
      await this.rollback()
      return;
    }

    this.connection!.release();
    this.connection = null;
  }
}
