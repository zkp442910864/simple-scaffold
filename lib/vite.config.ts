import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'node:path';
import { readFileSync } from 'node:fs';

const packageJson = JSON.parse(readFileSync(path.join(__dirname, './package.json'), 'utf-8')) as {peerDependencies: Record<string, string>};

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, }) => ({
  plugins: [
    react(),
  ],
  resolve: {
    alias: [
    ],
  },
  server: {
    host: true,
  },
  build: {
    outDir: '../build/lib',
    lib: {
      entry: path.join(__dirname, './src/main.tsx'),
      formats: ['es', 'umd',],
      name: 'lib',
    },
    rollupOptions: {
      external: Object.keys(packageJson.peerDependencies).map(ii => new RegExp(ii)),
      output: {
      },
    },
  },
}));
