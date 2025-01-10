import { microAppConfig } from '@/qiankun/master';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { MicroAppPage } from './MicroAppPage';
import { useStateExtend } from '@/hooks';


export const NoFindPage = () => {
    const local = useLocation();
    const [, update,] = useStateExtend({});
    const { current: state, } = useRef({
        loading: true,
        microApp: false,
    });

    const checkPath = (path: string) => {
        const item = microAppConfig.find(ii => path.toLocaleLowerCase().includes(ii.name.toLocaleLowerCase()));
        state.microApp = !!item;
    };

    useEffect(() => {
        checkPath(local.pathname.slice(1));
        state.loading = false;
        void update({});
    }, []);

    if (state.loading) return <div>loading</div>;

    if (state.microApp) return <MicroAppPage pathname={local.pathname} />;

    return (
        <>
            <div>-404-</div>
        </>
    );
};
