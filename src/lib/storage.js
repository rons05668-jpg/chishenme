/**
 * 本地持久化封装（localStorage / sessionStorage）
 * ------------------------------------------------------------------
 * 设计要点：
 * 1. 所有 key 统一加前缀，避免与其他应用冲突。
 * 2. 读取一律做「结构 + 字段」校验，损坏或被外部篡改的数据会被安全丢弃，
 *    而不是让脏数据流入 UI 导致白屏。
 * 3. 写入失败（配额满 / 隐私模式 / 存储被禁用）会被感知并上报，
 *    由上层决定是否提示用户；存储不可用时应用仍可正常随机与转盘。
 * 4. 提供带格式版本的备份导出与导入，导入只做「合并去重」，绝不静默删除已有有效数据。
 */

import { BUDGETS, CATEGORIES, CUISINES, EXCLUSIONS, MEALS, REGIONS, SCENES, TASTES, getFoodById } from '../data/foods'
import { BRANDS } from '../data/brands'
import {
  CAFFEINE_LEVELS,
  DRINK_BUDGETS,
  DRINK_CATEGORIES,
  DRINK_EXCLUSIONS,
  DRINK_SCENES,
  SUGAR_LEVELS,
  TEMPERATURES,
  drinkEmoji,
  getDrinkById,
} from '../data/drinks'

const PREFIX = 'tqsc:v1:'

/**
 * 存储键表。
 * 前 6 个键（history / favorites / dislikes / stats / exclusions / filters）
 * 语义固定为「食物」，键名与数据格式不可改动——用户已有数据依赖它们。
 * 后 5 个 drink* 键为饮料专属命名空间，与食物完全隔离，互不影响。
 */
const KEYS = {
  history: `${PREFIX}history`,
  favorites: `${PREFIX}favorites`,
  dislikes: `${PREFIX}dislikes`,
  stats: `${PREFIX}stats`,
  exclusions: `${PREFIX}exclusions`,
  filters: `${PREFIX}filters`,
  drinkFavorites: `${PREFIX}drinkFavorites`,
  drinkHistory: `${PREFIX}drinkHistory`,
  drinkDislikes: `${PREFIX}drinkDislikes`,
  drinkFilters: `${PREFIX}drinkFilters`,
  drinkExclusions: `${PREFIX}drinkExclusions`,
  drinkStats: `${PREFIX}drinkStats`,
}

/* --------------------------- 存储可用性探测 --------------------------- */

/**
 * 一次性探测 localStorage 是否真的可写。
 * Safari 隐私模式下 localStorage 存在但 setItem 会抛异常，
 * 因此必须实际写一次才能判断。
 */
let localAvailable = null

export function isLocalAvailable() {
  if (localAvailable !== null) return localAvailable
  try {
    const probe = `${PREFIX}__probe__`
    window.localStorage.setItem(probe, '1')
    window.localStorage.removeItem(probe)
    localAvailable = true
  } catch {
    localAvailable = false
  }
  return localAvailable
}

/* ------------------------------ 读写底层 ------------------------------ */

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

/**
 * 写入 localStorage。
 * 返回 true 表示写入成功；false 表示失败（配额满 / 被禁用）。
 * 失败原因通过 reportWriteError 上报，供上层做一次性的用户提示。
 */
function writeLocal(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    reportWriteError(key, error)
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
    return true
  } catch (error) {
    reportWriteError(key, error)
    return false
  }
}

/* --------------------------- 写入失败上报机制 --------------------------- */

const writeErrorListeners = new Set()

/**
 * 订阅写入失败事件。返回取消订阅函数。
 * 上层（AppState）据此展示一次性的、不重复打扰的提示。
 */
export function onWriteError(listener) {
  writeErrorListeners.add(listener)
  return () => writeErrorListeners.delete(listener)
}

let lastReportAt = 0

function reportWriteError(key, error) {
  // 同一次会话内避免高频重复上报：写入失败通常意味着整体不可用，
  // 连续操作会触发多次 setItem，这里做节流，防止提示刷屏。
  const now = Date.now()
  if (now - lastReportAt < 1500) return
  lastReportAt = now
  writeErrorListeners.forEach((listener) => {
    try {
      listener({ key, error })
    } catch {
      /* 监听器自身异常不影响主流程 */
    }
  })
}

