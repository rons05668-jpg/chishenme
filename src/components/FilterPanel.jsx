import { memo } from 'react'
import { BUDGETS } from '../data/foods'
import { CATEGORY_OPTIONS, SCENE_OPTIONS, TASTE_OPTIONS } from '../lib/content'
import OptionGroup from './OptionGroup'

const BUDGET_OPTIONS = BUDGETS.map((item) => ({ value: item.key, label: item.label }))

/**
 * 条件筛选面板：预算 / 口味 / 类型 / 场景
 * onChange 接收「增量补丁」，由父级用函数式更新合并，
 * 保证连续快速点击多个条件时不会相互覆盖。
 */
function FilterPanel({ filters, onChange }) {
  return (
    <div className="filter-panel">
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
    </div>
  )
}

export default memo(FilterPanel)
