import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'test-dumi',
  },
  plugins: ['./config/dumi-plugins-auto-api-parse'],
});
