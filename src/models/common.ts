
import {useState} from 'react';

/**
 * https://umijs.org/docs/max/data-flow
 */
export default () => {
    const [common, setCommon] = useState<TObj>({
        xxxData: 'xxxData',
    });

    return [common, setCommon] as [typeof common, typeof setCommon];
};
