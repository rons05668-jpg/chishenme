import { useEffect, useState } from 'react'

/**
 * 订阅一条 media query，返回当前是否命中。
 * ------------------------------------------------------------------
 * - 纯 CSR 项目，不涉及 SSR；但初始渲染仍可能在 matchMedia 不可用时执行
 *   （老浏览器 / 测试环境），此时退化为 false，避免整页崩溃。
 * - 用 addEventListener('change') 监听，老 Safari 只有废弃的 addListener，
 *   这里做能力检测兜底。
 */
export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined

    const list = window.matchMedia(query)
    const handleChange = (event) => setMatches(event.matches)

    // query 变化时先同步一次，避免沿用上一条 query 的结果
    setMatches(list.matches)

    if (typeof list.addEventListener === 'function') {
      list.addEventListener('change', handleChange)
      return () => list.removeEventListener('change', handleChange)
    }
    list.addListener(handleChange)
    return () => list.removeListener(handleChange)
  }, [query])

  return matches
}
