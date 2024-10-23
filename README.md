# React + react-router + zustand + TypeScript + Vite

### 任务列表

- [demo](https://zkp442910864.github.io/simple-scaffold/vite-react/#/)

- [x] [状态管理zustand](https://awesomedevin.github.io/zustand-vue/docs/introduce/start/zustand)
- [x] 移动端适配设置
    - [资料](https://blog.csdn.net/weixin_57677300/article/details/129164050)
    - <img src="md/QQ截图20241015103017.png" height="200" alt="window.devicePixelRatio" style="vertical-align:top;" />
- [ ] 网络封装(<https://github.com/zkp442910864/common-utils.git>)
- [x] [unocss](https://unocss.dev/integrations/vite)
- [x] gzip，分析依赖
    - [vite-bundle-analyzer(分析依赖)](https://www.mulingyuer.com/archives/1033/)
    - [vite-bundle-visualizer(分析依赖)](https://github.com/KusStar/vite-bundle-visualizer)
    - [vite-plugin-compression2(gzip)](https://github.com/nonzzz/vite-plugin-compression)
- [ ] 前端监控 sourceMap提取
    - 监控
        - [x] 错误监控(js错误, 资源异常, 接口)
        - [x] 性能监控
        - [ ] 用户行为监控
    - [x] 抽取sourceMap文件
    - ~~dist, sourceMap 上传服务器~~ 根据项目实际情况处理
    - [x] 选择错误信息对应的 sourceMap 定位错误
        - [source-map](https://www.npmjs.com/package/source-map)
            - source-map 库，因为严格模型下，判断浏览器环境的代码有问题，所以用 [pnpm patch <pkg>](https://pnpm.io/zh/cli/patch) 解决
        - [shiki 高亮](https://shiki.tmrs.site/)
    - 资料
        - [资料](https://juejin.cn/post/7270028440036294711#heading-31)
        - [参考资料](https://cdc.tencent.com/2018/09/13/frontend-exception-monitor-research/)
        - 第三方监控库 Fundebug, Sentry
    - 可扩展
        - web worker(记录错误，确认崩溃)
        - [页面快照(错误溯源)](https://juejin.cn/post/6844904019605848072)
        - [路由监控](https://mp.weixin.qq.com/s/eLPWGqR6hOYVrwfa3OEVMA)
- [x] 页面更新，刷新(<https://github.com/zkp442910864/common-utils.git>)
- [x] react 组件错误边界处理
- [x] keep-alive

- 其它资料
    - [接入why-did-you-render](https://github.com/welldone-software/why-did-you-render)
    - [页面内存查看](https://github.com/localvoid/perf-monitor)
    - 内存泄露问题
        - [前端🦠内存泄漏🦠四部曲](https://juejin.cn/post/7377247135006457890?searchId=202410220915165C4F540402B5D4DBD90F)
        - [解决内存问题](https://developer.chrome.com/docs/devtools/memory-problems?hl=zh-cn#visualize_memory_leaks_with_timeline_recordings)
        - [使用 Chrome Devtools 分析内存问题](https://fe.okki.com/post/62cbfea7136f570343d89416)