/* ------------------------------- 校验工具 ------------------------------- */

const isPlainObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value)
const isNonEmptyString = (value) => typeof value === 'string' && value.length > 0
const isFiniteNumber = (value) => typeof value === 'number' && Number.isFinite(value)

/** 取合法枚举值，不合法则回退到 fallback */
function pickEnum(value, allowed, fallback) {
  return allowed.includes(value) ? value : fallback
}

/** 取合法枚举值，不合法则回退到默认值（用于筛选偏好） */
function normalizeEnum(value, allowed, fallback) {
  return pickEnum(value, allowed, fallback)
}

/* ----------------------------- 历史记录 ----------------------------- */

export const MAX_HISTORY = 60

/**
 * 单条历史记录校验。
 * ------------------------------------------------------------------
 * 兼容性优先：只要求 id 与 ts 有效（这两个是还原记录的必要字段）。
 * 早期版本的历史记录可能没有 name / emoji / category / taste，
 * 这类记录必须保留——UI 端会通过 getFoodById(id) 还原完整信息，
 * 因缺少展示字段就丢弃用户历史是不可接受的。
 */
function isValidHistoryRecord(item) {
  if (!isPlainObject(item)) return false
  if (!isNonEmptyString(item.id)) return false
  if (!isFiniteNumber(item.ts)) return false
  return true
}

/** 补全历史记录的展示字段：优先用记录自带值，缺失时从食物库还原 */
function normalizeHistoryRecord(item) {
  const food = getFoodById(item.id)
  return {
    uid: isNonEmptyString(item.uid) ? item.uid : `${item.id}@${item.ts}`,
    id: item.id,
    name: isNonEmptyString(item.name) ? item.name : food?.name || item.id,
    emoji: isNonEmptyString(item.emoji) ? item.emoji : food?.emoji || '🍽️',
    category: isNonEmptyString(item.category) ? item.category : food?.category || '',
    taste: isNonEmptyString(item.taste) ? item.taste : food?.taste || '',
    ts: item.ts,
  }
}

export function loadHistory() {
  const list = readLocal(KEYS.history, [])
  if (!Array.isArray(list)) return []
  return list.filter(isValidHistoryRecord).slice(0, MAX_HISTORY).map(normalizeHistoryRecord)
}

export function saveHistory(list) {
  if (!Array.isArray(list)) return false
  return writeLocal(KEYS.history, list.filter(isValidHistoryRecord).slice(0, MAX_HISTORY))
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
  if (!Array.isArray(list)) return []
  return Array.from(new Set(list.filter(isNonEmptyString)))
}

export function saveFavorites(list) {
  if (!Array.isArray(list)) return false
  return writeLocal(KEYS.favorites, Array.from(new Set(list.filter(isNonEmptyString))))
}

/* ------------------------- 本次会话不喜欢 ------------------------- */

export function loadDislikes() {
  const list = readSession(KEYS.dislikes, [])
  if (!Array.isArray(list)) return []
  return Array.from(new Set(list.filter(isNonEmptyString)))
}

export function saveDislikes(list) {
  if (!Array.isArray(list)) return false
  return writeSession(KEYS.dislikes, Array.from(new Set(list.filter(isNonEmptyString))))
}

/* ------------------------------ 统计 ------------------------------ */

const DEFAULT_STATS = { totalDecided: 0, firstUsedAt: null }

/** 统计校验：字段类型不对就回退到默认值，避免出现 NaN 之类的展示 */
export function loadStats() {
  const raw = readLocal(KEYS.stats, DEFAULT_STATS)
  if (!isPlainObject(raw)) return { ...DEFAULT_STATS }
  return {
    totalDecided: isFiniteNumber(raw.totalDecided) && raw.totalDecided >= 0 ? Math.floor(raw.totalDecided) : 0,
    firstUsedAt: isFiniteNumber(raw.firstUsedAt) && raw.firstUsedAt > 0 ? raw.firstUsedAt : null,
  }
}

