import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { shortName } from '../data/foods'
import { weightOf } from '../lib/picker'
/** 扇区配色：柔和的暖色循环，保证文字始终清晰可读 */
const SEGMENT_COLORS = [
  '#FFE6D2',
  '#FFF6E4',
  '#FFDCE6',
  '#FFF0E2',
  '#FFEAD2',
  '#FFF7EF',
  '#FFDFF0',
  '#FFF2D9',
  '#FFE7DE',
  '#FFF8E6',
  '#FFE0E0',
  '#FFF3EA',
]

const SIZE = 340
const CENTER = SIZE / 2
const RADIUS = 162
const SPIN_DURATION = 4800
const FULL_TURNS = 5

const polar = (radius, angleDeg) => {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return [CENTER + radius * Math.cos(rad), CENTER + radius * Math.sin(rad)]
}

/**
 * 幸运转盘
 * items       候选列表（2–10 个；零和单候选由页面处理）
 * context     { history, favorites, dislikes }，用于加权决定最终结果
 * onResult    旋转结束后回调，参数为命中的条目
 * shortNameOf 扇区短标签取值的可选覆盖（饮料页传入饮料版短名函数）
 * weightOfFn  权重函数的可选覆盖（默认用食物的 weightOf）
 * ariaLabel   无障碍标签，默认「吃什么转盘」
 */
