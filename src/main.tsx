// import './wdyr.ts';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { CustomRouter } from './router';
import { createViewport, getDevice } from './utils/index.ts';
import { SystemUpdateSPA } from './utils/modules/systemUpdateSPA.ts';
import { IMonitoringAjaxData, IMonitoringAnalyseData, IMonitoringErrorData, Monitoring } from './utils/modules/monitoring/index.ts';
import { systemErrorStore } from './store/index.tsx';
import { ICustomQiankunProps, slaveRender } from './qiankun/slave.ts';
import 'virtual:uno.css';

const render = (props?: ICustomQiankunProps) => {
    Monitoring.getInstance({
        maxLimit: 2,
        requestApi: (type, data) => {
            if (type === 'error') {
                systemErrorStore.getState().updateErrorData(data as IMonitoringErrorData[]);
            }
            else if (type === 'ajax') {
                systemErrorStore.getState().updateAjaxData(data as IMonitoringAjaxData[]);
            }
            else if (type === 'pageAnalyse') {
                systemErrorStore.getState().updatePageAnalyseData(data as IMonitoringAnalyseData);
            }
            return Promise.resolve();
        },
    });

    SystemUpdateSPA.getInstance({
        // 开发环境不触发
        isDev: import.meta.env.DEV,
        interval: 1000,
        dialog: (type) => {
            confirm('qweqe' + type);
            return Promise.resolve();
        },
        interceptError(e, updateDialog) {
            if (import.meta.env.DEV) return;

            if (
                e.target instanceof HTMLScriptElement ||
                e.target instanceof HTMLLinkElement ||
                e.message?.includes('Uncaught TypeError: Failed to fetch dynamically imported module')
            ) {
                console.log(e);
                try {
                    const source = (e.target as HTMLImageElement).src || (e.target as HTMLLinkElement).href || e.filename;
                    if (source) {
                        const obj = new URL(source);
                        if (obj.origin === window.location.origin) {
                            void updateDialog();
                        }
                    }
                    else {
                        void updateDialog();
                    }
                }
                catch (error) {
                    void updateDialog();
                }
            }
        },
    });

    const [, dType,] = getDevice();
    createViewport(dType);

    // 存在菜单，就先请求完成
    document.getElementById('skeleton-screen')!.remove();

    createRoot(document.getElementById('main-root')!).render(
        <StrictMode>
            <RouterProvider router={CustomRouter.getInstance({ basename: props?.basename, defaultEntry: props?.defaultEntry, }).router!} />
        </StrictMode>
    );
};


slaveRender(render);
