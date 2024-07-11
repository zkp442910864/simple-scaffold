

const {generateApi} = require('swagger-typescript-api');
const path = require('path');

generateApi({
    url: 'http://10.10.158.140:9201/v2/api-docs',
    output: path.resolve(process.cwd(), './src/services'),
    // 生成api
    generateClient: true,
    // 分模块生成
    modular: true,
    // 按 tag 分
    nameFirstTag: true,
    // 使用axios
    httpClientType: 'axios',
    // 自定义模板
    templates: path.resolve(process.cwd(), './api-templates/custom'),
    // 清除目录，生成
    cleanOutput: true,
});
