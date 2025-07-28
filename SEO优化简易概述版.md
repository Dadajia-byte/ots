## SEO优化简易概述版

作为面试高频考点，往往只能模糊简略地回答 **SSR** 和 **语意化标签** 两种手段。

在此，笔者根据腾讯视频实际 SEO 优化手段做出系统性总结，以应付面试。

主要以两个角度进行回答，**网页** 与 **搜索引擎**。不难想到根据 SEO 的定义，核心的两要素就是网页和搜索引擎，因此下文，我们也将从以下两个角度分析。

### 一、网页内部 SEO 特性加强

1. 使用 **SSR**
2. 使用 **语意化HTML标签**
3. 使用 **结构化数据**
4. **网页间关联** 与 **权威性加强**
5. 优化页面加载速度
6. 移动友好性

### 二、搜索引擎联动

1. 使用 **sitemap**
2. 向搜索引擎 **主动提交**
3. **死链提交**
4. SEO效果查看（本点不属于优化手段，但是是基于搜索引擎做得优化反馈，暂时也放这里了）

### 三、要点解析

#### 3.1 SSR

**CSR**，首次加载仅加载一个近乎为空的 HTML 框架，后续内容节点渲染依赖于 JS 脚本的动态加载，对搜索引擎爬虫（Googlebot）极不友好。

**SSR**，在服务端执行渲染，返回浏览器时已经具备完整的 HTML 框架结构。

同时，上述现象还影响 **FCP** 与 **LCP** 等页面速度，此类指标也是直接影响 SEO 排名的重要因素。

#### 3.2 语意化 HTML 标签 和 结构化数据

一、使用语意化 HTML

1. 使用语意化的 HTML 标签（例如：`<header>`、`<nav>`、`<main>`、`<article>`、`<section>`、`footer`等）
2. 使用 `<h1>` 到 `<h6>` 标签来定义标题层次结构
3. 使用 **alt** 属性来为图片添加描述性文本

二、使用 Schema.org 标记来帮助搜素引擎理解页面内容

添加 **JSON-LD** 格式的结构化数据
如：
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "如何优化网页语义化",
  "datePublished": "2023-10-01T08:00:00+08:00",
  "author": {
    "@type": "Person",
    "name": "张三"
  }
}
</script>
```

#### 3.3 网页间的权威与关联性加强

`canonical` 和 `alternate(特别是 hreflang)`，是两种重要的 HTML标签用于解决网站中 **内容重复** 和 **多语言/多地区定位** 的问题。它们的主要目的都是通过向搜索引擎传递明确的信号，来 **集中页面权重（权威）**，并阐明**不同页面版本之间的关系（关联性）**，从而优化 SEO 表现。它们是加强网页间权威与关联性的核心工具。

1. **rel="canonical"** （权威性链接）
- 核心目的：​​ ​处理重复或相似内容，指定哪个 URL 是某一组相似页面中的权威版本或首选版本。
- 多个重复相似页面，头增加 `<link rel="canonical" href="https://example.com/preferred-page/" />`，指向主页面
- 尽量清除 **?路径参数** 保证 url 干净

2. **rel="alternate"** (通常与 hreflang 属性结合使用)
- ​核心目的：​​ ​处理多语言和/或多地区定位问题，帮助搜索引擎理解不同语言或地区版本的页面之间的关系。
- 例如：
- ```html
  <link rel="alternate" hreflang="en" href="https://example.com/page/" />
  <link rel="alternate" hreflang="en-gb" href="https://example.com/uk/page/" />
  <link rel="alternate" hreflang="fr-fr" href="https://example.com/fr/page/" />
  <link rel="alternate" hreflang="zh-cn" href="https://example.com/zh-cn/page/" />
  <link rel="alternate" hreflang="x-default" href="https://example.com/page/" />
  ```
#### 3.4 优化页面加载速度

1. 压缩和最小化 CSS、JS 和 HTML 文件
2. 使用浏览器缓存
3. 延迟加载非关键资源（如图片和视频）
4. 使用内容分发网络（CDN）

#### 3.5 sitemap

**Sitemap（网站地图)** 是一个文件，列出了网站上所有你希望搜索引擎索引的页面。它向搜索引擎提供了网站结构的清晰概览，帮助搜索引擎更高效地抓取和理解网站内容

主要有以下两种类型：
1. XML Sitemap（面向搜索引擎）
2. HTML Sitemap（面向用户）

|建议|原因|
|--|--|
|每个 sitemap 文件建议不超过 50,000 个 URL 或 50MB|超过建议拆分多个 sitemap 文件，使用 sitemap index 文件|
|sitemap 应托管在网站根目录或子目录下|例如: https://example.com/sitemap.xml|
|确保链接内容是有效的|不要提交死链或者 noindex 页面|
|向搜索引擎提交 sitemap| 可通过 Google Search Console、Bing Webmaster Tools 提交|

#### 3.6 向搜索引擎主动提交

**可以主动向搜素引擎推送 url 链接**

|搜索引擎平台|推送方式|数量限制|更新时间|对应官网介绍|
|--|--|--|--|--|
|Baidu|URL 推送|5w/天|0点|https://ziyuan.baidu.com/linksubmit/index|
|BING|URL推送|1w/天|UTC 0点|https://bing.com/webmasters/url-submission-api#APIs|
|BING|indexNow|无限制|--|https://www.bing.com/indexnow/getstarted|

**主动推送 sitemap**

#### 3.7 死链提交

**作用**

死链提交是网站向搜索引擎提交死链的数据推送方式，被推送死链将被百度搜索屏蔽。

网站存在大量死链，将影响网站的站点评级，建议存在大量死链内容的网站，使用工具清楚。

**操作**

1. 手动提交
2. 建立定期更新的死链文件 让搜索引擎定期来读

#### 3.8 SEO 效果查看

搜索引擎相对黑盒，收录和效果不一定保证。

1. 站点基于 refer 统计：页面大同上报有报当前页面的来源 refer，可以基于此来分析各个搜索引擎的来源分布和数量

2. sitemap 提升效果也可以从搜索引擎的角度查看

