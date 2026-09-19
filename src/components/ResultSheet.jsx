import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import FoodResultCard from './FoodResultCard'

/**
 * 底部弹出结果面板（转盘停止后展示）
 */
export default function ResultSheet({ food, open, onClose, onEat, onReroll, onDislike }) {
  // Esc 关闭，桌面端也能顺手用
  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && food ? (
        <motion.div
          className="sheet-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
        >
          <motion.div
            className="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="转盘结果"
          >
            <div className="sheet__handle" />
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
            <button type="button" className="btn btn--quiet btn--block" onClick={onClose}>
              先不看，我再想想
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
