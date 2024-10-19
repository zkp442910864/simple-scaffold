
/**
 * - 错误监控
 * 性能监控
 * 用户行为监控
 */
export class Monitoring {
    private static instance: Monitoring;

    /** 错误映射 */
    errorMap = new WeakMap<Error, IMonitoringErrorData>();
    /** 错误数据 */
    errorData: IMonitoringErrorData[] = [];
    /** 本地缓存key */
    private LOCAL_STORAGE_CACHE_KEY = '__monitoring-error';
    private configData: Required<IConfigData> = {
        maxLimit: 50,
        requestApi: async () => {},
    };

    static getInstance(config?: IConfigData) {
        if (!Monitoring.instance) {
            if (!config) throw new Error('首次创建 Monitoring 实例时需要传入有效的配置参数。');
            Monitoring.instance = new Monitoring(config);
        }

        return Monitoring.instance;
    }

    private constructor(config: IConfigData) {
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
            void this.configData.requestApi(data);
        }

        this.handlerCacheData('write');
    }

    /**
     * 处理缓存数据
     * 应对页面关闭后，内存上的数据消失了
     */
    handlerCacheData(type: 'write' | 'read') {
        if (type === 'write') {
            window.localStorage.setItem(this.LOCAL_STORAGE_CACHE_KEY, JSON.stringify(this.errorData));
        }
        else {
            try {
                const oldErrorData = JSON.parse(window.localStorage.getItem(this.LOCAL_STORAGE_CACHE_KEY) || '[]') as IMonitoringErrorData[];
                if (oldErrorData.length) {
                    // TODO: 接口
                    void this.configData.requestApi(oldErrorData);
                    this.handlerCacheData('write');
                }
            }
            catch (error) {
                //
            }
        }
    }
}

/** 配置数据 */
interface IConfigData {
    /** 数据上报接口，达到一定量时候会触发或者页面刚进入时候检测有数据触发 */
    requestApi: (data: IMonitoringErrorData[]) => Promise<void>;
    /**
     * 收集多少条数据时候触发上报
     * @default 50
     */
    maxLimit?: number;
}

/** 错误监控 类型 */
export interface IMonitoringErrorData {
    type: EMonitoringErrorType;
    /** 信息 */
    message: string;
    stack?: string;
    time: string;
    lineno?: number;
    colno?: number;
    /** 文件路径 */
    source: string;
    rawEvent?: ErrorEvent | PromiseRejectionEvent,
    rawError?: Error,
    /** 节点类型的字符串 */
    nodeName?: string;
}

export enum EMonitoringErrorType {
    RUNTIME_ERROR = 'runtimeError',
    RESOURCE_ERROR = 'resourceError',
    PROMISE_REJECT = 'promiseReject',
}


/**
 * 错误监控
 * js错误
 * 资源异常     script,link 资源加载失败
 * 接口错误
 * 白屏         页面白屏
 *
 *
 *
 * 性能监控(加载时间监控说明)
 * window.performance
 * TTFB(首字节时间)     请求发送到接收的首个字节所花费的时间(包括网络请求事件，后端处理时间)
 * FP(首次绘制)         浏览器首次将像素绘制到屏幕上的时间点(首次渲染)(说明用户在网页上看到了内容)。
 *                      FP表示首次绘制了至少一个像素，并给显示在用户屏幕上
 * FCP(首次内容绘制)    首次将dom渲染到屏幕上的事件(可以是任何东西)。
 * FMP(首次有意义绘制)  理解可进行操作了的事件?
 * LCP(最大内容渲染)
 * DCL(加载完成 DOMContentLoaded)
 * L(onLoad)
 * TTI(可交互时间)
 * FID(首次输入延迟)    用户首次 和 页面交互 到页面响应 的交互的时间
 * 卡顿                 超过 50ms 的长任务
 *
 *
 * 用户行为监控(数据统计说明)
 * PV                   页面浏览量或点击量
 * UV                   访问网站的不同ip地址的人数
 * 页面停留时间          每个页面停留时间
 *
 */