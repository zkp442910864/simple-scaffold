import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { CustomRouter } from './router/index.tsx';

(async () => {
    // 存在菜单，就先请求完成
    // createRoot(document.getElementById('skeleton-screen')!);
    document.getElementById('skeleton-screen')!.remove();

    createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <RouterProvider router={CustomRouter.getInstance().router!}/>
        </StrictMode>
    );
})();
