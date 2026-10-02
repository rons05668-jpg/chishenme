import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import FilterPanel from '../components/FilterPanel'
import ResultSheet from '../components/ResultSheet'
import TopBar from '../components/TopBar'
import Wheel from '../components/Wheel'
import FoodResultCard from '../components/FoodResultCard'
import { regionPoolNote, suggestRelaxations, summarizeFilters, toPickerFilters } from '../lib/filters'
import { buildWheelPool, filterFoods } from '../lib/picker'
import useMediaQuery from '../hooks/useMediaQuery'
import { useAppState } from '../state/AppState'

const MAX_SEGMENTS = 10

export default function WheelPage() {
  const { filters, updateFilters, resetFilters, history, favorites, dislikes, exclusions, recordEaten, dislikeFood, showToast } =
    useAppState()
  const [showFilters, setShowFilters] = useState(false)
  const [batch, setBatch] = useState(0)
  const [spinSignal, setSpinSignal] = useState(0)
  const [sheetFood, setSheetFood] = useState(null)
  const [spinning, setSpinning] = useState(false)

  // 手机端：筛选面板切换为紧凑模式（次要条件折叠）
  const isMobile = useMediaQuery('(max-width: 640px)')

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
    () => buildWheelPool(pickerFilters, contextRef.current, MAX_SEGMENTS),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- batch 是有意的「换一批」触发器，不参与计算但必须作为依赖
    [pickerFilters, batch]
  )

  /**
   * 转盘候选就是严格筛选后的池子，所以 countFor 直接用 filterFoods 的结果长度。
   * 同样注入当前忌口，保证建议只涉及普通筛选条件；只计算不应用。
   */
  const relaxations = useMemo(
    () => suggestRelaxations(filters, (next) => filterFoods(toPickerFilters({ ...next, exclusions })).length),
    [filters, exclusions]
  )

  /**
   * 地点维度的补充说明：切到「纽约·Parsons」这类外地时，候选池天然远小于「平时」，
   * 空态里必须说清原因，否则用户会以为数据丢了。「平时」下为空串，不干扰原文案。
   */
  const regionNote = useMemo(() => regionPoolNote(filters), [filters])

  const emptyBlockerText = relaxations.length
    ? '放宽下面任意一个条件，转盘就能转起来（忌口不会被改动）。'
    : regionNote
      ? '当前主要是忌口或地点限制导致没有候选。两者都不会被自动放宽，你可以自行调整。'
      : '当前主要是忌口限制导致没有候选。忌口不会被自动放宽，你可以自行调整。'

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

  // 用户主动应用某条放宽建议
  const applyRelaxation = (suggestion) => {
    updateFilters(suggestion.patch)
    setSheetFood(null)
    showToast(`已放宽「${suggestion.label}」`, '🔓')
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
            <FilterPanel
              filters={filters}
              onChange={updateFilters}
              onReset={resetFilters}
              disabled={spinning}
              matchCount={items.length}
              compact={isMobile}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {items.length === 0 ? (
        <div className="empty" role="status">
          <span className="empty__title">没有符合条件的食物</span>
          <span className="empty__text">{emptyBlockerText}</span>
          {regionNote ? <span className="empty__text">{regionNote}</span> : null}
        </div>
      ) : items.length === 1 ? (
        <>
          <p className="pool-hint">只有一个候选，就选它吧。</p>
          {regionNote ? <p className="pool-hint">{regionNote}</p> : null}
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

      {items.length === 0 && relaxations.length ? (
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
