import { createBrowserRouter, createHashRouter, Navigate, RouteObject } from 'react-router-dom';
import { ErrorComponent, LayoutRoot, NoFindPage } from '@/layout';
import { lazy, Suspense } from 'react';

export class CustomRouter {
    private static instance: CustomRouter;

    router?: ReturnType<typeof createBrowserRouter>;
    defaultRoot = <LayoutRoot />;
    defaultErrorFn = (props?: Parameters<typeof ErrorComponent>[0]) => <ErrorComponent {...props} />;

    /** 这个变量要注意和目录保持一致 */
    localPageBasePaths = ['/src/pages/', '/index.tsx',];
    localPageMap: Record<string, () => Promise<{default: () => JSX.Element}>> = {};

    /** 加载过渡 */
    loadingComponent = <div>Loading...</div>;

    /** 匹配不到页面 */
    noFindPage: RouteObject = { path: '*', element: <NoFindPage />, errorElement: this.defaultErrorFn({ path: 'NoFindPage', }), };

    /** 需要重定向页面 */
    redirectRouter: RouteObject[] = [
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
        const root = serverData ? this.generateServerRouter(serverData) : this.generateLocalRouter();
        this.createRouter(root);
    }

    /** 获取本地 pages 文件 */
    getLocalPages() {
        this.localPageMap = import.meta.glob('@/pages/**/index.tsx') as typeof this.localPageMap;
        return this.localPageMap;
    }

    /** 异步加载组件 */
    lazyComponent(fn: typeof this.localPageMap[string]) {
        const Module = lazy(fn);
        return (
            <Suspense fallback={this.loadingComponent}>
                <Module></Module>
            </Suspense>
        );
    }

    /** 匹配服务端数据进行生成 */
    generateServerRouter(serverData: ServerDataModel) {
        const [prefix, suffix,] = this.localPageBasePaths;
        const root: RouteObject = {
            path: '/',
            element: this.defaultRoot,
            children: [
                // TODO: 根基业务情况匹配
                this.noFindPage,
            ],
        };
        return root;
    }

    /** 基于本地数据生成 */
    generateLocalRouter() {
        const [prefix, suffix,] = this.localPageBasePaths;
        const root: RouteObject = {
            path: '/',
            element: this.defaultRoot,
            errorElement: this.defaultErrorFn(),
            children: [
                ...Object.keys(this.localPageMap).map((url) => {
                    const path = url.replace(prefix, '/').replace(suffix, '');
                    const data: RouteObject = {
                        element: this.lazyComponent(this.localPageMap[url]),
                        path,
                        errorElement: this.defaultErrorFn({ path, }),
                    };
                    return data;
                }),
                this.noFindPage,
            ],
        };
        return root;
    }

    createRouter(root: RouteObject) {
        this.router = createHashRouter([
            ...this.redirectRouter,
            root,
            this.noFindPage,
        ]);
    }
}

type ServerDataModel = unknown;