export default function Wheel({
  items,
  context = {},
  onResult,
  spinLabel = '转一下',
  spinSignal = 0,
  onSpinChange,
  shortNameOf = shortName,
  weightOfFn = weightOf,
  ariaLabel = '吃什么转盘',
}) {
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [winnerIndex, setWinnerIndex] = useState(-1)

  const rotationRef = useRef(0)
  // 保存本次命中的食物对象（而不是下标）：候选列表若在旋转途中被替换，下标会错位
  const pendingRef = useRef(null)
  const timerRef = useRef(null)
  const signalRef = useRef(spinSignal)

  const count = items.length
  const segmentAngle = count ? 360 / count : 0

  useEffect(() => {
    clearTimeout(timerRef.current)
    pendingRef.current = null
    setSpinning(false)
    setWinnerIndex(-1)
  }, [items])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  // 把旋转状态同步给父级（父级据此禁用「换一批」等操作）
  useEffect(() => {
    onSpinChange?.(spinning)
  }, [spinning, onSpinChange])

  const segments = useMemo(() => {
    if (!count) return []
    return items.map((food, index) => {
      const start = index * segmentAngle
      const end = start + segmentAngle
      const mid = start + segmentAngle / 2
      const [x1, y1] = polar(RADIUS, start)
      const [x2, y2] = polar(RADIUS, end)
      const largeArc = segmentAngle > 180 ? 1 : 0
      return {
        food,
        index,
        mid,
        path: `M ${CENTER} ${CENTER} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`,
        color: SEGMENT_COLORS[index % SEGMENT_COLORS.length],
      }
    })
  }, [items, count, segmentAngle])

  /** 按权重决定落点（最近吃过 / 不喜欢的食物概率更低） */
  const pickWinnerIndex = useCallback(() => {
    const weights = items.map((food) => weightOfFn(food, context))
    const total = weights.reduce((sum, weight) => sum + weight, 0)
    if (total <= 0) return Math.floor(Math.random() * count)
    let ticket = Math.random() * total
    for (let i = 0; i < count; i += 1) {
      ticket -= weights[i]
      if (ticket <= 0) return i
    }
    return count - 1
  }, [items, context, count, weightOfFn])

  const finalize = useCallback(() => {
    const food = pendingRef.current
    if (!food) return
    pendingRef.current = null
    clearTimeout(timerRef.current)
    setSpinning(false)
    setWinnerIndex(items.findIndex((item) => item.id === food.id))
    onResult?.(food)
  }, [items, onResult])

  const spin = () => {
    if (spinning || count < 2) return

    const winner = pickWinnerIndex()
    const centerAngle = winner * segmentAngle + segmentAngle / 2
    const base = rotationRef.current
    // 让扇区中心对准顶部指针，并叠加一点随机偏移，落点更自然
    const delta = (360 - ((base + centerAngle) % 360)) % 360
    const jitterRange = Math.max(0, segmentAngle - 16) * 0.5
    const jitter = (Math.random() - 0.5) * 2 * jitterRange
    const next = base + 360 * FULL_TURNS + delta + jitter

    rotationRef.current = next
    pendingRef.current = items[winner]
    setWinnerIndex(-1)
    setSpinning(true)
    setRotation(next)

    // 兜底：即便 transitionend 没有触发（例如系统开启了减弱动效），也能给出结果
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(finalize, SPIN_DURATION + 320)

    // 轻微震动反馈（仅在用户已经与页面交互过时调用，避免浏览器告警）
    if (navigator.vibrate && navigator.userActivation?.hasBeenActive) navigator.vibrate(18)
  }

  const handleTransitionEnd = (event) => {
    if (event.propertyName !== 'transform') return
    if (pendingRef.current) finalize()
  }

  // 支持外部触发（结果面板里的「再转一次」）。
  // 只在 spinSignal 变化时执行，不把 spin 放进依赖：它每次渲染都会重建，
  // 放进去会导致刚停下来就被重新触发。
  useEffect(() => {
    if (spinSignal === signalRef.current) return
    signalRef.current = spinSignal
    spin()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 有意省略 spin，见上方说明
  }, [spinSignal])

  return (
    <div className="wheel-stage">
      <div className="wheel-wrap">
        <div className="wheel-glow" style={{ opacity: spinning ? 1 : 0.6 }} aria-hidden="true" />
        <div className="wheel-ring" aria-hidden="true" />

        <div className={`wheel-pointer${spinning ? ' is-ticking' : ''}`} aria-hidden="true" />

        <svg
          className={`wheel-svg ${spinning ? 'is-spinning' : 'is-idle'}`}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          style={{ transform: `rotate(${rotation}deg)` }}
          onTransitionEnd={handleTransitionEnd}
          role="img"
          aria-label={ariaLabel}
        >
          <circle cx={CENTER} cy={CENTER} r={RADIUS + 2} fill="#fff" />
          {segments.map((segment) => (
            <g key={segment.food.id}>
              <path
                d={segment.path}
                fill={segment.color}
                stroke={winnerIndex === segment.index ? '#FF6B35' : 'rgba(255,255,255,0.9)'}
                strokeWidth={winnerIndex === segment.index ? 3 : 1.5}
              />
              <g transform={`rotate(${segment.mid} ${CENTER} ${CENTER})`}>
                {/* emoji 反向旋转，保持正向朝上，避免出现「躺倒」的表情 */}
                <text
                  x={CENTER}
                  y={CENTER - RADIUS * 0.8}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="15"
                  transform={`rotate(${-segment.mid} ${CENTER} ${CENTER - RADIUS * 0.8})`}
                  aria-hidden="true"
                >
                  {segment.food.emoji}
                </text>
                <text
                  x={CENTER}
                  y={CENTER - RADIUS * 0.6}
                  transform={`rotate(90 ${CENTER} ${CENTER - RADIUS * 0.6})`}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="wheel-seg-label"
                >
                  {shortNameOf(segment.food)}
                </text>
              </g>
            </g>
          ))}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.85)"
            strokeWidth="3"
          />
        </svg>

        <button
          type="button"
          className="wheel-center"
          onClick={spin}
          disabled={spinning || count < 2}
          aria-label="开始旋转"
        >
          {spinning ? (
            <span>
              转动中
              <br />
              <span className="wheel-center__sub">命运安排中…</span>
            </span>
          ) : (
            <span>
              {spinLabel}
              <br />
              <span className="wheel-center__sub">点我</span>
            </span>
          )}
        </button>
      </div>

      <p className="wheel-hint">
        {spinning ? '转盘减速中，马上就要停下来了…' : `共 ${count} 个候选，点中间按钮开始`}
      </p>
    </div>
  )
}
