# 今天吃什么？🍜

> 一个有趣、好看、手机端优先的「今天吃什么」生成器。随机抽一个，或者转个盘，把今天的吃饭决定交给命运。

纯前端应用，无需后端与数据库，所有记录只保存在你自己的浏览器里，并支持添加到 iPhone 主屏当 App 用。

**在线地址（Vercel 生产环境）**：https://chishenme-two.vercel.app

- 项目：`ashby3/chishenme`（Vercel 团队 `ashby3`），生产部署状态 `● Ready`
- 重新部署：在项目根目录执行 `npx vercel deploy --prod --yes`（同一项目会复用该域名并覆盖线上内容）
- ⚠️ **该地址在中国内地无法访问**，原因见下方「中国内地访问」章节

**在线地址（中国内地可用）**：https://4d06f6539e1e4b3aa3b025dae85c48cb.sg2.agentos-app.run

- 托管在**腾讯云新加坡节点**（`43.160.144.32`，AS132203 Tencent Cloud），内地直连实测 **6/6 稳定、约 0.43–0.49 秒**，功能验收 **10/10 通过**
- 由内置发布能力生成，可在「设置—数据管理—我发布的应用」中管理
- ⚠️ **长期可用性不保证**：这是面向预览与分享的托管环境，不是带 SLA 的商业 CDN 产品，也不支持自定义域名、缓存策略与监控告警。**把它当临时分享地址用；要长期对外运营，请按下表迁移到正式托管**

### 迁移到正式托管（已备好产物）

`today-eat-what-static.zip` 是纯静态产物包（10 个文件、约 140 KB），**解压后直接上传到任意静态托管的根目录即可**，无需构建、无需 Node 环境：

```text
index.html  sw.js  manifest.webmanifest  favicon.svg
assets/index-*.js  assets/index-*.css  icons/*.png（4 个）
```

因为项目是纯前端、无后端、数据全在浏览器 `localStorage`，迁移只是「换个地方放文件」，**不需要改任何代码**。

> 提示：`chishenme.vercel.app` 已被其他 Vercel 用户占用，因此实际域名自动带上了后缀，为 `chishenme-two.vercel.app`。

---

## 中国内地访问

### 实测结论

**Vercel 在中国内地被网络层封锁，这不是配置问题，Vercel 侧任何设置都改不了。**

在本机（内地网络）用「不走代理的直连」实测：

| 检测项 | 结果 |
| --- | --- |
| `*.vercel.app` 的 DNS 解析 | 被污染——返回 `31.13.96.195`、`185.45.6.103` 等 **Facebook/Meta 的 IP 段**（IPv6 里 `face:b00c` 是 Meta 的标志），而非 Vercel 真实 IP |
| 直连 Vercel 官方 IP `76.76.21.21` | **0.14 秒立即失败**（IP 层被阻断，典型 RST） |
| 直连 `https://chishenme-two.vercel.app/` | `net::ERR_CONNECTION_TIMED_OUT`（15 秒超时） |
| 对照：直连 `https://www.qq.com/` | 0.19 秒连通 |
| 对照：直连内置发布网址 | 0.43 秒，6/6 成功 |

也就是说：**域名被污染 + IP 被阻断**同时存在。所以给 Vercel 绑自有域名也救不了——底层 IP 一样连不上。

### 可选方案

| 方案 | 内地可访问 | 长期稳定性 | 需要备案 | 说明 |
| --- | --- | --- | --- | --- |
| **内置发布网址（当前已用）** | ✅ 实测 0.43s | ⚠️ **不承诺长期** | ❌ 不需要 | 腾讯云新加坡节点；适合临时分享，不适合长期对外运营 |
| **EdgeOne Pages（腾讯云）** | ✅ | ✅ 正式产品 | ❌ 默认域名不需要 | 国内 CDN，有免费额度；绑自有域名则需备案 |
| **国内云对象存储 + CDN** | ✅ 最快 | ✅ 最稳 | ✅ **必须 ICP 备案** | 腾讯云 COS / 阿里云 OSS + CDN，最正规，备案周期约 1–20 个工作日 |
| **香港 / 新加坡轻量服务器** | ⚠️ 一般 | ✅ | ❌ 不需要 | 免备案，但跨境链路会波动；约 ¥24–40/月 |
| **Cloudflare Pages** | ⚠️ 不稳定 | ✅ | ❌ 不需要 | 免费版在内地（尤其电信）时通时不通；中国大陆节点仅企业版 |
| **Vercel** | ❌ 不可用 | ✅ | — | 保留作为海外入口即可 |

### 推荐做法：双线部署

