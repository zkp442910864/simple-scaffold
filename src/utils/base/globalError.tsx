import {Modal} from 'antd';

// 错误拦截
window.addEventListener('unhandledrejection', (e) => {
    // console.log('unhandledrejection', e.reason)
    // 错误推到 error
    throw e.reason;
}, true);


let lock = false;
window.addEventListener('error', (e) => {
    // ChunkLoadError: Loading chunk
    const errorName = e?.error?.name;
    if (errorName === 'ChunkLoadError' && !lock) {
        lock = true;
        Modal.warn({
            title: '版本更新，点击确认刷新页面',
            content: '如无效请手动清缓存 \n 或者检查网络环境',
            onOk: () => {
                window.location.reload();
            },
        });
    }
    return true;
}, true);


