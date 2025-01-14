import enquirer from 'enquirer';
import fs from 'node:fs';
import path from 'node:path';
import { cwd } from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const globalMap: TMap = {
  component: {
    url: path.join(__dirname, '../src/component'),
    handleName(name: string) {
      return name.replace(/\w/, (val) => val.toLocaleUpperCase());
    },
  },
  function: {
    url: path.join(__dirname, '../src/utils'),
    handleName(name: string) {
      return name.replace(/\w/, (val) => val.toLocaleLowerCase());
    },
  },
  hooks: {
    url: path.join(__dirname, '../src/utils/hooks'),
    handleName(name: string) {
      if (!name.startsWith('use')) {
        throw new Error('hooks 需要use 开头');
      }
      return name;
    },
  },
};


void startCommand(globalMap);


/** ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */


async function startCommand(map: TMap) {
  const { configItem, result, } = await getBaseResult(map);
  if (result.type === 'component') {
    generateComponentTemplate({ configItem, result, });
  }
  else if (result.type === 'function') {
    generateFunctionTemplate({ configItem, result, });
  }
  else if (result.type === 'hooks') {
    generateHooksTemplate({ configItem, result, });
  }
}

/** 获取用户结果 */
async function getBaseResult(map: TMap) {

  const resultType = await enquirer.prompt<IData>([
    {
      type: 'select',
      name: 'type',
      message: '选择要生成的模板',
      choices: [
        'component',
        'function',
        'hooks',
      ],
    },
  ]);

  const resultName = await enquirer.prompt<IData>([
    {
      type: 'input',
      name: 'name',
      message: '模板名称',
    },
  ]);

  const mergeResult: IData = {
    ...resultType,
    ...resultName,
  };

  const configItem = map[mergeResult.type];
  mergeResult.name = configItem.handleName(mergeResult.name);

  return { configItem, result: mergeResult, };
};

/** 生成 hooks 模板 */
function generateHooksTemplate({ configItem, result, }: Awaited<ReturnType<typeof getBaseResult>>) {
  const baseUrl = configItem.url;
  const templateName = result.name;

  const urls = [
    {
      url: path.join(baseUrl, templateName),
      type: 'folder',
    },
    {
      url: path.join(baseUrl, templateName, 'index.ts'),
      type: 'file',
      content: `

        export const ${templateName} = () => {};

      `,
    },
    {
      url: path.join(baseUrl, templateName, 'index.type.ts'),
      type: 'file',
      content: '',
    },
    {
      url: path.join(baseUrl, templateName, 'stories'),
      type: 'folder',
    },
    {
      url: path.join(baseUrl, templateName, 'stories', 'README.md'),
      type: 'file',
      content: '',
    },
    {
      url: path.join(baseUrl, templateName, 'stories', `${templateName}.mdx`),
      type: 'file',
      content: `

        import { Meta, Controls, Markdown, Story, Canvas } from '@storybook/blocks';
        import * as all from './${templateName}.stories';
        import Readme from './README.md?raw';

        <Meta of={all} />

        # Default

        <Canvas of={all.Default} sourceState="shown" source={all.Default.source} />

        <Markdown>{Readme}</Markdown>

      `,
    },
    {
      url: path.join(baseUrl, templateName, 'stories', `${templateName}.stories.tsx`),
      type: 'file',
      content: `
        import { Meta, StoryObj } from '@storybook/react';
        import { ${templateName} } from '..';
        import { useState } from 'react';

        // 具体情况,看想要什么参数进行可以受控,然后再下面args中进行配置
        const Template = (props: Parameters<typeof ${templateName}>[0]) => {

          return (
            <div>
              ...
            </div>
          );
        };

        const meta: Meta = {
          title: 'Utils/Hooks/${templateName}',
          component: Template,
          // More on argTypes: https://storybook.js.org/docs/api/argtypes
          argTypes: {},
          parameters: {
            // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
            layout: 'centered',
          },
          // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
          // tags: ['autodocs',],
          // Use \`fn\` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
          args: {
            interval: 500,
            immediate: false,
          },
        };

        type Story = StoryObj<typeof meta>;

        export const Default = Template.bind({});
        (Default as unknown as {source: {transform: (code: string) => string}}).source = {
          transform: (() => {
            let cacheCode = '';
            return (code: string) => {
              if (!cacheCode) cacheCode = code;
              return cacheCode;
            };
          })(),
        };

        export default meta;
      `,
    },
  ];

  urls.forEach(({ type, url, content, }) => {
    if (fs.existsSync(url)) return;

    if (type === 'folder') {
      fs.mkdirSync(url);
    }
    else {
      const newContent = (content || '').trim().split('\n').map(ii => ii.replace(/\s{8}/, '')).join('\n');
      fs.writeFileSync(url, newContent, { encoding: 'utf-8', });
    }
  });
  fs.appendFileSync(path.join(baseUrl, 'index.ts'), `\nexport * from './${templateName}';`);
}

/** 生成 component 模板 */
function generateComponentTemplate({ configItem, result, }: Awaited<ReturnType<typeof getBaseResult>>) {}

/** 生成 function 模板 */
function generateFunctionTemplate({ configItem, result, }: Awaited<ReturnType<typeof getBaseResult>>) {}


/** ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */


type TType = 'component' | 'function' | 'hooks';
type TMap = Record<TType, IMapData>;

interface IData {
  type: TType;
  name: string;
}

interface IMapData {
  url: string;
  handleName: (raw: string) => string;
}
