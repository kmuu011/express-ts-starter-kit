import { injectable } from 'inversify';
import type { Database } from '../../utils/Database';
import { DBContext } from './DBContext';

export interface DatabaseProvider {
  get(): Database;
}

/** 요청별 ALS에서 DB를 꺼내는 Provider */
@injectable()
export class AlsDatabaseProvider implements DatabaseProvider {
  get(): Database {
    return DBContext.get();
  }
}
