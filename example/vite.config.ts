import react from '@vitejs/plugin-react';
import { BuildOptions, defineConfig, normalizePath, UserConfig } from 'vite';
import { resolve } from 'node:path';
import UnoCSS from 'unocss/vite';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, }) => ({
    base: './',
    // define: {
    //     'process.env': {}, // 模拟空的 process.env 对象
    //     __dirname: '"' + __dirname + '"',
    // },
    plugins: [
        // Inspect(),
        react(),
        UnoCSS(),
    ],
    resolve: {
        alias: [
            { find: '@', replacement: resolve('./src'), },
            // { find: 'vite', replacement: resolve('./node_modules/vite'), },
        ],
    },
    server: {
        host: true,
    },
    build: {
        // minify: false,
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
                assetFileNames: (assetInfo) => {
                    if (assetInfo.originalFileNames?.length && assetInfo.name && assetInfo.name.endsWith('.css')) {
                        const flag = assetInfo.originalFileNames[0].startsWith('/');
                        const name = transformName(`${flag ? '' : '/'}${assetInfo.originalFileNames[0]}`) || '[name]';
                        return `assets/${name}-[hash][extname]`;
                    }

                    return 'assets/[name]-[hash][extname]'; // 其他资源
                },
            },
        },
    },
}));

function transformName(pathUrl: string) {
    const base = ['/src/', '.tsx',];
    const index = pathUrl.indexOf(base[0]);
    if (index === -1) return undefined;

    const path = pathUrl.substring(index);
    const pathName = path
        .replace(base[0], '')
        .replace(base[1], '')
        .replace(/\//g, '-');
        // .replace(/\/(\w)/g, (_, match1: string) => match1.toUpperCase());

    return pathName;
}

/** 自定义输出文件名称 */
function handlerFileNames(target: string, suffix: string) {
    type TFnType = Exclude<Exclude<Exclude<Exclude<BuildOptions['rollupOptions'], undefined>['output'], undefined>, object[]>['chunkFileNames'], string | undefined>

    const fn: TFnType = (chunkInfo) => {

        if (chunkInfo.isEntry) {
            return `${target}/common-${suffix}`;
        }
        else {
            const lastModuleId = chunkInfo.moduleIds[chunkInfo.moduleIds.length - 1];
            const mId = normalizePath(chunkInfo.facadeModuleId || lastModuleId || '');
            const pathName = transformName(mId) || 'chunk-[name]';

            return `${target}/${pathName}-${suffix}`;
        }

    };

    return fn;
}

