import { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ICustomRouteObject } from '../index.type';
import { CustomRouter } from '../modules/customRouter';

export const useRouter = () => {
    const cache = useRef(CustomRouter.getInstance());
    const local = useLocation();

    return cache.current.routerPageMap[local.pathname.toLowerCase()]?.[0] as ICustomRouteObject | undefined;
};
