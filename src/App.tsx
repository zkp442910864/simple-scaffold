import { useEffect, useMemo, useRef } from 'react';
import { Outlet, useRouteError } from 'react-router';
import { useRouter } from './router';

const App = () => {
    // const local = useLocation();
    const page = useRouter();
    const { current: cache, } = useRef({
        title: document.title,
    });

    useEffect(() => {
        document.title = page?.title ?? cache.title;
    }, [page,]);

    return useMemo(() => <Outlet />, []);
};

export default App;