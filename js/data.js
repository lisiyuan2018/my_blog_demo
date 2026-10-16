/* =========================================================
 * 数据层：模拟后端返回的数据
 * 后续接入真实后端时，只需将本文件替换为 fetch 请求，
 * main.js 中的渲染逻辑无需改动。
 * ========================================================= */

// 站点全局信息
const SITE = {
  name: "代码拾遗",       // 站点名称
  nameEn: "CODE NOTES",  // 封面角标英文
  author: "李思远",
  authorBio: "全栈开发者，热爱分享前端与工程化实践",
  avatar: "assets/avatar.svg",
};

// 分类配色（渐变起止色）：用于生成文章封面图
const CATEGORY_COLORS = {
  "前端开发": ["#3b82f6", "#1d4ed8"], // 蓝
  "JavaScript": ["#f59e0b", "#d97706"], // 琥珀
  "CSS": ["#ec4899", "#be185d"],     // 粉
  "工程化": ["#10b981", "#047857"],     // 绿
  "AI": ["#8b5cf6", "#6d28d9"],      // 紫
};

/* 文章列表（模拟接口返回的数据）
 * content 为 HTML 字符串，支持：h2/h3 标题、p 段落、
 * pre>code 代码块、ul/ol 列表、blockquote 引用、img 图片
 */
