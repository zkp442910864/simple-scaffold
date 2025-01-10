import { renderWithQiankun, qiankunWindow, QiankunProps } from '@zzzz-/vite-plugin-qiankun/helper';

export const slaveRender = (renderFn: (props?: ICustomQiankunProps) => void) => {

    renderWithQiankun({
        bootstrap() {
            // console.log('bootstrap');
        },
        mount(props) {
            // console.log(props);
            // console.log('mount');
            renderFn(props as ICustomQiankunProps);
        },
        update(props) {
            // console.log('update');
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
    defaultEntry: string;
}

