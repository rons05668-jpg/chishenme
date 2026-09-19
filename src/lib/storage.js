/**
 * 本地持久化封装（localStorage / sessionStorage）
 * 所有 key 统一加前缀，避免与其他应用冲突；读写都做了异常兜底，
 * 隐私模式或存储被禁用时不会导致应用崩溃。
 */

const PREFIX = 'tqsc:v1:'
const KEYS = {
  history: `${PREFIX}history`,
  favorites: `${PREFIX}favorites`,
  dislikes: `${PREFIX}dislikes`,
  stats: `${PREFIX}stats`,
}

function safeParse(raw, fallback) {
  if (!raw) return fallback
  try {
    const parsed = JSON.parse(raw)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

function readLocal(key, fallback) {
  try {
    return safeParse(window.localStorage.getItem(key), fallback)
  } catch {
    return fallback
  }
}

function writeLocal(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

function readSession(key, fallback) {
  try {
    return safeParse(window.sessionStorage.getItem(key), fallback)
  } catch {
    return fallback
  }
}

function writeSession(key, value) {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* 忽略：会话存储不可用时功能降级，不影响主流程 */
  }
}

/* ----------------------------- 历史记录 ----------------------------- */

export const MAX_HISTORY = 60

export function loadHistory() {
  const list = readLocal(KEYS.history, [])
  return Array.isArray(list) ? list.filter((item) => item && item.id && item.ts) : []
}

export function saveHistory(list) {
  writeLocal(KEYS.history, list.slice(0, MAX_HISTORY))
}

export function createHistoryRecord(food) {
  const now = new Date()
  return {
    uid: `${now.getTime()}-${Math.random().toString(36).slice(2, 7)}`,
    id: food.id,
    name: food.name,
    emoji: food.emoji,
    category: food.category,
    taste: food.taste,
    ts: now.getTime(),
  }
}

/* ------------------------------- 收藏 ------------------------------- */

export function loadFavorites() {
  const list = readLocal(KEYS.favorites, [])
  return Array.isArray(list) ? list.filter((id) => typeof id === 'string') : []
}

export function saveFavorites(list) {
  writeLocal(KEYS.favorites, Array.from(new Set(list)))
}

/* --------------------------- 本次会话不喜欢 --------------------------- */

export function loadDislikes() {
  const list = readSession(KEYS.dislikes, [])
  return Array.isArray(list) ? list.filter((id) => typeof id === 'string') : []
}

export function saveDislikes(list) {
  writeSession(KEYS.dislikes, Array.from(new Set(list)))
}

/* ------------------------------ 统计 ------------------------------ */

export function loadStats() {
  return readLocal(KEYS.stats, { totalDecided: 0, firstUsedAt: null })
}

export function saveStats(stats) {
  writeLocal(KEYS.stats, stats)
}
