# GitHub Pages 部署指南

本项目为纯静态站点（全相对路径引用），推送到 GitHub 后开启 Pages 即可，**无需任何构建步骤**。

## 前置条件

- [x] 本地已初始化 git 仓库并完成首次提交（仓库根目录有 `.git`）
- [ ] 一个 GitHub 账号
- 项目已包含部署所需配置：`.nojekyll`（禁用 Jekyll）、`.gitignore`、`.gitattributes`

---

## 第一步：在 GitHub 上创建仓库

1. 打开 [github.com/new](https://github.com/new)
2. Repository name 填写仓库名，**两种选择**：

   | 方案 | 仓库名 | 最终访问地址 | 说明 |
   |---|---|---|---|
   | A（推荐） | `blog` 或 `blog-demo` 等任意名 | `https://<用户名>.github.io/blog/` | 项目站点，子路径部署 |
   | B | `<用户名>.github.io` | `https://<用户名>.github.io/` | 用户主页站点，根路径部署 |

   > 本项目所有资源引用均为相对路径，**两种方案都完全兼容**。

3. 可见性选 **Public**（免费账号的 Pages 仅支持公开仓库；Pro 账号可选 Private）
4. **不要**勾选 "Add a README file"（本地已有），点击 **Create repository**

## 第二步：推送本地代码

在项目根目录（`blog_demo/`）执行，把 `<用户名>` 和 `<仓库名>` 换成你自己的：

```bash
git remote add origin https://github.com/<用户名>/<仓库名>.git
git push -u origin main
```

> 如果推送时提示认证，按引导登录即可（GitHub 已不支持密码推送，会引导使用浏览器令牌授权）。

## 第三步：开启 GitHub Pages

1. 打开仓库页面 → **Settings** → 左侧 **Pages**
2. **Build and deployment** 区域：
   - Source 选择 **Deploy from a branch**
   - Branch 选择 **main**，目录选择 **/(root)**
   - 点击 **Save**
3. 等待 1～2 分钟。页面顶部出现绿色提示
   `Your site is live at https://<用户名>.github.io/<仓库名>/`
   即部署成功（也可在仓库 **Actions** 标签页查看 `pages-build-deployment` 的进度）。

## 第四步：验证

浏览器访问 `https://<用户名>.github.io/<仓库名>/`，逐项检查：

- [ ] 首页文章卡片、侧边栏、样式正常加载
- [ ] 点击文章卡片进入详情页，上一篇 / 下一篇可跳转
- [ ] 侧边栏分类筛选、返回顶部按钮工作正常
- [ ] 手机访问（或浏览器开发者工具切换设备模拟）布局为单栏

---

## 日常更新流程

改完代码后，三条命令即可自动重新部署（约 1 分钟后生效）：

```bash
git add -A
git commit -m "说明这次改了什么"
git push
```

## 常见问题

**Q：为什么仓库里有 `.nojekyll` 空文件？**
GitHub Pages 默认用 Jekyll 处理仓库，会忽略下划线开头的文件和目录，且可能对文件做意外转换。纯静态站点放一个空 `.nojekyll` 可以完全禁用 Jekyll，保证所有文件原样发布。**请勿删除。**

**Q：访问 404？**
依次检查：Settings → Pages 里分支是否选了 `main` + `/(root)`；Actions 里部署是否已完成（黄色转圈进行中→绿色对勾完成）；推送是否成功（`git log origin/main` 与本地一致）。

**Q：页面打开是白的 / 样式全丢了？**
通常是有人把相对路径改成了 `/css/style.css` 这类以 `/` 开头的**绝对路径**——子路径部署（方案 A）下会指向 `https://<用户名>.github.io/css/style.css` 导致 404。保持项目原有的相对路径写法即可。

**Q：想绑定自己的域名（如 `blog.example.com`）？**
1. 在仓库根目录新建名为 `CNAME` 的文件（无扩展名），内容写你的域名，如 `blog.example.com`，并提交推送
2. 到域名服务商处添加 DNS 记录：CNAME 指向 `<用户名>.github.io`
3. Settings → Pages → Custom domain 填入域名并保存，建议勾选 **Enforce HTTPS**

**Q：改了代码但线上没更新？**
浏览器缓存的可能性最大，先 `Ctrl + F5` 强刷；仍无变化再看 Actions 部署状态与提交记录。
