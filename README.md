# 代码拾遗 · 个人技术博客

一个**不依赖任何框架**的纯静态个人技术博客，使用 HTML + CSS + 原生 JavaScript 构建。
数据与渲染分离：文章内容存于 JavaScript 数组（模拟后端），后续可无缝切换为真实 API。

## 功能特性

- **首页**：两列卡片式文章列表（悬停微上浮）、侧边栏（个人信息 / 分类筛选 / 最新文章）
- **文章详情页**：标题、作者、发布日期、分类标签；正文支持标题、段落、代码块、图片、引用；底部上一篇 / 下一篇导航
- **关于页**：自我介绍、技能标签、联系方式
- **交互细节**：吸顶导航栏（滚动投影 + 当前页下划线高亮）、返回顶部按钮（滚动超一屏显示，点击平滑回顶）
- **响应式适配**：桌面端两栏布局（左 70% 文章 + 右 30% 侧边栏），移动端（≤768px）自动切换单栏
- **零依赖**：无框架、无构建工具、无 node_modules，克隆即用

## 目录结构

```
blog_demo/
├── index.html          # 首页（文章列表 + 侧边栏）
├── article.html        # 文章详情页（通过 ?id= 区分文章）
├── about.html          # 关于我页面
├── css/
│   └── style.css       # 全站唯一样式文件（含响应式）
├── js/
│   ├── data.js         # 数据层：站点信息 + 文章数据（模拟后端）
│   └── main.js         # 逻辑层：渲染与交互
├── assets/
│   └── avatar.svg      # 头像
├── .nojekyll           # 禁用 GitHub Pages 的 Jekyll 处理
├── .gitignore
└── .gitattributes
```

## 本地运行

方式一：直接用浏览器打开 `index.html`（纯静态，双击即可）

方式二：启动本地服务器（推荐，地址栏更干净）：

```bash
python -m http.server 8000
# 浏览器访问 http://localhost:8000
```

## 内容维护

| 需求 | 改哪里 |
|---|---|
| 新增 / 修改 / 删除文章 | `js/data.js` 的 `ARTICLES` 数组，按现有条目格式增改即可 |
| 修改站点名、作者、头像、简介 | `js/data.js` 的 `SITE` 对象 |
| 新增文章分类 | 在文章的 `category` 字段使用新名称，并在 `CATEGORY_COLORS` 中补充配色 |
| 调整样式 / 主题色 | `css/style.css` 顶部的 `:root` CSS 变量 |

文章正文（`content` 字段）为 HTML 字符串，支持：`h2` / `h3` 标题、`p` 段落、`pre>code` 代码块、`ul` / `ol` 列表、`blockquote` 引用、`img` 图片。注意代码块中的 `<` `>` `&` 需转义为 `&lt;` `&gt;` `&amp;`。

## 部署

纯静态站点，可托管在任意静态托管服务（GitHub Pages / Vercel / Netlify / Cloudflare Pages）。

**GitHub Pages 部署步骤见 [DEPLOY.md](DEPLOY.md)。**
