/* eslint-disable react/prop-types */
import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  CheckCircle2,
  CloudUpload,
  FileText,
  FolderUp,
  ShieldCheck,
  ShieldOff,
  Trash2,
  Upload,
} from 'lucide-react'
import SceneLayout from './SceneLayout'
import { useApp } from '../context/AppContext'

const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/* ───── Upload Panel ───── */
const UploadPanel = ({ language }) => {
  const { dispatch } = useApp()
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const processFiles = useCallback(
    (files) => {
      if (files.length === 0) return
      const newNotes = files.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        verified: false,
        uploadedAt: new Date().toLocaleString(),
      }))
      dispatch({ type: 'ADD_NOTES', payload: { language, notes: newNotes } })
      setStatusMessage(`${files.length} file${files.length > 1 ? 's' : ''} uploaded successfully!`)
      setTimeout(() => setStatusMessage(''), 3500)
    },
    [dispatch, language],
  )

  const onFilesSelected = (event) => {
    processFiles(Array.from(event.target.files || []))
    event.target.value = ''
  }

  const onDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)
    processFiles(Array.from(event.dataTransfer.files))
  }

  const onDragOver = (event) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const onDragLeave = () => setIsDragging(false)

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
        multiple
        hidden
        onChange={onFilesSelected}
      />

      <motion.div
        className={`drop-zone glass-panel ${isDragging ? 'drop-zone--active' : ''}`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        whileHover={{ scale: 1.01 }}
      >
        <motion.div
          className="drop-zone-icon"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <CloudUpload size={52} />
        </motion.div>
        <h3>Drag & Drop Files Here</h3>
        <p className="section-subtitle">or click the button below to browse</p>
        <button
          id="upload-files-btn"
          className="btn btn-gradient"
          type="button"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={18} />
          Browse Files
        </button>
        <p className="drop-zone-hint">Supports PDF, DOC, DOCX, TXT, PPT, PPTX</p>
      </motion.div>

      <AnimatePresence>
        {statusMessage && (
          <motion.p
            className="status-message"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <CheckCircle2 size={18} />
            {statusMessage}
          </motion.p>
        )}
      </AnimatePresence>
    </>
  )
}

/* ───── Verify Panel ───── */
const VerifyPanel = ({ language }) => {
  const { state, dispatch } = useApp()
  const notes = state.uploadedNotes[language] || []

  const toggleVerify = (noteId) => {
    dispatch({ type: 'TOGGLE_VERIFY', payload: { language, noteId } })
  }

  if (notes.length === 0) {
    return (
      <motion.div
        className="glass-panel empty-state"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <FolderUp size={42} className="empty-icon" />
        <p>No notes uploaded for {language} yet.</p>
        <p className="section-subtitle">Upload files first to verify them.</p>
      </motion.div>
    )
  }

  return (
    <div className="notes-list">
      <AnimatePresence>
        {notes.map((note, index) => (
          <motion.div
            className="glass-panel note-list-item"
            key={note.id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div className="note-list-info">
              <FileText size={20} />
              <div>
                <span className="note-list-name">{note.name}</span>
                <span className="note-list-meta">
                  {formatFileSize(note.size)} · {note.uploadedAt}
                </span>
              </div>
            </div>
            <button
              className={`btn ${note.verified ? 'btn-verified' : 'btn-unverified'}`}
              type="button"
              onClick={() => toggleVerify(note.id)}
            >
              {note.verified ? <ShieldCheck size={16} /> : <ShieldOff size={16} />}
              {note.verified ? 'Verified' : 'Unverified'}
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

/* ───── Delete Panel ───── */
const DeletePanel = ({ language }) => {
  const { state, dispatch } = useApp()
  const notes = state.uploadedNotes[language] || []

  const deleteNote = (noteId) => {
    dispatch({ type: 'DELETE_NOTE', payload: { language, noteId } })
  }

  if (notes.length === 0) {
    return (
      <motion.div
        className="glass-panel empty-state"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <Trash2 size={42} className="empty-icon" />
        <p>No notes to delete for {language}.</p>
        <p className="section-subtitle">Upload files first.</p>
      </motion.div>
    )
  }

  return (
    <div className="notes-list">
      <AnimatePresence>
        {notes.map((note, index) => (
          <motion.div
            className="glass-panel note-list-item"
            key={note.id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
            transition={{ duration: 0.25, delay: index * 0.04 }}
          >
            <div className="note-list-info">
              <FileText size={20} />
              <div>
                <span className="note-list-name">{note.name}</span>
                <span className="note-list-meta">
                  {formatFileSize(note.size)} · {note.uploadedAt}
                  {note.verified && ' · ✅ Verified'}
                </span>
              </div>
            </div>
            <button
              className="btn btn-danger"
              type="button"
              onClick={() => deleteNote(note.id)}
            >
              <Trash2 size={16} />
              Delete
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

/* ───── Action Page (Dynamic) ───── */
const actionConfig = {
  upload: { title: 'Upload Notes', icon: FolderUp, Panel: UploadPanel },
  verify: { title: 'Verify Notes', icon: CheckCircle2, Panel: VerifyPanel },
  delete: { title: 'Delete Notes', icon: Trash2, Panel: DeletePanel },
}

const ActionPage = () => {
  const { language } = useParams()
  const navigate = useNavigate()
  const { state } = useApp()
  const action = state.action || 'upload'
  const config = actionConfig[action] || actionConfig.upload
  const { title, icon: TitleIcon, Panel } = config

  return (
    <SceneLayout>
      <motion.div
        className="glass-panel panel-header"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="header-badge action-badge">
          <TitleIcon size={18} />
          <span>{title}</span>
        </div>
        <h1 className="section-title">
          {language} — {title}
        </h1>
        <p className="section-subtitle">
          {action === 'upload' && `Drag & drop or browse files to upload ${language} notes.`}
          {action === 'verify' && `Toggle verification status on ${language} notes.`}
          {action === 'delete' && `Remove unwanted ${language} notes from the library.`}
        </p>
        <button
          className="btn btn-ghost back-btn"
          type="button"
          onClick={() => navigate('/admin/languages')}
        >
          <ArrowLeft size={18} />
          Back to Languages
        </button>
      </motion.div>

      <Panel language={language} />
    </SceneLayout>
  )
}

export default ActionPage
