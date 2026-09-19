import { useCallback, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import FilterPanel from '../components/FilterPanel'
import FoodResultCard from '../components/FoodResultCard'
import TopBar from '../components/TopBar'
import { DEFAULT_FILTERS, toPickerFilters } from '../lib/filters'
import { EMPTY_POOL_HINT, EMPTY_RESULT_HINT } from '../lib/content'
import { filterFoods } from '../lib/picker'
import useDecider from '../hooks/useDecider'
import { useAppState } from '../state/AppState'

export default function RandomPage() {
  const { history, favorites, dislikes, recordEaten, dislikeFood, showToast } = useAppState()
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  const pickerFilters = useMemo(() => toPickerFilters(filters), [filters])
  const pool = useMemo(() => filterFoods(pickerFilters), [pickerFilters])

  const context = useMemo(
    () => ({ history, dislikes, favorites }),
    [history, dislikes, favorites]
  )

  const { rolling, result, rollEmoji, decide, setResult } = useDecider(pool, context)

  // 函数式更新：连续点选多个条件时不会相互覆盖
  const applyFilters = useCallback((patch) => {
    setFilters((prev) => ({ ...prev, ...patch }))
  }, [])

  const handleDecide = () => {
    if (!pool.length) {
      showToast('这个组合下没有可选的食物', '🤔')
      return
    }
    decide()
  }

  const handleReroll = () => {
    decide(result ? [result.id] : [])
  }

  const handleDislike = (food) => {
    dislikeFood(food.id)
    showToast('已减少它的出现概率', '🙅')
    decide([food.id])
  }

  const handleEat = (food) => {
    recordEaten(food)
    showToast(`已记录：${food.name}`, '✅')
  }

  return (
    <div className="page">
      <TopBar title="随机吃什么" subtitle="先定条件，再交给运气" />

      <FilterPanel filters={filters} onChange={applyFilters} />

      <div className="pool-hint">
        <span aria-hidden="true">🔍</span>
        <span>
          当前条件匹配到 <strong>{pool.length}</strong> 种食物
          {pool.length === 0 ? '，试着放宽一个条件' : ''}
        </span>
      </div>

      <div className="dice-wrap">
        <button
          type="button"
          className={`btn btn--primary btn--lg btn--block dice-btn${rolling ? ' is-rolling' : ''}`}
          onClick={handleDecide}
          disabled={rolling || pool.length === 0}
        >
          <span className="dice-btn__emoji" aria-hidden="true">
            🎲
          </span>
          {rolling ? '正在翻牌…' : '帮我决定'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {rolling ? (
          <motion.div
            key="rolling"
            className="rolling-state"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
          >
            <span className="rolling-state__emoji" aria-hidden="true">
              {rollEmoji}
            </span>
            <span className="muted">正在为你翻牌…</span>
          </motion.div>
        ) : result ? (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <FoodResultCard
              food={result}
              onEat={handleEat}
              onReroll={handleReroll}
              onDislike={handleDislike}
            />
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            className="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <span className="empty__emoji" aria-hidden="true">
              🥢
            </span>
            <span className="empty__title">还没有决定吃什么</span>
            <span className="empty__text">
              {pool.length ? EMPTY_RESULT_HINT : EMPTY_POOL_HINT}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {result ? (
        <button
          type="button"
          className="btn btn--quiet btn--block"
          onClick={() => setResult(null)}
        >
          收起结果
        </button>
      ) : null}
    </div>
  )
}
