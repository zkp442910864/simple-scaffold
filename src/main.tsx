import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { CustomRouter } from './router/index.tsx';
import { createViewport, getDevice } from './utils/index.ts';
import 'virtual:uno.css';
import { SystemUpdateSPA } from './utils/modules/systemUpdateSPA.ts';
// import { Monitoring } from './utils/modules/monitoring.ts';
import { IMonitoringAjaxData, IMonitoringAnalyseData, IMonitoringErrorData, Monitoring } from './utils/modules/monitoring/index.ts';
import { systemErrorStore } from './store/index.tsx';
import { decodeSourceMap } from './utils/modules/decodeSourceMap.ts';

void (() => {
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
        dialog: () => {
            confirm('qweqe');
            return Promise.resolve();
        },
        interceptError(e, updateDialog) {
            // console.log(Date.now());
            // console.log(e);
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

    createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <RouterProvider router={CustomRouter.getInstance().router!}/>
        </StrictMode>
    );
})();
