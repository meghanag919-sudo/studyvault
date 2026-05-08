import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { motion } from 'framer-motion'
import { UserRoundPlus } from 'lucide-react'
import SceneLayout from './SceneLayout'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()

  const registerUser = async event => {
    event.preventDefault()
    setErrorMsg('')
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      navigate('/role')
    } catch (error) {
      setErrorMsg(error.message)
    }
  }

  return (
    <SceneLayout>
      <motion.form
        className="glass-panel auth-panel"
        onSubmit={registerUser}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <motion.div
          className="floating-icon lock-hero"
          animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <UserRoundPlus size={34} />
        </motion.div>

        <h1 className="section-title">Create Account</h1>
        <p className="section-subtitle">Register to access StudyVault notes.</p>

        <label className="input-label" htmlFor="register-email">
          Email
        </label>
        <input
          id="register-email"
          className="input-control"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={event => setEmail(event.target.value)}
        />

        <label className="input-label" htmlFor="register-password">
          Password
        </label>
        <input
          id="register-password"
          className="input-control"
          type="password"
          placeholder="Minimum 6 characters"
          value={password}
          onChange={event => setPassword(event.target.value)}
        />

        <button className="btn btn-primary" type="submit">
          Register
        </button>
        <p className="error">{errorMsg}</p>
        <p className="helper">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </motion.form>
    </SceneLayout>
  )
}

export default Register
