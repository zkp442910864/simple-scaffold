import { renderWithQiankun, qiankunWindow, QiankunProps } from '@zzzz-/vite-plugin-qiankun/helper';
import { ReactNode } from 'react';


export const slaveRender = (renderFn: (props?: QiankunProps) => void) => {

    renderWithQiankun({
        bootstrap() {
        },
        mount(props) {
            renderFn(props);
        },
        update(props) {
        },
        unmount(props) {
        },
    });

    if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
        renderFn();
    }
};