const ARTICLES = [
  {
    id: 6,
    title: "深入理解 CSS Flexbox：从概念到实战",
    category: "CSS",
    date: "2026-10-08",
    author: "李思远",
    content: `
<p>布局一直是 CSS 的重点和难点。从早期的 float 布局、position 定位，到今天的 Flexbox 与 Grid，CSS 的布局能力发生了质的飞跃。其中 Flexbox（弹性盒子布局）是目前使用频率最高的布局方案——绝大多数现代网页都离不开它。本文带你系统梳理 Flexbox 的核心概念与常用技巧。</p>

<h2>一、Flexbox 解决什么问题</h2>
<p>在 Flexbox 出现之前，实现「垂直居中」这样看似简单的需求，往往需要借助绝对定位加负边距等技巧，代码既难写也难维护。Flexbox 提供了一套在一维方向上<strong>分配空间、对齐元素</strong>的能力：一行（或一列）之内的元素如何排列、如何伸缩、如何对齐，都可以用几个声明式的属性描述清楚。</p>

<h2>二、主轴与交叉轴</h2>
<p>理解 Flexbox 的关键是理解两根看不见的轴：</p>
<ul>
  <li><strong>主轴（main axis）</strong>：由 <code>flex-direction</code> 决定，默认水平向右，也可以改为纵向；</li>
  <li><strong>交叉轴（cross axis）</strong>：与主轴垂直的方向。</li>
</ul>
<p>几乎所有对齐属性都围绕这两根轴展开：<code>justify-content</code> 控制主轴上的对齐，<code>align-items</code> 控制交叉轴上的对齐。先想清楚主轴方向，再选择对齐属性，思路就不会乱。</p>

<h2>三、常用属性速查</h2>
<pre><code>/* 容器属性 */
.flex-container {
  display: flex;
  flex-direction: row;      /* 主轴方向：row | column */
  justify-content: center;  /* 主轴对齐方式 */
  align-items: center;      /* 交叉轴对齐方式 */
  gap: 16px;                /* 子项之间的间距 */
  flex-wrap: wrap;          /* 一行放不下时是否换行 */
}

/* 子项属性 */
.flex-item {
  flex: 1;                  /* 伸展比例，均分剩余空间 */
  align-self: flex-end;     /* 单独覆盖交叉轴对齐 */
}</code></pre>

<h2>四、实战：三行代码实现完美居中</h2>
<pre><code>.center-box {
  display: flex;
  justify-content: center;   /* 水平居中 */
  align-items: center;       /* 垂直居中 */
}</code></pre>
<p>这段代码可以让任意子元素在容器中同时实现水平与垂直居中，而且不依赖子元素的宽高——这正是 Flexbox 最经典的用法。本博客首页的两栏布局，本质上也只是一句 <code>display: flex</code> 加上间距配置。</p>

<h2>五、一个容易踩的坑：flex: 1 与最小宽度</h2>
<p>当某个子项的内容很长（比如一个超长单词或 URL）时，子项可能撑破容器、溢出布局。原因是 flex 子项默认 <code>min-width: auto</code>，不允许收缩到内容宽度以下。解决办法是显式设置 <code>min-width: 0</code>：</p>
<pre><code>.flex-item {
  flex: 1;
  min-width: 0;      /* 允许收缩到内容宽度以下 */
  overflow: hidden;  /* 配合下面两行实现省略号 */
  text-overflow: ellipsis;
  white-space: nowrap;
}</code></pre>

<blockquote><p>一句话总结：先确定主轴方向，再选择对齐属性，最后处理子项的伸缩与最小宽度，绝大多数一维布局问题都能迎刃而解。</p></blockquote>`,
  },

  {
    id: 5,
    title: "搞懂 JavaScript 事件循环，只要一个例子",
    category: "JavaScript",
    date: "2026-09-25",
    author: "李思远",
    content: `
<p>「为什么 setTimeout(fn, 0) 不是立即执行？」——这是 JavaScript 面试中出场率最高的问题之一。要回答它，必须理解 JavaScript 的并发模型：事件循环（Event Loop）。</p>

<h2>一、JavaScript 为什么是单线程</h2>
<p>JavaScript 诞生于浏览器环境，最初的使命是操作 DOM、响应用户交互。如果允许多个线程同时操作 DOM，就需要处理复杂的锁与竞争问题。设计者索性让 JavaScript 成为单线程语言：同一时刻只执行一段代码，简单且够用。代价是——所有「耗时操作」都不能阻塞主线程，于是有了异步回调机制。</p>

<h2>二、调用栈与任务队列</h2>
<p>同步代码在调用栈中依次执行；异步操作（定时器、网络请求等）完成后，其回调会被放入任务队列排队。事件循环的职责就是：当调用栈清空后，从队列中取出任务放入栈中执行。队列又细分为两类：</p>
<ul>
  <li><strong>宏任务（macrotask）</strong>：setTimeout、setInterval、I/O、UI 渲染等；</li>
  <li><strong>微任务（microtask）</strong>：Promise.then、MutationObserver、queueMicrotask 等。</li>
</ul>

<h2>三、一道经典面试题</h2>
<pre><code>console.log("1");

setTimeout(() =&gt; console.log("2"), 0);

Promise.resolve().then(() =&gt; console.log("3"));

console.log("4");

// 请问输出顺序是什么？</code></pre>
<p>答案是 <code>1 → 4 → 3 → 2</code>。推理过程只有三步：</p>
<ol>
  <li>同步代码先执行，输出 <code>1</code> 和 <code>4</code>；</li>
  <li>调用栈清空后，<strong>先清空所有微任务队列</strong>，输出 <code>3</code>；</li>
  <li>最后才从宏任务队列取一个任务执行，输出 <code>2</code>。</li>
</ol>

<h2>四、事件循环的完整规则</h2>
<ol>
  <li>执行调用栈中的所有同步代码；</li>
  <li>调用栈清空后，依次执行<strong>全部</strong>微任务（包括执行过程中新产生的微任务）；</li>
  <li>取出<strong>一个</strong>宏任务执行；</li>
  <li>回到第 2 步，如此往复。</li>
</ol>
<p>注意微任务是「清空全部」而宏任务是「取一个」，这个不对称正是无数面试题的考点来源。</p>

<blockquote><p>记住一句话：同步代码执行完毕后，先清空所有微任务，再取一个宏任务，如此往复。</p></blockquote>`,
  },

  {
    id: 4,
    title: "不依赖框架：纯 HTML/CSS/JS 搭建个人博客复盘",
    category: "前端开发",
    date: "2026-09-12",
    author: "李思远",
    content: `
<p>你眼前这个博客，就是用最朴素的技术栈搭建的：HTML + CSS + 原生 JavaScript，没有框架、没有构建工具、没有 node_modules。这篇文章复盘整个搭建过程，也顺便回答一个常见问题：<strong>不用框架，到底行不行？</strong></p>

<h2>一、为什么选择纯前端方案</h2>
<p>对个人博客这类内容型站点来说，交互复杂度其实很低：列表展示、文章详情、分类筛选，仅此而已。引入框架的收益（组件化、状态管理）在十几个组件以下的规模里几乎体现不出来，反而带来了构建链路的复杂度。纯静态页面的好处很直接：加载快、可维护、随处可托管。</p>

<h2>二、项目结构</h2>
<p>标准的三层结构，职责清晰：</p>
<pre><code>blog/
├── index.html      # 首页（文章列表 + 侧边栏）
├── article.html    # 文章详情页（通过 ?id= 区分文章）
├── about.html      # 关于页
├── css/
│   └── style.css   # 全站唯一样式文件
├── js/
│   ├── data.js     # 数据层：模拟后端返回的文章数据
│   └── main.js     # 逻辑层：渲染与交互
└── assets/         # 头像、封面等静态资源</code></pre>

<h2>三、数据与渲染分离</h2>
<p>最关键的设计决策是把<strong>数据</strong>和<strong>渲染</strong>拆成两个文件。data.js 里只有一个普通的 JavaScript 数组，main.js 负责把它渲染成 DOM。将来接入真实后端时，只需要把 data.js 换成一次 fetch 请求，渲染逻辑一行都不用改——这其实就是最朴素的「前后端分离」。</p>
<pre><code>// data.js：模拟后端数据
const ARTICLES = [
  { id: 1, title: "...", category: "CSS", date: "2026-10-08" },
  // ...
];

// 将来接入后端，只需替换为：
// const ARTICLES = await fetch("/api/articles").then(r =&gt; r.json());</code></pre>

<h2>四、响应式适配：只需要一个断点</h2>
<p>桌面端用 Flexbox 实现左 70% 文章列表、右 30% 侧边栏的两栏布局；手机端（768px 以下）切换为单栏，侧边栏自然落到文章列表下方——只需把 <code>flex-direction</code> 改为 <code>column</code>，再加上几个字号、间距的微调。</p>

<blockquote><p>技术选型的原则：用能满足需求的<strong>最简单</strong>的工具。当朴素方案开始变得吃力时，再升级到框架也不迟。</p></blockquote>`,
  },

  {
    id: 3,
    title: "Git 团队协作指南：分支模型与提交规范",
    category: "工程化",
    date: "2026-08-30",
    author: "李思远",
    content: `
<p>代码会写错，但历史不会说谎。Git 不仅是版本管理工具，更是团队协作的「外交语言」——分支怎么开、提交怎么写，直接决定了代码评审的效率和回溯问题的速度。</p>

<h2>一、分支模型：简单就是美</h2>
<p>很多团队照搬复杂的分支模型，结果大部分精力花在「合并」上。对小团队来说，一条简化原则就够用：</p>
<ul>
  <li><code>main</code> 分支始终保持可发布状态，受保护、禁止直接推送；</li>
  <li>所有新工作都从 <code>main</code> 拉出特性分支，完成后通过 Pull Request 合入；</li>
  <li>分支存活周期以「天」为单位，越短越好——分歧越小，冲突越少。</li>
</ul>

<h2>二、提交信息规范</h2>
<p>统一使用 <code>type: 描述</code> 格式，一眼就能看懂每次提交的意图：</p>
<pre><code>feat: 新增文章分页功能
fix: 修复移动端侧边栏遮挡列表的问题
docs: 更新 README 部署说明
refactor: 抽离文章卡片渲染函数
style: 统一代码缩进为两空格</code></pre>

<h2>三、日常协作流程</h2>
<pre><code># 1. 从最新 main 拉出特性分支
git checkout main &amp;&amp; git pull
git checkout -b feat/article-pagination

# 2. 开发并提交（小步多次提交）
git add . &amp;&amp; git commit -m "feat: 新增分页组件"

# 3. 推送并发起 Pull Request，通过评审后合入 main
git push origin feat/article-pagination</code></pre>

<h2>四、救火手册：两个最常用的撤销操作</h2>
<pre><code># 提交错了想重来：撤销最近一次提交，但保留代码改动
git reset --soft HEAD~1

# 只想丢弃某个文件的工作区改动（危险：不可恢复）
git checkout -- src/main.js</code></pre>
<p>前者是「安全撤销」，几乎每天都会用到；后者请务必先确认改动真的不要了再执行。</p>

<blockquote><p>分支模型不需要「正确」，只需要「一致」。团队达成共识并坚持执行，比选择哪套模型重要得多。</p></blockquote>`,
  },

  {
    id: 2,
    title: "防抖与节流：前端性能优化的两把利刃",
    category: "JavaScript",
    date: "2026-08-15",
    author: "李思远",
    content: `
<p>滚动监听、搜索输入联想、窗口缩放重算布局……这类高频事件每秒可能触发几十上百次。如果每次触发都执行完整逻辑，页面很容易卡顿。防抖（debounce）和节流（throttle）就是解决这个问题的两个经典手段。</p>

<h2>一、防抖：只认最后一次</h2>
<p>防抖的语义是：<strong>事件停止触发 N 毫秒后，才真正执行</strong>。期间再次触发就重新计时。典型场景是搜索框——用户连续打字时不发请求，停顿后再请求，能省掉大量无效调用：</p>
<pre><code>function debounce(fn, delay = 300) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);                 // 每次触发都取消上一次的计时
    timer = setTimeout(() =&gt; {
      fn.apply(this, args);              // 停止触发 delay 毫秒后才执行
    }, delay);
  };
}

// 用法：停止输入 300ms 后才触发搜索
input.addEventListener("input", debounce(doSearch, 300));</code></pre>

<h2>二、节流：固定频率执行</h2>
<p>节流的语义是：<strong>不管事件触发多频繁，每 N 毫秒最多执行一次</strong>。适合滚动加载、滚动吸顶这类「希望匀速响应」的场景：</p>
<pre><code>function throttle(fn, interval = 200) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last &gt;= interval) {        // 距上次执行超过 interval 才放行
      last = now;
      fn.apply(this, args);
    }
  };
}

// 用法：滚动位置判断最多每 200ms 计算一次
window.addEventListener("scroll", throttle(updateNavbar, 200));</code></pre>

<h2>三、怎么选</h2>
<ul>
  <li>只关心「最终状态」→ 用<strong>防抖</strong>（搜索联想、表单校验、窗口缩放后重算）；</li>
  <li>过程中需要「匀速反馈」→ 用<strong>节流</strong>（滚动加载、按钮防连点、拖拽跟随）。</li>
</ul>

<h2>四、别忘了现代化替代方案</h2>
<p>如果场景只是「滚动触发渲染」，现代浏览器还提供了 <code>IntersectionObserver</code>（元素可见性监听），由浏览器自行调度回调，性能优于手动节流，值得优先考虑。</p>

<blockquote><p>防抖和节流本质都是在「事件触发频率」与「处理成本」之间找平衡：拖得越久越省资源，响应也就越迟钝，按业务需求拿捏即可。</p></blockquote>`,
  },

  {
    id: 1,
    title: "当 AI 成为结对程序员：我的大模型辅助编程工作流",
    category: "AI",
    date: "2026-07-28",
    author: "李思远",
    content: `
<p>过去一年，我的编程方式发生了比过去十年加起来还大的变化：AI 成了我的结对程序员。这篇聊聊我实际在用的工作流，以及哪些环节AI 帮了大忙、哪些环节必须自己把关。</p>

<h2>一、先想清楚，再让 AI 动手</h2>
<p>最常见的误区是把 AI 当「许愿机」：丢一句「帮我写个博客」，得到一堆看似完整、实则拼凑的代码，然后陷入无尽的修补。我的做法反过来——<strong>人负责拆解问题，AI 负责填充细节</strong>。动手前先写清楚：目标是什么、有哪些约束、怎么验收。</p>

<h2>二、提示词的写法</h2>
<p>一份好提示词的结构，和一份好需求文档没什么两样：</p>
<pre><code>目标：为博客首页实现文章分类筛选功能
约束：
- 不引入框架，用原生 JavaScript 实现
- 保持现有代码风格（中文注释、两空格缩进）
- 与现有 renderArticleList 函数复用同一套卡片模板
验收标准：
- 点击侧边栏分类，列表只显示该分类文章
- 提供清除筛选入口，恢复显示全部文章</code></pre>
<p>把「约束」和「验收标准」写进去，能挡掉绝大多数返工——AI 返工和你自己返工一样昂贵。</p>

<h2>三、AI 写的代码要不要 Review</h2>
<p>要，而且要更严格。AI 生成代码的特点是「表面光洁」：命名规范、结构工整，但容易在边界条件、安全性、性能这类暗礁上翻船。我的 Review 清单：</p>
<ul>
  <li>空值与异常路径：列表为空、请求失败时会不会崩；</li>
  <li>XSS：动态拼接进 innerHTML 的内容有没有来源不可信；</li>
  <li>资源释放：定时器、事件监听器有没有清理；</li>
  <li>是否有「看似有用实则没被调用」的死代码。</li>
</ul>

<h2>四、AI 时代工程师的护城河</h2>
<p>工具越强大，提出正确问题的能力就越值钱。写代码的成本在急剧下降，而<strong>判断代码该不该写、写得对不对</strong>的成本没有降。把时间投在架构判断、领域理解和质量把关上，把样板代码交给 AI——这是我认为可持续的分工。</p>

<blockquote><p>AI 负责产量，工程师负责判断。谁承担最终责任，谁就该拥有最终决定权。</p></blockquote>`,
  },
];
