
import { useRouter } from '@/router';
import { FC, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { NoFindPage } from '../modules/NoFindPage';
import { useLocation } from 'react-router-dom';

export class KeepAlive {
    static instance: KeepAlive;

    id = `keep-alive-${parseInt(Math.random() * 100000 + '')}`;
    private contentDom?: HTMLElement;

    static getInstance() {
        if (!KeepAlive.instance) {
            KeepAlive.instance = new KeepAlive();
        }
        return KeepAlive.instance;
    }

    private constructor() {}

    /** 根渲染容器组件 */
    Content = () => {
        const local = useLocation();
        const [, update,] = useState({});
        const { current: cache, } = useRef({
            keepAliveItems: [] as typeof local[],
            keepAliveMap: {} as Record<string, typeof local>,
            currentPathname: '',
        });


        useEffect(() => {
            this.contentDom = document.getElementById(this.id)!;
        }, []);

        useEffect(() => {
            const pathname = local.pathname;
            if (cache.currentPathname === pathname) return;

            if (!cache.keepAliveMap[pathname]) {
                cache.keepAliveMap[pathname] = local;
                cache.keepAliveItems.push(local);
            }

            cache.currentPathname = pathname;
            update({});
        }, [local,]);

        return (
            <>
                <div id={this.id}></div>
                {
                    cache.keepAliveItems.map((item) =>
                        <this.KeepAliveItem key={item.pathname} activate={cache.currentPathname === item.pathname} />
                    )
                }
            </>
        );
    };

    /** 页面挂载组件 */
    KeepAliveItem: FC<{activate: boolean}> = ({
        activate,
    }) => {
        const page = useRouter();
        const [, update,] = useState({});
        const { current: cache, } = useRef({
            div: document.createElement('div'),
            portal: null as null | ReturnType<typeof createPortal>,
        });

        useEffect(() => {
            if (activate && this.contentDom) {
                cache.portal = cache.portal || createPortal(
                    // <this.ChildError>{page?.element || <NoFindPage/>}</this.ChildError>,
                    page?.element || <NoFindPage/>,
                    cache.div
                );
                this.contentDom.appendChild(cache.div);
            }
            else {
                cache.div.remove();
            }
            update({});
        }, [activate, this.contentDom,]);

        return cache.portal;
    };

}