# 今天吃什么？🍜

> 一个有趣、好看、手机端优先的「今天吃什么」生成器。随机抽一个，或者转个盘，把今天的吃饭决定交给命运。

纯前端应用，无需后端与数据库，所有记录只保存在你自己的浏览器里，并支持添加到 iPhone 主屏当 App 用。

**源码仓库**：https://github.com/rons05668-jpg/chishenme

**在线地址**：https://chishenme-two.vercel.app

- 生产分支为 `main`：仓库 `rons05668-jpg/chishenme` 的 `main` 分支推送后由 Vercel 自动部署，该域名指向生产环境
- Vercel 项目名与所属团队/账号归属**未在本仓库中记录**，请在 Vercel 控制台自行确认
- 重新部署：在项目根目录执行 `npx vercel deploy --prod`（同一项目会复用该域名并覆盖线上内容）
- ⚠️ 在中国内地访问该域名可能不稳定或不可达，详见下方「中国内地访问」章节

> 提示：`chishenme.vercel.app` 已被其他 Vercel 用户占用，因此实际域名自动带上了后缀，为 `chishenme-two.vercel.app`。

---

## 中国内地访问

> **本节为历史观察，未持续验证，请自行实测。**
>
> 下面提到的连通性结论来自过去某一次在特定网络环境下的手工观察，既不代表普遍情况，也不构成对当前状态的承诺。网络链路、DNS 解析与各托管平台的策略都会变化，**请以你自己的实测结果为准**。

经验上，面向内地用户时通常会遇到两类差异：

- **Vercel 等海外平台的默认域名**：部分内地网络环境下解析或连接不稳定，可能超时或无法打开
- **新加坡 / 香港等跨境节点**：能否连通、延迟高低，在不同运营商和不同时段差别较大

因此选型时建议优先考虑「是否需要内地用户稳定访问」这一条：

| 方案 | 需要 ICP 备案 | 说明 |
| --- | --- | --- |
| **EdgeOne Pages（腾讯云）** | 默认域名不需要，绑自有域名需要 | 国内 CDN，有免费额度 |
| **国内云对象存储 + CDN** | ✅ **必须备案** | 腾讯云 COS / 阿里云 OSS + CDN，最正规，但需备案周期 |
| **香港 / 新加坡轻量服务器** | 不需要 | 免备案，但跨境链路会波动 |
| **Cloudflare Pages** | 不需要 | 免费版在内地连通性不稳定；中国大陆节点仅企业版 |
| **Vercel** | 不需要 | 本项目的生产环境；若内地访问不畅，可另配一条内地线路 |

关于长期可用性：无论选哪种托管，都建议把它当作需要持续观测的服务，而不是上线后就固定不变的结论。

### 推荐做法：双线部署

项目是**纯静态产物**（无后端、数据全在浏览器 localStorage），所以两边可以共用同一份 `dist/` 构建产物，**零代码改动**：

- **海外**：Vercel（`chishenme-two.vercel.app`）
- **内地**：按上表选一个方案，把 `npm run build` 产出的 `dist/` 原样上传即可

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
| 🎡 吃什么转盘 | `#/wheel` | 最多 10 个严格匹配的候选；单候选直接展示，零候选提示调整条件 |

首页（`#/`）会显示当前时段问候语、随机副标题、累计决定顿数，以及上一次决定吃了什么。

---

## 今天喝什么 🧋

独立的饮品模块，入口在首页（`#/drink`），与「吃什么」平行但数据完全隔离。

| 玩法 | 说明 |
| --- | --- |
| 🥤 帮我选一杯 | 先选品牌 / 预算 / 冷热 / 类型，按加权随机抽一款具体饮品 |
| 🎡 喝什么转盘 | 最多 10 个严格匹配的候选，规则与食物转盘一致 |

**推荐的是「哪个品牌的哪款饮品」**，例如「喜茶 · 多肉葡萄」，而不是只给一个品类。

### 跨品牌抽样规则

默认采用**先等概率选品牌、再在品牌内加权选饮品**的两段式抽样：

