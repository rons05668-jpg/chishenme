/**
 * 饮品轻量元数据（枚举 / 品类 emoji / 筛选默认值）
 * ------------------------------------------------------------------
 * 209KB 的 DRINKS 大表（src/data/drinks.js）只在饮品页 chunk 里加载，
 * 但 storage.js 在应用启动时就要做饮料偏好校验与历史归一化——它只需要
 * 这些枚举，不需要大表。把枚举独立成这个小模块，首屏 chunk 就不再被
 * DRINKS 拖大。
 *
 * 注意：drinks.js 保持原样（内含同一套枚举的字面量定义），不在此 re-export。
 * 两处字面量由 tests/unit/drinks-meta-parity.test.cjs 强制保证一致：
 * 改枚举时两处同步改，单测会拦住不一致。
 * 不要把数据段（DRINKS_RAW）搬到这里来——merge-drinks.cjs 的注入标记
 * 只包着 drinks.js 里的数据段。
 */

/* ------------------------------- 枚举 ------------------------------- */

/**
 * 饮品主分类。判定规则见 brands.js 的 DRINK_CATEGORY_RULES。
 * 「鲜奶茶」与「奶茶」的区别必须有原料或官方分类依据，否则归「奶茶」。
 */
export const DRINK_CATEGORIES = ['奶茶', '鲜奶茶', '果茶', '纯茶', '奶类饮品', '咖啡', '其他']

/** 冷热选项 */
export const TEMPERATURES = ['冰', '常温', '热']

/** 甜度选项 */
export const SUGAR_LEVELS = ['无糖', '少糖', '正常糖']

/**
 * 咖啡因状态。
 * 注意：'unknown' 是合法且常见的值——纯茶/果茶/奶茶不得默认为无咖啡因。
 */
export const CAFFEINE_LEVELS = ['无咖啡因', '低咖啡因', '高咖啡因', 'unknown']

/** 场景（与食物共用同一组场景语义） */
export const DRINK_SCENES = ['食堂', '外卖', '出去吃']

/**
 * 价格档位（饮品价格整体低于正餐）。
 * 价格缺失（priceStatus !== 'known'）的饮品不参与任何价格档位的「命中」，
 * 也就是说用户选了某个预算档时，价格未知的饮品会被排除——这是刻意的，
 * 因为无法确认它是否落在预算内，不能假装它满足条件。
 */
export const DRINK_BUDGETS = [
  { key: 'any', label: '不限', min: 0, max: Infinity },
  { key: 'cheap', label: '10元以内', min: 0, max: 10 },
  { key: 'mid', label: '10–20元', min: 10, max: 20 },
  { key: 'high', label: '20元以上', min: 20, max: Infinity },
]

/** 忌口（饮品维度的常见限制） */
export const DRINK_EXCLUSIONS = ['咖啡因', '乳制品', '冰', '高糖', '酒精']

/**
 * 价格来源等级。
 * 品牌官网不公示价格是普遍现象（茶百道/沪上阿姨/益禾堂/书亦/一点点/CoCo/贡茶
 * 均如此）。此时只能退而使用第三方菜单聚合站，但**必须显式标注为二手来源**，
 * 否则等于把未经官方确认的数字包装成官方价——这比留空更糟。
 */
export const PRICE_STATUS = {
  official: 'official',
  thirdParty: 'thirdParty',
  unpublished: 'unpublished',
}

/* --------------------------- 品类 emoji --------------------------- */

export const CATEGORY_EMOJI = {
  奶茶: '🧋',
  鲜奶茶: '🥛',
  果茶: '🍹',
  纯茶: '🍵',
  奶类饮品: '🥤',
  咖啡: '☕',
  其他: '🥤',
}

/** 取饮品展示用 emoji（按品类，永不返回空值） */
export const drinkEmoji = (drink) => CATEGORY_EMOJI[drink?.category] || '🥤'

/* ------------------------- 筛选状态元数据 ------------------------- */

/** 默认筛选值 */
export const DRINK_DEFAULT_FILTERS = {
  brand: '随机',
  budgetKey: 'any',
  temperature: '随机',
  category: '随机',
  scene: '随机',
  sugar: '随机',
  caffeine: '随机',
}

/** 除忌口外的「普通筛选」字段 */
export const DRINK_NORMAL_FILTER_KEYS = [
  'brand',
  'budgetKey',
  'temperature',
  'category',
  'scene',
  'sugar',
  'caffeine',
]

/* ------------------------- 饮料懒查询（降级版） ------------------------- */

/**
 * 按 id 查饮品。
 * ------------------------------------------------------------------
 * DRINKS 大表只在饮品页 chunk 里加载，首屏初始化时不可用。
 * 因此这里恒返回 null，调用方（storage.js 的归一化函数）用记录自带
 * 的展示字段 + 静态兜底（见 drinkEmoji），行为降级但绝不抛错。
 * 记录在创建时就存了 name/emoji，所以实践中这个降级路径几乎走不到。
 */
export function getDrinkById() {
  return null
}
