import { create } from 'zustand';

export const useBaseData = create<IUseBaseData>((set) => ({
    init: 0,
    test: 1,
    updateTest: () => set((state) => ({ test: ++state.test, })),
}));

interface IUseBaseData {
    init: number;
    test: number;
    updateTest: () => void;
}

