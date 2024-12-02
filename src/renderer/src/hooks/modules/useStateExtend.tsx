import { useEffect, useRef, useState } from 'react';

export const useStateExtend = <S, >(valOrFn: S | (() => S)) => {
    const [val, updateFn,] = useState<S>(valOrFn);
    // const promiseContent = Promise.withResolvers<void>();
    const { current: data, } = useRef({
        /** 锁是为了防止组件移除后，还执行修改值 */
        lock: false,
        promiseContent: Promise.withResolvers<void>(),
        /** 记录旧值，一致的不更新 */
        prevValue: Symbol('prevValue') as React.SetStateAction<S>,
        // nextTick: (fn: () => void) => {},
        newUpdateFn: (value: React.SetStateAction<S>) => {
            if (data.prevValue === value) return;

            data.prevValue = value;
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
