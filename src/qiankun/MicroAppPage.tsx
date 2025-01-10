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
        error: null as null | Error,
        loading: true,
    }));

    useDebounceEffect(() => {
        void update().then(() => {
            const result = loadMicroApp({
                name: config.name + Date.now(),
                entry: config.entry,
                container: '#' + state.divId,
                props: {
                    basename: config.name,
                    defaultEntry: pathname,
                },
            }, {
                // autoStart: false,
                // sandbox: true,
            }, {
                beforeLoad: async () => {},
                beforeMount: async () => {},
            });

            // console.log(result.loadPromise);
            result.loadPromise.catch((err) => {
                state.error = err as Error;
                void update();
                // throw err;
            }).finally(() => {
                state.loading = false;
                void update();
            });
        });
    }, []);


    if (state.error) {
        throw state.error;
        // return (
        //     <>
        //         <div>{state.error.name}</div>
        //         <div>{state.error.stack}</div>
        //         <div>{state.error.message}</div>
        //     </>
        // );
    }

    return (
        <>
            {state.loading ? 'loading' : ''}
            <div id={state.divId}></div>
        </>
    );
};

interface IProps {
    pathname: string;
    config: TMicroAppConfigConfig;
}