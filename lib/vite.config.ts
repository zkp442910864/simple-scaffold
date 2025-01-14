import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import vitePluginTypedoc from './config/vite-plugin-typedoc';

const packageJson = JSON.parse(readFileSync(path.join(__dirname, './package.json'), 'utf-8')) as {peerDependencies: Record<string, string>};

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, }) => ({
  plugins: [
    react(),
    vitePluginTypedoc(),
  ],
  resolve: {
    alias: [
    ],
  },
  server: {
    host: true,
  },
  build: {
    outDir: 'build',
    emptyOutDir: true,
    lib: {
      entry: path.join(__dirname, './src/index.ts'),
      formats: ['es', 'umd',],
      name: 'lib',
      fileName: 'index',
    },
    rollupOptions: {
      external: Object.keys(packageJson.peerDependencies).map(ii => new RegExp(`^${ii}`)),
      // external: Object.keys(packageJson.peerDependencies).map(ii => new RegExp(`node_modules.*${ii}`)),
      // external: [/node_modules/, ],
      // external: (source, importer, isResolved) => {
      //   console.log(source);
      // },
      output: {
        // globals: packageJson.peerDependencies,
      },
    },
  },
}));
