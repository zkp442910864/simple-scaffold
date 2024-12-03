import react from '@vitejs/plugin-react';
import { BuildOptions, defineConfig } from 'vite';
import { resolve } from 'path';
import UnoCSS from 'unocss/vite';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, }) => ({
    clearScreen: false,
    plugins: [
        react(),
        UnoCSS(),
    ],
    resolve: {
        alias: [
            { find: '@', replacement: resolve('./src'), },
        ],
    },
    server: {
        host: true,
        port: 5173,
    },
    // 添加有关当前构建目标的额外前缀，使这些 CLI 设置的 Tauri 环境变量可以在客户端代码中访问
    envPrefix: ['VITE_', 'TAURI_ENV_*',],
    build: {
        // Tauri 在 Windows 上使用 Chromium，在 macOS 和 Linux 上使用 WebKit
        target: process.env.TAURI_ENV_PLATFORM == 'windows'
            ? 'chrome105'
            : 'safari13',
        outDir: 'build',
        reportCompressedSize: false,
        // 在 debug 构建中不使用 minify
        minify: !process.env.TAURI_ENV_DEBUG ? 'esbuild' : false,
        // 在 debug 构建中生成 sourcemap
        sourcemap: !!process.env.TAURI_ENV_DEBUG,
    },
}));

