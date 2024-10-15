import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { CustomRouter } from './router/index.tsx';
import { createViewport, getDevice } from './utils/index.ts';
import 'virtual:uno.css';

(async () => {
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
