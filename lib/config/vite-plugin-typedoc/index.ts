import { exec, execSync } from 'node:child_process';
import { existsSync, fsync, glob, globSync } from 'node:fs';
import path from 'node:path';
import { Plugin } from 'vite';

const watchCache: Record<string, boolean> = {};
const generateMarkDown = (pathStr: string, isWatch = false) => {
  if (!pathStr.match(/index(.tsx|.ts)$/)) return;
  const dirPath = path.dirname(pathStr);
  const storiesPath = path.join(dirPath, 'stories');

  if (!existsSync(storiesPath)) return;
  if (isWatch && watchCache[pathStr]) return;

  watchCache[pathStr] = true;
  const command = [
    'typedoc',
    `--entryPoints "${pathStr}"`,
    '--outputFileStrategy modules',
    `--out "${storiesPath}"`,
    '--cleanOutputDir false',
    '--readme none',
    '--hidePageTitle true',
    '--hidePageHeader true',
    '--disableSources true',
    '--plugin typedoc-plugin-markdown',
    isWatch ? '--watch' : '',
  ];

  exec(command.join(' '), (error, stdout, stderr) => {
    if (error) {
      watchCache[pathStr] = false;
      console.error('vite-plugin-typedoc: ', error, stdout, stderr);
    }
  });
};

const firstGenerateAllMarkDown = (isWatch = false) => {
  const pathStr = path.join(__dirname, '../../', 'src/**/index.{ts,tsx}');
  const paths = globSync(pathStr);

  paths.forEach((str) => generateMarkDown(str, isWatch));
};

export { firstGenerateAllMarkDown };
export default function () {
  let isDev = true;

  const plugin: Plugin = {
    name: 'vite-plugin-typedoc',
    config(config, env) {
      isDev = env.command === 'serve';
    },
    configureServer(server) {
      server.watcher.on('add', (str) => generateMarkDown(str, true));
      server.watcher.on('addDir', (str) => generateMarkDown(str, true));
      server.watcher.on('change', (str) => generateMarkDown(str, true));
    },
    buildStart: () => {
      if (isDev) {
        firstGenerateAllMarkDown(true);
      }
    },
    // renderStart: () => {
    //   console.log(2);
    // },
  };

  return plugin;
};
