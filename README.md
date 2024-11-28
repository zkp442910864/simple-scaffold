# vite-shopify

### 引用资源(shopify)

- [shopify-vite](https://shopify-vite.barrelny.com/)
- [vite-plugin-shopify-clean](https://github.com/dan-gamble/vite-plugin-shopify-clean)
- [vite-plugin-shopify](https://www.npmjs.com/package/vite-plugin-shopify)

### 专业词

- PV: 是浏览量
- UV: 独立访客数
- 外链: 外链是指从其他网站指向你的网站的链接，也被称为反向链接、入站链接或链接到网站的链接。
- 内链: 网站内部的路由跳转, 多个入口链接到同一页面, 可以提高页面排名
- 白帽SEO: 遵守主流搜索引擎（如谷歌和百度）规定的优化方针
- 黑帽SEO: 想方设法地钻空子

### SEO

#### 网站开发

- 网站`TDK`三大标签
  - `title`
  - `description`
  - `keyword`
- 具名标签(语义化)(`header`, `search`, `nav`, `main`, `footer`...)
- `js` `css` 优化(压缩,预加载,`script`异步属性)
- `白帽SEO` `黑帽SEO` `外链` `内链`

#### 网站内容

- 以搜索量多的关键词作为选题
- 永远关注内容本身质量
- 提升内容与关键词的匹配度
- 内容更新

### 数据分析工具

- `流量统计`和`分析软件`一般分为两种
  - 页面上插入统计代码`Google Analytics`
  - 对原始日志文件进行分析(根据资源访问情况进行分析)

- 数据分析方向(网站权重，网站自然流量，网站外链)
  - 网站权重
    - 关键词排名：通过`SEMrush` `Ahrefs` `Ubersuggest` `Keyword Tool`等工具来跟踪网站关键词在搜索引擎中的排名情况，以了解SEO策略的效果。
      - `SEOquake`插件
      - <https://zhuanlan.zhihu.com/p/425975594>
  - 网站自然流量
    - 自然流量趋势：使用工具如`Google Search Console`来监控网站的自然流量变化，以评估SEO效果的有效性。
    - 自然流量转化：利用`Google Analytics`等工具来分析自然流量转化为实际业务成果的情况，如询盘、订单等。
  - 网站外链
    - 外链质与量：分析网站的外部链接情况，包括数量和质量，以评估网站的权威性和信任度。

  - 网站收录页面数量
  - 网站内容
  - 网站健康度：通过`Ahrefs`等工具进行网站健康度检查，以评估网站的整体性能和用户体验。
  - 网站结构规范：检查网站的重要页面（如首页、分类页、产品页面等）是否符合SEO最佳实践，以提高网站的整体SEO表现。
  - 跳出率和平均访问时长：通过`Google Analytics`来监控用户在网站上的行为，如跳出率和平均访问时长，以评估用户对网站内容的兴趣和参与度。
  - <https://www.zhihu.com/question/595690755/answer/3609195089>

### AMP HTML

- 好像不流行了
- <https://medium.com/@cramforce/why-amp-is-fast-7d2ff1f48597#.9v8f7c3i0>
- <https://amp.dev/zh_cn/documentation/guides-and-tutorials/start/create/basic_markup>
- 以 `<!doctype html>` doctype 开头。
- 包含顶级 `<html amp>` 标记
- 包含 `<head>` 和 `<body>` 标记。
- 包含 `<meta charset="utf-8">` 标记，作为其 <head> 标记的第一个子级。
- 包含 `async` 属性的脚本,尽早的在`<head>`中执行
- 需要提高被发现收录的页面,增加 `<head>`标签, 通过设置 `rel="canonical"` `href="地址"`,来标记页面
- 设置 `<meta name="viewport" content="width=device-width,initial-scale=1">`

### 尝试任务

- [ ] 谷歌，必应，Facebook 推广，分析
- [ ] 节假日主题页面
- [ ] seo优化（平台引入外部链接 优惠购物或引入平台链接）
- [ ] ~~做成单页面的加载效果，通过iframe实现~~
  - 实现有问题,嵌入`iframe` `src`加载不允许,直接操作`dom`写入,会有不执行的情况,需要处理很多东西.
- [ ] 页面载入速度分析
- [ ] 学习数据分析
