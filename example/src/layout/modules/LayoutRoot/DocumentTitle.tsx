import { useRouter } from '@/router';
import { useRef, useEffect } from 'react';

export const DocumentTitle = () => {

    const page = useRouter();
    const { current: cache, } = useRef({
        title: document.title,
    });

    useEffect(() => {
        document.title = page?.title ?? cache.title;
    }, [page,]);

    return <></>;
};
