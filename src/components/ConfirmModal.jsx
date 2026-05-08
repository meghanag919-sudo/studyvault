import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'

const ConfirmModal = ({ open, title, message, onConfirm, onCancel }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onCancel}
      >
        <motion.div
          className="glass-panel modal-content confirm-modal"
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="confirm-modal-icon">
            <AlertTriangle size={38} />
          </div>
          <h2 className="confirm-modal-title">{title || 'Confirm Action'}</h2>
          <p className="confirm-modal-message">{message || 'Are you sure you want to proceed?'}</p>
          <div className="confirm-modal-actions">
            <button className="btn btn-ghost" type="button" onClick={onCancel}>
              <X size={16} />
              Cancel
            </button>
            <button className="btn btn-danger-solid" type="button" onClick={onConfirm}>
              <AlertTriangle size={16} />
              Confirm Delete
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
)

export default ConfirmModal