- 若直接在全部候选上做加权随机，收录条目多的品牌（例如收录 30 款的品牌）会明显比收录 5 款的品牌更容易被抽中
- 品牌优先抽样让每个「有候选的品牌」先获得等概率的品牌席位，避免大目录品牌系统性占优
- 品牌内部仍然按权重抽取（最近喝过降权、收藏加权），所以结果不是纯均匀随机
- 转盘候选使用同一套分层规则，保证扇区构成与推荐落点一致

### 饮品筛选

- **品牌**：不限，或指定单一品牌（选项来自 `src/data/brands.js`）
- **预算**：不限 / 10 元以内 / 10–20 元 / 20 元以上
- **冷热 / 咖啡因**：仅列出官方可确认的选项
- **忌口**：咖啡因 / 乳制品 / 冰 / 高糖，独立于食物忌口

预算匹配有一条刻意设计的约束：**价格未公示的饮品不参与任何预算档的匹配**。既然无法确认它是否落在预算内，就不能假装它满足条件——宁可排除，并在零候选时提示原因。

**「甜度」筛选器已被移除（2026-09-20）。** 原因：212 条饮品中仅 21 条有官方公示的糖度，且全部来自贡茶（其大陆菜单无法统一核实、在售状态为 `unknown`，默认不进推荐池）——也就是说**推荐池内没有任何一条带糖度数据**，保留该筛选器等于「一选就零候选」的界面装饰。底层 `filters.sugar` 字段与偏好持久化保留，以免破坏旧数据兼容；日后补齐糖度数据即可直接加回。

**「高糖」忌口的口径**：只排除数据明确显示**提供「正常糖」**的饮品。糖度未公示不会被自动判定为高糖——否则 180 条常驻饮品会全部出局，一个勾选就锁死功能。代价是未公示糖度的饮品不会被排除，因此勾选忌口后界面会明确提示「品牌未公示的信息无法代为排除，有过敏或严格忌口需求请向门店确认」，不做静默保证。

### 数据真实性与核验

饮品数据（`src/data/drinks.js` + `src/data/brands.js`）遵循以下硬规则，并由 `npm run check:data` 强制校验：

| 规则 | 说明 |
| --- | --- |
| 分类不猜测 | `鲜奶茶` 必须有官方「鲜奶 / 牛乳」依据，否则一律归 `奶茶` |
| 价格三态 | `official`（官方公示）/ `thirdParty`（第三方参考，UI 强制标注）/ `unpublished` |
| 禁止 0 元占位 | 价格未公示时 `priceRange` 必须为 `null`，`[0,0]` 会被判定为错误 |
| 配置不套用 | 温度 / 甜度只能写官方公示的档位，未公示时留空数组 |
| 咖啡因不臆造 | 纯茶 / 果茶 / 奶茶不得默认为无咖啡因；标为无咖啡因必须填 `caffeineNote` |
| 在售状态准入 | `unknown`（待确认）与 `discontinued`（已下架）、季节 / 区域限定默认不进推荐池 |
| schema 字段名一致 | 禁止出现 `sugar` / `emoji` 等 schema 外的别名键；消费端读取的字段必须真实存在（防 undefined 静默失效） |

#### 核验范围与已知局限（如实说明，不做过度承诺）

这批数据**于 2026-09-20 集中核验完成**，因此全量条目的 `verifiedAt` 是同一个日期。请注意这意味着：

- 它是**一批集中核验**，不等于每一条都在当天被独立二次复核；`verifiedAt` 表示「该条目所属批次的核验日期」，不是逐条的复核时间戳。
- **没有任何一条具备官方一手价格**以外的价格背书：`official` 仅 19 条（茶颜悦色 18 条 + 书亦 1 条），`thirdParty` 55 条（UI 强制标注「第三方参考」），`unpublished` 138 条。
- 有 6 条（奈雪的茶）的 `sources` 只指向品牌首页、未能定位到具体菜单页，属于**来源精度不足**，已在数据中如实保留而未用一个更"好看"的地址替换。
- 品牌表中有 8/14 个品牌没有可确认的官方站点来源（含沪上阿姨：其 `hsaytea.com` 经 DNS 查询为 NXDOMAIN，`hsaytea.cn` 内容与茶饮无关），`sources` 一律留空，**不填无法打开的地址充数**。
- 核验过程中发现多个**假冒站 / 加盟招商站 / 盗版站**（`hsaytea.cn`、`yihetgw.cn`、`coco--tea.com`、`naixuedetea.cn` 等），这些站点的任何信息都未被采用。

