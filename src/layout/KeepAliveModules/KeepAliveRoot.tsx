import { useRef } from 'react';
import { KeepAlive } from './KeepAlive';

export const KeepAliveRoot = () => {
    const { current: keepAlive, } = useRef(KeepAlive.getInstance());

    return (
        <>
            {/* <div>测试</div> */}
            <keepAlive.Content/>
        </>
    );
};
