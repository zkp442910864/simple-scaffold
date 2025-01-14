import { useEffect, useRef, useState } from 'react';

/**
 * 对 useState 的扩展,实现操作对象,绕过闭包的问题
 * @param stateFn
 * @returns
 */
export const useStateData = <T = unknown>(stateFn: () => T) => {
  const [val, update,] = useState({});
  const [state,] = useState(stateFn);
  const { current: data, } = useRef({
    lock: false,
    promiseContent: Promise.withResolvers<void>(),
    // nextTick: (fn: () => void) => {},
    newUpdateFn: () => {
      !data.lock && update({});

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


  return { state, update: data.newUpdateFn, };
};
