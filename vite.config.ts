import react from '@vitejs/plugin-react';
import { BuildOptions, defineConfig, UserConfig } from 'vite';
import { resolve } from 'path';
import { compression } from 'vite-plugin-compression2';
import { analyzer } from 'vite-bundle-analyzer';
import UnoCSS from 'unocss/vite';
import Inspect from 'vite-plugin-inspect';
import { extractSourceMap } from './config/vite-plugin-extract-source-map';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, }) => ({
    base: './',
    // define: {
    //     'process.env': {}, // 模拟空的 process.env 对象
    //     __dirname: '"' + __dirname + '"',
    // },
    plugins: [
        Inspect(),
        react(),
        UnoCSS(),
        // 提取sourcemap
        extractSourceMap({
            outDir: 'dist/maps',
        }),
        // 分析
        // analyzer(),
        // gzip压缩
        // compression(),
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
        // sourcemap: false,
        sourcemap: 'hidden',
        rollupOptions: {
            output: {
                // 页面根据路径名称生成name值
                entryFileNames: handlerFileNames('assets', '[hash].js'),
                chunkFileNames: handlerFileNames('assets', '[hash].js'),
                // 使用这种方式会导致生成的文件hash值不一致
                // sourcemapFileNames: handlerFileNames('maps', '[hash].js.map'),
                // assetFileNames: 'assets/[name]-[hash].[ext]',
                assetFileNames: (assetInfo) => {
                    if (assetInfo.names?.join('').endsWith('.map')) {
                        return 'maps/[name]-[hash][extname]'; // map 文件放入 maps 目录
                    }
                    return 'assets/[name]-[hash][extname]'; // 其他资源
                },
            },
        },
    },
}));


/** 自定义输出文件名称 */
function handlerFileNames(target: string, suffix: string) {
    type TFnType = Exclude<Exclude<Exclude<Exclude<BuildOptions['rollupOptions'], undefined>['output'], undefined>, object[]>['chunkFileNames'], string | undefined>

    const fn: TFnType = (chunkInfo) => {

        if (chunkInfo.isEntry) {
            return `${target}/common-${suffix}`;
        }
        else {
            const lastModuleId = chunkInfo.moduleIds[chunkInfo.moduleIds.length - 1];
            const mId = chunkInfo.facadeModuleId || lastModuleId || '';


            const base = ['/src/', '.tsx',];
            const index = mId.indexOf(base[0]);
            if (index > -1) {
                const path = mId.substring(index);
                const pathName = path
                    .replace(base[0], '')
                    .replace(base[1], '')
                    .replace(/\/(\w)/g, (_, match1: string) => match1.toUpperCase());

                return `${target}/${pathName}-${suffix}`;
            }

            return `${target}/chunk-[name]-${suffix}`;
        }

    };

    return fn;
}

