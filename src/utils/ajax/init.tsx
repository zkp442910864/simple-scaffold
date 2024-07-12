import {AlovaMethodCreateConfig, createAlova, Method, MethodType} from 'alova';
import GlobalFetch from 'alova/GlobalFetch';

import {baseDomain} from '../base/constant';


export enum EStatus {
    /** 可能浏览器发送失败 */
    otherError = 'other error',
    /** 响应的数据状态码错误 */
    serverError = 'server error',
    /** 请求状态非200的错误 */
    serverErrorNot200 = 'server status error not 200',
    /** 成功 */
    success = 'success',
}

const alovaInstance = createAlova({
    requestAdapter: GlobalFetch(),
    localCache: null,
    beforeRequest: (method) => {
        method.config.headers.token = 'token';
    },
    responded: {
        onSuccess: async (response, method) => {
            const json = await response.json();

            if (response.status >= 300) {
                return {
                    data: json,
                    type: EStatus.serverErrorNot200,
                };
            }

            // if (json.code !== 200) {
            //     return {
            //         data: json,
            //         type: EStatus.serverError,
            //     };
            // }

            return {
                data: json,
                type: EStatus.success,
            };
        },
    },
});

export const requestApi = <T extends TObj = TObj>(
    method: MethodType,
    url: string,
    data?: any,
    config?: AlovaMethodCreateConfig<any, any, unknown, any>,
) => {
    const methodObj = new Method(method, alovaInstance, baseDomain + url, {
        ...config,
        // cache: false,
    }, ['GET', 'HEAD'].includes(method) ? undefined : data);

    const promise = methodObj.send().catch((err) => {
        return Promise.reject({
            data: err,
            type: EStatus.otherError,
        });
    }).then((data) => {
        const newData = data as IData<T>;
        if (newData.type === EStatus.success) {
            return newData.data;
        }
        return Promise.reject(newData);
    }).catch((data: IData<any>) => {
        console.error(data);
        return Promise.reject(data);
    });


    return promise;
};

// const fn = window.fn = async (id: string) => {
//     try {
//         const data = await requestApi('GET', `https://jsonplaceholder.typicode.com/todos/${id}`, {}, {
//             localCache: {
//                 mode: 'memory',
//                 expire: 60 * 10 * 1000,
//             },
//         });
//         // console.log(data);
//         return data;
//     } catch (error) {
//         console.error(error);
//     }
// };


// (async () => {
//     const a = await window.fn(1);
//     const b = await window.fn(2);
//     const d = await Promise.all([window.fn(3), window.fn(3), window.fn(3), window.fn(3), window.fn(3)]);
//     console.log(a, b, d);

//     // console.log(a);
// })();

interface IData<T = any> {
    type: EStatus;
    data: T;
}
