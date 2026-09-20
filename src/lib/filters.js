/**
 * 筛选条件的默认值、转换与「摘要 / 放宽建议」工具
 */

import { BUDGETS, CATEGORIES, CUISINES, MEALS, SCENES, TASTES } from '../data/foods'

export const DEFAULT_FILTERS = {
  budgetKey: 'any',
  taste: '随机',
  category: '随机',
  scene: '随机',
  cuisine: '随机',
  meal: '随机',
}

/** 除忌口外的「普通筛选」字段，重置时只清这些，不动忌口 */
export const NORMAL_FILTER_KEYS = ['budgetKey', 'taste', 'category', 'scene', 'cuisine', 'meal']

/** 各字段对应的中文名，用于摘要与放宽建议文案 */
const FIELD_LABELS = {
  budgetKey: '预算',
  taste: '口味',
  category: '类型',
  scene: '场景',
  cuisine: '风味',
  meal: '时段',
}

/** 把 UI 上的筛选状态转换成推荐算法需要的结构 */
export function toPickerFilters(filters) {
  return {
    budget: BUDGETS.find((item) => item.key === filters.budgetKey) || BUDGETS[0],
    taste: filters.taste,
    category: filters.category,
    scene: filters.scene,
    cuisine: filters.cuisine,
    meal: filters.meal,
    exclusions: filters.exclusions || [],
  }
}

/** 某个普通筛选字段是否处于「已限制」状态（非随机 / 非不限） */
export function isFilterActive(key, filters) {
  if (!filters) return false
  if (key === 'budgetKey') return filters.budgetKey && filters.budgetKey !== 'any'
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
  const pick = (value, allowed, fallback) => (allowed.includes(value) ? value : fallback)
  return {
    budgetKey: pick(source.budgetKey, budgetKeys, DEFAULT_FILTERS.budgetKey),
    taste: pick(source.taste, [...TASTES, '随机'], DEFAULT_FILTERS.taste),
    category: pick(source.category, [...CATEGORIES, '随机'], DEFAULT_FILTERS.category),
    scene: pick(source.scene, [...SCENES, '随机'], DEFAULT_FILTERS.scene),
    cuisine: pick(source.cuisine, [...CUISINES, '随机'], DEFAULT_FILTERS.cuisine),
    meal: pick(source.meal, [...MEALS, '随机'], DEFAULT_FILTERS.meal),
  }
}
