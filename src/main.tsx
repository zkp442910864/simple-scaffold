// import './wdyr.ts';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { CustomRouter } from './router';
import 'virtual:uno.css';
import { renderWithQiankun, qiankunWindow } from '@zzzz-/vite-plugin-qiankun/helper';

const render = () => {
    createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <RouterProvider router={CustomRouter.getInstance().router!} />
        </StrictMode>
    );
};

renderWithQiankun({
    bootstrap() {
        render();
    },
    mount(props) {
        console.log(props);
    },
    update(props) {
    },
    unmount(props) {
    },
});

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
    render();
}