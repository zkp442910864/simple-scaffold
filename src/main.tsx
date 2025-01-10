import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { CustomRouter } from './router';
import { ICustomQiankunProps, slaveRender } from './qiankun/slave.ts';
import 'virtual:uno.css';

const render = (props?: ICustomQiankunProps) => {
    createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <RouterProvider router={CustomRouter.getInstance(props?.basename).router!} />
        </StrictMode>
    );
};

slaveRender(render);
