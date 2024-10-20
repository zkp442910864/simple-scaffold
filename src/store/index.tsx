import { IMonitoringAjaxData, IMonitoringErrorData } from '@/utils/modules/monitoring';
import { create } from 'zustand';
import { createCustom } from './modules/config';

export const useBaseData = create<IUseBaseData>((set) => ({
    init: 0,
    test: 1,
    updateTest: () => set((state) => ({ test: ++state.test, })),
}));

export const [systemErrorStore, useSystemErrorStore,] = createCustom<ISystemError>((cache, set) => cache({
    errorData: [],
    ajaxData: [],
    updateAjaxData: (newData) => set((state) => {
        state.ajaxData.push(...newData);
        return {
            ajaxData: state.ajaxData.slice(),
        };
    }),
    updateErrorData: (newData) => set((state) => {
        state.errorData.push(...newData);
        return {
            errorData: state.errorData.slice(),
        };
    }),
}));

interface IUseBaseData {
    init: number;
    test: number;
    updateTest: () => void;
}

interface ISystemError {
    errorData: IMonitoringErrorData[];
    updateErrorData: (data: IMonitoringErrorData[]) => void;
    ajaxData: IMonitoringAjaxData[];
    updateAjaxData: (data: IMonitoringAjaxData[]) => void;
}