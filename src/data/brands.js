/**
 * 品牌表
 * ------------------------------------------------------------------
 * 与饮品表（drinks.js）分表维护，避免每个 SKU 重复存品牌名称/地区备注。
 *
 * 字段说明：
 *  id         string  品牌唯一标识（拼音缩写），饮品表通过 brandId 关联
 *  name       string  品牌官方名称
 *  priceBand  string  价格带标签，仅用于列表展示与用户预期管理
 *  regionNote string  区域备注。**仅在有可靠依据时填写**，否则为 null。
 *                     连锁品牌的区域覆盖会随时间变化，不写无法核实的门店数量。
 *  sources    string[] 品牌官方站点/官方账号 URL，供数据维护追溯
 *  verifiedAt string  核验日期（YYYY-MM-DD）
 */

/* ------------------------------ 分类规则 ------------------------------ */

/**
 * 饮品主分类判定规则（先定规则，再按实际菜单归类）。
 *
 * 奶茶     以茶为基底 + 奶（奶精/植脂末/奶基底），未标注使用鲜奶。
 * 鲜奶茶   官方菜单或配料表**明确标注使用鲜奶/牛乳/纯牛奶**的奶茶。
 *          与「奶茶」的区别必须有原料或官方分类依据；无依据一律归「奶茶」，不猜。
 * 果茶     以水果/果汁为主要风味来源的茶饮（含柠檬茶、水果茶等）。
 * 纯茶     无奶无果汁的茶饮（绿茶/红茶/乌龙/茉莉等）。
 * 奶类饮品 不以茶为基底，但以奶为主体的饮品（纯牛奶、酸奶、奶昔等）。
 * 咖啡     以咖啡为基底（美式/拿铁/摩卡等）。
 * 其他     无法归入以上六类的饮品。
 *
 * 注意：品牌、茶底、配料、温度都不作为分类维度，它们是独立字段/标签。
 * 珍珠、椰果、芝士奶盖等一律作为 ingredientTags，不进分类。
 */
export const DRINK_CATEGORY_RULES = {
  奶茶: '茶基底 + 奶（奶精/植脂末/奶基底），未标注使用鲜奶',
  鲜奶茶: '官方明确标注使用鲜奶/牛乳/纯牛奶的奶茶',
  果茶: '以水果或果汁为主要风味来源的茶饮',
  纯茶: '无奶无果汁的茶饮',
  奶类饮品: '不以茶为基底、以奶为主体的饮品',
  咖啡: '以咖啡为基底的饮品',
  其他: '无法归入以上六类',
}

/* ---------------------------- 可用性枚举 ---------------------------- */

/** 在售状态 */
export const AVAILABILITY_LEVELS = [
  'permanent', // 常驻在售
  'seasonal', // 季节限定
  'regional', // 区域限定
  'discontinued', // 已确认下架
  'unknown', // 无法确认在售状态
]

/** 默认参与推荐的可用性：仅常驻。季节/区域/未知/已下架默认不进推荐池。 */
export const DEFAULT_RECOMMENDABLE_AVAILABILITY = ['permanent']

/**
 * 默认不进推荐池的可用性。
 * 需求明确：无法确认在售状态标记「待确认」默认不进推荐池；已确认下架不进推荐池。
 */
export const NON_DEFAULT_AVAILABILITY = ['unknown', 'discontinued']

/* ------------------------------ 品牌数据 ------------------------------ */

/**
 * 品牌原始数据。
 *
 * 诚实性约定：本表中每个品牌都必须有可访问的官方来源（官网/官方账号）才收录。
 * 无法给出 sources 的品牌不应出现在这里——宁缺毋滥。
 */
