/* =========================================================
 * 渲染与交互逻辑
 * 依赖：data.js（提供 SITE / ARTICLES / CATEGORY_COLORS）
 * ========================================================= */

/* ---------------- 工具函数 ---------------- */

/**
 * 获取文章列表（按发布日期倒序，最新在前）
 * 模拟后端的默认排序行为
 */
function getArticles() {
  return [...ARTICLES].sort((a, b) => new Date(b.date) - new Date(a.date));
}

/** 按 id 查找文章 */
function getArticleById(id) {
  return ARTICLES.find((a) => a.id === id);
}

/**
 * 从正文 HTML 中提取纯文本摘要（默认前 150 字）
 * 去除标签、压缩空白字符后截断
 */
function extractSummary(content, len = 150) {
  const text = content
    .replace(/<[^>]+>/g, "")   // 去掉 HTML 标签
    .replace(/\s+/g, " ")      // 压缩空白字符
    .trim();
  return text.length > len ? text.slice(0, len) + "……" : text;
}

/** 日期格式化：2026-10-08 → 2026 年 10 月 8 日 */
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
}

/**
 * 生成文章封面图（SVG data URI，按分类配色）
 * 纯前端方案：无需图片资源文件，每个分类有专属渐变色
 */
function coverDataUri(article) {
  const [from, to] = CATEGORY_COLORS[article.category] || ["#3b82f6", "#1d4ed8"];
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">` +
    `<defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">` +
    `<stop offset="0%" stop-color="${from}"/><stop offset="100%" stop-color="${to}"/>` +
    `</linearGradient></defs>` +
    `<rect width="800" height="450" fill="url(#g)"/>` +
    `<circle cx="690" cy="60" r="190" fill="#ffffff" opacity="0.10"/>` +
    `<circle cx="110" cy="430" r="150" fill="#ffffff" opacity="0.08"/>` +
    `<text x="60" y="90" font-family="Arial, sans-serif" font-size="28" letter-spacing="6" fill="#ffffff" opacity="0.8">${SITE.nameEn}</text>` +
    `<rect x="60" y="330" width="56" height="6" rx="3" fill="#ffffff" opacity="0.9"/>` +
    `<text x="60" y="392" font-family="'Microsoft YaHei', sans-serif" font-size="52" font-weight="700" fill="#ffffff">${article.category}</text>` +
    `</svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

/* ---------------- 吸顶导航滚动状态 ---------------- */

/**
 * 页面滚动后给导航栏加投影（.scrolled），
 * 让「固定在顶部」的层次感更明显；回到顶部时移除
 */
function initHeaderShadow() {
  const header = document.querySelector(".site-header");
  const update = () => header.classList.toggle("scrolled", window.scrollY > 10);
  window.addEventListener("scroll", update, { passive: true });
  update(); // 初始化时校正一次（如刷新后停留在页面中部）
}

/* ---------------- 返回顶部按钮 ---------------- */

/**
 * 右下角返回顶部按钮：
 * - 页面滚动超过一屏（视口高度）时淡入显示，回到顶部区域时淡出隐藏
 * - 点击后平滑滚动回顶部
 */
function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return; // 页面未放置按钮时安全跳过

  // 滚动距离超过一屏才显示
  const update = () =>
    btn.classList.toggle("visible", window.scrollY > window.innerHeight);
  window.addEventListener("scroll", update, { passive: true });
  update(); // 初始化时校正一次（如刷新后停留在页面中部）

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------------- 导航高亮 ---------------- */

/** 根据当前页面（body data-page）设置导航链接高亮 */
function initNav() {
  const page = document.body.dataset.page; // home | article | about
  // 文章详情页归属于「文章」导航项
  let key = page === "article" ? "articles" : page;
  // 首页锚点 #articles 时高亮「文章」
  if (page === "home" && location.hash === "#articles") key = "articles";

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("active", link.dataset.nav === key);
  });
}

/* ---------------- 首页：文章列表 ---------------- */

// 当前选中的分类（"全部" 表示不过滤）
let currentCategory = "全部";

/** 渲染文章卡片列表（可按分类过滤） */
function renderArticleList() {
  const box = document.getElementById("article-cards");
  const articles = getArticles().filter(
    (a) => currentCategory === "全部" || a.category === currentCategory
  );

  box.innerHTML =
    articles
      .map(
        (a) => `
    <a class="article-card" href="article.html?id=${a.id}">
      <div class="card-cover">
        <img src="${coverDataUri(a)}" alt="《${a.title}》的封面图" loading="lazy">
      </div>
      <div class="card-body">
        <h2 class="card-title">${a.title}</h2>
        <p class="card-summary">${extractSummary(a.content)}</p>
        <div class="card-meta">
          <span class="meta-date">📅 ${formatDate(a.date)}</span>
          <span class="tag">${a.category}</span>
        </div>
      </div>
    </a>`
      )
      .join("") || `<p class="empty-tip">该分类下暂无文章</p>`;
}

/** 渲染分类筛选提示条（选中分类时显示，附清除按钮） */
function renderFilterBar() {
  const bar = document.getElementById("filter-bar");
  if (currentCategory === "全部") {
    bar.innerHTML = "";
    return;
  }
  bar.innerHTML = `
    <div class="filter-bar">
      <span>当前分类：<strong>${currentCategory}</strong></span>
      <button class="filter-clear" type="button">✕ 清除筛选</button>
    </div>`;
}

/** 切换分类：重渲染列表、提示条，并更新分类列表高亮 */
function setCategory(name) {
  currentCategory = name;
  renderArticleList();
  renderFilterBar();
  renderCategoryList();
}

/* ---------------- 首页：侧边栏 ---------------- */

/** 个人信息卡片（数据来自 SITE，头像、姓名、一句话介绍） */
function renderProfileCard() {
  document.getElementById("widget-profile").innerHTML = `
    <div class="profile-card">
      <img class="avatar" src="${SITE.avatar}" alt="${SITE.author} 的头像">
      <h3 class="profile-name">${SITE.author}</h3>
      <p class="profile-bio">${SITE.authorBio}</p>
      <a class="profile-link" href="about.html">了解更多 →</a>
    </div>`;
}

/** 文章分类列表（带数量统计与分类色点，点击可筛选列表） */
function renderCategoryList() {
  // 统计各分类文章数
  const counts = {};
  getArticles().forEach((a) => {
    counts[a.category] = (counts[a.category] || 0) + 1;
  });

  // “全部”置顶（主题蓝）；各分类色点取自其文章封面渐变的起始色
  const items = [
    { name: "全部", count: ARTICLES.length, color: "#3b82f6" },
    ...Object.keys(counts).map((name) => ({
      name,
      count: counts[name],
      color: (CATEGORY_COLORS[name] || ["#6b7280"])[0],
    })),
  ];

  document.getElementById("category-list").innerHTML = items
    .map(
      (it) => `
      <li>
        <button class="category-item${it.name === currentCategory ? " active" : ""}"
                type="button" data-category="${it.name}">
          <span class="cat-left">
            <span class="cat-dot" style="background:${it.color}"></span>
            <span class="cat-name">${it.name}</span>
          </span>
          <span class="cat-count">${it.count}</span>
        </button>
      </li>`
    )
    .join("");
}

/** 最新文章列表（最近 5 篇） */
function renderRecentList() {
  const recent = getArticles().slice(0, 5);
  document.getElementById("recent-list").innerHTML = recent
    .map(
      (a) => `
      <li>
        <a class="recent-item" href="article.html?id=${a.id}">
          <span class="recent-title">${a.title}</span>
          <span class="recent-date">${formatDate(a.date)}</span>
        </a>
      </li>`
    )
    .join("");
}

/* ---------------- 文章详情页 ---------------- */

/** 渲染文章详情：标题、作者、日期、分类、封面与正文 */
function renderArticleDetail() {
  const wrap = document.getElementById("article-detail");

  // 从 URL 读取文章 id（article.html?id=3）
  const id = Number(new URLSearchParams(location.search).get("id"));
  const article = getArticleById(id);

  // 文章不存在时的兜底提示
  if (!article) {
    wrap.innerHTML = `
      <div class="empty-tip">
        文章不存在或已被删除。<br>
        <a href="index.html">← 返回首页</a>
      </div>`;
    return;
  }

  // 更新浏览器标签页标题
  document.title = `${article.title} - ${SITE.name}`;

  wrap.innerHTML = `
    <header class="article-header">
      <h1 class="article-title">${article.title}</h1>
      <div class="article-meta">
        <span class="meta-author">
          <img class="avatar-mini" src="${SITE.avatar}" alt="">
          <span>${article.author}</span>
        </span>
        <span class="meta-sep">·</span>
        <span>发布于 ${formatDate(article.date)}</span>
        <span class="tag">${article.category}</span>
      </div>
    </header>
    <div class="article-cover">
      <img src="${coverDataUri(article)}" alt="《${article.title}》的封面图">
    </div>
    <div class="article-content">${article.content}</div>`;

  renderPager(article);
}

/**
 * 上一篇 / 下一篇导航
 * 约定（与主流博客一致）：
 *   上一篇 = 发布时间更早的文章；下一篇 = 发布时间更新的文章
 */
function renderPager(article) {
  const list = getArticles();          // 按日期倒序，最新在前
  const idx = list.findIndex((a) => a.id === article.id);
  const older = list[idx + 1] || null; // 更早的一篇
  const newer = list[idx - 1] || null; // 更新的一篇

  const cell = (target, cls, label) =>
    target
      ? `<a class="pager-link ${cls}" href="article.html?id=${target.id}">
           <span class="pager-label">${label}</span>
           <span class="pager-title">${target.title}</span>
         </a>`
      : `<span class="pager-link ${cls} is-empty">
           <span class="pager-label">${label}</span>
           <span class="pager-title">没有了</span>
         </span>`;

  document.getElementById("article-pager").innerHTML =
    cell(older, "prev", "← 上一篇") + cell(newer, "next", "下一篇 →");
}

/* ---------------- 入口 ---------------- */

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initHeaderShadow();
  initBackToTop();
  // 首页锚点跳转（#articles）时同步导航高亮
  window.addEventListener("hashchange", initNav);

  const page = document.body.dataset.page;

  if (page === "home") {
    // 渲染侧边栏与文章列表
    renderProfileCard();
    renderCategoryList();
    renderRecentList();
    renderArticleList();

    // 事件委托：点击分类 → 筛选；点击清除 → 恢复全部
    document.getElementById("category-list").addEventListener("click", (e) => {
      const item = e.target.closest(".category-item");
      if (item) setCategory(item.dataset.category);
    });
    document.getElementById("filter-bar").addEventListener("click", (e) => {
      if (e.target.closest(".filter-clear")) setCategory("全部");
    });
  } else if (page === "article") {
    renderArticleDetail();
  }
  // about 页为静态内容，无需渲染
});
