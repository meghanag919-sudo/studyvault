import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Atom, Braces, Bug, Database, Globe, Layers } from 'lucide-react'
import SceneLayout from './SceneLayout'
import { useApp } from '../context/AppContext'

const languages = [
  { name: 'Python', slug: 'python', icon: Braces, accent: 'accent-python', desc: 'Master the serpent’s code and scripting magic.' },
  { name: 'HTML/CSS', slug: 'html-css', icon: Globe, accent: 'accent-html', desc: 'Forge the structure and aesthetics of the web.' },
  { name: 'JavaScript', slug: 'javascript', icon: Atom, accent: 'accent-js', desc: 'Bring your creations to life with dynamic logic.' },
  { name: 'React', slug: 'react', icon: Layers, accent: 'accent-react', desc: 'Build reactive universes with component magic.' },
  { name: 'SQL', slug: 'sql', icon: Database, accent: 'accent-sql', desc: 'Organize vast knowledge in relational vaults.' },
]

const cardVariants = {
  hidden: { opacity: 0, y: 30, rotateX: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
}

const LanguagePage = () => {
  const navigate = useNavigate()
  const { state, dispatch } = useApp()

  const isAdmin = state.role === 'admin'
  const backPath = isAdmin ? '/admin-dashboard' : '/role'
  const backLabel = isAdmin ? 'Back to Dashboard' : 'Back to Selection'

  const handleLanguageSelect = (languageItem) => {
    dispatch({ type: 'SET_LANGUAGE', payload: languageItem.name })
    if (isAdmin) {
      navigate(`/admin/topics/${languageItem.slug}`)
    } else {
      navigate(`/notes/${languageItem.slug}`)
    }
  }

  return (
    <SceneLayout>
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="notes-page-title">Digital Library</h1>
        <p className="section-subtitle">
          {isAdmin
            ? `Choose a scroll to manage ${state.action}s`
            : 'Select a subject and access verified scrolls'}
        </p>
        <button className="btn btn-ghost" onClick={() => navigate(backPath)} style={{ marginTop: '10px' }}>
          <ArrowLeft size={18} /> {backLabel}
        </button>
      </motion.div>

      <div className="subject-grid">
        {languages.map(({ name, slug, icon: Icon, accent, desc }, index) => (
          <motion.article
            className="subject-card"
            key={name}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -15, rotateY: index % 2 === 0 ? 10 : -10, rotateX: 5 }}
          >
            <div className={`subject-icon ${accent}`}>
              <Icon size={36} />
            </div>
            <h2>{name}</h2>
            <p>{desc}</p>
            <button
              className="btn btn-secondary"
              onClick={() => handleLanguageSelect({ name, slug })}
              style={{ width: '100%', marginTop: 'auto' }}
            >
              Open Vault
            </button>
          </motion.article>
        ))}
      </div>
    </SceneLayout>
  )
}


export default LanguagePage
