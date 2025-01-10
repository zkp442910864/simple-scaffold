import { renderWithQiankun, qiankunWindow, QiankunProps } from '@zzzz-/vite-plugin-qiankun/helper';
import { ReactNode } from 'react';


export const slaveRender = (renderFn: (props?: ICustomQiankunProps) => void) => {

    renderWithQiankun({
        bootstrap() {
        },
        mount(props) {
            console.log(props);
            renderFn(props as ICustomQiankunProps);
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

export interface ICustomQiankunProps extends QiankunProps {
    basename: string;
    pathname: string;
}