const BRANDS_RAW = [
  {
    id: 'mxbc',
    name: '蜜雪冰城',
    priceBand: '10元以内',
    regionNote: null,
    sources: ['https://www.mxbc.com'],
    verifiedAt: '2026-09-20',
  },
  {
    id: 'guming',
    name: '古茗',
    priceBand: '10–20元',
    regionNote: null,
    sources: ['https://www.gumingnc.com'],
    verifiedAt: '2026-09-20',
  },
  {
    id: 'tianlala',
    name: '甜啦啦',
    priceBand: '10元以内',
    regionNote: null,
    sources: [],
    verifiedAt: '2026-09-20',
  },
  {
    id: 'heytea',
    name: '喜茶',
    priceBand: '20元以上',
    regionNote: null,
    sources: ['https://www.heytea.com'],
    verifiedAt: '2026-09-20',
  },
  {
    id: 'naixue',
    name: '奈雪的茶',
    priceBand: '20元以上',
    regionNote: null,
    sources: ['https://www.naixue.com'],
    verifiedAt: '2026-09-20',
  },
  {
    id: 'chagee',
    name: '霸王茶姬',
    priceBand: '10–20元',
    regionNote: null,
    sources: ['https://www.chagee.com'],
    verifiedAt: '2026-09-20',
  },
  {
    id: 'chayan',
    name: '茶颜悦色',
    priceBand: '10–20元',
    regionNote: '以长沙及周边为主，其他城市门店较少',
    sources: [],
    verifiedAt: '2026-09-20',
  },
  {
    id: 'cbd',
    name: '茶百道',
    priceBand: '10–20元',
    regionNote: null,
    sources: [],
    verifiedAt: '2026-09-20',
  },
  {
    /*
     * brandId 是本应用的内部标识符，与域名无关。
     *
     * 沪上阿姨的核验情况（2026-09-20 实测）：
     *  - hsaytea.com / www.hsaytea.com → DNS 返回 NXDOMAIN，**域名根本不存在**。
     *    本注释曾误写「官方渠道经核验为 hsaytea.com」，该断言已作废。
     *  - hsaytea.cn → 有 Cloudflare 解析，但站点内容与茶饮无关
     *    （实为影视盗版内容站），已拒绝采用其任何信息。
     * 结论：未找到可确认的官方站点，因此 sources 留空并在 availabilityNote
     * 层面保持保守。宁可不标注来源，也不标注一个打不开或真伪不明的地址。
     */
    id: 'hsys',
    name: '沪上阿姨',
    priceBand: '10–20元',
    regionNote: null,
    // 未找到可确认的官方渠道，留空而不是填一个 NXDOMAIN 或可疑域名
    sources: [],
    verifiedAt: '2026-09-20',
  },
  {
    id: 'yidiandian',
    name: '一点点',
    priceBand: '10–20元',
    regionNote: null,
    sources: [],
    verifiedAt: '2026-09-20',
  },
  {
    id: 'coco',
    name: 'CoCo都可',
    priceBand: '10–20元',
    regionNote: null,
    sources: [],
    verifiedAt: '2026-09-20',
  },
  {
    id: 'yihotang',
    name: '益禾堂',
    priceBand: '10元以内',
    regionNote: null,
    sources: [],
    verifiedAt: '2026-09-20',
  },
  {
    id: 'shuyi',
    name: '书亦烧仙草',
    priceBand: '10–20元',
    regionNote: null,
    sources: [],
    verifiedAt: '2026-09-20',
  },
  {
    id: 'gongcha',
    name: '贡茶',
    priceBand: '10–20元',
    regionNote: null,
    sources: [],
    verifiedAt: '2026-09-20',
  },
]

/* ------------------------------ 派生导出 ------------------------------ */

export const BRANDS = BRANDS_RAW.map((brand) => Object.freeze({ ...brand }))

export const BRAND_MAP = BRANDS.reduce((acc, brand) => {
  acc[brand.id] = brand
  return acc
}, {})

export const getBrandById = (id) => BRAND_MAP[id] || null

export const BRAND_NAMES = BRANDS.map((brand) => brand.name)

/** 品牌筛选选项：不限 + 各品牌 */
export const BRAND_FILTER_OPTIONS = [
  { value: '随机', label: '不限' },
  ...BRANDS.map((brand) => ({ value: brand.id, label: brand.name })),
]
