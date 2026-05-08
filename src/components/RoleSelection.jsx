import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpenCheck, ShieldCheck, Sparkles } from 'lucide-react'
import SceneLayout from './SceneLayout'
import { useApp } from '../context/AppContext'

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.15, ease: 'easeOut' },
  }),
}

const RoleSelection = () => {
  const navigate = useNavigate()
  const { dispatch } = useApp()

  const selectRole = (role, path) => {
    dispatch({ type: 'SET_ROLE', payload: role })
    navigate(path)
  }

  return (
    <SceneLayout>
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="notes-page-title">Identity</h1>
        <p className="section-subtitle">How shall you traverse the vaults today?</p>
      </motion.div>

      <div className="role-grid">
        <motion.article
          className="role-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={0}
          whileHover={{ y: -15, rotateY: 8, rotateX: 5 }}
        >
          <div className="role-icon admin-icon">
            <ShieldCheck size={40} />
          </div>
          <h2>Guardian</h2>
          <p>Manage the library, verify new scrolls, and oversee the archives.</p>
          <button
            className="btn btn-primary"
            onClick={() => selectRole('admin', '/admin-password')}
          >
            Enter Admin
          </button>
        </motion.article>

        <motion.article
          className="role-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={1}
          whileHover={{ y: -15, rotateY: -8, rotateX: 5 }}
        >
          <div className="role-icon user-icon">
            <BookOpenCheck size={40} />
          </div>
          <h2>Scholar</h2>
          <p>Access the vast collection of verified study notes and expand your mind.</p>
          <button
            className="btn btn-gradient"
            onClick={() => selectRole('user', '/languages')}
          >
            Begin Learning
          </button>
        </motion.article>
      </div>
    </SceneLayout>

  )
}

export default RoleSelection
