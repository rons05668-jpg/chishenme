import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  MAX_HISTORY,
  buildBackup,
  createDrinkHistoryRecord,
  createHistoryRecord,
  downloadBackup,
  loadDislikes,
  loadDrinkDislikes,
  loadDrinkExclusions,
  loadDrinkFavorites,
  loadDrinkHistory,
  loadDrinkPrefs,
  loadDrinkStats,
  loadExclusions,
  loadFavorites,
  loadFilterPrefs,
  loadHistory,
  loadStats,
  mergeImported,
  normalizeDrinkPrefs,
  onWriteError,
  parseBackup,
  saveDislikes,
  saveDrinkDislikes,
  saveDrinkExclusions,
  saveDrinkFavorites,
  saveDrinkHistory,
  saveDrinkPrefs,
  saveDrinkStats,
  saveExclusions,
  saveFavorites,
  saveFilterPrefs,
  saveHistory,
  saveStats,
} from '../lib/storage'
import { DEFAULT_FILTERS, NORMAL_FILTER_KEYS, normalizeFilters } from '../lib/filters'
// 注意：从 drinks-meta（轻量模块）而非 drinkPicker 导入——
// drinkPicker 会拖入 209KB 的 DRINKS 大表，首屏不能要它。
import { DRINK_DEFAULT_FILTERS, DRINK_NORMAL_FILTER_KEYS } from '../data/drinks-meta'

const AppStateContext = createContext(null)
const ToastStateContext = createContext(null)
const ToastActionsContext = createContext(null)

/** 存储不可用时的提示文案：说明后果 + 安抚可用功能 */
const STORAGE_UNAVAILABLE_MESSAGE = '本地存储不可用，记录不会保存（仍可正常随机推荐）'

/**
 * 单个持久化 state。
 * ------------------------------------------------------------------
 * 挂载时只读不写：之后每次「真正变更」才写回。
 * 原来 12 个 useEffect 在挂载时各触发一次写回（含默认值回写），
 * 这里用脏标记跳过挂载期的写入——只有调用返回的 setter 才算一次变更。
 */
function usePersistedState(load, save) {
  const [value, setValue] = useState(load)
  const dirtyRef = useRef(false)
  const setDirty = useCallback(
    (updater) => {
      dirtyRef.current = true
      setValue(updater)
    },
    []
  )
  useEffect(() => {
    if (!dirtyRef.current) return
    dirtyRef.current = false
    // 注意：storage 的 save* 返回 boolean（表示写入是否成功），
    // 而 useEffect 的回调返回值会被 React 当作 cleanup 函数调用——
    // 直接返回 boolean 会抛 "destroy is not a function"。因此这里统一用语句块包裹，
    // 不把 save 的返回值透出。
    save(value)
  }, [value, save])
  return [value, setDirty]
}

/**
 * 食物 / 饮料两套持久化状态的工厂。
 * ------------------------------------------------------------------
 * 两套切片（历史 / 收藏 / 本次不喜欢 / 统计 / 忌口 / 筛选偏好）结构完全相同，
 * 以前是逐行对称重复的两份代码（只靠注释保证一致，还出过把补丁对象当值写入、
 * 导致 React error #31 的事故）。现在由这个工厂按配置生成两套。
 *
 * config:
 *  - loaders / savers  各切片的 load / save 函数
 *  - createRecord      单条历史记录的构造器
 *  - normalizePrefs    筛选偏好的归一化函数
 *  - defaultPrefs      筛选偏好默认值对象
 *  - normalKeys        「普通筛选」字段列表（重置时只清这些，不动忌口）
 */
