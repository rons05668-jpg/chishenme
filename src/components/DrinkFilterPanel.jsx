import { memo } from 'react'
import { DRINK_BUDGETS, DRINK_CATEGORIES, CAFFEINE_LEVELS, TEMPERATURES, DRINK_SCENES, DRINK_EXCLUSIONS } from '../data/drinks-meta'
import { BRANDS } from '../data/brands'
import { useAppState } from '../state/AppState'
import { activeDrinkFilterKeys, describeActiveDrinkFilters } from '../lib/drinkPicker'
import FilterPanelBase from './FilterPanelBase'
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
 * 面板骨架收敛到 FilterPanelBase，这里只保留饮品特有的选项组与忌口文案。
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

  const summary = describeActiveDrinkFilters(filters)
  const hasActive = activeDrinkFilterKeys(filters).length > 0

  const toggleExclusion = (tag) => {
    setDrinkExclusions((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    )
  }

  return (
    <FilterPanelBase
      onReset={onReset}
      disabled={disabled}
      matchCount={matchCount}
      compact={compact}
      unitName="种饮品"
      summaryChips={summary}
      summaryEmpty="当前未限制条件，交给运气吧"
      hasActive={hasActive}
      resetTitle="只清除品牌 / 预算 / 冷热 / 类型 / 场景 / 咖啡因，忌口会保留"
      expandLabel="咖啡因 / 忌口"
      exclusions={drinkExclusions}
      exclusionOptions={DRINK_EXCLUSIONS}
      exclusionVerb="不要"
      exclusionNotes={
        <>
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
        </>
      }
      onToggleExclusion={toggleExclusion}
      extra={
        <>
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
        </>
      }
    >
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
    </FilterPanelBase>
  )
}

export default memo(DrinkFilterPanel)
