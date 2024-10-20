import { EMonitoringAjaxEndType, IConfigData, IMonitoringAjaxData } from './monitoring.type';
import { restrainErrorFn } from './config';

/** 监控接口 */
export class MonitoringAjax {
    /** 本地 接口信息缓存key */
    private static LOCAL_STORAGE_CACHE_KEY = '__monitoring-ajax';

    /** 原生对象 */
    RawXMLHttpRequest = window.XMLHttpRequest;
    RawFetch = window.fetch;

    /** 收集数据 */
    ajaxData: IMonitoringAjaxData[] = [];

    private configData: Required<IConfigData> = {
        maxLimit: 50,
        requestApi: async () => {},
    };

    constructor(config: IConfigData) {
        Object.assign(this.configData, config);
        this.start();
    }

    start() {
        this.handlerCacheData('read');
        this.overrideXMLHttpRequest();
        this.overrideFetch();
    }

    stop() {
        window.XMLHttpRequest = this.RawXMLHttpRequest;
        window.fetch = this.RawFetch;
    }

    /** 重写XMLHttpRequest */
    overrideXMLHttpRequest() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const outThis = this;
        const fn = (function () {
            const xhr = new outThis.RawXMLHttpRequest();
            const data: IMonitoringAjaxData = {
                url: '',
                method: '',
                requestText: '',
                duration: 0,
                eventType: EMonitoringAjaxEndType.SUCCESS,
                status: 0,
                responseText: '',
                time: '',
                raw: xhr,
                onLine: true,
            };

            xhr.open = function (method, url) {
                data.url = url.toString();
                data.method = method.toUpperCase();
                // eslint-disable-next-line prefer-rest-params
                return outThis.RawXMLHttpRequest.prototype.open.apply(this, arguments as never);
            };

            xhr.send = function (body) {
                data.duration = Date.now();
                data.requestText = JSON.stringify(body) || '';
                data.time = new Date().toISOString();

                const handleEvent = (eventType: EMonitoringAjaxEndType) => {
                    data.duration = Date.now() - data.duration;
                    data.eventType = eventType;
                    data.status = xhr.status;
                    data.responseText = xhr.responseText;
                    data.onLine = navigator.onLine;
                    if (xhr.status === 0) {
                        data.message = '可能问题: CORS, 网络离线, 超时, 中断, 浏览器调试';
                    }
                    outThis.reportData(data);
                };

                xhr.addEventListener('load', () => {
                    handleEvent(EMonitoringAjaxEndType.SUCCESS);
                });
                xhr.addEventListener('error', () => {
                    handleEvent(EMonitoringAjaxEndType.ERROR);
                });
                xhr.addEventListener('timeout', () => {
                    handleEvent(EMonitoringAjaxEndType.ERROR);
                });
                xhr.addEventListener('abort', () => {
                    handleEvent(EMonitoringAjaxEndType.ERROR);
                });
                // eslint-disable-next-line prefer-rest-params
                return outThis.RawXMLHttpRequest.prototype.send.apply(this, arguments as never);
            };

            // xhr.addEventListener
            return xhr;
        }) as unknown as typeof window.XMLHttpRequest;
        window.XMLHttpRequest = fn;
    }

    /** 重写fetch */
    overrideFetch() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const outThis = this;
        const fn: typeof this.RawFetch = async function (input, init) {
            let resData: Response | Error;
            const data: IMonitoringAjaxData = {
                url: '',
                method: '',
                requestText: '',
                duration: Date.now(),
                eventType: EMonitoringAjaxEndType.SUCCESS,
                status: 0,
                responseText: '',
                time: new Date().toISOString(),
                // raw: xhr,
                onLine: true,
            };

            if (typeof input === 'string' || input instanceof URL) {
                data.url = input.toString();
                data.method = (init?.method || 'get').toUpperCase();
                data.requestText = init?.body?.toString() ?? '';
            }
            else if (input instanceof Request) {
                data.url = input.url;
                data.method = input.method.toUpperCase();
                data.requestText = await input.clone().text();
            }

            try {
                resData = await outThis.RawFetch.call(window, input, init);
                return resData;
            }
            catch (error) {
                resData = error as Error;
                throw error; // 继续抛出错误以确保调用方捕获
            }
            finally {
                data.raw = resData!;
                data.duration = Date.now() - data.duration;
                data.onLine = navigator.onLine;

                if (resData! instanceof Response) {
                    data.eventType = EMonitoringAjaxEndType.SUCCESS;
                    data.responseText = await resData.clone().text(); // 响应内容异步读取
                    data.status = resData.status;
                }
                else {
                    data.eventType = EMonitoringAjaxEndType.ERROR;
                    data.responseText = (data.raw as Error).message || '请求失败';
                    data.status = 0;
                    data.message = '可能问题: CORS, 网络离线, 超时, 中断, 浏览器调试';
                }
                outThis.reportData(data); // 上报数据
            }
        };

        window.fetch = fn;
    }

    /** 上报数据 */
    reportData(data: IMonitoringAjaxData) {
        this.ajaxData.push(data);

        // // TODO: 接口
        if (this.ajaxData.length >= this.configData.maxLimit) {
            const data = this.ajaxData.splice(0, this.configData.maxLimit);
            void this.configData.requestApi('ajax', data);
        }

        this.handlerCacheData('write');
        // console.log(this.ajaxData);
    }

    /**
     * 处理缓存数据
     * 应对页面关闭后，内存上的数据消失了
     */
    handlerCacheData = restrainErrorFn((type: 'write' | 'read') => {
        if (type === 'write') {
            window.localStorage.setItem(MonitoringAjax.LOCAL_STORAGE_CACHE_KEY, JSON.stringify(this.ajaxData));
        }
        else {
            const oldData = JSON.parse(window.localStorage.getItem(MonitoringAjax.LOCAL_STORAGE_CACHE_KEY) || '[]') as IMonitoringAjaxData[];
            if (oldData.length) {
                // TODO: 接口
                void this.configData.requestApi('ajax', oldData);
                this.handlerCacheData('write');
            }
        }
    });
}
