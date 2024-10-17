import { useEffect, useRef, useState } from 'react';

export const useStateExtend = <S, >(valOrFn: S | (() => S)) => {
    const [val, updateFn,] = useState<S>(valOrFn);
    // const promiseContent = Promise.withResolvers<void>();
    const { current: data, } = useRef({
        promiseContent: Promise.withResolvers<void>(),
        // nextTick: (fn: () => void) => {},
        newUpdateFn: (value: React.SetStateAction<S>) => {
            updateFn(value);

            data.promiseContent = Promise.withResolvers<void>();
            return data.promiseContent.promise;
        },
    });

    useEffect(() => {
        data.promiseContent.resolve();
    }, [val,]);

    return [val, data.newUpdateFn,] as [S, typeof data.newUpdateFn];
};
