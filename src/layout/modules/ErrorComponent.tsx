import { useDebounceEffect } from '@/hooks';
import { FC, useEffect } from 'react';
import { useRouteError } from 'react-router-dom';

/**
 * 生产环境时候需要，把错误向外抛出
 *
 * 使用 React 错误边界
 *
 * React 内部组件的错误不会冒泡到 window。需要使用 Error Boundary 捕获。
 */
export const ErrorComponent: FC<IErrorComponentProps> = ({
    path,
}) => {
    const error = useRouteError() as InstanceType<typeof Error>;

    useDebounceEffect(() => {
        // 生产环境时候需要，把错误向外抛出
        if (import.meta.env.PROD) {
            setTimeout(() => {
                throw error;
            }, 0);
        }
    }, [error,]);

    return (
        <div className="f-col flex f-items-center">
            <div>"{path}" 组件发生错误</div>
            {/* <div>错误信息:{error.message}</div> */}
            <pre className="un-whitespace-pre-wrap">错误栈:{error.stack}</pre>
        </div>
    );
};

interface IErrorComponentProps {
    path?: string;
}
