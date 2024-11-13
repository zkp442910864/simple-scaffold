import shopifyClear from '@by-association-only/vite-plugin-shopify-clean';
import react from '@vitejs/plugin-react';
import {resolve} from "path";
import UnoCSS from 'unocss/vite';
import {defineConfig} from 'vite';
// import shopify from 'vite-plugin-shopify';
import shopify from './vite-plugin/vite-plugin-shopify/src';
import importMaps from 'vite-plugin-shopify-import-maps';

// https://vitejs.dev/config/
export default defineConfig(() => ({
    plugins: [
        shopify(),
        importMaps({ bareModules: true, modulePreload: true }),
        shopifyClear(),
        react(),
        UnoCSS(),
    ],
    build: {
        emptyOutDir: false,
        minify: false,
        rollupOptions: {
          // 看情况是否需要开启
          treeshake: false,
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: '@use "@/styles/variable.scss" as *;',
                importers: [],
            },
        },
    },
    resolve: {
        alias: [
            { find: '@', replacement: resolve('./frontend'), },
        ],
    },
}));

