
export const createViewport = (type: DeviceType) => {
    // <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    document.querySelector('[name="viewport"]')?.remove();

    const dom = document.createElement('meta');

    if (['android', 'iphone',].includes(type)) {
        const scale = 1 / window.devicePixelRatio;
        dom.setAttribute('name', 'viewport');
        dom.setAttribute('content', `width=device-width, initial-scale=${scale}, minimum-scale=${scale}, maximum-scale=${scale}, user-scalable=no`);

        setHtmlFontSize();
    }
    else {
        dom.setAttribute('name', 'viewport');
        dom.setAttribute('content', 'width=device-width, initial-scale=1.0');

        setHtmlFontSize();
    }

    document.head.appendChild(dom);
};

/** 获取设备类型 */
export const getDevice = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const platform = (navigator.platform ?? '').toLowerCase();

    const isWeChat = userAgent.includes('micromessenger');
    const isWeCom = userAgent.includes('wxwork'); // 企业微信
    const isQQ = userAgent.includes('qq'); // QQ 浏览器或内嵌环境

    let appStr: AppType = 'unknown';
    let statusStr: DeviceType = 'unknown';

    // 应用类型判断
    if (isWeChat) appStr = 'weChat';
    else if (isWeCom) appStr = 'weCom';
    else if (isQQ) appStr = 'qq';

    // 设备类型判断
    if (/iphone|ipod/.test(userAgent)) statusStr = 'iphone';
    else if (platform === 'macintel' && navigator.maxTouchPoints > 1) statusStr = 'ipad';
    else if (userAgent.includes('android')) statusStr = 'android';
    else if (platform.includes('win')) statusStr = 'win';
    else if (platform.includes('mac')) statusStr = 'macOS';
    else if (platform.includes('linux')) statusStr = 'linux';

    return [appStr, statusStr,] as [AppType, DeviceType];
};


/**
 * 一个标准的尺寸(375/100份 = 3.75)分成100份，也就是说一份3.75，当看到设计稿上的尺寸为100px，就是 100px / 3.75 ≈ 26.67份, 也就是100份里，100px 占了 26.67份。
 *
 * 26.67份 * (device-width / 100份)，就为真实的像素值
 *
 * 这个以vw作为单位使用比较方便
 */
const setHtmlFontSize = () => {
    /** 标准宽(理解成ui图上宽) */
    const baseDeviceWidth = 750;
    /** 标准文字大小(理解成ui图上统一文字大小) */
    const baseFontSize = 32;
    /** 标准份数 */
    const basePart = 10;
    /** 标准份额 */
    const baseDeviceRate = baseDeviceWidth / basePart;

    const fn = () => {
        /** 设备宽/标准设备宽 */
        const baseRate = window.innerWidth / baseDeviceWidth;
        /**
         * TODO: 往下进行缩放，往上保持不变
         * 在屏幕越大的情况下，应该是看的更多，而不是同比缩放
         */
        const val = baseRate > 1 ? baseDeviceRate : window.innerWidth / basePart;

        document.documentElement.setAttribute('style', `font-size:${val}px`);
    };

    fn();
    document.body.attributeStyleMap.set('font-size', `${baseFontSize / baseDeviceRate}rem`);
    window.addEventListener('resize', fn);
};


type AppType = 'unknown' | 'weChat' | 'weCom' | 'qq';
type DeviceType = 'unknown' | 'win' | 'macOS' | 'linux' | 'iphone' | 'ipad' | 'android';
