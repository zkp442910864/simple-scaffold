import { restrainErrorFn } from './config';
import { EMonitoringErrorType, IConfigData, IMonitoringErrorData } from './monitoring.type';

/** 错误监控 */
export class MonitoringError {
    /** 本地 错误信息缓存key */
    private static LOCAL_STORAGE_CACHE_KEY = '__monitoring-error';

    /** 错误映射 */
    errorMap = new WeakMap<Error, IMonitoringErrorData>();
    /** 错误数据 */
    errorData: IMonitoringErrorData[] = [];

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
        window.addEventListener('error', this.errorFn, true);
        window.addEventListener('unhandledrejection', this.unhandledrejectionFn, true);
    }

    stop() {
        window.removeEventListener('error', this.errorFn);
        window.removeEventListener('unhandledrejection', this.unhandledrejectionFn, true);
    }

    /** 错误拦截 */
    errorFn = (e: ErrorEvent) => {
        // debugger;

        if (e.target instanceof HTMLElement) {
            void this.reportData({
                type: EMonitoringErrorType.RESOURCE_ERROR,
                message: e.message ?? '资源加载失败',
                time: new Date().toISOString(),
                nodeName: e.target.nodeName,
                source: (e.target as HTMLImageElement).src || (e.target as HTMLLinkElement).href || '',
                rawEvent: e,
                rawError: e.error as Error,
            });
        }
        else {
            void this.reportData({
                type: EMonitoringErrorType.RUNTIME_ERROR,
                message: e.message ?? '逻辑错误',
                stack: (e.error as Error)?.stack || '',
                time: new Date().toISOString(),
                source: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                rawEvent: e,
                rawError: e.error as Error,
            });
        }
    };

    /** promise 错误拦截 */
    unhandledrejectionFn = (e: PromiseRejectionEvent) => {
        // console.log(e);
        void this.reportData({
            type: EMonitoringErrorType.PROMISE_REJECT,
            message: (e.reason as Error)?.message || 'Promise reject 未处理',
            stack: (e.reason as Error)?.stack || '',
            time: new Date().toISOString(),
            source: '',
            rawEvent: e,
            rawError: e.reason as Error,
        });
    };

    /** 上报数据 */
    reportData(data: IMonitoringErrorData) {
        if (data.rawError) {
            const oldData = this.errorMap.get(data.rawError);
            if (oldData) {
                // 覆盖
                Object.assign(oldData, data);
            }
            else {
                // 添加
                this.errorMap.set(data.rawError, data);
                this.errorData.push(data);
            }
        }
        else {
            this.errorData.push(data);
        }

        // TODO: 接口
        if (this.errorData.length >= this.configData.maxLimit) {
            const data = this.errorData.splice(0, this.configData.maxLimit);
            void this.configData.requestApi('error', data);
        }

        this.handlerCacheData('write');
    }

    /**
     * 处理缓存数据
     * 应对页面关闭后，内存上的数据消失了
     */
    handlerCacheData = restrainErrorFn((type: 'write' | 'read') => {
        if (type === 'write') {
            window.localStorage.setItem(MonitoringError.LOCAL_STORAGE_CACHE_KEY, JSON.stringify(this.errorData));
        }
        else {
            const oldData = JSON.parse(window.localStorage.getItem(MonitoringError.LOCAL_STORAGE_CACHE_KEY) || '[]') as IMonitoringErrorData[];
            if (oldData.length) {
                // TODO: 接口
                void this.configData.requestApi('error', oldData);
                this.handlerCacheData('write');
            }
        }
    });
}
