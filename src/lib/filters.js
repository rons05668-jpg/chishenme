/**
 * 筛选条件的默认值与转换工具
 */

import { BUDGETS } from '../data/foods'

export const DEFAULT_FILTERS = {
  budgetKey: 'any',
  taste: '随机',
  category: '随机',
  scene: '随机',
  cuisine: '随机',
  meal: '随机',
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

/** 一行文字概括当前条件，用于转盘页折叠状态下展示 */
export function summarizeFilters(filters) {
  const budget = BUDGETS.find((item) => item.key === filters.budgetKey)
  const parts = [
    budget && budget.key !== 'any' ? budget.label : '预算不限',
    filters.taste,
    filters.category,
    filters.scene,
    filters.cuisine,
    filters.meal,
    ...(filters.exclusions || []).map((tag) => '不吃' + tag),
  ]
  return parts.filter(Boolean).join(' · ')
}
