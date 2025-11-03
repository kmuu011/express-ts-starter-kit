import { AsyncLocalStorage } from 'node:async_hooks';
import type { Database } from '../../utils/Database';

type Store = { db: Database };
const als = new AsyncLocalStorage<Store>();

export const DBContext = {
  run<T>(db: Database, fn: () => T) {
    return als.run({ db }, fn);
  },
  get(): Database {
    const s = als.getStore();
    if (!s?.db) throw new Error('DBContext not initialized');
    return s.db;
  }
};
