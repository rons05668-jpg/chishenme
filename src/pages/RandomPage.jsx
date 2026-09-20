import { useCallback, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import FilterPanel from '../components/FilterPanel'
import FoodResultCard from '../components/FoodResultCard'
import TopBar from '../components/TopBar'
import { suggestRelaxations, toPickerFilters } from '../lib/filters'
import { EMPTY_RESULT_HINT } from '../lib/content'
import { filterFoods } from '../lib/picker'
import useDecider from '../hooks/useDecider'
import useMediaQuery from '../hooks/useMediaQuery'
import { useAppState } from '../state/AppState'

export default function RandomPage() {
  const { filters, updateFilters, resetFilters, history, favorites, dislikes, exclusions, recordEaten, dislikeFood, showToast } =
    useAppState()

  // 手机端：筛选面板切换为紧凑模式（次要条件折叠）
  const isMobile = useMediaQuery('(max-width: 640px)')

  const pickerFilters = useMemo(() => toPickerFilters({ ...filters, exclusions }), [filters, exclusions])
  const pool = useMemo(() => filterFoods(pickerFilters), [pickerFilters])

  const context = useMemo(
    () => ({ history, dislikes, favorites }),
    [history, dislikes, favorites]
  )

  const { rolling, result, rollEmoji, decide, setResult } = useDecider(pool, context)

  /**
   * 零候选时的具体放宽建议。
   * countFor 每次都带上当前忌口：算出来的是「在现有忌口不变的前提下」放宽某一个
   * 普通条件能多出多少候选，因此建议里永远不会包含放宽忌口。
   * 这里只计算、不应用——是否放宽完全由用户点击决定。
   */
  const relaxations = useMemo(
    () => suggestRelaxations(filters, (next) => filterFoods(toPickerFilters({ ...next, exclusions })).length),
    [filters, exclusions]
  )

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

  // 用户主动应用某条放宽建议
  const applyRelaxation = (suggestion) => {
    updateFilters(suggestion.patch)
    showToast(`已放宽「${suggestion.label}」`, '🔓')
  }

  return (
    <div className="page">
      <TopBar title="随机吃什么" subtitle="先定条件，再交给运气" />

      <FilterPanel
        filters={filters}
        onChange={updateFilters}
        onReset={resetFilters}
        matchCount={pool.length}
        compact={isMobile}
      />

      <div className="pool-hint">
        <span aria-hidden="true">🔍</span>
        <span>
          当前条件匹配到 <strong>{pool.length}</strong> 种食物
          {pool.length === 0 ? '，下面是可以立刻放宽的条件' : ''}
        </span>
      </div>

      {pool.length === 0 ? (
        <div className="pool-hint pool-hint--relax" role="status">
          <span aria-hidden="true">💡</span>
          <span>
            {relaxations.length ? (
              <span>想更快吃到？点一下就能放宽某一个条件（忌口不会被改动）：</span>
            ) : (
              <span>
                当前主要是忌口限制导致没有候选。忌口不会被自动放宽，你可以自行调整。
              </span>
            )}
          </span>
        </div>
      ) : null}

      {pool.length === 0 && relaxations.length ? (
        <ul className="relax-list">
          {relaxations.map((suggestion) => (
            <li key={suggestion.key} className="relax-list__item">
              <button
                type="button"
                className="option"
                onClick={() => applyRelaxation(suggestion)}
                aria-label={`放宽${suggestion.label}，去掉${suggestion.from}，可多 ${suggestion.gain} 种食物`}
              >
                放宽「{suggestion.label}」（去掉 {suggestion.from}）→ 可多 {suggestion.gain} 种
              </button>
            </li>
          ))}
        </ul>
      ) : null}

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
        ) : result && pool.some((food) => food.id === result.id) ? (
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
              {pool.length ? EMPTY_RESULT_HINT : '放宽下面任意一个条件，候选就会回来。'}
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
