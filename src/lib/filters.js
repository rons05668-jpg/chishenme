/**
 * 筛选条件的默认值、转换与「摘要 / 放宽建议」工具
 */

import { BUDGETS, CATEGORIES, CUISINES, MEALS, REGIONS, SCENES, TASTES } from '../data/foods'

export const DEFAULT_FILTERS = {
  budgetKey: 'any',
  taste: '随机',
  category: '随机',
  scene: '随机',
  cuisine: '随机',
  meal: '随机',
  // 地点默认「平时」（国内条目）。国内随机永远不出海外店铺。
  region: 'local',
}

/** 除忌口外的「普通筛选」字段，重置时只清这些，不动忌口 */
export const NORMAL_FILTER_KEYS = ['budgetKey', 'taste', 'category', 'scene', 'cuisine', 'meal', 'region']

/** 各字段对应的中文名，用于摘要与放宽建议文案 */
const FIELD_LABELS = {
  budgetKey: '预算',
  taste: '口味',
  category: '类型',
  scene: '场景',
  cuisine: '风味',
  meal: '时段',
  region: '地点',
}

/** 把 UI 上的筛选状态转换成推荐算法需要的结构 */
export function toPickerFilters(filters = {}) {
  return {
    budget: BUDGETS.find((item) => item.key === filters.budgetKey) || BUDGETS[0],
    taste: filters.taste,
    category: filters.category,
    scene: filters.scene,
    cuisine: filters.cuisine,
    meal: filters.meal,
    region: filters.region,
    exclusions: filters.exclusions || [],
  }
}

/** 某个普通筛选字段是否处于「已限制」状态（非随机 / 非不限） */
export function isFilterActive(key, filters) {
  if (!filters) return false
  if (key === 'budgetKey') return filters.budgetKey && filters.budgetKey !== 'any'
  // 「平时」是地点维度的默认值，与预算的 'any' 同构，不算已限制条件
  if (key === 'region') return Boolean(filters.region) && filters.region !== DEFAULT_FILTERS.region
  return filters[key] && filters[key] !== '随机'
}

/** 当前生效的普通筛选字段列表（不含忌口） */
export function activeFilterKeys(filters) {
  return NORMAL_FILTER_KEYS.filter((key) => isFilterActive(key, filters))
}

/** 取某字段当前值对应的展示文案 */
function valueLabel(key, filters) {
  if (key === 'budgetKey') {
    const budget = BUDGETS.find((item) => item.key === filters.budgetKey)
    return budget ? budget.label : '不限'
  }
  // 地点存的是 key，展示要用中文 label（如 parsons-nyc → 纽约·Parsons）
  if (key === 'region') {
    const region = REGIONS.find((item) => item.key === filters.region)
    return region ? region.label : DEFAULT_FILTERS.region
  }
  return filters[key]
}

/**
 * 一行文字概括当前条件（含忌口），用于随机页 / 转盘页折叠状态下展示。
 * 只列出「已限制」的普通条件，未设置的显示为「不限」占位，避免摘要过长。
 */
export function summarizeFilters(filters) {
  const parts = []
  const budget = BUDGETS.find((item) => item.key === filters?.budgetKey)
  parts.push(budget && budget.key !== 'any' ? budget.label : '预算不限')
  const actives = activeFilterKeys(filters)
  if (actives.length === 0) {
    parts.push('其他不限')
  } else {
    actives.forEach((key) => {
      if (key === 'budgetKey') return
      parts.push(valueLabel(key, filters))
    })
  }
  const exclusions = filters?.exclusions || []
  if (exclusions.length) parts.push(...exclusions.map((tag) => `不吃${tag}`))
  return parts.join(' · ')
}

/** 已选条件的结构化摘要，便于在 UI 上逐条展示 */
export function describeActiveFilters(filters) {
  return activeFilterKeys(filters).map((key) => ({
    key,
    label: FIELD_LABELS[key],
    value: valueLabel(key, filters),
  }))
}

