
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



/** 配置数据 */
export interface IConfigData {
    /** 数据上报接口，达到一定量时候会触发或者页面刚进入时候检测有数据触发 */
    requestApi(type: 'error', data: IMonitoringErrorData[]): Promise<void>;
    requestApi(type: 'ajax', data: IMonitoringAjaxData[]): Promise<void>;
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

