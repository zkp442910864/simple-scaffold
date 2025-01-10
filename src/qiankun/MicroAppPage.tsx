import { useDebounceEffect, useStateData } from '@/hooks';
import { FC } from 'react';
import { loadMicroApp } from 'qiankun';
import { TMicroAppConfigConfig } from './master';

export const MicroAppPage: FC<IProps> = ({
    pathname,
    config,
}) => {
    const { state, update, } = useStateData(() => ({
        divId: 'micro-app' + Date.now(),
    }));

    useDebounceEffect(() => {
        void update().then(() => {
            loadMicroApp({
                name: config.name + Date.now(),
                entry: config.entry,
                container: '#' + state.divId,
                props: {
                    basename: config.name,
                    pathname,
                },
            }, {
                autoStart: true,
            }, {
                beforeLoad: async () => {},
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
    config: TMicroAppConfigConfig;
}