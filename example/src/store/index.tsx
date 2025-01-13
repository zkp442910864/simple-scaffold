import { create } from 'zustand';

export const useBaseData = create<IUseBaseData>((set) => ({
  init: 0,
  test: 1,
  updateTest: () => set((state) => ({ test: ++state.test, })),
}));

// export const [systemErrorStore, useSystemErrorStore,] = createCustom<ISystemError>((cache, set) => cache({
//     errorData: [],
//     ajaxData: [],
//     pageAnalyseData: {},
// }));

interface IUseBaseData {
    init: number;
    test: number;
    updateTest: () => void;
}

// interface ISystemError {
//     errorData: IMonitoringErrorData[];
//     updateErrorData: (data: IMonitoringErrorData[]) => void;
//     ajaxData: IMonitoringAjaxData[];
//     updateAjaxData: (data: IMonitoringAjaxData[]) => void;
//     pageAnalyseData: Partial<IMonitoringAnalyseData>;
//     updatePageAnalyseData: (data: IMonitoringAnalyseData) => void;
// }