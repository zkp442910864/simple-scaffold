
/** 不处理错误 */
export const restrainErrorFn = <T extends Array<unknown>, >(fn: (...arg: T) => void) => {
    return (...arg: T) => {
        try {
            fn(...arg);
        }
        catch (error) {
            //
        }
    };
};