export function saveStats(stats) {
  if (!isPlainObject(stats)) return false
  const safe = {
    totalDecided: isFiniteNumber(stats.totalDecided) && stats.totalDecided >= 0 ? Math.floor(stats.totalDecided) : 0,
    firstUsedAt: isFiniteNumber(stats.firstUsedAt) && stats.firstUsedAt > 0 ? stats.firstUsedAt : null,
  }
  return writeLocal(KEYS.stats, safe)
}

/* ------------------------------ 忌口 ------------------------------ */

export function loadExclusions() {
  const list = readLocal(KEYS.exclusions, [])
  if (!Array.isArray(list)) return []
  return Array.from(new Set(list.filter((tag) => EXCLUSIONS.includes(tag))))
}

export function saveExclusions(list) {
  if (!Array.isArray(list)) return false
  return writeLocal(KEYS.exclusions, Array.from(new Set(list.filter((tag) => EXCLUSIONS.includes(tag)))))
}

/* ---------------------------- 筛选偏好 ---------------------------- */

/** 筛选偏好结构与默认值（与 lib/filters.js 的 DEFAULT_FILTERS 保持一致） */
export const DEFAULT_FILTER_PREFS = Object.freeze({
  budgetKey: 'any',
  taste: '随机',
  category: '随机',
  scene: '随机',
  cuisine: '随机',
  meal: '随机',
  region: 'local',
})

const BUDGET_KEYS = BUDGETS.map((item) => item.key)
const REGION_KEYS = REGIONS.map((item) => item.key)

/**
 * 校验并规整筛选偏好。
 * 旧版本数据可能缺字段、字段类型不对、或枚举值已废弃，
 * 这里逐字段校验，非法值一律回退到默认值，保证结果永远是合法对象。
 *
 * ⚠️ 本函数与 lib/filters.js 的 normalizeFilters 是**两份平行实现**，
 * 字段集合必须始终一致。历史上新增 region 时只改了 filters.js 而漏掉这里，
 * 导致从 localStorage 读回偏好后 region 被整个丢掉、默认地点失效。
 * check:data 的第 22b 项专门锁死两者的字段与默认值一致，请勿只改一边。
 */
export function normalizeFilterPrefs(raw) {
  const source = isPlainObject(raw) ? raw : {}
  return {
    budgetKey: normalizeEnum(
      typeof source.budgetKey === 'string' ? source.budgetKey : String(source.budgetKey ?? ''),
      BUDGET_KEYS,
      DEFAULT_FILTER_PREFS.budgetKey
    ),
    taste: normalizeEnum(source.taste, [...TASTES, '随机'], DEFAULT_FILTER_PREFS.taste),
    category: normalizeEnum(source.category, [...CATEGORIES, '随机'], DEFAULT_FILTER_PREFS.category),
    scene: normalizeEnum(source.scene, [...SCENES, '随机'], DEFAULT_FILTER_PREFS.scene),
    cuisine: normalizeEnum(source.cuisine, [...CUISINES, '随机'], DEFAULT_FILTER_PREFS.cuisine),
    meal: normalizeEnum(source.meal, [...MEALS, '随机'], DEFAULT_FILTER_PREFS.meal),
    // 旧数据没有 region，normalizeEnum 会回退到 'local'，老用户偏好零迁移
    region: normalizeEnum(source.region, REGION_KEYS, DEFAULT_FILTER_PREFS.region),
  }
}

export function loadFilterPrefs() {
  return normalizeFilterPrefs(readLocal(KEYS.filters, null))
}

export function saveFilterPrefs(prefs) {
  return writeLocal(KEYS.filters, normalizeFilterPrefs(prefs))
}

/* ==========================================================================
 * 饮料命名空间
 * --------------------------------------------------------------------------
 * 以下为「喝什么」模块的存储层，与上面的食物数据完全并行：
 * key 前缀相同但后缀独立，读写函数成对出现，互不干扰。
 * 饮料没有 taste（味型）而有 sugar（甜度），因此历史记录沿用同一套结构，
 * 但把甜度值放在 taste 字段的位置上，UI 端可无差别渲染。
 * ========================================================================== */

