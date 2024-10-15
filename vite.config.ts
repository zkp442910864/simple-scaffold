import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { resolve } from 'path';
import { compression } from 'vite-plugin-compression2';
import { analyzer } from 'vite-bundle-analyzer';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, }) => ({
    base: './',
    plugins: [
        react(),
        // 分析
        // analyzer(),
        ...mode === 'production'
            ? [
                // gzip压缩
                compression({
                    // algorithm: 'brotliCompress',
                    // deleteOriginalAssets: true,
                }),
            ]
            : [],
    ],
    resolve: {
        alias: [
            { find: '@', replacement: resolve('./src'), },
        ],
    },
    server: {
        host: true,
    },
    build: {
        reportCompressedSize: false,
        // sourcemap: true,
        rollupOptions: {
            output: {
                entryFileNames: 'assets/common-[hash].js',
                // 页面根据路径名称生成name值
                chunkFileNames: (chunkInfo) => {
                    const base = ['/src/', '.tsx',];
                    const lastModuleId = chunkInfo.moduleIds[chunkInfo.moduleIds.length - 1];
                    const mId = chunkInfo.facadeModuleId || lastModuleId || '';
                    const index = mId.indexOf(base[0]) ?? -1;
                    if (index > -1) {
                        const path = mId.substring(index);
                        const pathName = path
                            .replace(base[0], '')
                            .replace(base[1], '')
                            .replace(/\/(\w)/g, (_, match1) => match1.toUpperCase());

                        return `assets/${pathName}-[hash].js`;
                    }

                    return 'assets/chunk-[name]-[hash].js';
                },
                assetFileNames: 'assets/[name]-[hash].[ext]',
            },
        },
    },
}));
