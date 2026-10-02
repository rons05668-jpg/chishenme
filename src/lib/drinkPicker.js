/**
 * 饮料推荐逻辑
 * ------------------------------------------------------------------
 * 与食物 picker.js 平行的一套逻辑，复用其通用工具（shuffle / daysSinceLastEaten /
 * groupHistoryByDay / formatTime），只新写饮料特有的筛选与权重部分。
 *
 * 1. respectsDrinkExclusions  按「咖啡因 / 乳制品 / 冰 / 高糖」判断忌口，优先级最高
 * 2. filterDrinks             按预算 / 冷热 / 类型 / 场景 / 甜度 / 咖啡因筛选
 * 3. weightOfDrink            依据「最近喝过」「本次不喜欢」「收藏」计算权重
 * 4. pickDrink                加权随机抽一个结果
 * 5. sampleDrinks             加权不放回抽样，用于生成转盘候选
 *
 * 注意：历史与收藏的 id 空间是饮料自己的（id 带 `drink-` 前缀），不会与食物冲突。
 */

import { DRINKS, DRINK_BUDGETS, matchDrinkBudget } from '../data/drinks'
import { getBrandById } from '../data/brands'
import { daysSinceLastEaten, shuffle } from './picker'
/** 含奶饮品的名称特征（拿铁 / 卡布奇诺 / 摩卡等咖啡类） */
const MILKY_NAME_PATTERN = /拿铁|卡布奇诺|摩卡/

/** 额外标注为含奶的茶饮（名称与描述里都不含「奶」字，只能显式列举） */
const MILKY_DRINK_IDS = ['drink-naicha', 'drink-hongcha-nai']

/** 收集一条饮料的全部可判定文本，用于关键词匹配 */
const drinkText = (drink) => `${drink.name}${drink.desc}${drink.id}`

/** 该饮料是否含奶 */
function containsDairy(drink) {
  if (drink.category === '乳制品') return true
  if (drink.category === '咖啡' && MILKY_NAME_PATTERN.test(drink.name)) return true
  if (MILKY_DRINK_IDS.includes(drink.id)) return true
  return /奶/.test(drinkText(drink))
}

/** 该饮料是否只提供冰的（不适合要「不要冰」的人） */
const onlyServedIced = (drink) =>
  drink.temperatures.length === 1 && drink.temperatures[0] === '冰'

/**
 * 忌口标签 -> 判定函数，一条饮料命中任一判定即被排除。
 *
 * 「高糖」的口径需要非常小心，这里遵循两条硬约束的平衡：
 *  1. 需求规定「配料无法确认时严格排除模式应保守」；
 *  2. 但也不能把「数据缺失」直接当成「高糖」——那会让 180 条常驻饮品
 *     全部出局，一个勾选就把功能锁死，等于用臆造的结论换掉可用性。
 * 因此：**只在数据明确显示该饮品提供「正常糖」时才判定为高糖**。
 * 糖度未知的饮品既不断言高糖、也不声称安全，界面必须同时给出
 * 「糖度信息未公示，建议向门店确认」的提示（见 DRINK_EXCLUSION_NOTES）。
 * 早先这里误用 `drink.sugar`（数据字段实为 sweetness），导致该忌口完全失效。
 */
const EXCLUSION_RULES = {
  咖啡因: (drink) => drink.caffeine !== '无咖啡因',
  乳制品: (drink) => containsDairy(drink),
  冰: (drink) => onlyServedIced(drink),
  高糖: (drink) => drink.sweetness.includes('正常糖'),
}

/** 各忌口项的数据局限性说明，用于界面诚实告知（不得静默） */
export const DRINK_EXCLUSION_NOTES = {
  高糖: '糖度以品牌公示为准；多数品牌未公示糖度选项，未公示的不会被自动排除，甜度请以门店为准',
}

/* ------------------------------ 筛选 ------------------------------ */

/**
 * 判断饮料是否满足全部忌口要求。
 * 忌口优先级最高：不满足即直接出局，不参与后续任何筛选与加权。
 */
export function respectsDrinkExclusions(drink, exclusions = []) {
  return !exclusions.some((tag) => {
    const rule = EXCLUSION_RULES[tag]
    return rule ? rule(drink) : false
  })
}

