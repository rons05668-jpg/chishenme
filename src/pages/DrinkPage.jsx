import { useCallback, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import DrinkFilterPanel from '../components/DrinkFilterPanel'
import DrinkResultCard from '../components/DrinkResultCard'
import TopBar from '../components/TopBar'
import Wheel from '../components/Wheel'
import {
  buildDrinkWheelPool,
  filterDrinks,
  pickDrinkByBrand,
  suggestDrinkRelaxations,
  toDrinkPickerFilters,
  weightOfDrink,
} from '../lib/drinkPicker'
import { drinkShortName } from '../data/drinks'
import { EMPTY_DRINK_POOL_HINT, EMPTY_DRINK_RESULT_HINT } from '../lib/content'
import useMediaQuery from '../hooks/useMediaQuery'
import { useAppState } from '../state/AppState'

/**
 * 「喝什么」页面
 * ------------------------------------------------------------------
 * 与「吃什么」平行的独立模块：
 *  - 数据源是 drinks.js，独立的筛选偏好与收藏 / 历史
 *  - 复用 FilterPanel 的交互形态、Wheel 转盘组件与结果卡片布局
 * 玩法：随机（加权抽取）+ 转盘（严格候选），与食物页一致。
 */

const MIN_SEGMENTS = 8
const MAX_SEGMENTS = 10

export default function DrinkPage() {
  const {
    drinkFilters,
    updateDrinkFilters,
    resetDrinkFilters,
    drinkHistory,
    drinkFavorites,
    drinkDislikes,
    drinkExclusions,
    recordDrink,
    dislikeDrink,
    showToast,
  } = useAppState()

  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width: 640px)')

  const [showFilters, setShowFilters] = useState(false)
  const [mode, setMode] = useState('random') // 'random' | 'wheel'
  const [rolling, setRolling] = useState(false)
  const [result, setResult] = useState(null)
  const [sheetDrink, setSheetDrink] = useState(null)

  const pickerFilters = useMemo(
    () => toDrinkPickerFilters({ ...drinkFilters, exclusions: drinkExclusions }),
    [drinkFilters, drinkExclusions]
  )
  const pool = useMemo(() => filterDrinks(pickerFilters), [pickerFilters])

  const context = useMemo(
    () => ({ history: drinkHistory, dislikes: drinkDislikes, favorites: drinkFavorites }),
    [drinkHistory, drinkDislikes, drinkFavorites]
  )

  // 零候选放宽建议：countFor 注入当前忌口，保证建议只涉及普通条件
  const relaxations = useMemo(
    () => suggestDrinkRelaxations(drinkFilters, (next) => filterDrinks(toDrinkPickerFilters({ ...next, exclusions: drinkExclusions })).length),
    [drinkFilters, drinkExclusions]
  )

  const applyRelaxation = (suggestion) => {
    updateDrinkFilters(suggestion.patch)
    showToast(`已放宽「${suggestion.label}」`, '🔓')
  }

  const handleDecide = useCallback(() => {
    if (!pool.length) {
      showToast('这个组合下没有可选的饮品', '🤔')
      return
    }
    setRolling(true)
    setResult(null)
    window.setTimeout(() => {
      // 先等概率选品牌、再在品牌内加权选饮品，避免收录条目多的品牌系统性占优
      const next = pickDrinkByBrand(pool, context)
      setResult(next)
      setRolling(false)
    }, 700)
  }, [pool, context, showToast])

  const handleDrink = (drink) => {
    recordDrink(drink)
    setSheetDrink(null)
    showToast(`已记录：${drink.name}`, '✅')
  }

  const handleDislike = (drink) => {
    dislikeDrink(drink.id)
    setSheetDrink(null)
    setResult(null)
    showToast('已减少它的出现概率', '🙅')
  }

  // 转盘候选：严格筛选，绝不补入条件外饮品
  const wheelItems = useMemo(
    () => (mode === 'wheel' ? buildDrinkWheelPool(pickerFilters, context, MIN_SEGMENTS, MAX_SEGMENTS) : []),
    [mode, pickerFilters, context]
  )

  const handleReload = () => {
    setResult(null)
    setSheetDrink(null)
    showToast('已重置结果', '🔄')
  }

  return (
    <div className="page">
      <TopBar
        title="喝什么"
        subtitle="一杯的选择，也别为难自己"
        right={
          <button type="button" className="btn btn--sm btn--ghost" onClick={() => navigate('/')}>
            🏠 首页
          </button>
        }
      />

      <div className="mode-switch" role="tablist" aria-label="玩法切换">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'random'}
          className={`mode-switch__item${mode === 'random' ? ' is-active' : ''}`}
          onClick={() => setMode('random')}
        >
          🎲 随机一杯
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'wheel'}
          className={`mode-switch__item${mode === 'wheel' ? ' is-active' : ''}`}
          onClick={() => setMode('wheel')}
        >
          🎡 转转盘
        </button>
      </div>

      <button
        type="button"
        className="filter-toggle"
        onClick={() => setShowFilters((value) => !value)}
        aria-expanded={showFilters}
      >
        <span className="filter-toggle__text">
          <span aria-hidden="true">🎛️</span>
          筛选条件（当前匹配 {pool.length} 种）
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
            <DrinkFilterPanel
              filters={drinkFilters}
              onChange={updateDrinkFilters}
              onReset={resetDrinkFilters}
              matchCount={pool.length}
              compact={isMobile}
              disabled={rolling}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/*
        抽样规则说明。
        需求要求说明跨品牌随机策略：默认「先等概率选品牌、再在品牌内选饮品」，
        这样某品牌不会仅因为收录条目更多就更容易被抽中。
        固定展示在筛选区下方，避免用户误以为某品牌永远抽不到。
      */}
      {pool.length > 0 ? (
        <p className="tiny drink-sampling-note">
          <span aria-hidden="true">🎯</span> 随机规则：先等概率选中一个品牌，再在该品牌内挑选饮品，避免收录多的品牌更容易被抽到
        </p>
      ) : null}

      {/* ---------------------------- 零候选 ---------------------------- */}
      {pool.length === 0 ? (
        <>
          <div className="pool-hint pool-hint--relax" role="status">
            <span aria-hidden="true">💡</span>
            <span>
              {relaxations.length ? (
                <span>点一下就能放宽某一个条件（忌口不会被改动）：</span>
              ) : (
                <span>当前主要是忌口限制导致没有候选。忌口不会被自动放宽，你可以自行调整。</span>
              )}
            </span>
          </div>
          {relaxations.length ? (
            <ul className="relax-list">
              {relaxations.map((suggestion) => (
                <li key={suggestion.key} className="relax-list__item">
                  <button
                    type="button"
                    className="option"
                    onClick={() => applyRelaxation(suggestion)}
                    aria-label={`放宽${suggestion.label}，去掉${suggestion.from}，可多 ${suggestion.gain} 种饮品`}
                  >
                    放宽「{suggestion.label}」（去掉 {suggestion.from}）→ 可多 {suggestion.gain} 种
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </>
      ) : null}

      {/* ---------------------------- 随机模式 ---------------------------- */}
      {mode === 'random' ? (
        <>
          <div className="dice-wrap">
            <button
              type="button"
              className={`btn btn--primary btn--lg btn--block dice-btn${rolling ? ' is-rolling' : ''}`}
              onClick={handleDecide}
              disabled={rolling || pool.length === 0}
            >
              <span className="dice-btn__emoji" aria-hidden="true">
                🥤
              </span>
              {rolling ? '正在选…' : '帮我选一杯'}
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
                  🧊
                </span>
                <span className="muted">正在为你挑选…</span>
              </motion.div>
            ) : result && pool.some((drink) => drink.id === result.id) ? (
              <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <DrinkResultCard
                  drink={result}
                  onEat={handleDrink}
                  onReroll={handleDecide}
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
                  🥤
                </span>
                <span className="empty__title">还没有决定喝什么</span>
                <span className="empty__text">
                  {pool.length ? EMPTY_DRINK_RESULT_HINT : EMPTY_DRINK_POOL_HINT}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {result ? (
            <button type="button" className="btn btn--quiet btn--block" onClick={() => setResult(null)}>
              收起结果
            </button>
          ) : null}
        </>
      ) : (
        /* ---------------------------- 转盘模式 ---------------------------- */
        <>
          {wheelItems.length === 0 ? (
            <div className="empty" role="status">
              <span className="empty__title">没有符合条件的饮品</span>
              <span className="empty__text">请放宽条件或调整忌口。</span>
            </div>
          ) : wheelItems.length === 1 ? (
            <>
              <p className="pool-hint">只有一个候选，就选它吧。</p>
              <DrinkResultCard
                drink={wheelItems[0]}
                onEat={handleDrink}
                onReroll={handleReload}
                onDislike={handleDislike}
              />
            </>
          ) : (
            <Wheel
              items={wheelItems}
              context={context}
              onResult={setSheetDrink}
              spinSignal={0}
              spinLabel="转一下"
              shortNameOf={drinkShortName}
              weightOfFn={weightOfDrink}
              ariaLabel="喝什么转盘"
            />
          )}

          <div className="card card--tint">
            <div className="section-title">🎯 转盘说明</div>
            <p className="tiny" style={{ marginTop: 6, lineHeight: 1.7 }}>
              转盘候选严格符合筛选和忌口条件；停下来的那一格就是今天的答案，点击中间的按钮开始。
            </p>
          </div>
        </>
      )}

      {/* 结果弹层（转盘模式） */}
      <DrinkResultSheet
        drink={sheetDrink}
        onClose={() => setSheetDrink(null)}
        onDrink={handleDrink}
        onReroll={handleReload}
        onDislike={handleDislike}
      />

      {drinkFavorites.length || drinkHistory.length ? (
        <p className="tiny" style={{ textAlign: 'center' }}>
          已收藏 {drinkFavorites.length} 种 · 最近喝过 {drinkHistory.length} 条（与食物的记录相互独立）
        </p>
      ) : null}
    </div>
  )
}

/**
 * 转盘结果的底部弹层（与 ResultSheet 同构，展示饮品卡片）
 */
function DrinkResultSheet({ drink, onClose, onDrink, onReroll, onDislike }) {
  if (!drink) return null
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div
        className="sheet"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="转盘结果"
      >
        <div className="sheet__handle" />
        <DrinkResultCard
          drink={drink}
          eyebrow="🎉 转盘结果"
          onEat={onDrink}
          onReroll={onReroll}
          onDislike={onDislike}
          rerollLabel="🎡 再转一次"
          eatLabel="✅ 就喝这个"
          showFavorite={false}
        />
        <button type="button" className="btn btn--quiet btn--block" onClick={onClose}>
          先不喝，我再想想
        </button>
      </div>
    </div>
  )
}
