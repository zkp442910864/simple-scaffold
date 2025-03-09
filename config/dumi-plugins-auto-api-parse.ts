// dumi-ts-api-plugin.ts
import chokidar from 'chokidar';
import { IApi } from 'dumi';
import fs from 'fs';
import path from 'path';
import { whaleParse } from 'whale-component-docgen';

// const componentDocs = whaleParse(componentFile, {})!

/**
 * 解析数据 ../data.json
 * - 提取主API Props (parent.name 包含 displayName 的作为主api)
 * - 以数据中的 parent 为类别,对类型进行收集
 *  - 判断 parent.name 类别在 type.raw 出现次数,判断是否为 继承类型
 * - object 类型可以认为是一个类别,需要判断下面是否存在 parent
 * - union 为联合联类型,需要过滤数据中,时候包含 value 字段,有的话,认为是一个类别
 * - 最后注意去重
 *
 * - TODO: 交叉类型时候,有重复会有覆盖情况
 * - TODO: 函数类型解析不出来
 */
const parse = (entryUrl: string, outputUrl: string) => {
  const componentDocs = whaleParse(entryUrl, {});
  if (!componentDocs || !componentDocs.length) {
    console.error(`转换失败: ${entryUrl}`);
    return;
  }

  type TPropItem = Exclude<typeof componentDocs, null>[number]['props'][string];

  const each = (
    data: TPropItem[],
    dataStore: Record<
      string,
      { count: number; data: TPropItem[]; title: string }
    > = {},
  ) => {
    data.forEach((item) => {
      const key = item.parent?.name;

      if (item.type.name === 'object') {
        each(
          Object.values(item.type.value).filter((ii) => !!ii.parent),
          dataStore,
        );
      } else if (item.type.name === 'union') {
        const arr = item.type.value.filter(
          (ii) => !!(ii as { value: Record<string, TPropItem> }).value,
        );
        const newArr = arr
          .map((ii) =>
            Object.values((ii as { value: Record<string, TPropItem> }).value),
          )
          .flat();
        each(
          newArr.filter((ii) => !!ii.parent),
          dataStore,
        );
        // each(Object.values(item.type.value).filter(ii => !!ii.parent));
      }

      // 大类收集
      if (key) {
        dataStore[key] = dataStore[key] || { count: 0, data: [], title: key };
        dataStore[key].data.push(item);
      }
    });

    // 使用次数统计
    // const keyMap = Object.fromEntries(Object.keys(dataStore).map(k => [k, 1]));
    data.forEach((item) => {
      // const key = item.parent?.name;
      const rawKeys = item.type.raw.split(/\||&/);
      rawKeys.forEach((rawKey) => {
        const key = rawKey.trim();
        if (key && dataStore[key]) {
          dataStore[key].count++;
        }
      });
    });

    // 去重
    Object.values(dataStore).forEach((item) => {
      item.data = Object.values(
        Object.fromEntries(item.data.map((ii) => [ii.name, ii])),
      );
    });

    return dataStore;
  };

  componentDocs.forEach((item) => {
    const storeData = each(Object.values(item.props));
    const baseColumns = [
      {
        title: '字段',
        render: (item: TPropItem) =>
          `${item.required ? '<font color="red">*</font>' : ''}<code>${
            item.name
          }</code>`,
      },
      {
        title: '类型',
        render: (item: TPropItem) =>
          item.type.raw
            .split(/\||&/)
            .map((ii) => `<code>${ii.trim()}</code>`)
            .join(''),
      },
      {
        title: '默认值',
        render: (item: TPropItem) => item.defaultValue?.value,
      },
      {
        title: '说明',
        render: (item: TPropItem) =>
          item.description
            .split('\n')
            .filter((ii) => ii.indexOf('@version') === -1)
            .join('<br/>'),
      },
      {
        title: '版本',
        render: (item: TPropItem) =>
          item.description
            .split('\n')
            .find((ii) => ii.indexOf('@version') > -1)
            ?.replace('@version', '')
            .trim(),
      },
    ];

    const getTableStr = (
      title: string,
      columns = baseColumns,
      data: TPropItem[],
    ) => {
      const row: string[] = [];

      const titleArr: Array<string> = [];
      const lineArr: Array<string> = [];

      columns.forEach((config) => {
        titleArr.push(config.title);
        lineArr.push(' --- ');
      });

      row.push(`| ${titleArr.join(' | ')} |\n`);
      row.push(`| ${lineArr.join(' | ')} |\n`);

      data.forEach((field) => {
        const arr: Array<string> = [];
        columns.forEach((config) => {
          arr.push(config.render(field) || '-');
        });

        row.push(`| ${arr.join(' | ')} |\n`);
      });

      return `## ${title}\n\n ${row.join('')}\n`;
    };

    const mainTable = getTableStr(
      'Api Props',
      baseColumns,
      Object.values(item.props),
    );
    const otherTable = Object.values(storeData)
      .filter((ii) => ii.count > 0)
      .map((ii) => getTableStr(ii.title, baseColumns, Object.values(ii.data)))
      .join('');

    fs.writeFile(outputUrl, mainTable + otherTable, (err) => {
      if (err) {
        console.error('生成文件失败:', err);
      }
    });
  });
};

export default (api: IApi) => {
  // console.log('注册');

  api
    .applyPlugins({
      key: 'dumi-plugins-auto-api-parse',
      type: api.ApplyPluginsType.modify,
    })
    .then(() => {
      api.onBeforeCompiler(() => {
        const baseUrl = path.posix.join(process.cwd(), './src');
        // console.log('启动 监听', baseUrl);
        const watcher = chokidar.watch(baseUrl, {
          persistent: true,
          ignored: (file, _stats) => {
            // debugger
            if (!_stats?.isFile()) return false;
            if (file.includes('node_modules')) return true;

            return !file.endsWith('.types.ts');
          },
        });

        watcher.on('change', (filePath: string) => {
          const dirPath = path.dirname(filePath);
          const entry1 = path.join(dirPath, 'index.ts');
          const entry2 = path.join(dirPath, 'index.tsx');
          const output = path.join(dirPath, 'API.md');
          const entry = fs.existsSync(entry1) ? entry1 : entry2;

          if (fs.existsSync(entry)) {
            parse(entry, output);
          } else {
            console.error(`${dirPath} 缺少 index.ts|index.tsx 入口文件`);
          }
        });
      });
    });

  // api.describe({
  //   key: 'dumi-plugins-auto-api-parse',
  //   config: {
  //     schema(joi) {
  //       return joi.string();
  //     },
  //   },
  //   enableBy: api.EnableBy.config
  // });
  // api.modifyConfig((memo)=>{
  //   memo.favicons = api.userConfig.changeFavicon;
  //   return memo;
  // });
};