/* --------------------------- 饮料历史记录 --------------------------- */

/**
 * 单条饮料历史记录校验。
 * 与食物历史保持同一套兼容策略：只要求 id 与 ts 有效。
 * 展示字段（name / emoji / category / sugar）缺失时由 getDrinkById(id) 还原，
 * 因缺少展示字段就丢弃用户历史是不可接受的。
 */
function isValidDrinkHistoryRecord(item) {
  if (!isPlainObject(item)) return false
  if (!isNonEmptyString(item.id)) return false
  if (!isFiniteNumber(item.ts)) return false
  return true
}

/** 补全饮料历史记录的展示字段：taste 位置存放饮料的可选甜度摘要 */
function normalizeDrinkHistoryRecord(item) {
  const drink = getDrinkById(item.id)
  return {
    uid: isNonEmptyString(item.uid) ? item.uid : `${item.id}@${item.ts}`,
    id: item.id,
    name: isNonEmptyString(item.name) ? item.name : drink?.name || item.id,
    emoji: isNonEmptyString(item.emoji) ? item.emoji : (drink ? drinkEmoji(drink) : '🥤'),
    category: isNonEmptyString(item.category) ? item.category : drink?.category || '',
    taste: isNonEmptyString(item.taste)
      ? item.taste
      : drink?.sweetness?.length
        ? drink.sweetness.join('/')
        : '',
    ts: item.ts,
  }
}

export function loadDrinkHistory() {
  const list = readLocal(KEYS.drinkHistory, [])
  if (!Array.isArray(list)) return []
  return list.filter(isValidDrinkHistoryRecord).slice(0, MAX_HISTORY).map(normalizeDrinkHistoryRecord)
}

export function saveDrinkHistory(list) {
  if (!Array.isArray(list)) return false
  return writeLocal(KEYS.drinkHistory, list.filter(isValidDrinkHistoryRecord).slice(0, MAX_HISTORY))
}

export function createDrinkHistoryRecord(drink) {
  const now = new Date()
  return {
    uid: `${now.getTime()}-${Math.random().toString(36).slice(2, 7)}`,
    id: drink.id,
    name: drink.name,
    // 按品类派生本地 emoji（数据里没有 per-SKU 的 emoji 字段，不臆造商品图）
    emoji: drinkEmoji(drink),
    category: drink.category,
    // sweetness 是数组（官方公示的可选糖度），历史记录里只存一个可读摘要
    taste: drink.sweetness.length ? drink.sweetness.join('/') : null,
    ts: now.getTime(),
  }
}

/* ---------------------------- 饮料收藏 ---------------------------- */

export function loadDrinkFavorites() {
  const list = readLocal(KEYS.drinkFavorites, [])
  if (!Array.isArray(list)) return []
  return Array.from(new Set(list.filter(isNonEmptyString)))
}

export function saveDrinkFavorites(list) {
  if (!Array.isArray(list)) return false
  return writeLocal(KEYS.drinkFavorites, Array.from(new Set(list.filter(isNonEmptyString))))
}

/* ---------------------- 本次会话不喜欢的饮料 ---------------------- */

export function loadDrinkDislikes() {
  const list = readSession(KEYS.drinkDislikes, [])
  if (!Array.isArray(list)) return []
  return Array.from(new Set(list.filter(isNonEmptyString)))
}

export function saveDrinkDislikes(list) {
  if (!Array.isArray(list)) return false
  return writeSession(KEYS.drinkDislikes, Array.from(new Set(list.filter(isNonEmptyString))))
}

/* ----------------------------- 饮料统计 ----------------------------- */

const DEFAULT_DRINK_STATS = { totalDecided: 0, firstUsedAt: null }

export function loadDrinkStats() {
  const raw = readLocal(KEYS.drinkStats, DEFAULT_DRINK_STATS)
  if (!isPlainObject(raw)) return { ...DEFAULT_DRINK_STATS }
  return {
    totalDecided: isFiniteNumber(raw.totalDecided) && raw.totalDecided >= 0 ? Math.floor(raw.totalDecided) : 0,
    firstUsedAt: isFiniteNumber(raw.firstUsedAt) && raw.firstUsedAt > 0 ? raw.firstUsedAt : null,
  }
}

