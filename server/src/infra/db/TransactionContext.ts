import { AsyncLocalStorage } from 'node:async_hooks';

type TxStore = {
  depth: number;            // 중첩 트랜잭션(데코레이터 중첩) 깊이
};

const als = new AsyncLocalStorage<TxStore>();

export const TxContext = {
  run<T>(fn: () => T) {
    const cur = als.getStore();
    if (cur) return fn();          // 이미 컨텍스트 있음
    return als.run({ depth: 0 }, fn);
  },
  get depth() { return als.getStore()?.depth ?? 0; },
  set depth(v: number) {
    const s = als.getStore();
    if (s) s.depth = v;
  }
};
