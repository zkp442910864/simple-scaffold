import { useEffect, useRef, useState } from 'react';

export const useDebounceEffect = (effect: React.EffectCallback, deps?: React.DependencyList, options?: {interval?: number, immediate?: boolean}) => {
    const [, update,] = useState({});
    const { current: data, } = useRef({
        immediate: options?.immediate ?? false,
        timeId: null as ReturnType<typeof setTimeout> | null,
        destroy: undefined as ReturnType<typeof effect>,
    });


    useEffect(() => {
        if (data.immediate) {
            // 立即执行的情况下，因为顺序问题，所以不需要执行 "update"，会成功触发下面 "data.destroy"
            data.immediate = false;
            data.destroy = effect();
        }
        else {
            data.timeId && clearTimeout(data.timeId);
            data.timeId = setTimeout(() => {
                data.destroy = effect();
                data.timeId = null;
                data.destroy && update({});
            }, options?.interval ?? 16);
        }
    }, deps);

    useEffect(() => {
        if (data.destroy) {
            const fn = data.destroy;
            data.destroy = undefined;
            return fn;
        }
    }, [data.destroy,]);
};

