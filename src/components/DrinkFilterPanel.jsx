import { memo, useId, useState } from 'react'
import { DRINK_BUDGETS, DRINK_CATEGORIES, CAFFEINE_LEVELS, TEMPERATURES, DRINK_SCENES, DRINK_EXCLUSIONS } from '../data/drinks'
import { BRANDS } from '../data/brands'
import { useAppState } from '../state/AppState'
import { activeDrinkFilterKeys, describeActiveDrinkFilters } from '../lib/drinkPicker'
import OptionGroup from './OptionGroup'

const BUDGET_OPTIONS = DRINK_BUDGETS.map((item) => ({ value: item.key, label: item.label }))

/**
 * 品牌选项：不限 + 各品牌。
 * 仅列出「确实有可推荐饮品」的品牌，避免用户选中某品牌后恒为零候选。
 */
const BRAND_OPTIONS = ['随机', ...BRANDS.map((brand) => brand.id)]

/** 品牌 id -> 名称，供 OptionGroup 展示 */
const BRAND_LABELS = BRANDS.reduce((acc, brand) => {
  acc[brand.id] = brand.name
  return acc
}, {})

/** 无操作兜底：父级尚未接入重置逻辑时也不会报错 */
const noop = () => {}

/**
 * 饮料条件筛选面板：品牌 / 预算 / 冷热 / 类型 / 场景 / 咖啡因 / 忌口
 * ------------------------------------------------------------------
 * props 契约（与食物版 FilterPanel 保持一致）：
 *  - filters      { budgetKey, temperature, category, scene, sugar, caffeine }
 *  - onChange     增量补丁，由父级函数式合并
 *  - onReset      重置「普通筛选」，父级保证不动忌口
 *  - disabled     面板整体禁用
 *  - matchCount   当前条件匹配数量，undefined 时不渲染
 *  - compact      true = 手机端紧凑模式，次要条件折叠
 */
function DrinkFilterPanel({
  filters,
  onChange,
  onReset = noop,
  disabled = false,
  matchCount,
  compact = false,
}) {
  const { drinkExclusions, setDrinkExclusions } = useAppState()
  const [expanded, setExpanded] = useState(false)
  const extraId = useId()

  const summary = describeActiveDrinkFilters(filters)
  const hasActive = activeDrinkFilterKeys(filters).length > 0
  const showCount = typeof matchCount === 'number'
  const secondaryOpen = !compact || expanded

  const toggleExclusion = (tag) => {
    setDrinkExclusions((prev) =>
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
            <p className="filter-summary__empty">当前未限制条件，交给运气吧</p>
          )}
        </div>
        <button
          type="button"
          className="btn btn--sm btn--ghost filter-reset"
          onClick={onReset}
          disabled={!hasActive}
          title="只清除品牌 / 预算 / 冷热 / 类型 / 场景 / 咖啡因，忌口会保留"
        >
          重置筛选（保留忌口）
        </button>
      </div>

      {showCount ? (
        <p className={`pool-hint pool-hint--inline${matchCount === 0 ? ' is-empty' : ''}`}>
          <span aria-hidden="true">{matchCount === 0 ? '⚠️' : '🔍'}</span>
          <span>
            当前条件匹配到 <strong>{matchCount}</strong> 种饮品
          </span>
        </p>
      ) : null}

      <div className="filter-panel__main">
        <OptionGroup
          icon="🏪"
          label="品牌"
          options={BRAND_OPTIONS.map((value) => ({
            value,
            label: value === '随机' ? '不限' : BRAND_LABELS[value],
          }))}
          value={filters.brand}
          onChange={(value) => onChange({ brand: value })}
        />
        <OptionGroup
          icon="💰"
          label="预算"
          options={BUDGET_OPTIONS}
          value={filters.budgetKey}
          onChange={(value) => onChange({ budgetKey: value })}
        />
        <OptionGroup
          icon="🌡️"
          label="冷热"
          options={['随机', ...TEMPERATURES]}
          value={filters.temperature}
          onChange={(value) => onChange({ temperature: value })}
        />
        <OptionGroup
          icon="🥤"
          label="类型"
          options={['随机', ...DRINK_CATEGORIES]}
          value={filters.category}
          onChange={(value) => onChange({ category: value })}
        />
        <OptionGroup
          icon="📍"
          label="场景"
          options={['随机', ...DRINK_SCENES]}
          value={filters.scene}
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
            咖啡因 / 忌口
          </span>
          <span className="filter-more__action">{expanded ? '收起' : '展开'}</span>
        </button>
      ) : null}

      <div id={extraId} className="filter-panel__extra" hidden={compact ? !secondaryOpen : undefined}>
        <div className="filter-panel__extra-inner">
          {/*
            甜度筛选已于 2026-09-20 移除。
            原因：212 条饮品中仅 21 条有官方公示的糖度，且全部属于贡茶
            （其大陆菜单无法统一核实、在售状态为 unknown，默认不进推荐池），
            也就是说推荐池内**没有任何一条**带糖度数据 —— 这个筛选器
            一选就是零候选，属于需求明确禁止的「界面装饰」。
            底层 filters.sugar 字段与偏好持久化保留，避免破坏旧数据兼容；
            若日后补齐糖度数据，把下面这段 OptionGroup 加回即可。
          */}
          <OptionGroup
            label="咖啡因"
            options={['随机', ...CAFFEINE_LEVELS]}
            value={filters.caffeine}
            onChange={(caffeine) => onChange({ caffeine })}
          />
          <div className="option-group">
            <div className="option-group__label">忌口（可多选，自动保存）</div>
            <div className="option-group__options">
              {DRINK_EXCLUSIONS.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  aria-pressed={drinkExclusions.includes(tag)}
                  className={`option${drinkExclusions.includes(tag) ? ' is-active' : ''}`}
                  onClick={() => toggleExclusion(tag)}
                >
                  不要{tag}
                </button>
              ))}
            </div>
            <p className="tiny">
              咖啡因会排除含咖啡因的全部饮品；乳制品会排除奶茶、拿铁类。忌口不在「重置筛选」范围内。
            </p>
            {/*
              诚实告知数据局限：忌口是基于「已核验到的公开信息」判断的，
              未公示的信息不会被自动排除。不写明这一点，用户会误以为
              勾了忌口就万无一失。
            */}
            {drinkExclusions.length > 0 ? (
              <p className="tiny">
                忌口按已核验的公开信息判断；品牌未公示的信息无法代为排除，
                有过敏或严格忌口需求请向门店确认。
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </fieldset>
  )
}

export default memo(DrinkFilterPanel)
