// import shopifyClear from '@by-association-only/vite-plugin-shopify-clean';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';
// import shopify from 'vite-plugin-shopify';
import shopifyClear from './vite-plugin/vite-plugin-shopify-clean/src';
import shopify from './vite-plugin/vite-plugin-shopify/src';
import importMaps from 'vite-plugin-shopify-import-maps';
import Inspect from 'vite-plugin-inspect';

// https://vitejs.dev/config/
export default defineConfig(() => ({
  plugins: [
    shopify(),
    importMaps({ bareModules: true, modulePreload: true, }),
    shopifyClear(),
    react(),
    UnoCSS(),
    // Inspect({
    //   build: true,
    //   outputDir: '.vite-inspect',
    // }),
  ],
  build: {
    emptyOutDir: false,
    // minify: false,
    minify: 'terser' as any,
    terserOptions: {
      mangle: false, // 禁用混淆，只进行压缩
      compress: {
        unused: false, // 禁用移除未使用代码
        defaults: false, // 禁用 terser 的默认压缩行为
      },
    },
    rollupOptions: {
      // 看情况是否需要开启
      treeshake: false,
    },
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

