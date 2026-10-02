import { memo, useId, useState } from 'react'

/** 无操作兜底：父级尚未接入重置逻辑时也不会报错 */
const noop = () => {}

/**
 * 条件筛选面板骨架（食物 / 饮品共用）。
 * ------------------------------------------------------------------
 * 以前 FilterPanel 与 DrinkFilterPanel 两套实现逐行重复
 * （fieldset/legend/头部摘要/重置按钮/匹配数/折叠/忌口区），
 * 现在骨架收敛到这里，差异全部由 props 注入：
 *  - onReset / disabled / matchCount / compact  与原来两套的 props 契约一致
 *  - unitName        匹配数文案里的单位（'种食物' / '种饮品'）
 *  - summaryChips    [{ key, label, value }] 已选条件摘要（由调用方算好传入）
 *  - summaryEmpty    未限制条件时的空态文案
 *  - hasActive       是否有生效的普通条件（控制重置按钮禁用态）
 *  - resetTitle      重置按钮的 title 提示
 *  - expandLabel     紧凑模式下折叠区的按钮文案（如 '风味 / 时段 / 忌口'）
 *  - exclusions / exclusionOptions / exclusionVerb / exclusionNotes / onToggleExclusion
 *  - children        主选项区的 OptionGroup 列表
 *  - extra           折叠区内的 OptionGroup 列表
 */
function FilterPanelBase({
  onReset = noop,
  disabled = false,
  matchCount,
  compact = false,
  unitName,
  summaryChips,
  summaryEmpty,
  hasActive,
  resetTitle,
  expandLabel,
  exclusions,
  exclusionOptions,
  exclusionVerb,
  exclusionNotes,
  onToggleExclusion,
  children,
  extra,
}) {
  const [expanded, setExpanded] = useState(false)
  const extraId = useId()
  const showCount = typeof matchCount === 'number'
  const secondaryOpen = !compact || expanded

  return (
    <fieldset className="filter-panel" disabled={disabled} style={{ border: 0, margin: 0, minWidth: 0 }}>
      <legend className="tiny">筛选条件</legend>

      <div className="filter-panel__head">
        <div className="filter-summary" role="status">
          <span className="filter-summary__title">已选条件</span>
          {summaryChips.length ? (
            <ul className="filter-summary__list">
              {summaryChips.map((item) => (
                <li key={item.key} className="filter-summary__chip">
                  <span className="filter-summary__chip-label">{item.label}</span>
                  <span className="filter-summary__chip-value">{item.value}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="filter-summary__empty">{summaryEmpty}</p>
          )}
        </div>
        <button
          type="button"
          className="btn btn--sm btn--ghost filter-reset"
          onClick={onReset}
          disabled={!hasActive}
          title={resetTitle}
        >
          重置筛选（保留忌口）
        </button>
      </div>

      {showCount ? (
        <p className={`pool-hint pool-hint--inline${matchCount === 0 ? ' is-empty' : ''}`}>
          <span aria-hidden="true">{matchCount === 0 ? '⚠️' : '🔍'}</span>
          <span>
            当前条件匹配到 <strong>{matchCount}</strong> {unitName}
          </span>
        </p>
      ) : null}

      <div className="filter-panel__main">{children}</div>

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
            {expandLabel}
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
          {extra}
          <div className="option-group">
            <div className="option-group__label">忌口（可多选，自动保存）</div>
            <div className="option-group__options">
              {exclusionOptions.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  aria-pressed={exclusions.includes(tag)}
                  className={`option${exclusions.includes(tag) ? ' is-active' : ''}`}
                  onClick={() => onToggleExclusion(tag)}
                >
                  {exclusionVerb}
                  {tag}
                </button>
              ))}
            </div>
            {exclusionNotes}
          </div>
        </div>
      </div>
    </fieldset>
  )
}

export default memo(FilterPanelBase)
