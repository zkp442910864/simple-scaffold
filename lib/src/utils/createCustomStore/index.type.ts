import { StateCreator } from 'zustand';

/** 用来存储初始话对象 */
type TCacheFn<T = object> = (data: T) => T;

/** 透传的其他参数 */
type TOtherData<T = object> = Parameters<StateCreator<T, []>>;

export type {
  TCacheFn,
  TOtherData
};