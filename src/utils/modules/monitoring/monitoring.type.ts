
/** 配置数据 */
export interface IConfigData {
    /** 数据上报接口，达到一定量时候会触发或者页面刚进入时候检测有数据触发 */
    requestApi(type: 'error', data: IMonitoringErrorData[]): Promise<void>;
    requestApi(type: 'ajax', data: IMonitoringAjaxData[]): Promise<void>;
    requestApi(type: 'pageAnalyse', data: IMonitoringAnalyseData): Promise<void>;
    // requestApi(type: 'error' | 'ajax', data: IMonitoringErrorData[] | IMonitoringAjaxData[]): Promise<void>;
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
    userAgent: string;
    device?: string;
}

/** 接口监控 类型 */
export interface IMonitoringAjaxData {
    /** 请求路径 */
    url: string;
    /** 请求方式 */
    method: string;
    /** 状态码 */
    status: number;
    /** 响应文本 */
    responseText: string;
    /** 请求文本 */
    requestText: string;
    /** 持续时间 */
    duration: number;
    /** 结束状态 */
    eventType: EMonitoringAjaxEndType;
    /** 网络状态 */
    onLine: boolean;
    /** 发起时间 */
    time: string;
    message?: string;
    raw?: XMLHttpRequest | Response | Error;
    userAgent: string;
    device?: string;
}

export interface IMonitoringAnalyseData {
    list: IMonitoringAnalyseItemData[];
    userAgent: string;
    device?: string;
}

export interface IMonitoringAnalyseItemData {
    title: string;
    name: string;
    value: number;
}

export enum EMonitoringErrorType {
    RUNTIME_ERROR = 'runtimeError',
    RESOURCE_ERROR = 'resourceError',
    PROMISE_REJECT = 'promiseReject',
}

export enum EMonitoringAjaxEndType {
    SUCCESS = 'success',
    ERROR = 'error',
    // 这两个fetch 获取不到
    // TIMEOUT = 'timeout',
    // ABORT = 'abort',
}

