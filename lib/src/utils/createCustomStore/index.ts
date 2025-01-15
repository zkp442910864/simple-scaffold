export * from './index.type';
import { createStore, create } from 'zustand';
import type { TCacheFn, TOtherData } from './index.type';

/**
 * @description
 * - 对 zustand 的封装
 * - 同时支持 React 组件中使用的 useStore 和外部逻辑中访问的 store，并保持内部操作的对象一致性
 */
export const createCustomStore = <T extends object = object, >(fn: (cache: TCacheFn<T>, ...arg: TOtherData<T>) => T) => {
  let cache: T | null = null;
  const cacheFn = (data: T) => {
    if (!cache) {
      cache = data;
    }
    return cache;
  };
  // 想要触发响应 useStore 需要优先执行
  const useStore = create<T>((set, arg2, arg3) => fn(cacheFn, set, arg2, arg3));
  const store = createStore<T>((set, arg2, arg3) => fn(cacheFn, set, arg2, arg3));

  return [store, useStore,] as [typeof store, typeof useStore];
};