export function saveDrinkStats(stats) {
  if (!isPlainObject(stats)) return false
  const safe = {
    totalDecided: isFiniteNumber(stats.totalDecided) && stats.totalDecided >= 0 ? Math.floor(stats.totalDecided) : 0,
    firstUsedAt: isFiniteNumber(stats.firstUsedAt) && stats.firstUsedAt > 0 ? stats.firstUsedAt : null,
  }
  return writeLocal(KEYS.drinkStats, safe)
}

/* ----------------------------- 饮料忌口 ----------------------------- */

export function loadDrinkExclusions() {
  const list = readLocal(KEYS.drinkExclusions, [])
  if (!Array.isArray(list)) return []
  return Array.from(new Set(list.filter((tag) => DRINK_EXCLUSIONS.includes(tag))))
}

export function saveDrinkExclusions(list) {
  if (!Array.isArray(list)) return false
  return writeLocal(KEYS.drinkExclusions, Array.from(new Set(list.filter((tag) => DRINK_EXCLUSIONS.includes(tag)))))
}

/* --------------------------- 饮料筛选偏好 --------------------------- */

/** 饮料筛选偏好结构与默认值（与饮料数据层的枚举保持一致） */
export const DEFAULT_DRINK_PREFS = Object.freeze({
  brand: '随机',
  budgetKey: 'any',
  temperature: '随机',
  category: '随机',
  scene: '随机',
  sugar: '随机',
  caffeine: '随机',
})

const DRINK_BUDGET_KEYS = DRINK_BUDGETS.map((item) => item.key)
const BRAND_IDS = BRANDS.map((brand) => brand.id)

/**
 * 校验并规整饮料筛选偏好。
 * 与食物筛选同策略：逐字段枚举校验，非法值一律回退默认值，
 * 保证返回的永远是结构完整的合法对象。
 */
export function normalizeDrinkPrefs(raw) {
  const source = isPlainObject(raw) ? raw : {}
  return {
    /*
     * brand 存入的是品牌 id（如 'mxbc'），校验时对着品牌表比对，
     * 避免品牌数据调整后旧偏好里残留已不存在的 brandId 导致筛选恒为零候选。
     */
    brand: normalizeEnum(source.brand, ['随机', ...BRAND_IDS], DEFAULT_DRINK_PREFS.brand),
    budgetKey: normalizeEnum(
      typeof source.budgetKey === 'string' ? source.budgetKey : String(source.budgetKey ?? ''),
      DRINK_BUDGET_KEYS,
      DEFAULT_DRINK_PREFS.budgetKey
    ),
    temperature: normalizeEnum(source.temperature, [...TEMPERATURES, '随机'], DEFAULT_DRINK_PREFS.temperature),
    category: normalizeEnum(source.category, [...DRINK_CATEGORIES, '随机'], DEFAULT_DRINK_PREFS.category),
    scene: normalizeEnum(source.scene, [...DRINK_SCENES, '随机'], DEFAULT_DRINK_PREFS.scene),
    sugar: normalizeEnum(source.sugar, [...SUGAR_LEVELS, '随机'], DEFAULT_DRINK_PREFS.sugar),
    caffeine: normalizeEnum(source.caffeine, [...CAFFEINE_LEVELS, '随机'], DEFAULT_DRINK_PREFS.caffeine),
  }
}

export function loadDrinkPrefs() {
  return normalizeDrinkPrefs(readLocal(KEYS.drinkFilters, null))
}

export function saveDrinkPrefs(prefs) {
  return writeLocal(KEYS.drinkFilters, normalizeDrinkPrefs(prefs))
}

/* ------------------------------ 备份 / 恢复 ------------------------------ */

