import { IConfigData } from './monitoring.type';
import { MonitoringAjax } from './monitoringAjax';
import { MonitoringError } from './monitoringError';
export * from './monitoring.type';

export class Monitoring {
    private static instance: Monitoring;

    monitoringError: MonitoringError;
    monitoringAjax: MonitoringAjax;

    static getInstance(config?: IConfigData) {
        if (!Monitoring.instance) {
            if (!config) throw new Error('首次创建 Monitoring 实例时需要传入有效的配置参数。');
            Monitoring.instance = new Monitoring(config);
        }

        return Monitoring.instance;
    }

    private constructor(config: IConfigData) {
        this.monitoringError = new MonitoringError(config);
        this.monitoringAjax = new MonitoringAjax(config);
    }

    start() {
        this.monitoringError.start();
        this.monitoringAjax.start();
    }

    stop() {
        this.monitoringError.stop();
        this.monitoringAjax.stop();
    }
}

