import { memo } from 'react'
import { BUDGETS, CUISINES, MEALS, EXCLUSIONS } from '../data/foods'
import { useAppState } from '../state/AppState'
import { CATEGORY_OPTIONS, SCENE_OPTIONS, TASTE_OPTIONS } from '../lib/content'
import OptionGroup from './OptionGroup'

const BUDGET_OPTIONS = BUDGETS.map((item) => ({ value: item.key, label: item.label }))

/**
 * 条件筛选面板：预算 / 口味 / 类型 / 场景
 * onChange 接收「增量补丁」，由父级用函数式更新合并，
 * 保证连续快速点击多个条件时不会相互覆盖。
 */
function FilterPanel({ filters, onChange, disabled = false }) {
  const { exclusions, setExclusions } = useAppState()
  return (
    <fieldset className="filter-panel" disabled={disabled} style={{ border: 0, margin: 0, minWidth: 0 }}>
      <legend className="tiny">筛选条件</legend>
      <OptionGroup
        icon="💰"
        label="预算"
        options={BUDGET_OPTIONS}
        value={filters.budgetKey}
        onChange={(value) => onChange({ budgetKey: value })}
      />
      <OptionGroup
        icon="🌶️"
        label="口味"
        options={TASTE_OPTIONS}
        value={filters.taste}
        onChange={(value) => onChange({ taste: value })}
      />
      <OptionGroup
        icon="🍚"
        label="类型"
        options={CATEGORY_OPTIONS}
        value={filters.category}
        onChange={(value) => onChange({ category: value })}
      />
      <OptionGroup
        icon="📍"
        label="场景"
        options={SCENE_OPTIONS}
        value={filters.scene}
        onChange={(value) => onChange({ scene: value })}
      />
      <details>
        <summary>风味与用餐时段</summary>
        <OptionGroup label="风味" options={['随机', ...CUISINES]} value={filters.cuisine}
          onChange={(cuisine) => onChange({ cuisine })} />
        <OptionGroup label="时段" options={['随机', ...MEALS]} value={filters.meal}
          onChange={(meal) => onChange({ meal })} />
      </details>
      <div className="option-group">
        <div className="option-group__label">忌口（可多选，自动保存）</div>
        <div className="option-group__options">
          {EXCLUSIONS.map((tag) => (
            <button type="button" key={tag} aria-pressed={exclusions.includes(tag)}
              className={`option${exclusions.includes(tag) ? ' is-active' : ''}`}
              onClick={() => setExclusions((prev) => prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag])}>
              不吃{tag}
            </button>
          ))}
        </div>
        <p className="tiny">配料不明的组合菜会保守排除。忌口标签不保证过敏安全，请向门店确认配料。</p>
      </div>
    </fieldset>
  )
}

export default memo(FilterPanel)
