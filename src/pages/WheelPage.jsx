import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import FilterPanel from '../components/FilterPanel'
import ResultSheet from '../components/ResultSheet'
import TopBar from '../components/TopBar'
import Wheel from '../components/Wheel'
import FoodResultCard from '../components/FoodResultCard'
import { DEFAULT_FILTERS, summarizeFilters, toPickerFilters } from '../lib/filters'
import { buildWheelPool } from '../lib/picker'
import { useAppState } from '../state/AppState'

const MIN_SEGMENTS = 8
const MAX_SEGMENTS = 10

export default function WheelPage() {
  const { history, favorites, dislikes, exclusions, recordEaten, dislikeFood, showToast } = useAppState()
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [showFilters, setShowFilters] = useState(false)
  const [batch, setBatch] = useState(0)
  const [spinSignal, setSpinSignal] = useState(0)
  const [sheetFood, setSheetFood] = useState(null)
  const [spinning, setSpinning] = useState(false)

  const applyFilters = useCallback((patch) => {
    setFilters((prev) => ({ ...prev, ...patch }))
  }, [])

  const pickerFilters = useMemo(() => toPickerFilters({ ...filters, exclusions }), [filters, exclusions])
  useEffect(() => setSheetFood(null), [pickerFilters])
  const context = useMemo(() => ({ history, dislikes, favorites }), [history, dislikes, favorites])

  // 用 ref 读取最新的加权上下文：候选只在「条件变化」或「换一批」时重算，
  // 否则用户点完「就吃这个」后转盘会在眼前悄悄换掉一批候选。
  const contextRef = useRef(context)
  useEffect(() => {
    contextRef.current = context
  }, [context])

  const items = useMemo(
    () => buildWheelPool(pickerFilters, contextRef.current, MIN_SEGMENTS, MAX_SEGMENTS),
    [pickerFilters, batch]
  )

  const handleResult = (food) => setSheetFood(food)

  const handleEat = (food) => {
    recordEaten(food)
    setSheetFood(null)
    showToast(`已记录：${food.name}`, '✅')
  }

  const handleReroll = () => {
    setSheetFood(null)
    setSpinSignal((value) => value + 1)
  }

  const handleDislike = (food) => {
    dislikeFood(food.id)
    setSheetFood(null)
    setBatch((value) => value + 1)
    setSpinSignal((value) => value + 1)
    showToast('换掉它，重新转一次', '🙅')
  }

  const handleNewBatch = () => {
    setBatch((value) => value + 1)
    setSheetFood(null)
    showToast('已换一批候选', '🔄')
  }

  return (
    <div className="page">
      <TopBar
        title="吃什么转盘"
        subtitle="转到什么就吃什么，不许反悔"
        right={
          <button
            type="button"
            className="btn btn--sm btn--ghost"
            onClick={handleNewBatch}
            disabled={spinning}
          >
            🔄 换一批
          </button>
        }
      />

      <button
        type="button"
        className="filter-toggle"
        onClick={() => setShowFilters((value) => !value)}
      >
        <span className="filter-toggle__text">
          <span aria-hidden="true">🎛️</span>
          {summarizeFilters({ ...filters, exclusions })}
        </span>
        <span className="filter-toggle__action">{showFilters ? '收起' : '修改'}</span>
      </button>

      <AnimatePresence initial={false}>
        {showFilters ? (
          <motion.div
            key="filters"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.26, ease: [0.22, 0.9, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <FilterPanel filters={filters} onChange={applyFilters} disabled={spinning} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {items.length === 0 ? (
        <div className="empty" role="status">
          <span className="empty__title">没有符合条件的食物</span>
          <span className="empty__text">请放宽条件或调整忌口。</span>
        </div>
      ) : items.length === 1 ? (
        <>
          <p className="pool-hint">只有一个候选，就选它吧。</p>
          <FoodResultCard food={items[0]} onEat={handleEat} onReroll={handleNewBatch} onDislike={handleDislike} />
        </>
      ) : <Wheel
        items={items}
        context={context}
        onResult={handleResult}
        spinSignal={spinSignal}
        onSpinChange={setSpinning}
        spinLabel="转一下"
      />}

      <div className="card card--tint">
        <div className="section-title">🎯 转盘说明</div>
        <p className="tiny" style={{ marginTop: 6, lineHeight: 1.7 }}>
          转盘候选严格符合筛选和忌口条件，并优先选择最近没吃过的食物；
          停下来的那一格就是今天的答案，点击中间的按钮开始。
        </p>
      </div>

      <ResultSheet
        food={sheetFood}
        open={Boolean(sheetFood)}
        onClose={() => setSheetFood(null)}
        onEat={handleEat}
        onReroll={handleReroll}
        onDislike={handleDislike}
      />
    </div>
  )
}
