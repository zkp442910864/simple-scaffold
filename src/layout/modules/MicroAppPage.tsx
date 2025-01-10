import { useDebounceEffect, useStateData } from '@/hooks';
import { FC } from 'react';
import { loadMicroApp } from 'qiankun';

export const MicroAppPage: FC<IProps> = ({
    pathname,
}) => {
    const { state, update, } = useStateData(() => ({
        divId: 'micro-app' + Date.now(),
    }));

    useDebounceEffect(() => {
        void update().then(() => {
            // registerMicroApps([
            //     {
            //         name: 'child1',
            //         entry: '//localhost:7100',
            //         container: '#' + state.divId,
            //         activeRule: '/child1/page1',
            //     },
            // ]);
            loadMicroApp({
                name: 'child1-' + Date.now(),
                entry: '//localhost:7100',
                container: '#' + state.divId,
                props: {
                    pathname,
                },
            }, {
                autoStart: true,
            }, {
                beforeLoad: async () => {
                    // console.log(1);
                },
                beforeMount: async () => {},
            });
        });
    }, []);

    return (
        <div id={state.divId}>MicroAppPage</div>
    );
};

interface IProps {
    pathname: string;
}