function usePersistedModule(config) {
  const { loaders, savers, createRecord, normalizePrefs, defaultPrefs, normalKeys } = config

  const [history, setHistory] = usePersistedState(loaders.history, savers.history)
  const [favorites, setFavorites] = usePersistedState(loaders.favorites, savers.favorites)
  const [dislikes, setDislikes] = usePersistedState(loaders.dislikes, savers.dislikes)
  const [stats, setStats] = usePersistedState(loaders.stats, savers.stats)
  const [exclusions, setExclusions] = usePersistedState(loaders.exclusions, savers.exclusions)
  const [prefs, setPrefs] = usePersistedState(loaders.prefs, savers.prefs)

  /*
   * 最新值的 ref 镜像（渲染期赋值，保证子组件首次渲染时就能读到）。
   * action 回调不再闭包依赖 state 数组本身，useCallback 依赖置空、
   * 引用永久稳定，避免每次切片变化都重建回调、放大 Context 重渲染。
   */
  const ref = useRef(null)
  ref.current = { history, favorites, dislikes, stats, exclusions, prefs }

  /** 合并式更新筛选偏好：只覆盖传入的字段，其余保持当前值 */
  const updatePrefs = useCallback(
    (patch) => {
      setPrefs((prev) => normalizePrefs({ ...prev, ...patch }))
    },
    [normalizePrefs, setPrefs]
  )

  /**
   * 重置普通筛选条件为默认值。
   * 注意：忌口是独立的 state，不在这里的筛选对象内，
   * 因此本方法天然不会影响忌口。
   * 另注意：这里要的是单字段的默认值本身（defaultPrefs[key]），
   * 而不是返回补丁对象的 resetXxxFilterPatch(key)——
   * 曾有人误写成后者，导致筛选值变成对象、渲染时抛 React error #31。
   */
  const resetPrefs = useCallback(() => {
    setPrefs((prev) => {
      const next = { ...prev }
      normalKeys.forEach((key) => {
        next[key] = defaultPrefs[key]
      })
      return normalizePrefs(next)
    })
  }, [defaultPrefs, normalKeys, normalizePrefs, setPrefs])

  /** 记录「就吃这个 / 就喝这个」 */
  const recordItem = useCallback(
    (item) => {
      if (!item) return
      setHistory((prev) => [createRecord(item), ...prev].slice(0, MAX_HISTORY))
      setStats((prev) => ({
        totalDecided: (prev.totalDecided || 0) + 1,
        firstUsedAt: prev.firstUsedAt || Date.now(),
      }))
      // 吃过 / 喝过之后把它从「本次不喜欢」里移除，避免长期压制
      setDislikes((prev) => prev.filter((id) => id !== item.id))
    },
    [createRecord, setHistory, setStats, setDislikes]
  )

  const removeHistoryRecord = useCallback(
    (uid) => {
      setHistory((prev) => prev.filter((record) => record.uid !== uid))
    },
    [setHistory]
  )

  const clearHistory = useCallback(() => setHistory([]), [setHistory])

  /**
   * 收藏 / 取消收藏，返回本次是否为「新增」。
   * 返回值基于 ref 镜像计算，不能依赖 setState 更新函数内部的副作用
   * （React 不保证它同步执行）；回调本身不依赖 favorites 数组，引用永久稳定。
   */
  const toggleFavorite = useCallback(
    (itemId) => {
      const added = !ref.current.favorites.includes(itemId)
      setFavorites((prev) =>
        prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
      )
      return added
    },
    [setFavorites]
  )

  const isFavorite = useCallback((itemId) => ref.current.favorites.includes(itemId), [])

  /** 「这个不要」：本次会话内降低推荐概率 */
  const dislikeItem = useCallback(
    (itemId) => {
      setDislikes((prev) => (prev.includes(itemId) ? prev : [...prev, itemId]))
    },
    [setDislikes]
  )

  const resetDislikes = useCallback(() => setDislikes([]), [setDislikes])

  /*
   * 返回对象按切片 memo：只有某个切片变化时才换引用，
   * 上层的 value useMemo 才能真正起到缓存作用。
   * （set* 与 ref 都是稳定的，不用进依赖。）
   */
  return useMemo(
    () => ({
      history,
      favorites,
      dislikes,
      stats,
      exclusions,
      prefs,
      setHistory,
      setFavorites,
      setExclusions,
      setStats,
      setPrefs,
      updatePrefs,
      resetPrefs,
      recordItem,
      removeHistoryRecord,
      clearHistory,
      toggleFavorite,
      isFavorite,
      dislikeItem,
      resetDislikes,
      ref,
    }),
    [
      history,
      favorites,
      dislikes,
      stats,
      exclusions,
      prefs,
      setHistory,
      setFavorites,
      setExclusions,
      setStats,
      setPrefs,
      updatePrefs,
      resetPrefs,
      recordItem,
      removeHistoryRecord,
      clearHistory,
      toggleFavorite,
      isFavorite,
      dislikeItem,
      resetDislikes,
    ]
  )
}