/** 条件筛选；'随机' 或 'any' 视为不限制 */
export function filterDrinks(filters = {}) {
  const {
    budget,
    temperature,
    category,
    scene,
    sugar,
    caffeine,
    brand,
    exclusions = [],
  } = filters
  return DRINKS.filter((drink) => {
    if (!respectsDrinkExclusions(drink, exclusions)) return false
    if (!isRecommendable(drink)) return false
    if (!matchDrinkBudget(drink, budget)) return false
    if (brand && brand !== '随机' && drink.brandId !== brand) return false
    if (temperature && temperature !== '随机' && !drink.temperatures.includes(temperature)) return false
    if (category && category !== '随机' && drink.category !== category) return false
    if (scene && scene !== '随机' && !drink.scenes.includes(scene)) return false
    // 糖度：sweetness 是「该饮品官方公示提供的糖度选项」数组。
    // 用户选「无糖」= 要求该饮品能做成无糖，而不是声称整杯无糖（需求明确禁止后者表述）。
    if (sugar && sugar !== '随机' && !drink.sweetness.includes(sugar)) return false
    if (caffeine && caffeine !== '随机' && drink.caffeine !== caffeine) return false
    return true
  })
}

/**
 * 该饮品是否默认可参与推荐。
 *
 * 严格遵循需求：
 *  - 已确认下架（discontinued）→ 不进推荐池
 *  - 在售状态无法确认（unknown）→ 不进推荐池
 *  - 季节 / 区域限定 → 默认不进，由 UI 上的独立开关控制
 * 因此默认只有 permanent 参与随机与转盘。
 */
export function isRecommendable(drink) {
  return drink?.availability === 'permanent'
}

/** 候选池中因在售状态/限定原因被排除的饮品（供数据说明与检查使用） */
export function nonRecommendableDrinks() {
  return DRINKS.filter((drink) => !isRecommendable(drink))
}

/* ------------------------------ 权重 ------------------------------ */

/**
 * 计算单个饮料的权重
 * - 最近 3 天内喝过：明显降权（越近降得越狠）
 * - 本次使用中点过「这个不要」：大幅降权
 * - 收藏过：轻微加权
 * - 很久没喝：轻微加权，增加新鲜感
 */
export function weightOfDrink(drink, { history = [], dislikes = [], favorites = [] } = {}) {
  let weight = 100

  const days = daysSinceLastEaten(drink.id, history)
  if (days === 0) weight *= 0.06
  else if (days === 1) weight *= 0.18
  else if (days === 2) weight *= 0.4
  else if (days <= 6) weight *= 0.75
  else if (days > 14) weight *= 1.15

  if (dislikes.includes(drink.id)) weight *= 0.1
  if (favorites.includes(drink.id)) weight *= 1.25

  return weight
}

/** 把候选列表转换成带权重的数组（内部使用） */
function buildDrinkWeights(pool, context = {}) {
  return pool.map((drink) => ({ food: drink, weight: weightOfDrink(drink, context) }))
}

function weightedPickDrink(entries) {
  const total = entries.reduce((sum, entry) => sum + entry.weight, 0)
  if (total <= 0) {
    return entries.length ? entries[Math.floor(Math.random() * entries.length)].food : null
  }
  let ticket = Math.random() * total
  for (const entry of entries) {
    ticket -= entry.weight
    if (ticket <= 0) return entry.food
  }
  return entries[entries.length - 1].food
}

/** 加权随机抽一个饮料（在「已选定品牌」的候选池内） */
export function pickDrink(pool, context = {}) {
  if (!pool.length) return null
  return weightedPickDrink(buildDrinkWeights(pool, context))
}

/**
 * 从候选池中抽一个饮品——采用「先选品牌，再选品牌内饮品」的两段式抽样。
 * ------------------------------------------------------------------
 * 为什么需要这一步：
 *   若直接在全部候选上做加权随机，收录条目多的品牌（例如某品牌有 12 款、
 *   另一个只有 6 款）被抽中的概率会明显偏高。品牌优先抽样让每个「有候选的
 *   品牌」先获得等概率的品牌席位，再在其内部挑选具体饮品，避免大目录品牌
 *   因条目数量而系统性占优。
 *
 * 品牌内部仍然使用加权（最近喝过降权、收藏加权等），所以结果不是纯均匀随机。
 * 当候选只覆盖单一品牌时，退化为该品牌内部的加权随机。
 */
