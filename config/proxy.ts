import {defineConfig} from 'umi';

const proxy: ReturnType<typeof defineConfig>['proxy'] = {
    '/api/': {
        target: 'http://xxx.xxx.com/',
        changeOrigin: true,
        pathRewrite: {'^/api': ''},
    },
};

export default proxy;
