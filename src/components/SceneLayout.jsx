/* eslint-disable react/prop-types */
import { motion } from 'framer-motion'

const pageVariants = {
  initial: { opacity: 0, x: 40, rotateY: 8 },
  animate: { opacity: 1, x: 0, rotateY: 0 },
  exit: { opacity: 0, x: -40, rotateY: -8 },
}

const SceneLayout = ({ children }) => (
  <div className="scene-page" style={{ perspective: '1400px' }}>
    <main className="scene-content">
      <motion.div
        className="panel-wrap"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {children}
      </motion.div>
    </main>
  </div>
)

export default SceneLayout
