import { AnimatePresence, motion } from 'framer-motion'
import { useToastState } from '../state/AppState'

/** 全局轻提示 */
export default function Toast() {
  const { toast } = useToastState()

  return (
    <AnimatePresence>
      {toast ? (
        <motion.div
          key={toast.key}
          className="toast"
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 18, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
        >
          <span aria-hidden="true">{toast.emoji}</span>
          <span>{toast.message}</span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
