import { useRef } from 'react';
import { KeepAlive } from './keepAlive';

export const KeepAliveRoot = () => {
    const { current: keepAlive, } = useRef(KeepAlive.getInstance());

    return (
        <>
            {/* <div>测试</div> */}
            <keepAlive.Content/>
        </>
    );
};
