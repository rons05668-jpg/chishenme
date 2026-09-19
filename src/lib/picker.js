/**
 * 推荐核心逻辑
 * ------------------------------------------------------------------
 * 1. filterFoods  按预算 / 口味 / 类型 / 场景做条件筛选
 * 2. buildWeights 依据「最近吃过」「本次不喜欢」「收藏」计算权重
 * 3. pickFood     加权随机抽取一个结果
 * 4. sampleFoods  加权不放回抽样，用于生成转盘候选
 */

import { FOODS, matchBudget } from '../data/foods'

const DAY_MS = 24 * 60 * 60 * 1000

/** 条件筛选；'随机' 或 'any' 视为不限制 */
export function filterFoods(filters = {}) {
  const { budget, taste, category, scene } = filters
  return FOODS.filter((food) => {
    if (!matchBudget(food, budget)) return false
    if (taste && taste !== '随机' && food.taste !== taste) return false
    if (category && category !== '随机' && food.category !== category) return false
    if (scene && scene !== '随机' && !food.scenes.includes(scene)) return false
    return true
  })
}

/** 距离上次吃该食物过去了几天（从未吃过返回 Infinity） */
export function daysSinceLastEaten(foodId, history) {
  const last = history.find((item) => item.id === foodId)
  if (!last) return Infinity
  const diff = Date.now() - last.ts
  return Math.max(0, Math.floor(diff / DAY_MS))
}

/**
 * 计算单个食物的权重
 * - 最近 3 天内吃过：明显降权（越近降得越狠）
 * - 本次使用中点过「这个不要」：大幅降权
 * - 收藏过：轻微加权
 * - 很久没吃：轻微加权，增加新鲜感
 */
export function weightOf(food, { history = [], dislikes = [], favorites = [] } = {}) {
  let weight = 100

  const days = daysSinceLastEaten(food.id, history)
  if (days === 0) weight *= 0.06
  else if (days === 1) weight *= 0.18
  else if (days === 2) weight *= 0.4
  else if (days <= 6) weight *= 0.75
  else if (days > 14) weight *= 1.15

  if (dislikes.includes(food.id)) weight *= 0.1
  if (favorites.includes(food.id)) weight *= 1.25

  return weight
}

/** 把候选列表转换成带权重的数组（内部使用） */
function buildWeights(pool, context = {}) {
  return pool.map((food) => ({ food, weight: weightOf(food, context) }))
}

function weightedPick(entries) {
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

/** 加权随机抽一个食物 */
export function pickFood(pool, context = {}) {
  if (!pool.length) return null
  return weightedPick(buildWeights(pool, context))
}

/**
 * 加权不放回抽样，用于生成转盘候选。
 * 结果随机打乱，避免权重高的食物总是排在同一个位置。
 */
export function sampleFoods(pool, count, context = {}) {
  if (pool.length <= count) return shuffle(pool)
  const remaining = buildWeights(pool, context)
  const picked = []
  while (picked.length < count && remaining.length) {
    const chosen = weightedPick(remaining)
    picked.push(chosen)
    const index = remaining.findIndex((entry) => entry.food.id === chosen.id)
    remaining.splice(index, 1)
  }
  return shuffle(picked)
}

/** Fisher–Yates 洗牌（不修改原数组） */
export function shuffle(list) {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/**
 * 转盘候选：优先使用筛选结果；
 * 数量不足 8 个时，用「同口味 / 同类型」的食物补齐，保证转盘有 8–12 个扇区。
 */
export function buildWheelPool(filters = {}, context = {}, minCount = 8, maxCount = 12) {
  const primary = filterFoods(filters)

  if (primary.length >= minCount) {
    return sampleFoods(primary, Math.min(maxCount, primary.length), context)
  }

  // 候选不足：用相似度最高的食物补齐，保证转盘扇区数量足够
  const used = new Set(primary.map((food) => food.id))
  const extras = FOODS.filter((food) => !used.has(food.id)).sort(
    (a, b) => similarity(b, filters) - similarity(a, filters)
  )

  const filled = [...primary, ...extras.slice(0, minCount - primary.length)]
  return sampleFoods(filled, Math.min(maxCount, filled.length), context)
}

/** 与筛选条件的相似度，用于补齐候选时的排序 */
function similarity(food, filters = {}) {
  let score = 0
  if (filters.taste && filters.taste !== '随机' && food.taste === filters.taste) score += 2
  if (filters.category && filters.category !== '随机' && food.category === filters.category) score += 2
  if (filters.scene && filters.scene !== '随机' && food.scenes.includes(filters.scene)) score += 1
  if (matchBudget(food, filters.budget)) score += 1
  return score
}

/** 按照「今天 / 昨天 / 具体日期」分组历史记录 */
export function groupHistoryByDay(history) {
  const today = startOfDay(new Date())
  const groups = new Map()
  history.forEach((record) => {
    const day = startOfDay(new Date(record.ts))
    const key = day.getTime()
    if (!groups.has(key)) groups.set(key, { day, label: dayLabel(day, today), items: [] })
    groups.get(key).items.push(record)
  })
  return Array.from(groups.values()).sort((a, b) => b.day - a.day)
}

function startOfDay(date) {
  const copy = new Date(date)
  copy.setHours(0, 0, 0, 0)
  return copy
}

function dayLabel(day, today) {
  const diff = Math.round((today - day) / DAY_MS)
  if (diff === 0) return '今天'
  if (diff === 1) return '昨天'
  if (diff === 2) return '前天'
  if (day.getFullYear() === today.getFullYear()) {
    return `${day.getMonth() + 1}月${day.getDate()}日`
  }
  return `${day.getFullYear()}年${day.getMonth() + 1}月${day.getDate()}日`
}

export function formatTime(ts) {
  const date = new Date(ts)
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}
