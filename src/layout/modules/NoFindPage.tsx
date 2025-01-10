import { microAppConfig, TMicroAppConfigConfig } from '@/qiankun/master';
import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router';
import { MicroAppPage } from '@/qiankun/MicroAppPage';
import { useStateData } from '@/hooks';


export const NoFindPage = () => {
    const local = useLocation();
    const { state, update, } = useStateData(() => ({
        loading: true,
        microApp: null as null | undefined | TMicroAppConfigConfig,
        pathname: local.pathname,
    }));
    const microApp = useMemo(() => state.microApp ? <MicroAppPage pathname={state.pathname} config={state.microApp} /> : '', [state.microApp,]);

    const checkPath = (path: string) => {
        const item = microAppConfig.find(ii => path.toLocaleLowerCase().startsWith(ii.name.toLocaleLowerCase()));
        state.microApp = item;
    };

    useEffect(() => {
        checkPath(state.pathname.slice(1));
        state.loading = false;
        void update();
    }, []);

    if (state.loading) return <div>loading</div>;

    if (state.microApp) return microApp;

    return (
        <>
            <div>-404-</div>
        </>
    );
};
