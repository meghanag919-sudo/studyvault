import { useRef, useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  CloudUpload,
  Eye,
  FileText,
  FileUp,
  FolderOpen,
  Loader2,
  Search,
  Trash2,
  X,
  Download,
} from 'lucide-react'
import {
  topicsByLanguage,
  useApp,
} from '../context/AppContext'
import SceneLayout from './SceneLayout'
import ConfirmModal from './ConfirmModal'

const ROUTE_TO_LANGUAGE = {
  python: 'Python',
  'html-css': 'HTML/CSS',
  javascript: 'JavaScript',
  react: 'React',
  sql: 'SQL',
}

const EmptyState = ({ icon: Icon, title, message }) => (
  <div className="empty-state">
    <div className="empty-state-icon">
      <Icon size={48} />
    </div>
    <h3>{title}</h3>
    <p>{message}</p>
  </div>
)

const UploadTopicCard = ({ topic, language }) => {
  const { dispatch, addNote } = useApp()
  const [isDragging, setIsDragging] = useState(false)
  const [pendingFiles, setPendingFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState({})
  const fileInputRef = useRef(null)

  const addFiles = (files) => {
    setPendingFiles((prev) => [...prev, ...Array.from(files)])
  }

  const removePending = (index) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const submitFiles = async () => {
    if (pendingFiles.length === 0) return
    setUploading(true)
    const totalFiles = pendingFiles.length

    try {
      for (const file of pendingFiles) {
        const fileUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.onerror = () => reject(reader.error)
          reader.readAsDataURL(file)
        })

        await addNote({
          language,
          topic,
          name: file.name,
          size: file.size,
          type: file.type,
          fileUrl,
        })

        setProgress((prev) => ({ ...prev, [file.name]: 100 }))
      }

      setPendingFiles([])
      setProgress({})
      dispatch({ type: 'SHOW_TOAST', payload: { message: `Saved ${totalFiles} files locally`, type: 'success' } })
    } catch (err) {
      console.error('Upload error:', err)
      dispatch({ type: 'SHOW_TOAST', payload: { message: 'Unable to save files locally', type: 'error' } })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={`topic-card ${language}`}>
      <div className="topic-header">
        <div className="topic-icon-box">
          <BookOpen size={28} />
        </div>
        <div className="topic-info">
          <h3>{topic}</h3>
          <p>{topicsByLanguage[language].find((t) => t.topic === topic)?.desc}</p>
        </div>
      </div>

      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''} ${uploading ? 'uploading' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files) }}
        onClick={() => fileInputRef.current.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          multiple
          hidden
          onChange={(e) => addFiles(e.target.files)}
          disabled={uploading}
        />
        <div className="drop-zone-content">
          <CloudUpload className="upload-icon" />
          <p>Drag & drop or click to upload</p>
          <span>PDF, DOCX, Images supported</span>
        </div>
      </div>

      {pendingFiles.length > 0 && (
        <div className="pending-list">
          {pendingFiles.map((file, i) => (
            <div key={i} className="pending-item">
              <div className="file-info">
                <FileText size={18} />
                <div className="file-meta">
                  <span className="file-name">{file.name}</span>
                  {progress[file.name] !== undefined ? (
                    <span className="file-progress">{progress[file.name]}% uploaded</span>
                  ) : (
                    <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
                  )}
                </div>
              </div>
              {!uploading && (
                <button className="remove-btn" onClick={(e) => { e.stopPropagation(); removePending(i) }}>
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
          <button className="btn btn-primary w-full" onClick={submitFiles} disabled={uploading}>
            {uploading ? <Loader2 className="spin-icon" /> : <FileUp size={18} />}
            {uploading ? 'Uploading...' : `Submit ${pendingFiles.length} Files`}
          </button>
        </div>
      )}
    </div>
  )
}

const VerifyTopicCard = ({ topic, language, notes }) => {
  const { dispatch, updateNote, deleteNote } = useApp()
  const [processing, setProcessing] = useState(null)

  const handleVerify = async (noteId) => {
    setProcessing(noteId)
    try {
      await updateNote(noteId, { verified: true })
      dispatch({ type: 'SHOW_TOAST', payload: { message: 'Note verified successfully', type: 'success' } })
    } catch (err) {
      dispatch({ type: 'SHOW_TOAST', payload: { message: 'Verification failed', type: 'error' } })
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (noteId) => {
    setProcessing(noteId)
    try {
      await deleteNote(noteId)
      dispatch({ type: 'SHOW_TOAST', payload: { message: 'Note rejected and deleted', type: 'info' } })
    } catch (err) {
      dispatch({ type: 'SHOW_TOAST', payload: { message: 'Rejection failed', type: 'error' } })
    } finally {
      setProcessing(null)
    }
  }

  const pendingNotes = notes.filter((n) => !n.verified)

  return (
    <div className={`topic-card ${language}`}>
      <div className="topic-header">
        <div className="topic-icon-box">
          <BadgeCheck size={28} />
        </div>
        <div className="topic-info">
          <h3>{topic}</h3>
          <span className="badge badge-pending">{pendingNotes.length} Pending</span>
        </div>
      </div>

      <div className="topic-notes-list">
        {pendingNotes.length === 0 ? (
          <EmptyState icon={BadgeCheck} title="All Caught Up" message="No pending notes for this topic." />
        ) : (
          pendingNotes.map((note) => (
            <div key={note.id} className="topic-note-row">
              <div className="note-main">
                <FileText size={20} className="text-gold" />
                <div className="note-details">
                  <span className="note-name">{note.name}</span>
                  <span className="note-meta">{note.uploadedAt}</span>
                </div>
              </div>
              <div className="topic-note-actions">
                <button className="btn btn-sm" onClick={() => window.open(note.fileUrl, '_blank')}>
                  <Eye size={14} /> Preview
                </button>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleVerify(note.id)}
                  disabled={processing === note.id}
                >
                  {processing === note.id ? <Loader2 className="spin-icon" size={14} /> : <CheckCircle2 size={14} />} Approve
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleReject(note.id)}
                  disabled={processing === note.id}
                >
                  <X size={14} /> Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const DeleteTopicCard = ({ topic, language, notes }) => {
  const { dispatch, deleteNote } = useApp()
  const [confirmId, setConfirmId] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const handleDelete = async (note) => {
    setDeleting(note.id)
    try {
      await deleteNote(note.id)
      dispatch({ type: 'SHOW_TOAST', payload: { message: 'Note deleted successfully', type: 'success' } })
    } catch (err) {
      dispatch({ type: 'SHOW_TOAST', payload: { message: 'Deletion failed', type: 'error' } })
    } finally {
      setDeleting(null)
      setConfirmId(null)
    }
  }

  return (
    <div className={`topic-card ${language}`}>
      <div className="topic-header">
        <div className="topic-icon-box">
          <Trash2 size={28} />
        </div>
        <div className="topic-info">
          <h3>{topic}</h3>
          <span className="badge">{notes.length} Total Notes</span>
        </div>
      </div>

      <div className="topic-notes-list">
        {notes.length === 0 ? (
          <EmptyState icon={Trash2} title="No Notes" message="Upload some notes first." />
        ) : (
          notes.map((note) => (
            <div key={note.id} className="topic-note-row">
              <div className="note-main">
                <FileText size={20} />
                <div className="note-details">
                  <div className="flex items-center gap-2">
                    <span className="note-name">{note.name}</span>
                    {note.verified && <BadgeCheck size={14} className="text-gold" title="Verified" />}
                  </div>
                  <span className="note-meta">{note.uploadedAt}</span>
                </div>
              </div>
              <div className="topic-note-actions">
                <button className="btn btn-sm" onClick={() => window.open(note.fileUrl, '_blank')}>
                  <Download size={14} /> Download
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => setConfirmId(note.id)}
                  disabled={deleting === note.id}
                >
                  {deleting === note.id ? <Loader2 className="spin-icon" size={14} /> : <Trash2 size={14} />} Delete
                </button>
              </div>

              <ConfirmModal
                open={confirmId === note.id}
                title="Delete Note?"
                message="This will permanently remove the note from local storage."
                onConfirm={() => handleDelete(note)}
                onCancel={() => setConfirmId(null)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const AdminTopics = () => {
  const { language } = useParams()
  const navigate = useNavigate()
  const { state, dispatch } = useApp()
  const [search, setSearch] = useState('')

  const selectedLanguage = ROUTE_TO_LANGUAGE[language] || 'Python'
  const selectedGroup = selectedLanguage === 'HTML/CSS' ? ['HTML', 'CSS'] : [selectedLanguage]
  const activeAction = state.action || 'upload'

  const adminTabs = [
    { key: 'upload', label: 'Upload', icon: CloudUpload },
    { key: 'verify', label: 'Verify', icon: CheckCircle2 },
    { key: 'delete', label: 'Delete', icon: Trash2 },
  ]

  const languageGroups = useMemo(() => {
    return Object.entries(topicsByLanguage)
      .filter(([lang]) => selectedGroup.includes(lang))
      .map(([lang, topics]) => {
        const filteredTopics = topics.filter((topic) =>
          topic.topic.toLowerCase().includes(search.toLowerCase()) ||
          topic.desc.toLowerCase().includes(search.toLowerCase())
        )
        return { lang, topics: filteredTopics }
      })
      .filter(({ topics }) => topics.length > 0)
  }, [search, selectedGroup])

  const renderTopicSection = (lang, topic) => {
    const topicNotes = state.uploadedNotes[lang]?.[topic.topic] || []
    if (activeAction === 'upload') return <UploadTopicCard key={`${lang}-${topic.topic}`} topic={topic.topic} language={lang} />
    if (activeAction === 'verify') return <VerifyTopicCard key={`${lang}-${topic.topic}`} topic={topic.topic} language={lang} notes={topicNotes} />
    return <DeleteTopicCard key={`${lang}-${topic.topic}`} topic={topic.topic} language={lang} notes={topicNotes} />
  }

  return (
    <SceneLayout>
      <div className="container">
        <div className="page-header admin-page-header">
          <button className="btn btn-ghost" onClick={() => navigate('/admin/languages')} style={{ alignSelf: 'flex-start' }}>
            <ArrowLeft size={18} /> Back
          </button>

          <div>
            <h1 className="notes-page-title">{selectedLanguage} Topics</h1>
            <p className="section-subtitle">
              Manage and organize all {selectedLanguage} topics here.
            </p>
          </div>

          <div className="admin-action-tabs">
            {adminTabs.map((tab) => {
              const TabIcon = tab.icon
              return (
                <button
                  key={tab.key}
                  className={`btn btn-sm ${activeAction === tab.key ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => dispatch({ type: 'SET_ACTION', payload: tab.key })}
                >
                  <TabIcon size={16} style={{ marginRight: 6 }} /> {tab.label}
                </button>
              )
            })}
          </div>

          <div className="notes-search-bar" style={{ marginTop: '24px' }}>
            <Search className="notes-search-icon" size={18} />
            <input
              className="notes-search-input"
              type="text"
              placeholder={`Search ${selectedLanguage} topics...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {languageGroups.length === 0 ? (
          <div className="empty-state-panel">
            <EmptyState icon={FolderOpen} title="No topics found" message="Try a different search term." />
          </div>
        ) : (
          <div className="subject-grid admin-topic-grid">
            {languageGroups.flatMap(({ lang, topics }) =>
              topics.map((topic) => renderTopicSection(lang, topic))
            )}
          </div>
        )}
      </div>
    </SceneLayout>
  )
}

export default AdminTopics