/** 把单个字段重置为默认值，返回补丁对象 */
export function resetFilterPatch(key) {
  return { [key]: DEFAULT_FILTERS[key] }
}

/**
 * 零候选时推导「具体放宽建议」。
 * ------------------------------------------------------------------
 * 严格约束：
 *  - 只针对「普通筛选」字段给出建议，**绝不建议放宽忌口**
 *  - 只用于「提示」，由用户点击后再应用，不自动生效
 *  - 不补入任何条件外的食物
 *
 * @param {object} filters        当前 UI 筛选（含 exclusions）
 * @param {Function} countFor     传入候选筛选对象，返回候选数量（由调用方注入 filterFoods）
 * @returns {{ key: string, label: string, from: string, gain: number, patch: object }[]}
 */
export function suggestRelaxations(filters, countFor) {
  const actives = activeFilterKeys(filters).filter((key) => key !== 'budgetKey')
  const hasBudget = isFilterActive('budgetKey', filters)
  const suggestions = []

  const tryRelax = (key) => {
    const patch = resetFilterPatch(key)
    const next = { ...filters, ...patch }
    const gain = countFor(next) - countFor(filters)
    if (gain > 0) {
      suggestions.push({
        key,
        label: FIELD_LABELS[key],
        from: valueLabel(key, filters),
        gain,
        patch,
      })
    }
  }

  actives.forEach(tryRelax)
  if (hasBudget) {
    const patch = resetFilterPatch('budgetKey')
    const next = { ...filters, ...patch }
    const gain = countFor(next) - countFor(filters)
    if (gain > 0) {
      suggestions.push({
        key: 'budgetKey',
        label: '预算',
        from: valueLabel('budgetKey', filters),
        gain,
        patch,
      })
    }
  }

  // 收益从大到小，最多展示 3 条，避免信息过载
  return suggestions.sort((a, b) => b.gain - a.gain).slice(0, 3)
}

/** 校验并规整筛选偏好（无 storage 依赖，供纯函数测试使用） */
export function normalizeFilters(raw) {
  const source = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {}
  const budgetKeys = BUDGETS.map((item) => item.key)
  const regionKeys = REGIONS.map((item) => item.key)
  const pick = (value, allowed, fallback) => (allowed.includes(value) ? value : fallback)
  return {
    budgetKey: pick(source.budgetKey, budgetKeys, DEFAULT_FILTERS.budgetKey),
    taste: pick(source.taste, [...TASTES, '随机'], DEFAULT_FILTERS.taste),
    category: pick(source.category, [...CATEGORIES, '随机'], DEFAULT_FILTERS.category),
    scene: pick(source.scene, [...SCENES, '随机'], DEFAULT_FILTERS.scene),
    cuisine: pick(source.cuisine, [...CUISINES, '随机'], DEFAULT_FILTERS.cuisine),
    meal: pick(source.meal, [...MEALS, '随机'], DEFAULT_FILTERS.meal),
    // 旧数据没有 region 字段，pick 会落到 'local'，因此老用户偏好零迁移
    region: pick(source.region, regionKeys, DEFAULT_FILTERS.region),
  }
}

/**
 * 零候选 / 候选过少时的地点维度补充说明。
 * ------------------------------------------------------------------
 * 切到海外地点后候选池天然比「平时」小得多，用户很容易误以为数据丢了，
 * 这里显式说明原因，并给出「切回平时」这个可行动作。
 * 「平时」下返回空串，不干扰原有文案。
 */
export function regionPoolNote(filters) {
  const key = filters?.region
  if (!key || key === DEFAULT_FILTERS.region) return ''
  const region = REGIONS.find((item) => item.key === key)
  if (!region) return ''
  return `当前地点是「${region.label}」，可选店铺本来就比「平时」少；放宽其他条件或切回「平时」都能增加候选。`
}
