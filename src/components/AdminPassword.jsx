import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LockKeyhole } from 'lucide-react'
import SceneLayout from './SceneLayout'

const AdminPassword = () => {
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()

  const checkPassword = event => {
    event.preventDefault()
    if (password === 'admin123') {
      navigate('/admin-dashboard')
      return
    }
    setErrorMsg('Wrong admin password')
  }

  return (
    <SceneLayout>
      <motion.form
        className="glass-panel auth-panel"
        onSubmit={checkPassword}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <motion.div
          className="floating-icon lock-hero"
          animate={{ rotate: [0, -7, 7, 0], y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <LockKeyhole size={36} />
        </motion.div>
        <h1 className="section-title">Admin Verification</h1>
        <p className="section-subtitle">Enter admin password to continue.</p>

        <label className="input-label" htmlFor="admin-password">
          Admin Password
        </label>
        <input
          id="admin-password"
          className="input-control"
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={event => setPassword(event.target.value)}
        />

        <div className="action-row">
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
          <button className="btn btn-ghost" type="button" onClick={() => navigate('/role')}>
            Back
          </button>
        </div>
        <p className="error">{errorMsg}</p>
      </motion.form>
    </SceneLayout>
  )
}

export default AdminPassword