/**
 * 备份格式版本：结构发生不兼容变更时递增。
 * v1：仅含食物数据。
 * v2：新增饮料数据（drinkHistory / drinkFavorites / drinkExclusions / drinkPrefs / drinkStats）。
 *     v2 可向下兼容读取 v1 文件，缺失的饮料字段回退为空值。
 */
export const BACKUP_FORMAT_VERSION = 2
/** 备份文件大小上限：512 KB，超过则判定为异常文件直接拒绝 */
export const MAX_BACKUP_BYTES = 512 * 1024

const APP_ID = 'today-eat-what'

/** 构造一份完整备份对象（不含 sessionStorage 的 dislikes / drinkDislikes，它刻意只在会话内有效） */
export function buildBackup({
  history = [],
  favorites = [],
  exclusions = [],
  filterPrefs = null,
  stats = null,
  drinkHistory = [],
  drinkFavorites = [],
  drinkExclusions = [],
  drinkPrefs = null,
  drinkStats = null,
} = {}) {
  return {
    app: APP_ID,
    formatVersion: BACKUP_FORMAT_VERSION,
    exportedAt: new Date().toISOString(),
    data: {
      history: history.filter(isValidHistoryRecord).slice(0, MAX_HISTORY),
      favorites: Array.from(new Set(favorites.filter(isNonEmptyString))),
      exclusions: Array.from(new Set(exclusions.filter((tag) => EXCLUSIONS.includes(tag)))),
      filterPrefs: normalizeFilterPrefs(filterPrefs),
      stats: isPlainObject(stats) ? stats : { ...DEFAULT_STATS },
      drinkHistory: drinkHistory.filter(isValidDrinkHistoryRecord).slice(0, MAX_HISTORY),
      drinkFavorites: Array.from(new Set(drinkFavorites.filter(isNonEmptyString))),
      drinkExclusions: Array.from(new Set(drinkExclusions.filter((tag) => DRINK_EXCLUSIONS.includes(tag)))),
      drinkPrefs: normalizeDrinkPrefs(drinkPrefs),
      drinkStats: isPlainObject(drinkStats) ? drinkStats : { ...DEFAULT_DRINK_STATS },
    },
  }
}

/** 生成可下载的备份文本 */
export function serializeBackup(payload) {
  return JSON.stringify(payload, null, 2)
}

/**
 * 解析并校验导入的备份内容。
 * 校验顺序：大小 → JSON 合法性 → 顶层结构 → 格式版本 → 各字段类型与有效值。
 * 返回 { ok: true, data, warnings } 或 { ok: false, reason }。
 * 任何情况下都不修改调用方的现有数据。
 *
 * 版本兼容：v1 备份不含饮料字段，此时饮料相关字段回退为空数组 / 默认偏好，
 * 并给出提示，而不是判定为损坏文件——旧备份必须始终可导入。
 */