export function pickDrinkByBrand(pool, context = {}) {
  if (!pool.length) return null

  // 1. 按 brandId 分组
  const groups = new Map()
  for (const drink of pool) {
    const key = drink.brandId || '__unknown__'
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(drink)
  }

  // 2. 品牌等概率选一个（只统计「有候选的品牌」）
  const brandKeys = Array.from(groups.keys())
  const brandKey = brandKeys[Math.floor(Math.random() * brandKeys.length)]

  // 3. 在选定品牌内部做加权随机
  return weightedPickDrink(buildDrinkWeights(groups.get(brandKey), context))
}

/**
 * 加权不放回抽样，用于生成转盘候选。
 * 结果随机打乱，避免权重高的饮料总是排在同一个位置。
 */
export function sampleDrinks(pool, count, context = {}) {
  if (pool.length <= count) return shuffle(pool)
  const remaining = buildDrinkWeights(pool, context)
  const picked = []
  while (picked.length < count && remaining.length) {
    const chosen = weightedPickDrink(remaining)
    picked.push(chosen)
    const index = remaining.findIndex((entry) => entry.food.id === chosen.id)
    remaining.splice(index, 1)
  }
  return shuffle(picked)
}

/**
 * 转盘只从严格筛选结果中抽取；条件外的饮料一律不补入。
 * 候选不足时也不放宽，宁可转盘扇区少一些。
 * @param {object} filters   picker 结构筛选条件
 * @param {object} context   { history, dislikes, favorites }
 * @param {number} maxCount  最多返回的候选数量
 */
export function buildDrinkWheelPool(filters = {}, context = {}, maxCount = 10) {
  const primary = filterDrinks(filters)
  return sampleDrinksByBrand(primary, Math.min(maxCount, primary.length), context)
}

/**
 * 按品牌分层的不放回抽样，用于转盘候选。
 * 与 pickDrinkByBrand 保持同一套「品牌优先」规则，确保转盘扇区构成与
 * 随机推荐的落点逻辑一致——否则转盘上大目录品牌的扇区会明显更多。
 * 做法：轮转遍历各品牌（每个品牌内部先打乱），依次取一条，直到取满。
 */
export function sampleDrinksByBrand(pool, count, context = {}) {
  if (pool.length <= count) return shuffle(pool)

  const groups = new Map()
  for (const drink of pool) {
    const key = drink.brandId || '__unknown__'
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(drink)
  }

  // 品牌内按权重降序（等价于加权后的优先次序），品牌之间轮转取样
  const queues = Array.from(groups.values()).map((list) =>
    buildDrinkWeights(list, context)
      .sort((a, b) => b.weight - a.weight)
      .map((entry) => entry.food)
  )

  const picked = []
  let cursor = 0
  while (picked.length < count && queues.some((queue) => queue.length)) {
    const queue = queues[cursor % queues.length]
    if (queue.length) picked.push(queue.shift())
    cursor += 1
  }
  return shuffle(picked)
}

/* --------------------------- 筛选状态工具 --------------------------- */

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

/** 各字段对应的中文名，用于摘要与放宽建议文案 */
const DRINK_FIELD_LABELS = {
  brand: '品牌',
  budgetKey: '预算',
  temperature: '冷热',
  category: '类型',
  scene: '场景',
  sugar: '甜度',
  caffeine: '咖啡因',
}

/** 把 UI 上的筛选状态转换成推荐算法需要的结构 */
export function toDrinkPickerFilters(filters) {
  return {
    budget: DRINK_BUDGETS.find((item) => item.key === filters.budgetKey) || DRINK_BUDGETS[0],
    brand: filters.brand,
    temperature: filters.temperature,
    category: filters.category,
    scene: filters.scene,
    sugar: filters.sugar,
    caffeine: filters.caffeine,
    exclusions: filters.exclusions || [],
  }
}

/** 某个普通筛选字段是否处于「已限制」状态（非随机 / 非不限） */
export function isDrinkFilterActive(key, filters) {
  if (!filters) return false
  if (key === 'budgetKey') return filters.budgetKey && filters.budgetKey !== 'any'
  return filters[key] && filters[key] !== '随机'
}