const FOOD_MODULE_CONFIG = {
  loaders: {
    history: loadHistory,
    favorites: loadFavorites,
    dislikes: loadDislikes,
    stats: loadStats,
    exclusions: loadExclusions,
    prefs: loadFilterPrefs,
  },
  savers: {
    history: saveHistory,
    favorites: saveFavorites,
    dislikes: saveDislikes,
    stats: saveStats,
    exclusions: saveExclusions,
    prefs: saveFilterPrefs,
  },
  createRecord: createHistoryRecord,
  normalizePrefs: normalizeFilters,
  defaultPrefs: DEFAULT_FILTERS,
  normalKeys: NORMAL_FILTER_KEYS,
}

/*
 * 饮料模块的独立配置。
 * 与食物状态完全隔离：使用独立的存储键与 `drink-` 前缀 id，
 * 因此食物与饮品的收藏/历史永不互相污染，旧数据也无需迁移。
 */
const DRINK_MODULE_CONFIG = {
  loaders: {
    history: loadDrinkHistory,
    favorites: loadDrinkFavorites,
    dislikes: loadDrinkDislikes,
    stats: loadDrinkStats,
    exclusions: loadDrinkExclusions,
    prefs: loadDrinkPrefs,
  },
  savers: {
    history: saveDrinkHistory,
    favorites: saveDrinkFavorites,
    dislikes: saveDrinkDislikes,
    stats: saveDrinkStats,
    exclusions: saveDrinkExclusions,
    prefs: saveDrinkPrefs,
  },
  createRecord: createDrinkHistoryRecord,
  normalizePrefs: normalizeDrinkPrefs,
  defaultPrefs: DRINK_DEFAULT_FILTERS,
  normalKeys: DRINK_NORMAL_FILTER_KEYS,
}

