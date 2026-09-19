import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  MAX_HISTORY,
  createHistoryRecord,
  loadDislikes,
  loadFavorites,
  loadHistory,
  loadStats,
  saveDislikes,
  saveFavorites,
  saveHistory,
  saveStats,
} from '../lib/storage'

const AppStateContext = createContext(null)

export function AppStateProvider({ children }) {
  const [history, setHistory] = useState(() => loadHistory())
  const [favorites, setFavorites] = useState(() => loadFavorites())
  const [dislikes, setDislikes] = useState(() => loadDislikes())
  const [stats, setStats] = useState(() => loadStats())
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  /* 任何变更都同步写入本地存储，刷新后数据不丢失 */
  useEffect(() => saveHistory(history), [history])
  useEffect(() => saveFavorites(favorites), [favorites])
  useEffect(() => saveDislikes(dislikes), [dislikes])
  useEffect(() => saveStats(stats), [stats])

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

  const value = useMemo(
    () => ({
      history,
      favorites,
      dislikes,
      stats,
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
    }),
    [
      history,
      favorites,
      dislikes,
      stats,
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
    ]
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState 必须在 AppStateProvider 内使用')
  return ctx
}