export function parseBackup(text) {
  if (typeof text !== 'string') return { ok: false, reason: '文件内容无法读取' }
  if (text.length > MAX_BACKUP_BYTES) {
    return { ok: false, reason: `文件过大（超过 ${Math.round(MAX_BACKUP_BYTES / 1024)} KB），已拒绝导入` }
  }
  if (!text.trim()) return { ok: false, reason: '文件内容为空' }

  let raw
  try {
    raw = JSON.parse(text)
  } catch {
    return { ok: false, reason: '不是合法的 JSON 文件' }
  }

  if (!isPlainObject(raw)) return { ok: false, reason: '备份顶层结构不正确' }
  if (raw.app !== APP_ID) {
    return { ok: false, reason: '这不是「今天吃什么」的备份文件' }
  }
  if (!isFiniteNumber(raw.formatVersion) || raw.formatVersion < 1) {
    return { ok: false, reason: '备份文件缺少有效的格式版本' }
  }
  if (raw.formatVersion > BACKUP_FORMAT_VERSION) {
    return {
      ok: false,
      reason: `备份格式版本（v${raw.formatVersion}）高于当前应用支持的版本（v${BACKUP_FORMAT_VERSION}），请先更新应用`,
    }
  }
  if (!isPlainObject(raw.data)) return { ok: false, reason: '备份内容为空或结构不正确' }

  const warnings = []
  const data = raw.data

  // v1 备份没有饮料字段，明确提示用户，不影响导入结果
  const isLegacyV1 = raw.formatVersion < 2
  if (isLegacyV1) warnings.push('该备份为 v1 格式，不含饮料数据')

  // 逐字段校验：类型不对的字段整体跳过并记录警告，而不是让整个导入失败
  if (data.history !== undefined && !Array.isArray(data.history)) warnings.push('历史记录字段类型不正确，已跳过')
  if (data.favorites !== undefined && !Array.isArray(data.favorites)) warnings.push('收藏字段类型不正确，已跳过')
  if (data.exclusions !== undefined && !Array.isArray(data.exclusions)) warnings.push('忌口字段类型不正确，已跳过')
  if (data.drinkHistory !== undefined && !Array.isArray(data.drinkHistory)) warnings.push('饮料历史记录字段类型不正确，已跳过')
  if (data.drinkFavorites !== undefined && !Array.isArray(data.drinkFavorites)) warnings.push('饮料收藏字段类型不正确，已跳过')
  if (data.drinkExclusions !== undefined && !Array.isArray(data.drinkExclusions)) warnings.push('饮料忌口字段类型不正确，已跳过')

  const rawHistory = Array.isArray(data.history) ? data.history : []
  const rawFavorites = Array.isArray(data.favorites) ? data.favorites : []
  const rawExclusions = Array.isArray(data.exclusions) ? data.exclusions : []
  const rawDrinkHistory = Array.isArray(data.drinkHistory) ? data.drinkHistory : []
  const rawDrinkFavorites = Array.isArray(data.drinkFavorites) ? data.drinkFavorites : []
  const rawDrinkExclusions = Array.isArray(data.drinkExclusions) ? data.drinkExclusions : []

  const history = rawHistory.filter(isValidHistoryRecord)
  if (Array.isArray(data.history) && history.length < rawHistory.length) {
    warnings.push(`历史记录中有 ${rawHistory.length - history.length} 条格式不正确，已忽略`)
  }

  const favorites = Array.from(new Set(rawFavorites.filter(isNonEmptyString)))
  if (Array.isArray(data.favorites) && favorites.length < rawFavorites.length) {
    warnings.push('收藏中有重复或格式不正确的条目，已去重')
  }

  const exclusions = Array.from(new Set(rawExclusions.filter((tag) => EXCLUSIONS.includes(tag))))
  if (Array.isArray(data.exclusions) && exclusions.length < rawExclusions.length) {
    warnings.push('忌口中有无效标签，已忽略')
  }

  const drinkHistory = rawDrinkHistory.filter(isValidDrinkHistoryRecord)
  if (Array.isArray(data.drinkHistory) && drinkHistory.length < rawDrinkHistory.length) {
    warnings.push(`饮料历史记录中有 ${rawDrinkHistory.length - drinkHistory.length} 条格式不正确，已忽略`)
  }

  const drinkFavorites = Array.from(new Set(rawDrinkFavorites.filter(isNonEmptyString)))
  if (Array.isArray(data.drinkFavorites) && drinkFavorites.length < rawDrinkFavorites.length) {
    warnings.push('饮料收藏中有重复或格式不正确的条目，已去重')
  }

  const drinkExclusions = Array.from(new Set(rawDrinkExclusions.filter((tag) => DRINK_EXCLUSIONS.includes(tag))))
  if (Array.isArray(data.drinkExclusions) && drinkExclusions.length < rawDrinkExclusions.length) {
    warnings.push('饮料忌口中有无效标签，已忽略')
  }

  return {
    ok: true,
    warnings,
    data: {
      history,
      favorites,
      exclusions,
      filterPrefs: normalizeFilterPrefs(data.filterPrefs),
      stats: isPlainObject(data.stats) ? data.stats : null,
      drinkHistory,
      drinkFavorites,
      drinkExclusions,
      drinkPrefs: normalizeDrinkPrefs(data.drinkPrefs),
      drinkStats: isPlainObject(data.drinkStats) ? data.drinkStats : null,
    },
  }
}

