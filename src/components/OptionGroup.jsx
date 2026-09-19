import { memo } from 'react'

/**
 * 选项选择器（单选）
 * options 支持字符串数组或 [{ value, label }] 结构
 */
function OptionGroup({ icon, label, options, value, onChange }) {
  const normalized = options.map((option) =>
    typeof option === 'string' ? { value: option, label: option } : option
  )

  return (
    <div className="option-group">
      <div className="option-group__label">
        {icon ? <span aria-hidden="true">{icon}</span> : null}
        <span>{label}</span>
      </div>
      <div className="option-group__options">
        {normalized.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`option${value === option.value ? ' is-active' : ''}`}
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default memo(OptionGroup)