项目是**纯静态产物**（无后端、数据全在浏览器 localStorage），所以两边共用同一份 `dist/`，**零代码改动**：

- **海外**：Vercel（`chishenme-two.vercel.app`）
- **内地**：内置发布网址 / EdgeOne Pages / 已备案的国内 CDN

如果后续要绑自己的域名给内地用户用，**ICP 备案是硬门槛**——在中国内地提供网站服务必须备案，这一步无法绕过。

## 目录

- [核心玩法](#核心玩法)
- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [目录结构](#目录结构)
- [本地运行](#本地运行)
- [生产构建与本地预览](#生产构建与本地预览)
- [部署到公网（4 种方案）](#部署到公网4-种方案)
- [添加到 iPhone 主屏（PWA）](#添加到-iphone-主屏pwa)
- [数据存储说明](#数据存储说明)
- [扩充食物数据库](#扩充食物数据库)
- [已知限制](#已知限制)

---

## 核心玩法

两种方式，都能在两秒内结束「吃什么」这场内耗：

| 玩法 | 入口 | 说明 |
| --- | --- | --- |
| 🎲 随机吃什么 | `#/random` | 先选好预算 / 口味 / 类型 / 场景，点「帮我决定」，按加权随机抽一个结果 |
| 🎡 吃什么转盘 | `#/wheel` | 生成 8–10 个候选扇区，点中间按钮旋转，停在哪格就吃哪个 |

首页（`#/`）会显示当前时段问候语、随机副标题、累计决定顿数，以及上一次决定吃了什么。

---

## 功能特性

### 条件筛选

- **预算**：不限 / 20 元以内 / 20–40 元 / 40 元以上
- **口味**：清淡 / 微辣 / 辣 / 重口 / 随机
- **类型**：米饭 / 面食 / 粉面 / 火锅 / 小吃 / 快餐 / 西餐 / 随机
- **场景**：食堂 / 外卖 / 出去吃 / 随机

预算档位使用「价格区间求交集」判断（`matchBudget`），只要食物价格区间与档位区间有重叠就算命中，避免一刀切。页面会实时提示当前条件匹配到多少种食物。

### 加权随机（不是纯随机）

推荐核心在 `src/lib/picker.js`，基础权重为 100，然后按以下规则调整：

| 条件 | 权重系数 |
| --- | --- |
| 今天已经吃过 | × 0.06 |
| 昨天吃过 | × 0.18 |
| 前天吃过 | × 0.4 |
| 3–6 天内吃过 | × 0.75 |
| 超过 14 天没吃 | × 1.15 |
| 本次会话点过「这个不要」 | × 0.1 |
| 已收藏 | × 1.25 |

结果是「刚吃过的很难再抽到、很久没吃的更容易被抽到、喜欢的稍微更容易被抽到」，比纯随机更符合直觉。

### 转盘

- 候选扇区数量为 8–10 个，由 `buildWheelPool` 生成；筛选结果不足 8 个时，会按「同口味 / 同类型 / 同场景」相似度自动补齐
- 扇区顺序经过 Fisher–Yates 洗牌，避免高权重食物总在同一位置
- 落点同样按权重决定，再叠加少量随机抖动，看起来自然
- 旋转 5 圈、约 4.8 秒，带过渡结束兜底（系统开启「减弱动效」时也能正常出结果）
- 转盘页为沉浸模式，会隐藏底部导航；支持「🔄 换一批」重新抽取候选

### 最近吃过

- 每次点「✅ 就吃这个」自动记录一条（食物、emoji、类型、口味、时间戳）
- 按「今天 / 昨天 / 前天 / 具体日期」分组展示，单条可删除，支持一键清空（需二次确认）
- 历史记录最多保留最近 **60** 条（`MAX_HISTORY`）
- 吃过之后会自动把该食物从「本次不喜欢」中移除，避免长期被压制

### 收藏

- 结果卡片、历史记录、收藏页三处都能收藏 / 取消收藏
- 收藏页支持「🎲 从收藏里随机一个」，同样走加权随机
- 收藏项使用去重后的 id 列表存储

### 「这个不要」

抽到不想吃的，点「🙅 这个不要」即可在本会话内大幅降低它的出现概率（权重 × 0.1），并立刻换一个。该状态存在 `sessionStorage`，关闭标签页即自动失效。

### 本地持久化

所有状态变更都会自动写入浏览器存储（`useEffect` 同步），刷新、关闭浏览器后数据不丢失；读写都做了异常兜底，隐私模式下不会导致应用崩溃。

### PWA / 离线可用

- `public/manifest.webmanifest` 提供完整 Web App Manifest（`display: standalone`、竖屏、主题色 `#FF6B35`）
- `public/sw.js` 为 Service Worker：静态资源「缓存优先 + 后台更新」，导航请求离线时回退到 `/index.html`
- Service Worker **仅在正式构建产物中注册**（`import.meta.env.PROD`），开发环境不会缓存模块，避免调试时出现「改了代码没生效」

---

## 技术栈

| 分类 | 选型 | 版本 |
| --- | --- | --- |
| 框架 | React | `^18.3.1` |
| 渲染 | React DOM | `^18.3.1` |
| 路由 | react-router-dom（`HashRouter`） | `^6.28.0` |
| 动效 | framer-motion | `^11.11.17` |
| 构建 | Vite | `^5.4.11` |
| Vite React 插件 | @vitejs/plugin-react | `^4.3.4` |
| 语言 | JavaScript（JSX，ESM，无 TypeScript） | — |
| 样式 | 手写 CSS（3 个样式文件，无 UI 框架） | — |
| 状态管理 | React Context + Hooks（`src/state/AppState.jsx`） | — |
| 持久化 | localStorage / sessionStorage | — |

**没有使用任何 UI 组件库、CSS 框架或状态管理库**，样式与组件全部手写。

### 路由表

应用使用 `HashRouter`，URL 形如 `https://example.com/#/random`。

| 路径 | 页面 | 说明 |
| --- | --- | --- |
| `/` | `HomePage` | 首页：问候语、两种玩法入口、统计、快捷入口 |
| `/random` | `RandomPage` | 随机吃什么 |
| `/wheel` | `WheelPage` | 吃什么转盘（沉浸模式，隐藏底部导航） |
| `/history` | `HistoryPage` | 最近吃过 |
| `/favorites` | `FavoritesPage` | 我的收藏 |
| `*` | `HomePage` | 未匹配路径回退到首页 |

---

## 目录结构

```text
today-eat-what/
├── index.html                     # HTML 入口（含 iOS PWA meta、manifest、apple-touch-icon）
├── package.json
├── package-lock.json              # 锁定依赖版本，供 CI/Vercel 做确定性安装
├── vite.config.js                 # 开发/预览 host 与端口、构建输出目录、allowedHosts
├── vercel.json                    # Vercel 构建与缓存配置（锁定 framework/build/output）
├── .vercelignore                  # 上传 Vercel 时忽略 node_modules、dist 等
├── .gitignore
├── README.md
├── public/                        # 静态资源，构建时原样拷贝到 dist/
│   ├── favicon.svg
│   ├── manifest.webmanifest       # PWA 清单
│   ├── sw.js                      # Service Worker（离线缓存）
│   └── icons/
│       ├── apple-touch-icon.png   # 180×180，iOS 添加到主屏图标
│       ├── icon-192.png
│       ├── icon-512.png
│       └── icon-maskable-512.png  # Android 自适应图标（留安全区）
├── scripts/
│   ├── check-data.cjs             # 食物数据与推荐算法自检（16 项断言）
│   ├── generate-icons.cjs         # 纯 Node 生成上述 PNG 图标（无第三方依赖）
│   └── serve.cjs                  # 生产启动入口：按需构建 + 以 0.0.0.0:$PORT 提供服务
└── src/
    ├── main.jsx                   # 挂载 React、引入样式、注册 Service Worker
    ├── App.jsx                    # HashRouter + 路由表 + 页面切换动画
    ├── components/
    │   ├── BottomNav.jsx          # 底部导航（5 个 Tab）
    │   ├── FilterPanel.jsx        # 条件筛选面板（预算/口味/类型/场景）
    │   ├── FoodResultCard.jsx     # 推荐结果大卡片
    │   ├── OptionGroup.jsx        # 通用单选选项组
    │   ├── ResultSheet.jsx        # 转盘结果的底部弹出面板
    │   ├── Toast.jsx              # 全局轻提示
    │   ├── TopBar.jsx             # 子页面顶部栏（返回 + 标题）
    │   └── Wheel.jsx              # SVG 幸运转盘
    ├── data/
    │   └── foods.js               # 食物数据库 + 预算档位 + 短名称表 + 工具函数
    ├── hooks/
    │   └── useDecider.js          # 「帮我决定」的翻牌动画 + 加权抽取流程
    ├── lib/
    │   ├── content.js             # 文案（副标题/结果语录）、筛选选项、时段问候语
    │   ├── filters.js             # 筛选默认值与转换工具
    │   ├── picker.js              # 筛选、权重计算、加权抽样、历史分组
    │   └── storage.js             # localStorage / sessionStorage 封装
    ├── pages/
    │   ├── FavoritesPage.jsx
    │   ├── HistoryPage.jsx
    │   ├── HomePage.jsx
    │   ├── RandomPage.jsx
    │   └── WheelPage.jsx
    ├── state/
    │   └── AppState.jsx           # 全局状态 Context（历史/收藏/不喜欢/统计/Toast）
    └── styles/
        ├── components.css         # 组件样式
        ├── pages.css              # 页面布局样式
        └── theme.css              # 颜色变量与基础排版
```

---

## 本地运行

**环境要求**：Node.js 18 及以上（推荐 20+），npm 9+。

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev
```

启动后访问：**http://127.0.0.1:5173**

开发服务器已固定绑定 `127.0.0.1:5173`（见 `vite.config.js`），且不会自动打开浏览器。

### 可用脚本

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 启动开发服务器（`127.0.0.1:5173`，HMR 热更新） |
| `npm run build` | 生产构建，输出到 `dist/` |
| `npm start` | **生产启动**：产物缺失时先构建，再以 `0.0.0.0:$PORT` 启动（供云托管/单端口环境使用，本地默认 4173） |
| `npm run preview` | 预览构建产物（`127.0.0.1:4173`） |
| `npm run serve` | 预览构建产物并监听所有网卡（`0.0.0.0:4173`），便于用手机访问同一局域网地址测试 |
| `npm run icons` | 重新生成 `public/icons/` 下的 PWA 图标 |
| `npm run check:data` | 运行食物数据与推荐算法自检（16 项断言，失败时退出码为 1） |

> 提示：开发模式下不会注册 Service Worker（只有正式构建才注册），所以本地 `npm run dev` 看不到离线缓存效果，需要构建后用 `npm run preview` 验证。

### 部署到单端口环境（云托管 / 沙箱）

`scripts/serve.cjs` 是为此准备的启动入口，它会：① 产物不存在时先执行 `vite build`；② 以 `0.0.0.0:$PORT` 启动 `vite preview`（`$PORT` 由平台注入，缺省 4173）。

配套要求已写进 `vite.config.js`：`preview.allowedHosts: true`。因为平台通过反向代理访问该端口，不放开 Host 校验时 Vite 会直接返回 `Blocked request. This host is not allowed.`。这类环境下的启动命令用 `npm start` 即可。

---

## 生产构建与本地预览

```bash
# 1. 生产构建
npm run build
```

构建产物输出到 `dist/`，包含：

```text
dist/
├── index.html
├── assets/
│   ├── index-*.js      # 打包后的 JS
│   └── index-*.css     # 打包后的 CSS
├── favicon.svg
├── manifest.webmanifest
├── sw.js
└── icons/
```

```bash
# 2. 本地预览构建产物
npm run preview
```

访问：**http://127.0.0.1:4173**

如果想用手机在同一 Wi-Fi 下测试（含「添加到主屏」效果），改用：

```bash
npm run serve
# 然后在手机浏览器打开 http://<你的电脑局域网 IP>:4173
```

### 重新生成 PWA 图标

图标由纯 Node 脚本生成（暖色渐变底 + 白色碗与热气图案，3×3 超采样抗锯齿），无需任何图形软件或第三方依赖：

```bash
npm run icons
```

会覆盖输出以下文件到 `public/icons/`：

| 文件 | 尺寸 | 用途 |
| --- | --- | --- |
| `icon-192.png` | 192×192 | 清单基础图标 |
| `icon-512.png` | 512×512 | 清单大图标 |
| `icon-maskable-512.png` | 512×512 | `purpose: maskable`，Android 自适应图标 |
| `apple-touch-icon.png` | 180×180 | iOS 添加到主屏图标（满幅、无圆角，由系统裁切） |

等价的手工命令为 `node scripts/generate-icons.cjs`。

---

## 部署到公网（4 种方案）

构建命令统一为 `npm run build`，发布目录统一为 `dist/`。

### 关于路由：不需要 history fallback 重写规则

本项目使用 **`HashRouter`**，所有路由信息都在 URL 的 `#` 片段里（例如 `https://your-site.com/#/wheel`）。浏览器请求服务端时**永远只请求 `/`**，因此：

- ✅ **不需要**配置 SPA 重写 / history fallback（如 Netlify 的 `_redirects`、Vercel 的 `rewrites`、Nginx 的 `try_files`）
- ✅ 刷新任意子页面、直接分享 `#/history` 链接都不会 404
- ✅ 纯静态托管即可，无需 Node 运行时

### 方案一：Vercel

> **本项目已为 Vercel 预先配置好**，无需在网页端手动调整构建参数：
>
> - `vercel.json` 显式锁定 `framework: vite`、`buildCommand: npm run build`、`outputDirectory: dist`、`installCommand: npm install`，避免自动识别被 `package.json` 里的 `start` 脚本干扰；同时为 `/sw.js` 设置了 `must-revalidate`（保证 PWA 能及时更新）、为 `/assets/*` 设置了长缓存。
> - `.vercelignore` 已排除 `node_modules`、`dist`、`.workbuddy-ai`、Vite 时间戳临时文件与部署包本身。
> - `package.json` 增加了 `deploy` 脚本（等价于 `npx vercel --prod`）与 `engines.node >= 18`。
> - 使用 HashRouter，**不需要**配置 `rewrites` / history fallback，刷新子路由不会 404。

**方式 A：命令行（最快）**

```bash
npm install -g vercel     # 或直接使用 npx，无需全局安装
vercel                    # 首次会引导登录并创建项目，按提示回车即可
vercel --prod             # 部署到生产环境，输出公网网址
```

使用 `npx` 的等价写法：

```bash
npx vercel
npx vercel --prod
```

Vercel 会自动识别 Vite 项目：构建命令 `npm run build`、输出目录 `dist`，无需额外配置。

**方式 B：网页导入 Git 仓库**

1. 把项目推送到 GitHub / GitLab / Bitbucket
2. 打开 [vercel.com/new](https://vercel.com/new)，用 Git 账号登录
3. 选择该仓库 → Import
4. 确认配置：**Framework Preset = Vite**、Build Command = `npm run build`、Output Directory = `dist`
5. 点击 **Deploy**，等待构建完成后即得到 `https://<项目名>.vercel.app`

### 方案二：Netlify

**方式 A：命令行**

```bash
# 首次需要登录授权
npx netlify login

# 首次部署：创建站点（交互式选择，Build command 填 npm run build，Publish directory 填 dist）
npx netlify deploy

# 确认预览没问题后，部署到正式环境
npx netlify deploy --prod --dir=dist
```

> 若提示找不到命令，可使用完整的包名：`npx netlify-cli deploy --prod --dir=dist`。
> 部署完成后终端会输出 `Website URL`，即为公网地址。

**方式 B：网页拖拽（最省事）**

1. 本地执行 `npm run build`
2. 打开 [app.netlify.com/drop](https://app.netlify.com/drop)
3. 把整个 `dist` 文件夹拖进页面
4. 稍等几秒即可获得公网网址，可在站点设置里重命名或绑定自定义域名

**方式 C：Git 持续部署**

在 Netlify 新建站点 → 关联 Git 仓库 → 设置 Build command 为 `npm run build`、Publish directory 为 `dist`，之后每次 push 自动重新部署。

### 方案三：Cloudflare Pages

**方式 A：命令行（Wrangler）**

```bash
# 首次使用需登录（会打开浏览器授权）
npx wrangler login

# 构建产物后直接部署 dist 目录
npx wrangler pages deploy dist

# 也可以指定项目名，避免交互式输入
npx wrangler pages deploy dist --project-name=today-eat-what
```

部署完成后终端会输出 `https://<项目名>.pages.dev` 形式的公网地址。

**方式 B：Git 集成**

1. 推送代码到 GitHub / GitLab
2. 进入 Cloudflare 控制台 → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. 选择仓库，设置：
   - Framework preset：`Vite`
   - Build command：`npm run build`
   - Build output directory：`dist`
4. 保存并部署

### 方案四：GitHub Pages

**前置条件**：先把项目推送到 GitHub 仓库，仓库名记为 `<REPO>`。

**关键注意事项：`base` 必须配置**

GitHub Pages 的**项目站点**地址形如 `https://<用户名>.github.io/<REPO>/`，应用并不在域名根目录下。本项目 `vite.config.js` 未设置 `base`，默认值为 `'/'`，直接部署到项目站点会导致 JS/CSS/图标全部 404。

因此需要在 `vite.config.js` 中加上（这一步由你手动修改，本 README 不代改代码）：

```js
export default defineConfig({
  base: '/<REPO>/',        // 例如 '/today-eat-what/'
  plugins: [react()],
  // ...其余配置保持不变
})
```

同时，以下**绝对路径**也需要同步改成带子路径前缀（或改为相对路径），否则图标与清单会加载失败：

| 位置 | 需要调整的项 |
| --- | --- |
| `index.html` | `/favicon.svg`、`/manifest.webmanifest`、`/icons/apple-touch-icon.png` |
| `public/manifest.webmanifest` | `start_url`、`scope` 以及 `icons[].src` |
| `public/sw.js` | `PRECACHE` 数组中的 `'/'`、`'/index.html'`、`'/manifest.webmanifest'`、`'/favicon.svg'` |

> 如果部署到**用户站点**（仓库名为 `<用户名>.github.io`）或绑定了自定义域名（应用位于域名根目录），则 `base` 保持默认 `'/'` 即可，上面的路径也无需改动。

**方式 A：gh-pages 分支（推荐，一条命令搞定）**

```bash
# 1. 安装 gh-pages 并配置 base 后，先构建
npm run build

# 2. 把 dist 目录发布到 gh-pages 分支
npx gh-pages -d dist
```

执行完成后，在 GitHub 仓库 → **Settings** → **Pages** 中把 Source 设为 `Deploy from a branch`，分支选择 `gh-pages`、目录选择 `/ (root)`，保存后等待一两分钟即可访问 `https://<用户名>.github.io/<REPO>/`。

也可以把它固化成一个脚本（在 `package.json` 的 `scripts` 中自行添加，本 README 不代改）：

```json
"deploy": "npm run build && npx gh-pages -d dist"
```

**方式 B：GitHub Actions 自动部署**

在仓库中新建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

然后在 **Settings → Pages → Source** 中选择 **GitHub Actions**。之后每次 push 到 `main` 都会自动构建并发布。

### 部署方式对比

| 方案 | 是否需要 Git 仓库 | 命令行部署 | 免费额度 | 适合场景 |
| --- | --- | --- | --- | --- |
| Vercel | 可选（CLI 可直传） | `npx vercel --prod` | 个人项目免费 | 想要最快拿到公网地址 |
| Netlify | 可选（支持拖拽） | `npx netlify deploy --prod --dir=dist` | 个人项目免费 | 不想碰命令行，拖个文件夹就上线 |
| Cloudflare Pages | 可选（CLI 可直传） | `npx wrangler pages deploy dist` | 个人项目免费 | 已有 Cloudflare 账号 / 需要 CDN |
| GitHub Pages | 必需 | `npx gh-pages -d dist` | 公开仓库免费 | 代码本来就在 GitHub 上 |

---

## 添加到 iPhone 主屏（PWA）

部署到 HTTPS 公网地址后（`localhost` 也可），即可把它当成一个 App 使用：

1. 用 **Safari** 打开你的网址（必须是 Safari，Chrome for iOS 不支持「添加到主屏幕」的独立窗口模式）
2. 点击底部工具栏中间的 **分享** 按钮 <kbd>⬆️</kbd>
3. 在弹出菜单中向下滚动，选择 **添加到主屏幕**
4. 确认名称为「今天吃什么」（来自 `apple-mobile-web-app-title`），点击右上角 **添加**
5. 回到桌面即可看到应用图标，点开后是全屏运行、无浏览器地址栏的独立窗口

### PWA 图标与清单说明

- **iOS 图标**：使用 `<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">`，即 `public/icons/apple-touch-icon.png`（180×180、满幅直角，圆角由系统自动裁切）
- **Android / 桌面端图标**：来自 `manifest.webmanifest` 的 `icons` 字段，包含 192×192、512×512 以及 `purpose: maskable` 的 512×512 自适应图标
- **主题色**：`theme-color` 与清单中的 `theme_color`、`background_color` 统一为 `#FFF8F2`（与页面背景一致）。这样启动画面到首屏的过渡没有色差，独立窗口模式下的状态栏也不会出现一条突兀的橙色横条；品牌橙 `#FF6B35` 只用在按钮等强调元素上
- **显示模式**：`display: "standalone"`、`orientation: "portrait"`、`start_url` 与 `scope` 均为 `/`
- **离线能力**：`public/sw.js` 在正式构建中自动注册（缓存名 `tqsc-cache-v1`），预缓存 `/`、`/index.html`、`/manifest.webmanifest`、`/favicon.svg`；离线打开时导航请求回退到缓存的 `index.html`，应用仍可正常使用（历史、收藏等数据本来就在本机）
- **更新机制**：Service Worker 安装后立即 `skipWaiting()` 并 `clients.claim()`，新版本激活时会自动清理旧缓存

> 若更新了代码但手机上的图标仍显示旧版本，可关闭该 PWA 后重新打开，或在系统设置中清除 Safari 网站数据后重新添加。

---

## 数据存储说明

应用不联网、无账号体系，所有数据都只保存在**当前浏览器**中。

### 存储键一览

所有键统一以 `tqsc:v1:` 为前缀（定义在 `src/lib/storage.js` 的 `PREFIX`），避免与其他站点冲突：

| 存储位置 | 键名 | 内容 | 说明 |
| --- | --- | --- | --- |
| `localStorage` | `tqsc:v1:history` | 历史记录数组 | 每条含 `uid` / `id` / `name` / `emoji` / `category` / `taste` / `ts`，最多 60 条 |
| `localStorage` | `tqsc:v1:favorites` | 收藏的食物 id 数组 | 已去重 |
| `localStorage` | `tqsc:v1:stats` | 统计数据 | `{ totalDecided, firstUsedAt }`，即首页的「已决定顿数」 |
| `sessionStorage` | `tqsc:v1:dislikes` | 「这个不要」的食物 id 数组 | **仅当前标签页会话有效**，关闭标签页后自动清空 |

### 清空数据的方法

**方法一：在应用内操作（推荐）**

- 历史记录：进入「🕘 记录」页 → 右上角点「清空」→ 再点一次「确认清空？」（3.2 秒内不确认会自动取消）
- 收藏：进入「❤️ 收藏」页 → 逐个点心形按钮取消收藏
- 「这个不要」：关闭标签页或刷新到新会话即自动重置

**方法二：在浏览器中手动清除**

1. 打开应用页面 → 按 <kbd>F12</kbd> 打开开发者工具
2. 切换到 **Application**（Chrome/Edge）或 **存储**（Firefox）面板
3. 展开 **Local Storage**，找到当前站点，删除 `tqsc:v1:history`、`tqsc:v1:favorites`、`tqsc:v1:stats`
4. 展开 **Session Storage**，删除 `tqsc:v1:dislikes`
5. 刷新页面

或者在控制台执行：

```js
// 清空本应用的全部本地数据
Object.keys(localStorage)
  .filter((k) => k.startsWith('tqsc:v1:'))
  .forEach((k) => localStorage.removeItem(k))
Object.keys(sessionStorage)
  .filter((k) => k.startsWith('tqsc:v1:'))
  .forEach((k) => sessionStorage.removeItem(k))
location.reload()
```

**方法三：清除站点数据**

在浏览器设置中清除该站点的 Cookie 与网站数据（iOS 为「设置 → Safari → 高级 → 网站数据」），效果同上。

> 注意：清除浏览器数据、更换浏览器、使用无痕模式、更换设备，都会导致记录丢失或不可见，这是纯前端方案的固有特性。

---

## 扩充食物数据库

食物数据库位于 `src/data/foods.js` 的 `FOODS` 数组中，目前共 **101** 条记录，分布如下：

| 类型 | 数量 | 类型 | 数量 |
| --- | --- | --- | --- |
| 米饭 | 24 | 小吃 | 19 |
| 面食 | 17 | 快餐 | 7 |
| 粉面 | 12 | 西餐 | 9 |
| 火锅 | 13 | | |

口味分布：清淡 43 / 微辣 26 / 辣 27 / 重口 5。

### 添加一条记录

在 `FOODS` 数组末尾（或任意位置）按下面的字段结构追加一个对象即可：

```js
{
  id: 'niurou-wanzi',                 // 唯一标识，见下方说明
  name: '牛肉丸子',                    // 展示名称
  emoji: '🍡',                        // 结果卡片与转盘上展示的表情
  price: [15, 28],                    // [最低价, 最高价]，单位：元
  category: '小吃',                    // 必须是 CATEGORIES 中的值
  taste: '清淡',                       // 必须是 TASTES 中的值
  scenes: ['食堂', '外卖', '出去吃'],   // 必须是 SCENES 中的子集，可多选
  desc: '手打丸子配清汤，一口一个很满足。', // 一句话描述，显示在结果卡片上
}
```

字段约束（对应文件顶部导出的常量）：

| 字段 | 类型 | 约束 |
| --- | --- | --- |
| `id` | `string` | **必须全局唯一**，一旦发布就不要修改 |
| `name` | `string` | 建议 2–6 个字 |
| `emoji` | `string` | 单个 emoji |
| `price` | `[number, number]` | 最低价 ≤ 最高价，用于预算筛选 |
| `category` | `string` | 取值于 `CATEGORIES`：米饭 / 面食 / 粉面 / 火锅 / 小吃 / 快餐 / 西餐 |
| `taste` | `string` | 取值于 `TASTES`：清淡 / 微辣 / 辣 / 重口 |
| `scenes` | `string[]` | 取值于 `SCENES`：食堂 / 外卖 / 出去吃 |
| `desc` | `string` | 一句话，建议 15–25 字 |

**关于 `id` 的注意事项**：`id` 会写入 `localStorage` 的历史记录与收藏列表。修改或删除已有 `id` 会导致对应的历史记录和收藏「找不到食物」而被静默忽略（`getFoodById` 返回 `null` 后被过滤掉）。因此**新增记录时请使用全新的 `id`，不要改动已有记录的 `id`**。

添加完成后无需任何其他改动：

- 筛选面板自动识别新数据（选项来自 `CATEGORIES` / `TASTES` / `SCENES`，而非食物列表）
- 加权随机、转盘候选、收藏页都会自动包含它
- 如果新增了分类 / 口味 / 场景，需要同时更新 `CATEGORIES` / `TASTES` / `SCENES` 常量，以及 `src/lib/content.js` 中的 `CATEGORY_OPTIONS` / `TASTE_OPTIONS` / `SCENE_OPTIONS`（筛选按钮文案列表）

### `SHORT_NAMES` 的作用

`SHORT_NAMES` 是**转盘扇区专用的短名称映射表**（`id -> 短标签`），当前定义了 23 条，例如：

```js
export const SHORT_NAMES = {
  huangmenji: '黄焖鸡',        // 黄焖鸡米饭 → 黄焖鸡
  zhujiaofan: '猪脚饭',        // 隆江猪脚饭 → 猪脚饭
  'huiguorou-fan': '回锅肉',   // 回锅肉盖饭 → 回锅肉
  'chaoshan-niurou': '牛肉火锅', // 潮汕牛肉火锅 → 牛肉火锅
  // ...
}
```

它的作用与规则：

- **只影响展示，不影响数据**：转盘扇区宽度有限，长名称会溢出或挤成一团，所以用更口语化的短标签替代
- **回退逻辑**：`shortName(food)` 会优先取 `SHORT_NAMES[food.id]`，取不到就返回完整的 `food.name`。因此**不配置也能正常运行**，只是长名称在转盘上会显得拥挤
- **使用位置**：仅 `src/components/Wheel.jsx` 渲染扇区文字时调用；结果卡片、历史记录、收藏列表等位置一律显示完整名称
- **建议**：新增名称较长的食物（超过 4 个字）时，顺手在 `SHORT_NAMES` 中补一条 3–4 字的短标签，例如 `niurou-wanzi: '牛肉丸'`

### 其他相关常量

同文件内还导出了几个工具函数，改动数据时可能会用到：

| 名称 | 作用 |
| --- | --- |
| `FOOD_MAP` / `getFoodById(id)` | id → 食物对象的快速索引，收藏与历史记录靠它还原数据 |
| `avgPrice(food)` | 价格区间平均值，用于预算筛选与均价计算 |
| `priceLabel(food)` | 价格展示文案，例如 `¥15–28` |
| `matchBudget(food, budget)` | 判断食物是否命中某个预算档位（区间求交集） |
| `BUDGETS` | 预算档位定义：不限 / 20 元以内 / 20–40 元 / 40 元以上 |

---

## 已知限制

- **没有账号体系**：不支持注册登录，也没有云端同步
- **数据仅存本机**：历史记录、收藏、统计都保存在当前浏览器的 `localStorage` 中，换设备、换浏览器、清除浏览器数据都会丢失
- **不跨设备同步**：手机和电脑上的记录互相独立
- **「这个不要」不持久**：存在 `sessionStorage`，关闭标签页即失效，属于刻意设计（避免长期压制某个食物）
- **历史记录有上限**：只保留最近 60 条，超出后自动丢弃最旧的记录
- **无后端**：没有服务端接口，无法做多端排行榜、社区推荐等需要服务端的功能
- **转盘候选数量有限**：扇区固定为 8–10 个，不会把全部 101 种食物同时放上转盘
- **未使用 TypeScript**：纯 JavaScript，类型约束依赖约定与运行时校验
- **未内置单元测试**：`package.json` 中没有配置测试脚本与测试框架
- **PWA 依赖 HTTPS**：Service Worker 只在 HTTPS（或 `localhost`）下生效；部署到 HTTP 站点时将失去离线能力
- **iOS 安装入口仅限 Safari**：iPhone 上必须用 Safari 的「分享 → 添加到主屏幕」，「添加到主屏」后才有独立窗口体验
- **GitHub Pages 项目站点需手动改配置**：部署到子路径时需自行设置 `vite.config.js` 的 `base` 并同步调整若干绝对路径，详见[方案四](#方案四github-pages)

---

## License

本项目未附带开源许可证文件。如需公开使用或分发，请先自行添加合适的 LICENSE。
