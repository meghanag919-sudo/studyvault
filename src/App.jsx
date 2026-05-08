/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Login from './components/Login'
import Register from './components/Register'
import RoleSelection from './components/RoleSelection'
import AdminPassword from './components/AdminPassword'
import AdminDashboard from './components/AdminDashboard'
import LanguagePage from './components/LanguagePage'
import AdminTopics from './components/AdminTopics'
import Notes from './components/Notes'
import Toast from './components/Toast'
import ParticleBackground from './components/ParticleBackground'


const BookOpeningAnimation = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => onComplete(), 2600)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="book-opening-overlay">
      <div className="book-cover book-cover-left">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="book-cover-decoration top" />
          <div className="book-cover-title">Study</div>
          <div className="book-cover-decoration bottom" />
        </div>
      </div>
      <div className="book-cover book-cover-right">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="book-cover-decoration top" />
          <div className="book-cover-title">Vault</div>
          <div className="book-cover-subtitle">Digital Library</div>
          <div className="book-cover-decoration bottom" />
        </div>
      </div>
    </div>
  )
}

const App = () => {
  const location = useLocation()
  const [showBookAnimation, setShowBookAnimation] = useState(() => {
    return !sessionStorage.getItem('studyvault_opened')
  })

  const handleAnimationComplete = () => {
    sessionStorage.setItem('studyvault_opened', 'true')
    setShowBookAnimation(false)
  }

  return (
    <>
      <ParticleBackground />
      {showBookAnimation && <BookOpeningAnimation onComplete={handleAnimationComplete} />}
      <Toast />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/role" element={<RoleSelection />} />
          <Route path="/admin-password" element={<AdminPassword />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/languages" element={<LanguagePage />} />
          <Route path="/admin/topics/:language" element={<AdminTopics />} />
          <Route path="/languages" element={<LanguagePage />} />
          <Route path="/notes/:language" element={<Notes />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default App