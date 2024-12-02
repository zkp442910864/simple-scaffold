import { createBrowserRouter, createHashRouter, Navigate } from 'react-router-dom';
import { ErrorComponent, LayoutRoot, Loading, NoFindPage } from '@web/layout';
import { lazy, Suspense } from 'react';
import App from '@web/App';
import { ICustomRouteObject, ServerDataModel } from '../index.type';

export class CustomRouter {
    private static instance: CustomRouter;

    router?: ReturnType<typeof createBrowserRouter>;
    routerPageMap: Record<string, ICustomRouteObject[]> = {};
    layoutRoot = <LayoutRoot />;
    defaultError = <ErrorComponent />;

    /** 这个变量要注意和目录保持一致 */
    localPageBasePaths = ['/src/pages/', '/index.tsx',];
    localPagePromiseFnMap: Record<string, () => Promise<{default: () => JSX.Element}>> = {};

    /** 加载过渡 */
    loadingComponent = <Loading/>;

    /** 匹配不到页面 */
    noFindPage: ICustomRouteObject = {
        path: '*',
        element: <NoFindPage />,
        errorElement: this.defaultError,
    };

    /** 优先级高的自定义路由数据 */
    firstRouterData: ICustomRouteObject[] = [
        { path: '/', element: <Navigate to="/Home" />, },
    ];

    static getInstance(serverData?: ServerDataModel) {
        if (!CustomRouter.instance) {
            CustomRouter.instance = new CustomRouter(serverData);
        }

        return CustomRouter.instance;
    }

    private constructor(serverData?: ServerDataModel) {
        this.getLocalPages();
        const pageList = serverData ? this.generateServerRouter(serverData) : this.generateLocalRouter();
        this.createRouter(pageList);
        this.generateRouterMap();
    }

    createRouter(pageList: ICustomRouteObject[]) {
        this.router = createHashRouter([
            {
                path: '/',
                element: <App />,
                children: [
                    ...this.firstRouterData,
                    {
                        path: '/',
                        element: this.layoutRoot,
                        errorElement: this.defaultError,
                        children: [
                            ...pageList,
                            this.noFindPage,
                        ],
                    },
                    this.noFindPage,
                ],
            },
        ]);
    }

    /** 获取本地 pages 文件 */
    getLocalPages() {
        this.localPagePromiseFnMap = import.meta.glob('@web/pages/**/index.tsx') as typeof this.localPagePromiseFnMap;
        return this.localPagePromiseFnMap;
    }

    /** 生成路由map */
    generateRouterMap = () => {
        const map = this.routerPageMap;
        const routers = this.router!.routes;
        const each = (data: ICustomRouteObject[]) => {
            data.forEach(item => {
                if (item.children) {
                    each(item.children);
                }
                else if (item.path) {
                    const key = item.path.toLowerCase();
                    map[key] = map[key] || [];
                    map[key].push(item);
                }
            });
        };

        each(routers as ICustomRouteObject[]);
    };

    /** 异步加载组件 */
    lazyComponent(fn: typeof this.localPagePromiseFnMap[string]) {
        const Module = lazy(fn);
        // return this.loadingComponent;
        return (
            <Suspense fallback={this.loadingComponent}>
                <Module></Module>
            </Suspense>
        );
    }

    /** 匹配服务端数据进行生成 */
    generateServerRouter(serverData: ServerDataModel) {
        const [prefix, suffix,] = this.localPageBasePaths;
        return [];
    }

    /** 基于本地数据生成 */
    generateLocalRouter() {
        const [prefix, suffix,] = this.localPageBasePaths;

        return Object.keys(this.localPagePromiseFnMap).map((url, index) => {
            const path = url.replace(prefix, '/').replace(suffix, '');
            const data: ICustomRouteObject = {
                path,
                element: this.lazyComponent(this.localPagePromiseFnMap[url]),
                errorElement: this.defaultError,
                title: `页面-${path}-${index}`,
            };
            return data;
        });
    }

}
