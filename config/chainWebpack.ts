import Config from 'webpack-chain';
import fs from 'fs';

// https://github.com/neutrinojs/webpack-chain
const fn = (memo: Config, args: any) => {

    // memo.entry('').add
    // memo.module.rule
    // memo.plugin().use

    // memo.resolve.alias.set('foo', '/tmp/to/foo');

    // memo.externals({
    //     react: 'React',
    //     reactDom: 'ReactDOM',
    //     'react-dom/client': 'ReactDOM',
    //     antd: 'antd',
    // });

    // 查看分析内部依赖情况
    // memo.optimization.providedExports(false);

    // fs.writeFileSync('./fd.txt', memo.toString(), {
    //     encoding: 'utf-8',
    // });

};

export default fn;
