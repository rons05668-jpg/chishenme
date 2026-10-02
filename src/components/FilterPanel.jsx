import { memo, useId, useState } from 'react'
import { BUDGETS, CUISINES, MEALS, EXCLUSIONS, REGIONS } from '../data/foods'
import { useAppState } from '../state/AppState'
import { CATEGORY_OPTIONS, SCENE_OPTIONS, TASTE_OPTIONS } from '../lib/content'
import { DEFAULT_FILTERS, NORMAL_FILTER_KEYS, describeActiveFilters } from '../lib/filters'
import OptionGroup from './OptionGroup'

const BUDGET_OPTIONS = BUDGETS.map((item) => ({ value: item.key, label: item.label }))
const REGION_OPTIONS = REGIONS.map((item) => ({ value: item.key, label: item.label }))

/** 无操作兜底：父级尚未接入重置逻辑时也不会报错 */
const noop = () => {}

/**
 * 条件筛选面板：地点 / 预算 / 口味 / 类型 / 场景 / 风味 / 时段 / 忌口
 * ------------------------------------------------------------------
 * props 契约（筛选状态由父级持有，本组件不读 AppState 里的 filters）：
 *  - filters      { region, budgetKey, taste, category, scene, cuisine, meal }
 *  - onChange     增量补丁，由父级用函数式更新合并，保证连点不互相覆盖
 *  - onReset      重置「普通筛选」，由父级实现（父级保证不动忌口）
 *  - disabled     面板整体禁用
 *  - matchCount   当前条件匹配到的候选数量，undefined 时不渲染数量行
 *  - compact      true = 手机端紧凑模式，次要条件收进折叠区
 * 忌口（exclusions）本来就在全局，所以依然从 useAppState() 取；
 * 重置按钮只调用 onReset，绝不在这里碰 setExclusions。
 */
function FilterPanel({
  filters,
  onChange,
  onReset = noop,
  disabled = false,
  matchCount,
  compact = false,
}) {
  const { exclusions, setExclusions } = useAppState()
  const [expanded, setExpanded] = useState(false)
  const extraId = useId()

  // 防御：父级尚未传入 filters 时退回默认值
  const safeFilters = filters || DEFAULT_FILTERS
  const summary = describeActiveFilters(safeFilters)
  const hasActive = NORMAL_FILTER_KEYS.some((key) => summary.some((item) => item.key === key))
  const showCount = typeof matchCount === 'number'
  const secondaryOpen = !compact || expanded

  const toggleExclusion = (tag) => {
    setExclusions((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    )
  }

  return (
    <fieldset className="filter-panel" disabled={disabled} style={{ border: 0, margin: 0, minWidth: 0 }}>
      <legend className="tiny">筛选条件</legend>

      <div className="filter-panel__head">
        <div className="filter-summary" role="status">
          <span className="filter-summary__title">已选条件</span>
          {summary.length ? (
            <ul className="filter-summary__list">
              {summary.map((item) => (
                <li key={item.key} className="filter-summary__chip">
                  <span className="filter-summary__chip-label">{item.label}</span>
                  <span className="filter-summary__chip-value">{item.value}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="filter-summary__empty">当前未限制条件，完全是运气的味道</p>
          )}
        </div>
        <button
          type="button"
          className="btn btn--sm btn--ghost filter-reset"
          onClick={onReset}
          disabled={!hasActive}
          title="只清除地点 / 预算 / 口味 / 类型 / 场景 / 风味 / 时段，不吃标签会保留"
        >
          重置筛选（保留忌口）
        </button>
      </div>

      {showCount ? (
        <p className={`pool-hint pool-hint--inline${matchCount === 0 ? ' is-empty' : ''}`}>
          <span aria-hidden="true">{matchCount === 0 ? '⚠️' : '🔍'}</span>
          <span>
            当前条件匹配到 <strong>{matchCount}</strong> 种食物
          </span>
        </p>
      ) : null}

      <div className="filter-panel__main">
        <OptionGroup
          icon="🌏"
          label="地点"
          options={REGION_OPTIONS}
          value={safeFilters.region}
          onChange={(region) => onChange({ region })}
        />
        <OptionGroup
          icon="💰"
          label="预算"
          options={BUDGET_OPTIONS}
          value={safeFilters.budgetKey}
          onChange={(value) => onChange({ budgetKey: value })}
        />
        <OptionGroup
          icon="🌶️"
          label="口味"
          options={TASTE_OPTIONS}
          value={safeFilters.taste}
          onChange={(value) => onChange({ taste: value })}
        />
        <OptionGroup
          icon="🍚"
          label="类型"
          options={CATEGORY_OPTIONS}
          value={safeFilters.category}
          onChange={(value) => onChange({ category: value })}
        />
        <OptionGroup
          icon="📍"
          label="场景"
          options={SCENE_OPTIONS}
          value={safeFilters.scene}
          onChange={(value) => onChange({ scene: value })}
        />
      </div>

      {compact ? (
        <button
          type="button"
          className="filter-more"
          aria-expanded={expanded}
          aria-controls={extraId}
          onClick={() => setExpanded((value) => !value)}
        >
          <span className="filter-more__text">
            <span aria-hidden="true">➕</span>
            风味 / 时段 / 忌口
          </span>
          <span className="filter-more__action">{expanded ? '收起' : '展开'}</span>
        </button>
      ) : null}

      <div
        id={extraId}
        className="filter-panel__extra"
        hidden={compact ? !secondaryOpen : undefined}
      >
        <div className="filter-panel__extra-inner">
          <OptionGroup
            label="风味"
            options={['随机', ...CUISINES]}
            value={safeFilters.cuisine}
            onChange={(cuisine) => onChange({ cuisine })}
          />
          <OptionGroup
            label="时段"
            options={['随机', ...MEALS]}
            value={safeFilters.meal}
            onChange={(meal) => onChange({ meal })}
          />
          <div className="option-group">
            <div className="option-group__label">忌口（可多选，自动保存）</div>
            <div className="option-group__options">
              {EXCLUSIONS.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  aria-pressed={exclusions.includes(tag)}
                  className={`option${exclusions.includes(tag) ? ' is-active' : ''}`}
                  onClick={() => toggleExclusion(tag)}
                >
                  不吃{tag}
                </button>
              ))}
            </div>
            <p className="tiny">
              配料不明的组合菜会保守排除。忌口标签不保证过敏安全，请向门店确认配料。
              忌口不在「重置筛选」范围内。
            </p>
          </div>
        </div>
      </div>
    </fieldset>
  )
}

export default memo(FilterPanel)