来源 URL 与核验日期保存在每条数据的 `sources` / `verifiedAt` 字段中，完整来源可在数据说明或详情中查看。

> **关于时间显示**：历史记录的「今天 / 昨天 / 前天」分组与具体时间均按**设备本地时区**计算（`startOfDay` + `getHours()` 同一时区，不会自相矛盾）。本应用没有后端与账号，记录只存在于本机，因此以设备时区为准是合理设计；跨时区旅行后，旧记录的分组可能随之变化。

结果卡片**不再展示**价格免责说明（曾固定显示「菜单与价格以门店为准（参考价来源：…）」，已于 2026-09-20 按要求移除）。价格来源信息仍完整保留在数据层（`priceNote` / `priceSource` / `sources`），需要时可重新渲染。

即便界面上不再出现该说明，以下诚实性约束依然成立：**本应用未接入任何实时菜单，因此不使用「实时价格」「实时库存」等表述**，也不声称附近门店一定能买到某款饮品。第三方来源的价格始终标明「（第三方参考）」，未公示的价格显示「参考价未公示」而非 `¥0`。

---

## 功能特性

### 条件筛选

- **预算**：不限 / 20 元以内 / 20–40 元 / 40 元以上
- **口味**：清淡 / 微辣 / 辣 / 重口 / 随机
- **类型**：米饭 / 粉面 / 包饺饼类 / 火锅锅物 / 家常菜 / 烧烤 / 小吃点心 / 西式主菜 / 快餐简餐 / 粥汤 / 甜品烘焙
- **风味**：12 个独立地域风味标签，可与类型交叉筛选
- **时段**：早餐 / 午餐 / 晚餐 / 下午茶 / 夜宵；不会把所有小吃都视为早餐
- **忌口**：香菜 / 内脏 / 鱼虾贝类 / 辣，可多选，自动保存；随机、转盘和收藏推荐共用。配料不明确时保守排除，不作过敏安全保证
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

- 候选由 `buildWheelPool` 严格筛选，页面最多展示 10 个；不再补入条件外的食物。零候选提示调整条件，单候选直接展示结果卡片
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
- 安装时预缓存当前构建的 JS/CSS 与图标，首次安装完成后即可离线重开；更新时仅清理本应用的旧缓存

---

## 技术栈

| 分类 | 选型 | 版本 |
| --- | --- | --- |
| 框架 | React | `^18.3.1` |
| 渲染 | React DOM | `^18.3.1` |
| 路由 | react-router-dom（`HashRouter`） | `^7.18.4` |
| 动效 | framer-motion | `^11.11.17` |
| 构建 | Vite | `^8.3.0` |
| Vite React 插件 | @vitejs/plugin-react | `^6.1.1` |
| 语言 | JavaScript（JSX，ESM，无 TypeScript） | — |
| 样式 | 手写 CSS（3 个样式文件，无 UI 框架） | — |
| 状态管理 | React Context + Hooks（`src/state/AppState.jsx`） | — |
| 持久化 | localStorage / sessionStorage | — |

**没有使用任何 UI 组件库、CSS 框架或状态管理库**，样式与组件全部手写。

### 路由表

应用使用 `HashRouter`，URL 形如 `https://example.com/#/random`。

| 路径 | 页面 | 说明 |
| --- | --- | --- |
| `/` | `HomePage` | 首页：问候语、吃喝两种玩法入口、统计、快捷入口 |
| `/random` | `RandomPage` | 随机吃什么 |
| `/wheel` | `WheelPage` | 吃什么转盘（沉浸模式，隐藏底部导航） |
| `/drink` | `DrinkPage` | 今天喝什么（随机 + 转盘，含品牌筛选） |
| `/history` | `HistoryPage` | 最近吃过 / 喝过 |
| `/favorites` | `FavoritesPage` | 我的收藏 |
| `*` | `HomePage` | 未匹配路径回退到首页 |

