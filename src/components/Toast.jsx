import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { useApp } from '../context/AppContext'

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}

const Toast = () => {
  const { state, dispatch } = useApp()
  const toast = state.toast

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => {
      dispatch({ type: 'HIDE_TOAST' })
    }, 3500)
    return () => clearTimeout(timer)
  }, [toast, dispatch])

  return (
    <div className="toast-container" aria-live="polite">
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`toast toast-${toast.type || 'info'}`}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {(() => {
              const Icon = iconMap[toast.type] || Info
              return <Icon size={20} className="toast-icon" />
            })()}
            <span className="toast-message">{toast.message}</span>
            <button
              className="toast-close"
              type="button"
              aria-label="Dismiss"
              onClick={() => dispatch({ type: 'HIDE_TOAST' })}
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Toast
