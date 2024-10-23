import { useEffect, useRef, useState } from 'react';

export const useStateExtend = <S, >(valOrFn: S | (() => S)) => {
    const [val, updateFn,] = useState<S>(valOrFn);
    // const promiseContent = Promise.withResolvers<void>();
    const { current: data, } = useRef({
        lock: false,
        promiseContent: Promise.withResolvers<void>(),
        // nextTick: (fn: () => void) => {},
        newUpdateFn: (value: React.SetStateAction<S>) => {
            !data.lock && updateFn(value);

            data.promiseContent = Promise.withResolvers<void>();
            return data.promiseContent.promise;
        },
    });

    useEffect(() => {
        data.promiseContent.resolve();
    }, [val,]);

    useEffect(() => {
        data.lock = false;
        return () => {
            data.lock = true;
        };
    }, []);

    return [val, data.newUpdateFn,] as [S, typeof data.newUpdateFn];
};
