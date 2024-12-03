import { create } from 'zustand';
import { createCustom } from './modules/config';

export const useBaseData = create<IUseBaseData>((set) => ({
    init: 0,
    test: 1,
    updateTest: () => set((state) => ({ test: ++state.test, })),
}));

export const [systemErrorStore, useSystemErrorStore,] = createCustom<ISystemError>((cache, set) => cache({
    ajaxData: [],
    updateAjaxData: (newData) => set((state) => {
        state.ajaxData.push(...newData);
        return {
            ajaxData: state.ajaxData.slice(),
        };
    }),
}));

interface IUseBaseData {
    init: number;
    test: number;
    updateTest: () => void;
}

interface ISystemError {
    ajaxData: never[];
    updateAjaxData: (data: never[]) => void;
}