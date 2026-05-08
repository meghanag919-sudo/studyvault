import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, FolderUp, Trash2 } from 'lucide-react'
import SceneLayout from './SceneLayout'
import { useApp } from '../context/AppContext'

const adminActions = [
  {
    key: 'upload',
    title: 'Upload Notes',
    description: 'Add new notes for upcoming units and semesters.',
    icon: FolderUp,
    tone: 'tone-upload',
  },
  {
    key: 'verify',
    title: 'Verify Notes',
    description: 'Review submissions and mark trusted material as verified.',
    icon: CheckCircle2,
    tone: 'tone-verify',
  },
  {
    key: 'delete',
    title: 'Delete Notes',
    description: 'Remove outdated or duplicate content from the library.',
    icon: Trash2,
    tone: 'tone-delete',
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, delay: i * 0.1, ease: 'easeOut' },
  }),
}

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { dispatch } = useApp()

  const handleActionClick = (actionKey) => {
    dispatch({ type: 'SET_ACTION', payload: actionKey })
    navigate('/admin/languages')
  }

  return (
    <SceneLayout>
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="notes-page-title">Archives</h1>
        <p className="section-subtitle">Oversee the quality and accessibility of knowledge.</p>
        <button className="btn btn-ghost" onClick={() => navigate('/role')} style={{ marginTop: '10px' }}>
          <ArrowLeft size={18} /> Logout
        </button>
      </motion.div>

      <div className="subject-grid">
        {adminActions.map((action, index) => {
          const ActionIcon = action.icon
          return (
            <motion.article
              className="subject-card"
              key={action.key}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -15, rotateY: index % 2 === 0 ? 10 : -10, rotateX: 5 }}
            >
              <div className={`subject-icon ${action.tone}`}>
                <ActionIcon size={36} />
              </div>
              <h2>{action.title}</h2>
              <p>{action.description}</p>
              <button
                className="btn btn-secondary"
                onClick={() => handleActionClick(action.key)}
                style={{ width: '100%', marginTop: 'auto' }}
              >
                Proceed
              </button>
            </motion.article>
          )
        })}
      </div>
    </SceneLayout>

  )
}

export default AdminDashboard
