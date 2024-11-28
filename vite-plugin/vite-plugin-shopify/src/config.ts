import path from 'node:path'
import { BuildOptions, Plugin, UserConfig, normalizePath } from 'vite'
import glob from 'fast-glob'
import createDebugger from 'debug'

import type { Options } from './types'

const debug = createDebugger('vite-plugin-shopify:config')

// Plugin for setting necessary Vite config to support Shopify plugin functionality
export default function shopifyConfig (options: Required<Options>): Plugin {
  const plugin: Plugin = {
    name: 'vite-plugin-shopify-config',
    config (config: UserConfig): UserConfig {
      const host = config.server?.host ?? 'localhost'
      const port = config.server?.port ?? 5173
      const https = config.server?.https
      const origin = config.server?.origin ?? '__shopify_vite_placeholder__'
      const defaultAliases: Record<string, string> = {
        '~': path.resolve(options.sourceCodeDir),
        '@': path.resolve(options.sourceCodeDir)
      }

      const input = glob.sync([
        normalizePath(path.join(options.entrypointsDir, '**/*')),
        ...options.additionalEntrypoints
      ], { onlyFiles: true })

      const generatedConfig: UserConfig = {
        // Use relative base path so to load imported assets from Shopify CDN
        base: config.base ?? './',
        // Do not use "public" directory
        publicDir: config.publicDir ?? false,
        build: {
          // Output files to "assets" directory
          outDir: config.build?.outDir ?? path.join(options.themeRoot, 'assets'),
          // Do not use subfolder for static assets
          assetsDir: config.build?.assetsDir ?? '',
          // Configure bundle entry points
          rollupOptions: {
            input: config.build?.rollupOptions?.input ?? input,
            output: {
              // 页面根据路径名称生成name值
              entryFileNames: handlerFileNames(options, '[hash].js'),
              chunkFileNames: handlerFileNames(options, '[hash].js'),
              // 使用这种方式会导致生成的文件hash值不一致
              // sourcemapFileNames: handlerFileNames('maps', '[hash].js.map'),
              // assetFileNames: 'assets/[name]-[hash].[ext]',
              // assetFileNames: handlerFileNames('[hash][extname]'),
              assetFileNames: (assetInfo) => {
                if (assetInfo.originalFileNames?.length && assetInfo.names?.length) {
                  const name = transformName(assetInfo.originalFileNames[0], options) || '[name]';
                  return `${name}-[hash][extname]`; // 其他资源
                }
                return '[name]-[hash][extname]'; // 其他资源
              },
            },
          },
          // Output manifest file for backend integration
          manifest: typeof config.build?.manifest === 'string' ? config.build.manifest : true
        },
        resolve: {
          // Provide import alias to source code dir for convenience
          alias: Array.isArray(config.resolve?.alias)
            ? [
                ...(config.resolve?.alias ?? []),
                ...Object.keys(defaultAliases).map(alias => ({
                  find: alias,
                  replacement: defaultAliases[alias]
                }))
              ]
            : {
                ...defaultAliases,
                ...config.resolve?.alias
              }
        },
        server: {
          host,
          https,
          port,
          origin,
          hmr: config.server?.hmr === false
            ? false
            : {
                ...(config.server?.hmr === true ? {} : config.server?.hmr)
              }
        }
      }

      debug(generatedConfig)

      // Return partial config (recommended)
      // See: https://vitejs.dev/guide/api-plugin.html#config
      return generatedConfig
    }
  }

  return plugin;
}

function transformName(pathUrl: string, options: Required<Options>) {
  const base = [options.entrypointsDir, /.tsx|.ts|.js|.scss|.css/,] as [string, RegExp];
  const index = pathUrl.indexOf(base[0]);
  if (index === -1) return undefined;

  const path = pathUrl.substring(index);
  const pathName = path
        .replace(base[0], '')
        .replace(base[1], '')
        .replace(/(\/)/g, (_, _1, index) => index === 0 ? '' : '-');

  return pathName;
}

/** 自定义输出文件名称 */
function handlerFileNames(options: Required<Options>, suffix: string) {
  type TFnType = Exclude<Exclude<Exclude<Exclude<BuildOptions['rollupOptions'], undefined>['output'], undefined>, object[]>['chunkFileNames'], string | undefined>

  const fn: TFnType = (chunkInfo) => {

    const lastModuleId = chunkInfo.moduleIds[chunkInfo.moduleIds.length - 1];
    const mId = normalizePath(chunkInfo.facadeModuleId || lastModuleId || '');
    const pathName = transformName(mId, options) || 'chunk-[name]';

    return `${pathName}-${suffix}`;

  };

  return fn;
}
