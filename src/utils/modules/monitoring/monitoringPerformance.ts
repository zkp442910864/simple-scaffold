import { getDevice } from '../viewport';
import { IConfigData, IMonitoringAnalyseItemData } from './monitoring.type';


export class MonitoringPerformance {
    /** 加载分析指标 */
    loadAnalyse: Record<string, IMonitoringAnalyseItemData> = {
        // 网络连接
        DNS: { title: 'DNS', name: 'DNS', value: -1, },
        TCP: { title: 'TCP', name: 'TCP', value: -1, },
        SSL: { title: 'SSL', name: 'SSL', value: -1, },
        // 加载html
        TTFB: { title: '首字节时间', name: 'TTFB', value: -1, },
        // 渲染到页面
        FP: { title: '首次绘制', name: 'FP', value: -1, },
        FCP: { title: '首次内容绘制', name: 'FCP', value: -1, },
        // 渲染到页面(需要观察 node元素)
        FMP: { title: '首次有意义绘制', name: 'FMP', value: -1, },
        LCP: { title: '最大内容渲染', name: 'LCP', value: -1, },
        // dom渲染完
        DCL: { title: '加载完成 DOMContentLoaded', name: 'DCL', value: -1, },
        L: { title: 'onLoad', name: 'L', value: -1, },
        // 交互
        TTI: { title: '可交互时间', name: 'TTI', value: -1, },
        FID: { title: '首次输入延迟', name: 'FID', value: -1, },
    };

    private configData: Required<IConfigData> = {
        maxLimit: 50,
        requestApi: async () => {},
    };

    constructor(config: IConfigData) {
        Object.assign(this.configData, config);
        void this.analyseFn().then((data) => {
            void this.configData.requestApi('pageAnalyse', {
                list: data,
                userAgent: navigator.userAgent,
                device: getDevice()[1],
            });
        });

    }

    async analyseFn() {
        // performance.timeOrigin 返回性能测量开始时的时间的高精度时间戳。
        // performance.now();
        // 获取所有导航相关的性能条目。
        // performance.getEntriesByType('navigation');
        // 获取所有资源相关的性能条目
        // performance.getEntriesByType('resource');

        const otherAsyncPromise = this.otherAsyncPerformanceObserver();
        const pagePerformance = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        this.loadAnalyse.DNS.value = pagePerformance.domainLookupEnd - pagePerformance.domainLookupStart;
        this.loadAnalyse.TCP.value = pagePerformance.connectEnd - pagePerformance.secureConnectionStart;
        this.loadAnalyse.SSL.value = pagePerformance.connectEnd - pagePerformance.connectStart;

        this.loadAnalyse.TTFB.value = pagePerformance.responseStart - pagePerformance.requestStart;

        return otherAsyncPromise.then(({ lcp, fmp, fid, }) => {
            this.loadAnalyse.FP.value = performance.getEntriesByName('first-paint')[0]?.startTime;
            this.loadAnalyse.FCP.value = performance.getEntriesByName('first-contentful-paint')[0]?.startTime;

            this.loadAnalyse.FMP.value = fmp;
            this.loadAnalyse.LCP.value = lcp;

            this.loadAnalyse.DCL.value = pagePerformance.domContentLoadedEventEnd - pagePerformance.domainLookupStart;
            this.loadAnalyse.L.value = pagePerformance.loadEventStart - pagePerformance.fetchStart;
            this.loadAnalyse.TTI.value = pagePerformance.domInteractive - pagePerformance.fetchStart;

            this.loadAnalyse.FID.value = fid;

            // console.log(pagePerformance);
            // await otherAsyncPromise;
            // return Object.values(this.loadAnalyse);

            return Object.values(this.loadAnalyse);
        });

    }

    /** FMP LCP FID */
    otherAsyncPerformanceObserver() {
        return new Promise<{fmp: number, lcp: number, fid: number}>((rel) => {
            let [fmp, lcp, fid,] = [-1, -1, -1,];
            let fmpObserver: PerformanceObserver | null = new PerformanceObserver((entryList) => {
                const perEntries = entryList.getEntries();
                // console.log(perEntries[0]);
                fmp = perEntries[0].startTime;

                // fmpObserver?.disconnect();
                // fmpObserver = null;
            });
            fmpObserver.observe({ entryTypes: ['element',], });

            let lcpObserver: PerformanceObserver | null = new PerformanceObserver((entryList) => {
                const perEntries = entryList.getEntries();
                // console.log(perEntries[0]);
                lcp = perEntries[0].startTime;

                // lcpObserver?.disconnect();
                // lcpObserver = null;
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint',], });

            let fidObserver: PerformanceObserver | null = new PerformanceObserver((entryList) => {
                const firstInput = entryList.getEntries()[0] as PerformanceEventTiming;
                if (firstInput) {
                    // processingStart 开始处理的时间
                    // startTime 开始点击的时间
                    // 差值就是处理的延迟
                    fid = firstInput.processingStart - firstInput.startTime;
                }

                fmpObserver?.disconnect();
                fmpObserver = null;

                lcpObserver?.disconnect();
                lcpObserver = null;

                fidObserver?.disconnect();
                fidObserver = null;

                rel({ fmp, lcp, fid, });
            });
            fidObserver.observe({ type: 'first-input', buffered: true, });
        });
    }
}