「喝什么」入口放在首页而不是底部导航：底部导航在手机端空间有限，新增 tab 会挤压主功能，「今天喝什么」卡片单独占一行，视觉上更清晰。

---

## 目录结构

```text
today-eat-what/
├── index.html                     # HTML 入口（含 iOS PWA meta、manifest、apple-touch-icon）
├── package.json
├── package-lock.json              # 锁定依赖版本，供 CI/Vercel 做确定性安装
├── vite.config.js                 # 开发/预览 host 与端口、构建输出目录、allowedHosts
├── vercel.json                    # Vercel 构建与缓存配置（锁定 framework/build/output）
├── playwright.config.js           # 浏览器回归测试配置（Chromium 手机视口）
├── .vercelignore                  # 上传 Vercel 时忽略 node_modules、dist 等
├── .nvmrc                         # Node 主版本（`22`），与 package.json engines 一致
├── .gitignore
├── .github/
│   ├── dependabot.yml             # 定期检查 npm 与 Actions 更新
│   └── workflows/ci.yml           # main 推送与 PR：安装、数据自检、依赖审计、构建、浏览器测试
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
│   ├── check-data.cjs             # 食物数据、推荐算法、存储与备份自检（25 项检查）
│   ├── generate-icons.cjs         # 纯 Node 生成上述 PNG 图标（无第三方依赖）
│   └── serve.cjs                  # 生产启动入口：按需构建 + 以 0.0.0.0:$PORT 提供服务
├── tests/
│   └── core.spec.js               # Playwright 回归测试（随机、收藏、历史、忌口、转盘、离线）
└── src/
    ├── main.jsx                   # 挂载 React、引入样式、注册 Service Worker
    ├── App.jsx                    # HashRouter + 路由表 + 页面切换动画
    ├── components/
    │   ├── BackupPanel.jsx        # 本地数据备份面板（导出 / 导入 JSON）
    │   ├── BottomNav.jsx          # 底部导航（5 个 Tab）
    │   ├── FilterPanel.jsx        # 条件筛选面板（预算/口味/类型/场景）
    │   ├── FoodResultCard.jsx     # 推荐结果大卡片
    │   ├── OptionGroup.jsx        # 通用单选选项组
    │   ├── ResultSheet.jsx        # 转盘结果的底部弹出面板
    │   ├── Toast.jsx              # 全局轻提示
    │   ├── TopBar.jsx             # 子页面顶部栏（返回 + 标题）
    │   ├── UpdateBanner.jsx       # 「有新版本」提示条（订阅 pwaUpdate 状态）
    │   └── Wheel.jsx              # SVG 幸运转盘
    ├── data/
    │   ├── foods.js               # 原数据与统一导出 + 枚举 + 工具函数
    │   └── food-metadata.js       # 新增食物与独立分类、时段、忌口标注
    ├── hooks/
    │   ├── useDecider.js          # 「帮我决定」的翻牌动画 + 加权抽取流程
    │   └── useMediaQuery.js       # 响应式媒体查询订阅
    ├── lib/
    │   ├── content.js             # 文案（副标题/结果语录）、筛选选项、时段问候语
    │   ├── filters.js             # 筛选默认值与转换工具
    │   ├── picker.js              # 筛选、权重计算、加权抽样、历史分组
    │   ├── pwaUpdate.js           # PWA 新版本状态广播（供界面订阅并提示更新）
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

**环境要求**：Node.js `>=22.22.0 <23`（`package.json` 的 `engines` 字段）。仓库内置 `.nvmrc`（内容为 `22`），CI 通过 `actions/setup-node` 的 `node-version-file: .nvmrc` 读取，因此本地、CI、生产构建使用同一 Node 主版本。

```bash
# 1. 安装依赖
npm ci

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
| `npm run check:data` | 运行 25 项数据、推荐、存储与备份检查，失败时退出码为 1（含 249 条条目数、11 个类型、23 条短名映射等断言） |
| `npm run test:e2e` | 构建后运行手机端浏览器回归测试（随机、收藏、历史、忌口、转盘、离线） |

