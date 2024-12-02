import { createCustom } from './modules/config';

export const [baseDataStore, useBaseDataStore,] = createCustom<IBaseData>((cache, set) => cache({
    data: {
        timeoutVal: null,
        reachVal: null,
        autoStart: true,
        showFloatWindow: false,
        autoLaunch: false,
        dayData: [],
    },
    updateBaseData: (data: IGlobalAppCacheData) => set((state) => ({ ...state, data, })),
    updateAssignKey: (key, value) => set((state) => {
        state.data[key] = value;
        return { ...state, };
    }),
}));

interface IBaseData {
    data: IGlobalAppCacheData;
    updateBaseData: (data: IGlobalAppCacheData) => void;
    updateAssignKey: <T extends keyof IGlobalAppCacheData>(key: T, value: IGlobalAppCacheData[T]) => void;
}

interface IGlobalAppCacheData {
    /** 超时x后，停止 */
    timeoutVal: number | null;
    /** 每达到x后，通知 */
    reachVal: number | null;
    /**
     * 自动开始计时
     * 不可修改
     */
    autoStart: true;
    /** 显示悬浮窗口 */
    showFloatWindow: boolean;
    /** 开机启动 */
    autoLaunch: boolean;
    /** 每天的数据 */
    dayData: Array<{title: string, value: string}>;
    floatWinPosition?: number[];
}