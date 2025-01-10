import { loadMicroApp } from 'qiankun';

export const microAppConfig: TMicroAppConfigConfig[] = [];

export type TMicroAppConfigConfig = Partial<Parameters<typeof loadMicroApp>[0]> & {name: string, entry: string};
