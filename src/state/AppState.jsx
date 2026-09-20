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
import { DRINK_DEFAULT_FILTERS, DRINK_NORMAL_FILTER_KEYS } from '../lib/drinkPicker'

const AppStateContext = createContext(null)

/** 存储不可用时的提示文案：说明后果 + 安抚可用功能 */
const STORAGE_UNAVAILABLE_MESSAGE = '本地存储不可用，记录不会保存（仍可正常随机推荐）'

export function AppStateProvider({ children }) {
  const [history, setHistory] = useState(() => loadHistory())
  const [favorites, setFavorites] = useState(() => loadFavorites())
  const [dislikes, setDislikes] = useState(() => loadDislikes())
  const [stats, setStats] = useState(() => loadStats())
  const [exclusions, setExclusions] = useState(() => loadExclusions())
  // 筛选偏好提升为全局：随机页与转盘页共享同一份条件，且刷新后恢复
  const [filters, setFilters] = useState(() => loadFilterPrefs())

  /*
   * 饮料模块的独立状态。
   * 与食物状态完全隔离：使用独立的存储键与 `drink-` 前缀 id，
   * 因此食物与饮品的收藏/历史永不互相污染，旧数据也无需迁移。
   */
  const [drinkHistory, setDrinkHistory] = useState(() => loadDrinkHistory())
  const [drinkFavorites, setDrinkFavorites] = useState(() => loadDrinkFavorites())
  const [drinkDislikes, setDrinkDislikes] = useState(() => loadDrinkDislikes())
  const [drinkStats, setDrinkStats] = useState(() => loadDrinkStats())
  const [drinkExclusions, setDrinkExclusions] = useState(() => loadDrinkExclusions())
  const [drinkFilters, setDrinkFilters] = useState(() => loadDrinkPrefs())

  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  /*
   * 任何变更都同步写入本地存储，刷新后数据不丢失。
   * 注意：storage 的 save* 返回 boolean（表示写入是否成功，供备份与失败提示使用），
   * 而 useEffect 的回调返回值会被 React 当作 cleanup 函数调用——
   * 直接返回 boolean 会抛 "destroy is not a function"。因此这里统一用语句块包裹，
   * 不把 save 的返回值透出。
   */
  useEffect(() => {
    saveHistory(history)
  }, [history])
  useEffect(() => {
    saveFavorites(favorites)
  }, [favorites])
  useEffect(() => {
    saveDislikes(dislikes)
  }, [dislikes])
  useEffect(() => {
    saveStats(stats)
  }, [stats])
  useEffect(() => {
    saveExclusions(exclusions)
  }, [exclusions])
  useEffect(() => {
    saveFilterPrefs(filters)
  }, [filters])

  // 饮料状态的持久化：与食物同样是语句块包裹，不把 save 的 boolean 返回值透出。
  useEffect(() => {
    saveDrinkHistory(drinkHistory)
  }, [drinkHistory])
  useEffect(() => {
    saveDrinkFavorites(drinkFavorites)
  }, [drinkFavorites])
  useEffect(() => {
    saveDrinkDislikes(drinkDislikes)
  }, [drinkDislikes])
  useEffect(() => {
    saveDrinkStats(drinkStats)
  }, [drinkStats])
  useEffect(() => {
    saveDrinkExclusions(drinkExclusions)
  }, [drinkExclusions])
  useEffect(() => {
    saveDrinkPrefs(drinkFilters)
  }, [drinkFilters])

  useEffect(() => () => clearTimeout(toastTimer.current), [])

  const showToast = useCallback((message, emoji = '✨') => {
    setToast({ message, emoji, key: Date.now() })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 1800)
  }, [])

  const dismissToast = useCallback(() => {
    clearTimeout(toastTimer.current)
    setToast(null)
  }, [])

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

  /* ---------------------------- 筛选偏好 ---------------------------- */

  /** 合并式更新：只覆盖传入的字段，其余保持当前值 */
  const updateFilters = useCallback((patch) => {
    setFilters((prev) => normalizeFilters({ ...prev, ...patch }))
  }, [])

  /**
   * 重置普通筛选条件为默认值。
   * 注意：忌口（exclusions）是独立的 state，不在这里的筛选对象内，
   * 因此本方法天然不会影响忌口，只清预算 / 口味 / 类型 / 场景 / 风味 / 时段。
   */
  const resetFilters = useCallback(() => {
    setFilters((prev) => {
      const next = { ...prev }
      NORMAL_FILTER_KEYS.forEach((key) => {
        next[key] = DEFAULT_FILTERS[key]
      })
      return normalizeFilters(next)
    })
  }, [])

  /* -------------------------- 饮料筛选偏好 -------------------------- */

  /** 合并式更新：只覆盖传入字段，其余保持当前值 */
  const updateDrinkFilters = useCallback((patch) => {
    setDrinkFilters((prev) => ({ ...prev, ...patch }))
  }, [])

  /**
   * 重置饮料普通筛选条件。
   * 与食物一致：忌口（drinkExclusions）是独立 state，不在此对象内，
   * 因此本方法只清预算/温度/类型/场景/甜度/咖啡因，天然不影响忌口。
   */
  const resetDrinkFilters = useCallback(() => {
    setDrinkFilters((prev) => {
      const next = { ...prev }
      DRINK_NORMAL_FILTER_KEYS.forEach((key) => {
        // 注意：resetDrinkFilterPatch(key) 返回的是「补丁对象」{ [key]: value }，
        // 用于合并更新；这里要的是单字段的值本身，直接取 DRINK_DEFAULT_FILTERS。
        // 曾误写成 next[key] = resetDrinkFilterPatch(key)，导致 filters.temperature
        // 变成对象、渲染时抛 React error #31。
        next[key] = DRINK_DEFAULT_FILTERS[key]
      })
      return next
    })
  }, [])

  /* ---------------------------- 备份 / 恢复 ---------------------------- */

  /** 导出备份文件；只返回结果对象，是否提示由调用方决定 */
  const exportBackup = useCallback(() => {
    const payload = buildBackup({
      history,
      favorites,
      exclusions,
      filterPrefs: filters,
      stats,
      drinkHistory,
      drinkFavorites,
      drinkExclusions,
      drinkPrefs: drinkFilters,
      drinkStats,
    })
    const ok = downloadBackup(payload)
    return ok
      ? { ok: true, message: '备份文件已开始下载' }
      : { ok: false, message: '备份下载失败，请检查浏览器权限' }
  }, [history, favorites, exclusions, filters, stats, drinkHistory, drinkFavorites, drinkExclusions, drinkFilters, drinkStats])

  /**
   * 导入备份：解析失败直接返回原因；成功则与现有数据做并集合并，
   * 绝不删除现有有效数据（mergeImported 本身即为并集语义）。
   * 食物与饮料各自独立合并，互不覆盖。
   */
  const importBackup = useCallback(
    (text) => {
      const parsed = parseBackup(text)
      if (!parsed.ok) return { ok: false, message: parsed.reason }

      const merged = mergeImported(
        {
          history,
          favorites,
          exclusions,
          drinkHistory,
          drinkFavorites,
          drinkExclusions,
        },
        parsed.data
      )
      setHistory(merged.history)
      setFavorites(merged.favorites)
      setExclusions(merged.exclusions)
      if (merged.drinkHistory) setDrinkHistory(merged.drinkHistory)
      if (merged.drinkFavorites) setDrinkFavorites(merged.drinkFavorites)
      if (merged.drinkExclusions) setDrinkExclusions(merged.drinkExclusions)

      return { ok: true, added: merged.added, warnings: parsed.warnings }
    },
    [history, favorites, exclusions, drinkHistory, drinkFavorites, drinkExclusions]
  )

  /* ------------------------------ 记录 ------------------------------ */

  /** 记录「就吃这个」 */
  const recordEaten = useCallback((food) => {
    if (!food) return
    setHistory((prev) => [createHistoryRecord(food), ...prev].slice(0, MAX_HISTORY))
    setStats((prev) => ({
      totalDecided: (prev.totalDecided || 0) + 1,
      firstUsedAt: prev.firstUsedAt || Date.now(),
    }))
    // 吃过之后把它从「本次不喜欢」里移除，避免长期压制
    setDislikes((prev) => prev.filter((id) => id !== food.id))
  }, [])

  const removeHistoryRecord = useCallback((uid) => {
    setHistory((prev) => prev.filter((item) => item.uid !== uid))
  }, [])

  const clearHistory = useCallback(() => setHistory([]), [])

  /**
   * 收藏 / 取消收藏，返回本次是否为「新增」。
   * 注意：返回值必须基于当前已提交的 favorites 计算，
   * 不能依赖 setState 更新函数内部的副作用（React 不保证它同步执行）。
   */
  const toggleFavorite = useCallback(
    (foodId) => {
      const added = !favorites.includes(foodId)
      setFavorites((prev) =>
        prev.includes(foodId) ? prev.filter((id) => id !== foodId) : [...prev, foodId]
      )
      return added
    },
    [favorites]
  )

  const isFavorite = useCallback((foodId) => favorites.includes(foodId), [favorites])

  /** 「这个不要」：本次会话内降低推荐概率 */
  const dislikeFood = useCallback((foodId) => {
    setDislikes((prev) => (prev.includes(foodId) ? prev : [...prev, foodId]))
  }, [])

  const resetDislikes = useCallback(() => setDislikes([]), [])

  /* ---------------------------- 饮料记录 ---------------------------- */

  /**
   * 记录「就喝这个」。
   * 使用独立的 drinkStats，「已决定吃饭顿数」的含义不受影响。
   */
  const recordDrink = useCallback((drink) => {
    if (!drink) return
    setDrinkHistory((prev) => [createDrinkHistoryRecord(drink), ...prev].slice(0, MAX_HISTORY))
    setDrinkStats((prev) => ({
      totalDecided: (prev.totalDecided || 0) + 1,
      firstUsedAt: prev.firstUsedAt || Date.now(),
    }))
    // 喝过之后把它从「本次不喜欢」里移除，避免长期压制
    setDrinkDislikes((prev) => prev.filter((id) => id !== drink.id))
  }, [])

  const removeDrinkHistoryRecord = useCallback((uid) => {
    setDrinkHistory((prev) => prev.filter((item) => item.uid !== uid))
  }, [])

  const clearDrinkHistory = useCallback(() => setDrinkHistory([]), [])

  /** 收藏 / 取消收藏饮品，返回本次是否为「新增」 */
  const toggleDrinkFavorite = useCallback(
    (drinkId) => {
      const added = !drinkFavorites.includes(drinkId)
      setDrinkFavorites((prev) =>
        prev.includes(drinkId) ? prev.filter((id) => id !== drinkId) : [...prev, drinkId]
      )
      return added
    },
    [drinkFavorites]
  )

  const isDrinkFavorite = useCallback(
    (drinkId) => drinkFavorites.includes(drinkId),
    [drinkFavorites]
  )

  /** 「这个不想喝」：本次会话内降低推荐概率 */
  const dislikeDrink = useCallback((drinkId) => {
    setDrinkDislikes((prev) => (prev.includes(drinkId) ? prev : [...prev, drinkId]))
  }, [])

  const resetDrinkDislikes = useCallback(() => setDrinkDislikes([]), [])

  const value = useMemo(
    () => ({
      exclusions,
      setExclusions,
      history,
      favorites,
      dislikes,
      stats,
      filters,
      updateFilters,
      resetFilters,
      exportBackup,
      importBackup,
      toast,
      showToast,
      dismissToast,
      recordEaten,
      removeHistoryRecord,
      clearHistory,
      toggleFavorite,
      isFavorite,
      dislikeFood,
      resetDislikes,
      // 饮料模块
      drinkHistory,
      drinkFavorites,
      drinkDislikes,
      drinkStats,
      drinkExclusions,
      setDrinkExclusions,
      drinkFilters,
      updateDrinkFilters,
      resetDrinkFilters,
      recordDrink,
      removeDrinkHistoryRecord,
      clearDrinkHistory,
      toggleDrinkFavorite,
      isDrinkFavorite,
      dislikeDrink,
      resetDrinkDislikes,
    }),
    [
      exclusions,
      history,
      favorites,
      dislikes,
      stats,
      filters,
      updateFilters,
      resetFilters,
      exportBackup,
      importBackup,
      toast,
      showToast,
      dismissToast,
      recordEaten,
      removeHistoryRecord,
      clearHistory,
      toggleFavorite,
      isFavorite,
      dislikeFood,
      resetDislikes,
      drinkHistory,
      drinkFavorites,
      drinkDislikes,
      drinkStats,
      drinkExclusions,
      drinkFilters,
      updateDrinkFilters,
      resetDrinkFilters,
      recordDrink,
      removeDrinkHistoryRecord,
      clearDrinkHistory,
      toggleDrinkFavorite,
      isDrinkFavorite,
      dislikeDrink,
      resetDrinkDislikes,
    ]
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState 必须在 AppStateProvider 内使用')
  return ctx
}
