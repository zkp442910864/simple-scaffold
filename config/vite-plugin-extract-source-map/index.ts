import * as fs from 'fs';
import path from 'path';
import { Plugin, ResolvedConfig } from 'vite';


/**
 * 因为
 *  "build.rollupOptions.output.chunkFileNames" 和
 *  "build.rollupOptions.output.sourcemapFileNames"
 * 设置不同输出的时候，hash会不一致了,所以在打包后，把文件单独移动到指定位置
 */
export const extractSourceMap = ({ outDir = 'dist/maps', } = {}) => {
    let resolvedConfig: ResolvedConfig;

    /** 递归删除目录 */
    const removeFolder = (folderPath: string) => {
        if (fs.existsSync(folderPath)) {
            fs.rmSync(folderPath, { recursive: true, force: true, });
        }
    };

    /** 递归创建目录 */
    const mkdirFolder = (folderPath: string) => {
        fs.mkdirSync(folderPath, { recursive: true, });
    };

    const pluginConfig: Plugin = {
        name: 'vite-plugin-extract-source-map',
        apply: 'build',
        enforce: 'post',
        configResolved(e) {
            resolvedConfig = e;
        },
        closeBundle: () => {
            const assetsDir = path.join( resolvedConfig.build.outDir, resolvedConfig.build.assetsDir );
            const targetDir = path.normalize(outDir);
            removeFolder(targetDir);
            mkdirFolder(targetDir);

            const list = fs.readdirSync('dist/assets', {});
            list.forEach((val) => {
                const fileName = val as string;
                if (fileName.endsWith('.js.map')) {
                    fs.renameSync(path.join(assetsDir, fileName), path.join(targetDir, fileName));
                }
            });
        },
    };

    return pluginConfig;
};
