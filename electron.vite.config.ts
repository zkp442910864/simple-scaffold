import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import UnoCSS from 'unocss/vite';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';

// https://cn.electron-vite.org/guide/
export default defineConfig(({ command, mode, }) => ({
    main: {
        plugins: [externalizeDepsPlugin(),],
    },
    preload: {
        plugins: [externalizeDepsPlugin(),],
    },
    renderer: {
        plugins: [
            react(),
            UnoCSS(),
        ],
        resolve: {
            alias: [
                { find: '@web', replacement: resolve('./src/renderer/src'), },
            ],
        },
        server: {
            host: true,
            port: 6573,
        },
    },
}));
