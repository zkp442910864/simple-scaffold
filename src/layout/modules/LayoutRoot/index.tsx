import { useRouter } from '@/router';
import { useRef, useEffect } from 'react';
import { Link, Outlet } from 'react-router';
import { DocumentTitle } from './DocumentTitle';
import { MenuList } from './MenuList';

export const LayoutRoot = () => {

    const page = useRouter();
    const { current: cache, } = useRef({
        title: document.title,
    });

    useEffect(() => {
        document.title = page?.title ?? cache.title;
    }, [page,]);

    return (
        <>
            <DocumentTitle/>
            <MenuList/>
            <Outlet />
        </>
    );
};