/** 当前生效的普通筛选字段列表（不含忌口） */
export function activeDrinkFilterKeys(filters) {
  return DRINK_NORMAL_FILTER_KEYS.filter((key) => isDrinkFilterActive(key, filters))
}

/** 取某字段当前值对应的展示文案 */
function drinkValueLabel(key, filters) {
  if (key === 'budgetKey') {
    const budget = DRINK_BUDGETS.find((item) => item.key === filters.budgetKey)
    return budget ? budget.label : '不限'
  }
  if (key === 'brand') {
    const brand = getBrandById(filters.brand)
    return brand ? brand.name : '不限'
  }
  return filters[key]
}

/**
 * 一行文字概括当前条件（含忌口），用于随机页 / 转盘页折叠状态下展示。
 * 只列出「已限制」的普通条件，未设置的显示为「不限」占位，避免摘要过长。
 */
export function summarizeDrinkFilters(filters) {
  const parts = []
  const budget = DRINK_BUDGETS.find((item) => item.key === filters?.budgetKey)
  parts.push(budget && budget.key !== 'any' ? budget.label : '预算不限')
  const actives = activeDrinkFilterKeys(filters)
  if (actives.length === 0) {
    parts.push('其他不限')
  } else {
    actives.forEach((key) => {
      if (key === 'budgetKey') return
      parts.push(drinkValueLabel(key, filters))
    })
  }
  const exclusions = filters?.exclusions || []
  if (exclusions.length) parts.push(...exclusions.map((tag) => `不喝${tag}`))
  return parts.join(' · ')
}

/** 已选条件的结构化摘要，便于在 UI 上逐条展示 */
export function describeActiveDrinkFilters(filters) {
  return activeDrinkFilterKeys(filters).map((key) => ({
    key,
    label: DRINK_FIELD_LABELS[key],
    value: drinkValueLabel(key, filters),
  }))
}

/** 把单个字段重置为默认值，返回补丁对象 */
export function resetDrinkFilterPatch(key) {
  return { [key]: DRINK_DEFAULT_FILTERS[key] }
}

/**
 * 零候选时推导「具体放宽建议」。
 * ------------------------------------------------------------------
 * 严格约束：
 *  - 只针对「普通筛选」字段给出建议，**绝不建议放宽忌口**
 *  - 只用于「提示」，由用户点击后再应用，不自动生效
 *  - 不补入任何条件外的饮料
 *
 * @param {object} filters   当前 UI 筛选（含 exclusions）
 * @param {Function} countFor 传入候选筛选对象，返回候选数量（由调用方注入 filterDrinks）
 * @returns {{ key: string, label: string, from: string, gain: number, patch: object }[]}
 */
export function suggestDrinkRelaxations(filters, countFor) {
  const actives = activeDrinkFilterKeys(filters).filter((key) => key !== 'budgetKey')
  const hasBudget = isDrinkFilterActive('budgetKey', filters)
  const suggestions = []

  const tryRelax = (key) => {
    const patch = resetDrinkFilterPatch(key)
    const next = { ...filters, ...patch }
    const gain = countFor(next) - countFor(filters)
    if (gain > 0) {
      suggestions.push({
        key,
        label: DRINK_FIELD_LABELS[key],
        from: drinkValueLabel(key, filters),
        gain,
        patch,
      })
    }
  }

  actives.forEach(tryRelax)
  if (hasBudget) {
    const patch = resetDrinkFilterPatch('budgetKey')
    const next = { ...filters, ...patch }
    const gain = countFor(next) - countFor(filters)
    if (gain > 0) {
      suggestions.push({
        key: 'budgetKey',
        label: '预算',
        from: drinkValueLabel('budgetKey', filters),
        gain,
        patch,
      })
    }
  }

  // 收益从大到小，最多展示 3 条，避免信息过载
  return suggestions.sort((a, b) => b.gain - a.gain).slice(0, 3)
}

/** 重新导出，供饮料侧组件直接取用，避免多处 import 来源 */
export { daysSinceLastEaten, groupHistoryByDay, formatTime } from './picker'
