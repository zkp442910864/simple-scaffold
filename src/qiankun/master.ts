import { loadMicroApp } from 'qiankun';

export const microAppConfig: TMicroAppConfigConfig[] = [
    {
        name: 'child1',
        entry: '//localhost:7100',
    },
    {
        name: 'child2',
        entry: '//localhost:7101',
    },
];

export type TMicroAppConfigConfig = Partial<Parameters<typeof loadMicroApp>[0]> & {name: string, entry: string};
