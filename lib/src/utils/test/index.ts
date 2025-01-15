export * from './index.type';
import type { ITestData } from './index.type';

export const test = (data: ITestData) => {
  console.log(data);
};