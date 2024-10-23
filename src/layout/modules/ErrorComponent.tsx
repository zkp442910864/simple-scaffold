import { useDebounceEffect } from '@/hooks';
import { FC } from 'react';
import { useLocation, useRouteError } from 'react-router-dom';

/**
 * 生产环境时候需要，把错误向外抛出
 *
 * 使用 React 错误边界
 *
 * React 内部组件的错误不会冒泡到 window。需要使用 Error Boundary 捕获。
 */
export const ErrorComponent: FC<{outError?: unknown}> = ({
    outError,
}) => {
    const error = useRouteError();
    const inlineError = (outError || error) as Error;
    const local = useLocation();

    useDebounceEffect(() => {
        // 生产环境时候需要，把错误向外抛出
        if (import.meta.env.PROD) {
            setTimeout(() => {
                throw inlineError;
            }, 0);
        }
    }, [inlineError,]);

    return (
        <div className="f-col flex f-items-center">
            <div>"{local.pathname}" 组件发生错误</div>
            <pre className="un-whitespace-pre-wrap">错误信息:{inlineError?.stack || JSON.stringify(inlineError)}</pre>
        </div>
    );
};
