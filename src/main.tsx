import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { CustomRouter } from './router';
import { createViewport, getDevice } from './utils/index.ts';
import 'virtual:uno.css';

void (() => {
    const [, dType,] = getDevice();
    createViewport(dType);

    createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <RouterProvider router={CustomRouter.getInstance().router!}/>
        </StrictMode>
    );
})();
