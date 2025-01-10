import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { CustomRouter } from './router';
import { slaveRender } from './qiankun/slave.ts';
import 'virtual:uno.css';

const render = () => {
    createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <RouterProvider router={CustomRouter.getInstance().router!} />
        </StrictMode>
    );
};

slaveRender(render);
