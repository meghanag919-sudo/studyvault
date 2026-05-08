import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import { motion } from 'framer-motion'
import { BookOpenText, GraduationCap, NotebookPen } from 'lucide-react'
import SceneLayout from './SceneLayout'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()

  const getErrorMessage = error => {
    switch (error.code) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address.'
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Invalid email or password.'
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please log in.'
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.'
      case 'auth/popup-closed-by-user':
        return 'Google sign-in popup was closed before completion.'
      default:
        return error.message || 'Authentication failed. Please try again.'
    }
  }

  const loginWithEmail = async event => {
    event.preventDefault()
    setErrorMsg('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/role')
    } catch (error) {
      setErrorMsg(getErrorMessage(error))
    }
  }

  const registerWithEmail = async () => {
    setErrorMsg('')
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      navigate('/role')
    } catch (error) {
      setErrorMsg(getErrorMessage(error))
    }
  }

  const loginWithGoogle = async () => {
    setErrorMsg('')
    try {
      await signInWithPopup(auth, googleProvider)
      navigate('/role')
    } catch (error) {
      setErrorMsg(getErrorMessage(error))
    }
  }

  return (
    <SceneLayout>
      <motion.form
        className="glass-panel auth-panel"
        onSubmit={loginWithEmail}
        initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="hero-stack">
          <motion.div
            className="floating-icon icon-book"
            animate={{ y: [0, -15, 0], rotate: [0, 10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <BookOpenText size={36} />
          </motion.div>
          <motion.div
            className="floating-icon icon-cap"
            animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <GraduationCap size={36} />
          </motion.div>
        </div>

        <h1 className="notes-page-title" style={{ fontSize: '2.4rem', textAlign: 'center' }}>StudyVault</h1>
        <p className="section-subtitle" style={{ textAlign: 'center', marginBottom: '16px' }}>Your premium 3D digital library.</p>

        <button type="button" className="btn btn-google" onClick={loginWithGoogle}>
          <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/><path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.712s.102-1.172.282-1.712V4.956H.957A8.996 8.996 0 0 0 0 9c0 1.497.366 2.91 1.011 4.156l2.953-2.444z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.443 2.048 1.011 4.156L3.964 6.49c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/></svg>
          Continue with Google
        </button>

        <div style={{ margin: '10px 0', height: '1px', background: 'rgba(255,255,255,0.1)', width: '100%' }} />

        <label className="input-label">Email</label>
        <input
          className="input-control"
          type="email"
          placeholder="you@university.edu"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <label className="input-label">Password</label>
        <input
          className="input-control"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <div className="action-row">
          <button className="btn btn-primary" type="submit" style={{ flex: 1 }}>
            Login
          </button>
          <button className="btn btn-secondary" type="button" onClick={registerWithEmail} style={{ flex: 1 }}>
            Join Now
          </button>
        </div>
        <p className="error" style={{ color: '#ef4444', textAlign: 'center', marginTop: '12px' }}>{errorMsg}</p>
      </motion.form>
    </SceneLayout>
  )
}

export default Login
