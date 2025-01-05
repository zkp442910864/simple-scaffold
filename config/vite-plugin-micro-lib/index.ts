import * as fs from 'node:fs';
import path from 'node:path';
import { cwd } from 'node:process';
import { build, Plugin } from 'vite';
import chalk from 'chalk';



export const microLib = (options: IOptions) => {
    const {
        outDir = './micro-lib',
        externalData,
        webAbsUrl = '',
        minify = true,
        sourcemap = true,
        customHandleGenerateCode,
    } = options;

    let envMode = 'development';
    let rootOutDir = 'dist';
    const { external, libMap, outDirPath, } = generateExternalAndLibMap(externalData, outDir, webAbsUrl);

    const pluginConfig: Plugin = {
        name: 'vite-plugin-micro-lib',
        apply: 'build',
        enforce: 'post',
        config: (config, env) => {
            envMode = env.mode;
            rootOutDir = config.build?.outDir || 'dist';

            if (envMode === 'development') return;

            return {
                build: {
                    rollupOptions: {
                        external,
                    },
                },
            };
        },
        transformIndexHtml(html) {
            if (envMode === 'development') return html;

            // 引入js包
            const importMap = Object.fromEntries(
                Object.values(libMap).map((item) => [item.name, item.webAbsUrl || item.scriptUrl,])
            );

            const scriptList = [
                `<script type="importmap">${JSON.stringify({ imports: importMap, })}</script>`,
                ...Object.values(libMap).map((item) => `<script type="module" crossorigin src="${item.webAbsUrl || item.scriptUrl}"></script>`),
            ];

            return html.replace('</title>', `</title>\n${scriptList.join('\n')}\n`);
        },
        async closeBundle() {
            if (envMode === 'development') return;

            console.log(`\n${chalk.cyan('Micro libraries built:')}`);

            for (const lib of external) {
                const libItem = libMap[lib];

                /** 处理非lib打包后,内容没有进行export抛出问题 */
                const libPlugin: Plugin = {
                    name: 'vite-plugin-child-build',
                    closeBundle() {},
                    async generateBundle(options, bundle, isWrite) {
                        const asset = bundle[libItem.fileName];
                        if (asset.type !== 'chunk') return;

                        if (libItem.lib) {
                            //
                        }
                        else if (customHandleGenerateCode) {
                            asset.code = await customHandleGenerateCode(libItem, asset.code);
                        }
                        else {
                            let originalCode = asset.code;
                            const exportName = originalCode.match(/var\s*(\w+)\s*=\s*\{\}[;|,]/)?.[1]?.trim();
                            const reg = new RegExp(`(${exportName}\\.(\\w+)\\s*=)`);
                            const regG = new RegExp(`(${exportName}\\.(\\w+)\\s*=)`, 'g');
                            const matchData = originalCode.match(regG);

                            if (!exportName || !matchData) return;

                            matchData.forEach((str) => {
                                const exportData = str.match(reg)?.[2]?.trim();

                                if (exportData && originalCode.includes(`function ${exportData}(`)) {
                                    originalCode = originalCode.replace(`function ${exportData}(`, `export function ${exportData}(`);
                                }
                                else {
                                    const newStr = str.replace(reg, `export const ${exportData} = $1`);
                                    originalCode = originalCode.replace(str, newStr);
                                }
                            });

                            asset.code = `${originalCode}\nexport default ${exportName};`;
                        }

                        console.log(
                            `✔ ${chalk.green(path.posix.join(rootOutDir, outDir, libItem.fileName))}   ${(asset.code.length / 1024).toFixed(2)} kB`
                        );
                    },
                };

                await build({
                    mode: 'production',
                    configFile: false,
                    publicDir: false,
                    // esbuild: false,
                    logLevel: 'silent',
                    build: {
                        emptyOutDir: false,
                        outDir: path.join(rootOutDir, outDirPath),
                        minify,
                        sourcemap,
                        lib: libItem.lib
                            ? {
                                entry: lib,
                                formats: ['es',],
                            }
                            : undefined,
                        rollupOptions: {
                            external: external.filter(ii => ii !== lib),
                            input: lib,
                            treeshake: libItem.treeshake,
                            output: {
                                format: 'module',
                                entryFileNames: libMap[lib].fileName,
                                // esModule: true,
                            },
                        },
                    },
                    plugins: [libPlugin,],
                });
            }
        },
    };

    return pluginConfig;
};

function generateExternalAndLibMap(externalData: Record<string, IExternalData>, outDir: string, webAbsUrl: string) {
    const packageJson = JSON.parse(fs.readFileSync(path.resolve(cwd(), 'package.json'), 'utf-8')) as {dependencies: Record<string, string>};
    const external = Object.keys(externalData);
    const libMap: Record<string, ILibData> = {};
    const outDirPath = path.join(outDir);

    // 生成数据
    external.forEach((key) => {
        const [name, childName,] = key.split('/');
        const version = packageJson.dependencies[name];
        const fileName = `${key}${version}.mjs`.replace(/[\^~]/, '@').replace('/', '-');

        libMap[key] = {
            name: key,
            version,
            fileName,
            scriptUrl: `./${path.posix.join(outDirPath, fileName)}`,
            webAbsUrl: webAbsUrl ? `${webAbsUrl}/${fileName}` : '',
            treeshake: true,
            lib: false,
            ...externalData[key],
        };
    });
    return { external, libMap, outDirPath, };
}

interface IExternalData {
    /**
     * 是否启用 Tree Shaking
     * @default true
     */
    treeshake?: boolean;
    /**
     * 是否作为库进行打包
     * @default false
     */
    lib?: boolean;
}

interface ILibData extends IExternalData {
    name: string,
    version: string,
    scriptUrl: string,
    webAbsUrl: string,
    fileName: string,
}

interface IOptions {
    outDir?: string;
    externalData: Record<string, IExternalData>;
    webAbsUrl?: string;
    minify?: boolean;
    sourcemap?: boolean;
    customHandleGenerateCode?: (libItem: IExternalData, code: string) => string | Promise<string>;
};
