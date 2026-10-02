import { useEffect, useMemo, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import FoodResultCard from './FoodResultCard'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * 底部弹出结果面板（转盘停止后展示）
 * ------------------------------------------------------------------
 * props:
 *  - food / onEat / onReroll / onDislike   食物结果（默认渲染 FoodResultCard）
 *  - card            自定义卡片节点：传入后替代默认的食物卡片
 *                    （饮品页传入 DrinkResultCard，复用同一套无障碍处理）
 *  - open            是否打开
 *  - onClose         关闭回调（调用方请用 useCallback 包裹，避免重复绑定/解绑）
 *  - title           对话框无障碍名称
 *  - dismissLabel    底部「再想想」按钮文案
 *
 * 无障碍：Esc 关闭、焦点移入并陷阱循环、背景滚动锁定、关闭后焦点归还。
 */
export default function ResultSheet({
  food = null,
  open,
  onClose,
  onEat,
  onReroll,
  onDislike,
  card = null,
  title = '转盘结果',
  dismissLabel = '先不看，我再想想',
}) {
  const sheetRef = useRef(null)
  const restoreRef = useRef(null)

  // 是否开启「减弱动态效果」，开启时面板不做位移、过渡近似瞬时
  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  )

  // 弹窗打开期间的通用处理：Esc 关闭、焦点入内并循环、背景滚动锁定、关闭后还原
  useEffect(() => {
    if (!open) return undefined

    // 记录打开前的焦点，关闭时归还
    restoreRef.current = document.activeElement
    const sheet = sheetRef.current

    // 背景滚动锁定，同时补偿滚动条宽度避免布局跳动
    const { body } = document
    const prevOverflow = body.style.overflow
    const prevPaddingRight = body.style.paddingRight
    const gap = window.innerWidth - document.documentElement.clientWidth
    body.style.overflow = 'hidden'
    if (gap > 0) body.style.paddingRight = `${gap}px`

    const getFocusable = () =>
      sheet ? Array.from(sheet.querySelectorAll(FOCUSABLE)).filter((el) => el.offsetParent !== null || el === document.activeElement) : []

    // 焦点移入弹窗内第一个可聚焦元素，没有则落到容器本身（容器带 tabIndex={-1}）
    const target = getFocusable()[0] || sheet
    target?.focus?.({ preventScroll: true })

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab' || !sheet) return

      // focus trap：Tab / Shift+Tab 在弹窗内循环，不逃逸到背景
      const items = getFocusable()
      if (items.length === 0) {
        event.preventDefault()
        sheet.focus({ preventScroll: true })
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement
      const inside = sheet.contains(active)
      if (event.shiftKey && (active === first || !inside)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (active === last || !inside)) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      // 精确还原滚动状态
      body.style.overflow = prevOverflow
      body.style.paddingRight = prevPaddingRight
      // 焦点归还给打开前的元素（若已从 DOM 移除则安全跳过）
      const restore = restoreRef.current
      if (restore && typeof restore.focus === 'function' && document.contains(restore)) {
        restore.focus({ preventScroll: true })
      }
    }
  }, [open, onClose])

  const backdropTransition = reducedMotion ? { duration: 0 } : { duration: 0.22 }
  const sheetTransition = reducedMotion
    ? { duration: 0 }
    : { type: 'spring', stiffness: 300, damping: 32 }

  const body =
    card ||
    (food ? (
      <FoodResultCard
        food={food}
        eyebrow="🎉 转盘结果"
        onEat={onEat}
        onReroll={onReroll}
        onDislike={onDislike}
        rerollLabel="🎡 再转一次"
        eatLabel="✅ 就吃这个"
        showFavorite={false}
      />
    ) : null)

  return (
    <AnimatePresence>
      {open && body ? (
        <motion.div
          className="sheet-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={backdropTransition}
          onClick={onClose}
        >
          <motion.div
            ref={sheetRef}
            className="sheet"
            initial={reducedMotion ? { opacity: 0 } : { y: '100%' }}
            animate={reducedMotion ? { opacity: 1 } : { y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { y: '100%' }}
            transition={sheetTransition}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
          >
            <div className="sheet__handle" />
            {body}
            <button type="button" className="btn btn--quiet btn--block" onClick={onClose}>
              {dismissLabel}
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