/**
 * 合并导入数据到现有数据（并集去重），返回各字段的新值与统计。
 * 语义：只做「合并」，绝不删除现有有效数据；历史按 uid 去重并按时间倒序、截断到上限。
 * 食物与饮料各字段并行处理，互不影响。
 */
export function mergeImported(current, incoming) {
  const currentHistory = Array.isArray(current?.history) ? current.history : []
  const incomingHistory = Array.isArray(incoming?.history) ? incoming.history : []

  const seenUid = new Set()
  const mergedHistory = []
  // 先放现有记录，保证现有数据优先保留；导入项仅补充不存在的记录
  for (const record of [...currentHistory, ...incomingHistory]) {
    const key = record?.uid || `${record?.id}@${record?.ts}`
    if (seenUid.has(key)) continue
    seenUid.add(key)
    mergedHistory.push(record)
  }
  mergedHistory.sort((a, b) => b.ts - a.ts)
  const finalHistory = mergedHistory.slice(0, MAX_HISTORY)

  const currentFavorites = Array.isArray(current?.favorites) ? current.favorites : []
  const mergedFavorites = Array.from(new Set([...currentFavorites, ...(incoming?.favorites || [])]))

  const currentExclusions = Array.isArray(current?.exclusions) ? current.exclusions : []
  const mergedExclusions = Array.from(new Set([...currentExclusions, ...(incoming?.exclusions || [])]))

  // 饮料历史：同一套 uid 去重 + 时间倒序 + 截断策略
  const currentDrinkHistory = Array.isArray(current?.drinkHistory) ? current.drinkHistory : []
  const incomingDrinkHistory = Array.isArray(incoming?.drinkHistory) ? incoming.drinkHistory : []

  const seenDrinkUid = new Set()
  const mergedDrinkHistory = []
  for (const record of [...currentDrinkHistory, ...incomingDrinkHistory]) {
    const key = record?.uid || `${record?.id}@${record?.ts}`
    if (seenDrinkUid.has(key)) continue
    seenDrinkUid.add(key)
    mergedDrinkHistory.push(record)
  }
  mergedDrinkHistory.sort((a, b) => b.ts - a.ts)
  const finalDrinkHistory = mergedDrinkHistory.slice(0, MAX_HISTORY)

  const currentDrinkFavorites = Array.isArray(current?.drinkFavorites) ? current.drinkFavorites : []
  const mergedDrinkFavorites = Array.from(new Set([...currentDrinkFavorites, ...(incoming?.drinkFavorites || [])]))

  const currentDrinkExclusions = Array.isArray(current?.drinkExclusions) ? current.drinkExclusions : []
  const mergedDrinkExclusions = Array.from(new Set([...currentDrinkExclusions, ...(incoming?.drinkExclusions || [])]))

  return {
    history: finalHistory,
    favorites: mergedFavorites,
    exclusions: mergedExclusions,
    filterPrefs: normalizeFilterPrefs(incoming?.filterPrefs),
    drinkHistory: finalDrinkHistory,
    drinkFavorites: mergedDrinkFavorites,
    drinkExclusions: mergedDrinkExclusions,
    drinkPrefs: normalizeDrinkPrefs(incoming?.drinkPrefs),
    added: {
      history: Math.max(0, finalHistory.length - currentHistory.length),
      favorites: Math.max(0, mergedFavorites.length - currentFavorites.length),
      exclusions: Math.max(0, mergedExclusions.length - currentExclusions.length),
      drinkHistory: Math.max(0, finalDrinkHistory.length - currentDrinkHistory.length),
      drinkFavorites: Math.max(0, mergedDrinkFavorites.length - currentDrinkFavorites.length),
      drinkExclusions: Math.max(0, mergedDrinkExclusions.length - currentDrinkExclusions.length),
    },
  }
}

/** 导出为文件下载（浏览器环境）；返回是否成功 */
export function downloadBackup(payload, filename) {
  try {
    const blob = new Blob([serializeBackup(payload)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename || `chishenme-backup-${Date.now()}.json`
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    // 延迟释放，确保下载已开始
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    return true
  } catch {
    return false
  }
}
