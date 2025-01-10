import { useRouter } from '@/router';
import { useRef, useEffect } from 'react';
import { Link, Outlet } from 'react-router';
import { DocumentTitle } from './DocumentTitle';
import { MenuList } from './MenuList';
import { useStateData } from '@/hooks';
import { qiankunWindow } from '@zzzz-/vite-plugin-qiankun/helper';

export const LayoutRoot = () => {

    const page = useRouter();
    const { state, } = useStateData(() => ({
        title: document.title,
    }));

    useEffect(() => {
        document.title = page?.title ?? state.title;
    }, [page,]);

    return (
        <>
            {qiankunWindow.__POWERED_BY_QIANKUN__ ? '' : <DocumentTitle/>}
            {qiankunWindow.__POWERED_BY_QIANKUN__ ? '' : <MenuList/>}
            <Outlet />
        </>
    );
};