首次运行浏览器测试先执行 `npx playwright install chromium`。本机已安装 Chrome 时可设置环境变量 `PW_CHANNEL=chrome`。
GitHub Actions 对 main 推送和 PR 执行 `npm ci`、数据检查、依赖审计、生产构建及浏览器测试。Dependabot 定期检查 npm 和 Actions 更新。
Vercel 保留现有项目及 main 生产分支，安装命令使用 `npm ci`；响应头补充 MIME 嗅探、来源信息及嵌入保护。

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
> - `vercel.json` 显式锁定 `framework: vite`、`buildCommand: npm run build`、`outputDirectory: dist`、`installCommand: npm ci`；同时为 `/sw.js` 设置了 `must-revalidate`、为 `/assets/*` 设置了长缓存。
> - `.vercelignore` 已排除 `node_modules`、`dist`、`.workbuddy-ai`、Vite 时间戳临时文件与部署包本身。
> - `package.json` 提供 `deploy` 脚本（等价于 `npx vercel --prod`），`engines.node` 要求为 `>=22.22.0 <23`（见 `.nvmrc`）。
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
          node-version-file: .nvmrc    # 与本仓库 CI 一致；也可写死为 '22'
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
- **离线能力**：`public/sw.js` 在正式构建中自动注册（缓存名 `tqsc-cache-v2`），预缓存 `/`、`/index.html`、`/manifest.webmanifest`、`/favicon.svg` 与 4 个图标；离线打开时导航请求回退到缓存的 `index.html`，应用仍可正常使用（历史、收藏等数据本来就在本机）
- **更新机制**：Service Worker 安装后立即 `skipWaiting()` 并 `clients.claim()`。检测到新版本时（`registration.waiting`，或 `updatefound` 后新 SW 进入 `installed` 且已有 `controller`），`src/main.jsx` 调用 `src/lib/pwaUpdate.js` 的 `markPwaUpdateReady()` 广播更新状态；`src/components/UpdateBanner.jsx` 订阅该状态并在界面顶部显示「有新版本」提示，用户点击后由 `applyPwaUpdate()` 让 waiting 中的新 SW 立即接管，页面随之自动重载。整个过程**不触碰任何 localStorage 数据**；新版本激活时仅清理本应用的旧缓存（`tqsc-cache-` 前缀）