export function AppStateProvider({ children }) {
  const food = usePersistedModule(FOOD_MODULE_CONFIG)
  const drink = usePersistedModule(DRINK_MODULE_CONFIG)

  /* ------------------------------ 轻提示 ------------------------------ */

  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)
  // 自增计数器做 key：Date.now() 在 1ms 内连调两次会得到相同 key，动画不重播
  const toastKeyRef = useRef(0)

  const showToast = useCallback((message, emoji = '✨') => {
    toastKeyRef.current += 1
    setToast({ message, emoji, key: toastKeyRef.current })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 1800)
  }, [])

  const dismissToast = useCallback(() => {
    clearTimeout(toastTimer.current)
    setToast(null)
  }, [])

  useEffect(() => () => clearTimeout(toastTimer.current), [])

  /*
   * toast 独立成两个 Context：state 变化（每 1.8s 两次）只重渲染
   * 真正读 toast 的组件（Toast），调用 showToast 的页面/组件消费
   * 永远稳定的 actions Context，不会被 toast 的显隐带动重渲染。
   */
  const toastState = useMemo(() => ({ toast }), [toast])
  const toastActions = useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast])

  /* ------------------------ 存储写入失败提示 ------------------------ */

  /**
   * 会话内只提示一次的守卫。
   * 存储不可用通常是持续性状态（隐私模式 / 存储被禁用 / 配额耗尽），
   * 每次写入失败都弹提示会持续打扰用户，所以整体只提示一次。
   */
  const storageWarnedRef = useRef(false)

  useEffect(() => {
    // storage 层写入失败只返回 false、不抛错，因此这里也不做 catch 处理；
    // 订阅回调内即便出现意外也只会中断提示，不会影响随机 / 转盘主流程。
    const unsubscribe = onWriteError(() => {
      if (storageWarnedRef.current) return
      storageWarnedRef.current = true
      showToast(STORAGE_UNAVAILABLE_MESSAGE, '⚠️')
    })
    return unsubscribe
  }, [showToast])

  /* ---------------------------- 备份 / 恢复 ---------------------------- */

  /** 导出备份文件；只返回结果对象，是否提示由调用方决定 */
  const exportBackup = useCallback(() => {
    const currentFood = food.ref.current
    const currentDrink = drink.ref.current
    const payload = buildBackup({
      history: currentFood.history,
      favorites: currentFood.favorites,
      exclusions: currentFood.exclusions,
      filterPrefs: currentFood.prefs,
      stats: currentFood.stats,
      drinkHistory: currentDrink.history,
      drinkFavorites: currentDrink.favorites,
      drinkExclusions: currentDrink.exclusions,
      drinkPrefs: currentDrink.prefs,
      drinkStats: currentDrink.stats,
    })
    const ok = downloadBackup(payload)
    return ok
      ? { ok: true, message: '备份文件已开始下载' }
      : { ok: false, message: '备份下载失败，请检查浏览器权限' }
  }, [food.ref, drink.ref])

  /**
   * 导入备份：解析失败直接返回原因；成功则与现有数据做并集合并，
   * 绝不删除现有有效数据（mergeImported 本身即为并集语义）。
   * 食物与饮料各自独立合并，互不覆盖。
   * 统计与筛选偏好同样恢复（导出时包含它们）：统计走 max/最早时间合并，
   * 偏好只有备份里实际带了对应字段时才恢复，老备份缺失时不碰用户当前值。
   */
  const importBackup = useCallback(
    (text) => {
      const parsed = parseBackup(text)
      if (!parsed.ok) return { ok: false, message: parsed.reason }

      const currentFood = food.ref.current
      const currentDrink = drink.ref.current
      const merged = mergeImported(
        {
          history: currentFood.history,
          favorites: currentFood.favorites,
          exclusions: currentFood.exclusions,
          stats: currentFood.stats,
          drinkHistory: currentDrink.history,
          drinkFavorites: currentDrink.favorites,
          drinkExclusions: currentDrink.exclusions,
          drinkStats: currentDrink.stats,
        },
        parsed.data
      )
      food.setHistory(merged.history)
      food.setFavorites(merged.favorites)
      food.setExclusions(merged.exclusions)
      if (parsed.present.stats) food.setStats(merged.stats)
      if (parsed.present.filterPrefs) food.setPrefs(merged.filterPrefs)
      if (merged.drinkHistory) drink.setHistory(merged.drinkHistory)
      if (merged.drinkFavorites) drink.setFavorites(merged.drinkFavorites)
      if (merged.drinkExclusions) drink.setExclusions(merged.drinkExclusions)
      if (parsed.present.drinkStats) drink.setStats(merged.drinkStats)
      if (parsed.present.drinkPrefs) drink.setPrefs(merged.drinkPrefs)

      return { ok: true, added: merged.added, warnings: parsed.warnings }
    },
    [food, drink]
  )

  const value = useMemo(
    () => ({
      exclusions: food.exclusions,
      setExclusions: food.setExclusions,
      history: food.history,
      favorites: food.favorites,
      dislikes: food.dislikes,
      stats: food.stats,
      filters: food.prefs,
      updateFilters: food.updatePrefs,
      resetFilters: food.resetPrefs,
      recordEaten: food.recordItem,
      removeHistoryRecord: food.removeHistoryRecord,
      clearHistory: food.clearHistory,
      toggleFavorite: food.toggleFavorite,
      isFavorite: food.isFavorite,
      dislikeFood: food.dislikeItem,
      resetDislikes: food.resetDislikes,
      // 饮料模块
      drinkHistory: drink.history,
      drinkFavorites: drink.favorites,
      drinkDislikes: drink.dislikes,
      drinkStats: drink.stats,
      drinkExclusions: drink.exclusions,
      setDrinkExclusions: drink.setExclusions,
      drinkFilters: drink.prefs,
      updateDrinkFilters: drink.updatePrefs,
      resetDrinkFilters: drink.resetPrefs,
      recordDrink: drink.recordItem,
      removeDrinkHistoryRecord: drink.removeHistoryRecord,
      clearDrinkHistory: drink.clearHistory,
      toggleDrinkFavorite: drink.toggleFavorite,
      isDrinkFavorite: drink.isFavorite,
      dislikeDrink: drink.dislikeItem,
      resetDrinkDislikes: drink.resetDislikes,
      // 备份 / 恢复
      exportBackup,
      importBackup,
    }),
    [food, drink, exportBackup, importBackup]
  )

  return (
    <ToastStateContext.Provider value={toastState}>
      <ToastActionsContext.Provider value={toastActions}>
        <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
      </ToastActionsContext.Provider>
    </ToastStateContext.Provider>
  )
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState 必须在 AppStateProvider 内使用')
  return ctx
}

/** 读 toast 状态（Toast 组件用；toast 每 1.8s 变化两次，只带动这里重渲染） */
export function useToastState() {
  const ctx = useContext(ToastStateContext)
  if (!ctx) throw new Error('useToastState 必须在 AppStateProvider 内使用')
  return ctx
}

/** 调 showToast / dismissToast（引用永久稳定，消费方不会被 toast 显隐带动重渲染） */
export function useToastActions() {
  const ctx = useContext(ToastActionsContext)
  if (!ctx) throw new Error('useToastActions 必须在 AppStateProvider 内使用')
  return ctx
}
