
/**
 * 通过请求 HTML 判断系统是否需要更新，并拦截资源加载错误判断系统状态。
 */
export class SystemUpdateSPA {
    private static instance?: SystemUpdateSPA;

    /** 定时器 */
    private timerId: ReturnType<typeof setInterval> | null = null;
    /** 初始 HTML 内容 */
    private initialHtml = '';
    /** 配置数据 */
    private readonly baseData: ISystemUpdateSPAData;
    /** 是否处于运行状态 */
    isActive = false;
    /** 是否有弹窗正在打开 */
    private pendingDialog = false;
    /** 避免出现多次同一错误 */
    private errorSet = new WeakSet();

    static getInstance(data?: ISystemUpdateSPAData) {
        if (!SystemUpdateSPA.instance) {
            if (!data) {
                throw new Error('首次创建 SystemUpdateSPA 实例时需要传入有效的配置参数。');
            }
            SystemUpdateSPA.instance = new SystemUpdateSPA(data);
        }
        return SystemUpdateSPA.instance;
    }

    private constructor(data: ISystemUpdateSPAData) {
        this.baseData = data;
        this.start();
    }

    /** 启动 */
    start() {
        if (this.isActive) return;

        this.isActive = true;
        window.addEventListener('unhandledrejection', this.unhandledrejectionFn, true);
        window.addEventListener('error', this.errorFn, true);
        this.rollPoling();
    }

    /** 停止 */
    stop() {
        if (!this.isActive) return;

        this.isActive = false;
        window.removeEventListener('unhandledrejection', this.unhandledrejectionFn, true);
        window.removeEventListener('error', this.errorFn, true);

        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
    }

    /** promise 错误处理, 推到error上 */
    private unhandledrejectionFn = (e: PromiseRejectionEvent) => {
        throw e.reason;
    };

    /** 错误拦截 */
    private errorFn = (e: ErrorEvent) => {
        // TODO:
        if (!this.errorSet.has(e.error as object)) {
            this.baseData.interceptError?.(e, () => this.showUpdateDialog('error'));
        }
        e.error && this.errorSet.add(e.error as object);
    };

    /** 轮询检测版本 */
    private rollPoling() {
        const checkForUpdate = async () => {
            // TODO:
            if (this.baseData.customCheckUpdateFn) {
                this.baseData.customCheckUpdateFn(() => this.showUpdateDialog('update'));
            }
            else {
                const newHtml = await this.fetchHtml(`?v=${Date.now()}`);
                if (this.isActive && this.initialHtml !== newHtml) {
                    void this.showUpdateDialog('update');
                }
            }
        };

        void checkForUpdate();
        this.timerId = setInterval(() => void checkForUpdate(), this.baseData.interval ?? 1000 * 60 * 10);
    }

    /** 更新窗口 */
    private showUpdateDialog = async (type: 'update' | 'error') => {
        if (this.pendingDialog) return;
        this.pendingDialog = true;
        // TODO:
        await this.baseData?.dialog(type);
        this.pendingDialog = false;
    };

    /** 获取html */
    async fetchHtml(queryStr = '') {
        // TODO:
        const url = typeof this.baseData.htmlPath === 'function'
            ? this.baseData.htmlPath(queryStr)
            : this.baseData.htmlPath || `${window.location.origin}${window.location.pathname}${queryStr}`;

        const res = await fetch(url);
        const htmlContent = await res.text();

        if (!this.initialHtml) {
            this.initialHtml = htmlContent;
        }

        return htmlContent;
    }

}

interface ISystemUpdateSPAData {
    /**
     * 用来检测页面是否更新的 HTML 地址。
     * @param {string} queryStr - `?v=${Date.now()}`
     * @default `${window.location.origin}${window.location.pathname}${queryStr}`
     */
    htmlPath?: string | ((queryStr: string) => string);
    /**
     * 自定义轮询检测逻辑，触发更新时调用 `updateDialog`
     *
     * `customCheckUpdateFn` 优先于html检测逻辑
     */
    customCheckUpdateFn?: (updateDialog: () => Promise<void>) => void;
    /**
     * 拦截全局错误，并在识别为更新时调用 `updateDialog`。
     * @param e ErrorEvent - 错误事件
     * @param updateDialog () => void - 更新对话框触发函数
     */
    interceptError?: (e: ErrorEvent, updateDialog: () => Promise<void>) => void;
    /**
     * 更新对话框展示函数。
     * @param type - 错误类型，'update' 或 'error'
     */
    dialog: (type: 'update' | 'error') => Promise<void>;
    /** 轮询间隔时间（毫秒），默认为 10 分钟 */
    interval?: number;
}