> 若更新了代码但手机上的图标仍显示旧版本，请**先按顺序尝试**：
>
> 1. 完全关闭该 PWA（从后台任务列表中划掉）后重新打开
> 2. 若应用内出现「有新版本」提示，点击确认更新，等待页面自动重载
> 3. 仍不生效时，在浏览器中强制刷新一次（iOS 上可先移除主屏图标再重新添加，这一步不会清除站点数据）
>
> ⚠️ **不要为了更新而清除网站数据**。清除站点数据会一并删除 `localStorage` 里的**收藏、历史记录与忌口设置**（详见[数据存储说明](#数据存储说明)），属于不可逆操作。仅在数据已损坏、应用无法正常启动时，才把它作为最后手段，**且务必先导出备份**。

---

## 数据存储说明

应用不联网、无账号体系，所有数据都只保存在**当前浏览器**中。

### 存储键一览

所有键统一以 `tqsc:v1:` 为前缀（定义在 `src/lib/storage.js` 的 `PREFIX`），避免与其他站点冲突：

| 存储位置 | 键名 | 内容 | 说明 |
| --- | --- | --- | --- |
| `localStorage` | `tqsc:v1:history` | 历史记录数组 | 每条含 `uid` / `id` / `name` / `emoji` / `category` / `taste` / `ts`，最多 60 条 |
| `localStorage` | `tqsc:v1:favorites` | 收藏的食物 id 数组 | 已去重 |
| `localStorage` | `tqsc:v1:exclusions` | 忌口标签数组 | 取值于 `香菜` / `内脏` / `鱼虾贝类` / `辣`，已去重 |
| `localStorage` | `tqsc:v1:filters` | 筛选条件偏好 | 预算 / 口味 / 类型 / 风味 / 时段 / 场景 / 忌口的记忆值 |
| `localStorage` | `tqsc:v1:stats` | 统计数据 | `{ totalDecided, firstUsedAt }`，即首页的「已决定顿数」 |
| `sessionStorage` | `tqsc:v1:dislikes` | 「这个不要」的食物 id 数组 | **仅当前标签页会话有效**，关闭标签页后自动清空 |

饮品模块使用**完全独立的键空间**，与食物数据互不影响，因此旧数据无需任何迁移：

| 存储位置 | 键名 | 内容 | 说明 |
| --- | --- | --- | --- |
| `localStorage` | `tqsc:v1:drinkHistory` | 饮品历史记录数组 | 结构与食物历史一致，id 带 `drink-` 前缀 |
| `localStorage` | `tqsc:v1:drinkFavorites` | 收藏的饮品 id 数组 | 已去重 |
| `localStorage` | `tqsc:v1:drinkExclusions` | 饮品忌口标签数组 | 取值于 `咖啡因` / `乳制品` / `冰` / `高糖` / `酒精` |
| `localStorage` | `tqsc:v1:drinkFilters` | 饮品筛选偏好 | 品牌 / 预算 / 冷热 / 类型 / 场景 / 甜度 / 咖啡因 |
| `localStorage` | `tqsc:v1:drinkStats` | 饮品统计 | `{ totalDecided, firstUsedAt }`，**与「已决定吃饭顿数」相互独立** |
| `sessionStorage` | `tqsc:v1:drinkDislikes` | 「这个不想喝」的饮品 id 数组 | 仅当前会话有效 |

食物与饮品的 id 空间不重叠（食物 id 无前缀，饮品统一 `drink-` 前缀），且各自使用独立存储键，因此两边的收藏 / 历史不会互相污染。

### 备份与恢复

「❤️ 收藏」页底部的**本地数据备份**面板（`src/components/BackupPanel.jsx`）支持：

- **导出 JSON**：把历史记录、收藏、忌口与筛选偏好等打包下载成一个备份文件（`sessionStorage` 的 `dislikes` 刻意不包含在内，它只在会话内有效）
- **导入 JSON**：解析备份文件并与现有数据**合并**（不是覆盖）——重复项去重、新增项计入、**已有数据不会被删除**

**在清除站点数据或更换设备之前，建议先导出一次备份**，这样即使本地数据丢失也能恢复。

### 清空数据的方法

**方法一：在应用内操作（推荐）**

- 历史记录：进入「🕘 记录」页 → 右上角点「清空」→ 再点一次「确认清空？」（3.2 秒内不确认会自动取消）
- 收藏：进入「❤️ 收藏」页 → 逐个点心形按钮取消收藏
- 「这个不要」：关闭标签页或刷新到新会话即自动重置

**方法二：在浏览器中手动清除**

1. 打开应用页面 → 按 <kbd>F12</kbd> 打开开发者工具
2. 切换到 **Application**（Chrome/Edge）或 **存储**（Firefox）面板
3. 展开 **Local Storage**，找到当前站点，删除 `tqsc:v1:history`、`tqsc:v1:favorites`、`tqsc:v1:exclusions`、`tqsc:v1:filters`、`tqsc:v1:stats`
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

**方法三：清除站点数据（⚠️ 会连同业务数据一起丢失）**

在浏览器设置中清除该站点的 Cookie 与网站数据（iOS 为「设置 → Safari → 高级 → 网站数据」）。

> ⚠️ **警告**：该方法会删除本站点下的**全部** `localStorage`/`sessionStorage` 数据，即**收藏、历史记录、忌口设置、筛选偏好与统计数据都会被一并清除**，且不可撤销。只有在数据已损坏、应用无法正常启动时才建议使用，**执行前请先在应用内导出备份**。
>
> 如果你只是想解决「更新后还是旧版本」的问题，请改用[添加到 iPhone 主屏（PWA）](#添加到-iphone-主屏pwa)章节中的正常更新流程，不要清除站点数据。

> 注意：清除浏览器数据、更换浏览器、使用无痕模式、更换设备，都会导致记录丢失或不可见，这是纯前端方案的固有特性。

---

## 扩充食物数据库

食物数据库由 `src/data/foods.js` 的 `FOODS` 统一导出，目前共 **249** 条、**11** 个类型、**12** 个风味标签。原有 101 个 ID 全部保留，新增 148 条。
新增数据位于 `src/data/food-metadata.js`，类型、风味、时段独立；同义类型不再重复设置。价格为粗略参考，非门店实时报价。

### 添加一条记录

在 `EXTRA_FOODS` 数组末尾按下面的字段结构追加对象，并检查 `enrichFood` 生成的时段与忌口；更新条目数断言后运行全部检查：

```js
{
  id: 'niurou-wanzi',                 // 唯一标识，见下方说明
  name: '牛肉丸子',                    // 展示名称
  emoji: '🍡',                        // 结果卡片与转盘上展示的表情
  price: [15, 28],                    // [最低价, 最高价]，单位：元
  category: '小吃点心',                // 必须是 CATEGORIES 中的值
  cuisines: ['家常'],                 // 必须是 CUISINES 中的值
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
| `category` | `string` | 取值于 `CATEGORIES` 的 11 个食物类型 |
| `cuisines` / `meals` | `string[]` | 独立风味、时段标签，后者由 enrichFood 生成 |
| `exclusions` / `uncertainExclusions` | `string[]` | 常见及需确认的配料，两者都会被忌口排除 |
| `taste` | `string` | 取值于 `TASTES`：清淡 / 微辣 / 辣 / 重口 |
| `scenes` | `string[]` | 取值于 `SCENES`：食堂 / 外卖 / 出去吃 |
| `desc` | `string` | 一句话，建议 15–25 字 |

**关于 `id` 的注意事项**：`id` 会写入 `localStorage` 的历史记录与收藏列表。修改或删除已有 `id` 会导致对应的历史记录和收藏「找不到食物」而被静默忽略（`getFoodById` 返回 `null` 后被过滤掉）。因此**新增记录时请使用全新的 `id`，不要改动已有记录的 `id`**。

添加完成后无需任何其他改动：

- 筛选面板自动识别新数据（选项来自 `CATEGORIES` / `TASTES` / `SCENES`，而非食物列表）
- 加权随机、转盘候选、收藏页都会自动包含它
- 如果新增枚举，仅更新数据层常量；筛选选项自动派生，无需维护第二份列表

### `SHORT_NAMES` 的作用

`SHORT_NAMES` 是**转盘扇区专用的短名称映射表**（`id -> 短标签`），当前定义了 23 条（由 `npm run check:data` 的第 06 项校验：键必须存在且短名不超过 4 字），例如：

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
- **回退逻辑**：依次使用 `SHORT_NAMES[food.id]`、条目的 `shortName`、名称前四个字符，避免转盘文字溢出
- **使用位置**：仅 `src/components/Wheel.jsx` 渲染扇区文字时调用；结果卡片、历史记录、收藏列表等位置一律显示完整名称
- **建议**：新增名称较长的食物（超过 4 个字）时，顺手在 `SHORT_NAMES` 中补一条 3–4 字的短标签，例如 `niurou-wanzi: '牛肉丸'`

### 其他相关常量

同文件内还导出了几个工具函数，改动数据时可能会用到：

| 名称 | 作用 |
| --- | --- |
| `FOOD_MAP` / `getFoodById(id)` | id → 食物对象的快速索引，收藏与历史记录靠它还原数据 |
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
- **转盘候选数量有限**：最多 10 个，少于两个时采用空状态或直接结果
- **未使用 TypeScript**：纯 JavaScript，类型约束依赖约定与运行时校验
- **测试范围**：数据/算法/存储自检及 Chromium 手机视口回归；真实 iOS Safari 安装仍建议在设备上验证
- **PWA 依赖 HTTPS**：Service Worker 只在 HTTPS（或 `localhost`）下生效；部署到 HTTP 站点时将失去离线能力
- **iOS 安装入口仅限 Safari**：iPhone 上必须用 Safari 的「分享 → 添加到主屏幕」，「添加到主屏」后才有独立窗口体验
- **GitHub Pages 项目站点需手动改配置**：部署到子路径时需自行设置 `vite.config.js` 的 `base` 并同步调整若干绝对路径，详见[方案四](#方案四github-pages)

---

## License

本项目未附带开源许可证文件。如需公开使用或分发，请先自行添加合适的 LICENSE。
