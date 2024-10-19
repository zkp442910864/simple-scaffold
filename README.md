# React + react-router + zustand + TypeScript + Vite

### 任务列表

- [demo](https://zkp442910864.github.io/simple-scaffold/vite-react/#/)

- [x] 状态管理
    - [资料](https://awesomedevin.github.io/zustand-vue/docs/introduce/start/zustand)
- [x] 移动端适配设置
    - [资料](https://blog.csdn.net/weixin_57677300/article/details/129164050)
    - <img src="md/QQ截图20241015103017.png" height="200" alt="window.devicePixelRatio" style="vertical-align:top;" />
- [ ] 网络封装(<https://github.com/zkp442910864/common-utils.git>)
- [ ] 提取成类库(<https://github.com/zkp442910864/common-utils.git>)
- [x] unocss
    - [资料](https://unocss.dev/integrations/vite)
- [x] gzip，分析依赖
    - [分析依赖-资料](https://www.mulingyuer.com/archives/1033/)
    - [gzip-资料1](https://github.com/nonzzz/vite-plugin-compression)
    - [gzip-资料2](https://github.com/KusStar/vite-bundle-visualizer)
- [ ] 前端监控 sourceMap提取
    - 监控
        - [x] 错误监控(js错误, 资源异常)
        - [ ] 错误监控(接口错误, 白屏)
        - [ ] 性能监控
        - [ ] 用户行为监控
    - [x] 抽取sourceMap文件
    - dist, sourceMap 上传服务器
    - [x] 选择错误信息对应的 sourceMap 定位错误
        - source-map 库，因为严格模型下，判断浏览器环境的代码有问题，所以用 [pnpm patch <pkg>](https://pnpm.io/zh/cli/patch) 解决
        - [source-map](https://www.npmjs.com/package/source-map)
        - [shiki 高亮](https://shiki.tmrs.site/)
    - 考虑怎么实现成sdk
    - [资料](https://juejin.cn/post/7270028440036294711#heading-31)
- [x] 页面更新，刷新(<https://github.com/zkp442910864/common-utils.git>)
- [x] react 组件错误边界处理
