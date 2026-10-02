import { useCallback, useEffect, useRef, useState } from 'react'
import { pickFood } from '../lib/picker'

/**
 * 「帮我决定」的抽取流程：
 * 先播放一小段翻牌动画，再按权重给出结果。
 *
 * 候选池与加权上下文通过 ref 读取最新值：
 * 900ms 的动画期间用户仍可能调整条件，若闭包捕获旧数组，
 * 就会出现「结果不在当前候选里」的情况。
 */
export default function useDecider(pool, context, delay = 900) {
  const [rolling, setRolling] = useState(false)
  const [result, setResult] = useState(null)
  const [rollEmoji, setRollEmoji] = useState('🎲')

  const timeoutRef = useRef(null)
  const intervalRef = useRef(null)
  const poolRef = useRef(pool)
  const contextRef = useRef(context)

  useEffect(() => {
    poolRef.current = pool
    contextRef.current = context
  }, [pool, context])

  const clear = useCallback(() => {
    clearTimeout(timeoutRef.current)
    clearInterval(intervalRef.current)
  }, [])

  useEffect(() => clear, [clear])

  const decide = useCallback(
    (excludeIds = []) => {
      if (!poolRef.current.length) return false

      clear()
      setRolling(true)
      setResult(null)

      intervalRef.current = setInterval(() => {
        const current = poolRef.current
        if (!current.length) return
        setRollEmoji(current[Math.floor(Math.random() * current.length)].emoji)
      }, 90)

      timeoutRef.current = setTimeout(() => {
        clearInterval(intervalRef.current)
        const current = poolRef.current
        // 动画期间用户可能改筛选导致候选池变空：此时不抽取、直接结束翻牌状态，
        // 与上面的 setInterval 回调守卫保持一致。
        if (!current.length) {
          setRolling(false)
          return
        }
        const candidates = current.filter((food) => !excludeIds.includes(food.id))
        setResult(pickFood(candidates.length ? candidates : current, contextRef.current))
        setRolling(false)
      }, delay)

      return true
    },
    [delay, clear]
  )

  return { rolling, result, rollEmoji, decide, clear, setResult }
}
