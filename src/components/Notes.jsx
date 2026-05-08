/* eslint-disable react/prop-types */
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  BookOpen,
  Download,
  Eye,
  FileText,
  FolderOpen,
  Loader2,
  Search,
  X,
} from 'lucide-react'
import SceneLayout from './SceneLayout'
import { topicsByLanguage, useApp } from '../context/AppContext'

const ROUTE_TO_LANGUAGE = {
  python: 'Python',
  'html-css': 'HTML/CSS',
  javascript: 'JavaScript',
  react: 'React',
  sql: 'SQL',
}

const Notes = () => {
  const { language } = useParams()
  const navigate = useNavigate()
  const { state } = useApp()
  const [search, setSearch] = useState('')
  const [viewingNote, setViewingNote] = useState(null)

  const selectedLanguage = ROUTE_TO_LANGUAGE[language] || 'Python'
  const selectedGroups = selectedLanguage === 'HTML/CSS' ? ['HTML', 'CSS'] : [selectedLanguage]

  const languageSections = useMemo(() => {
    return Object.entries(topicsByLanguage)
      .filter(([lang]) => selectedGroups.includes(lang))
      .map(([lang, topics]) => ({
        lang,
        topics: topics.filter((topic) =>
          topic.topic.toLowerCase().includes(search.toLowerCase()) ||
          topic.desc.toLowerCase().includes(search.toLowerCase())
        ),
      }))
      .filter(({ topics }) => topics.length > 0)
  }, [search, selectedGroups])

  const openFile = (note) => {
    if (note.type === 'application/pdf') {
      setViewingNote(note)
    } else {
      window.open(note.fileUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <SceneLayout>
      <div className="notes-page-container">
        <div className="notes-page-header">
          <button className="back-btn btn btn-ghost" onClick={() => navigate('/languages')}>
            <ArrowLeft size={18} /> Back to Languages
          </button>

          <div className="notes-header-center">
            <div className="notes-header-badge">
              <BookOpen size={14} /> STUDY NOTES
            </div>
            <h1 className="notes-page-title">{selectedLanguage}</h1>
            <p className="notes-page-sub">Browse verified notes for {selectedLanguage}.</p>
          </div>

          <div className="notes-search-bar">
            <Search size={17} className="notes-search-icon" />
            <input
              className="notes-search-input"
              type="text"
              placeholder={`Search ${selectedLanguage} topics…`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="notes-search-clear" onClick={() => setSearch('')}>
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {state.notesLoading ? (
          <div className="notes-loading">
            <Loader2 className="spin-icon" size={40} />
            <p>Loading topics…</p>
          </div>
        ) : (
          <div className="subject-grid notes-grid">
            {languageSections.length === 0 ? (
              <div className="notes-empty">
                <FolderOpen size={48} style={{ opacity: 0.35 }} />
                <p>No topics match your search.</p>
              </div>
            ) : (
              languageSections.flatMap(({ lang, topics }) =>
                topics.map((topic) => {
                  const verifiedNotes = (state.uploadedNotes[lang]?.[topic.topic] || []).filter((note) => note.verified)
                  return (
                    <div key={`${lang}-${topic.topic}`} className={`topic-card ${lang}`}>
                      <div className="topic-header">
                        <div className="topic-icon-box">
                          <BookOpen size={28} />
                        </div>
                        <div className="topic-info">
                          <h3>{topic.topic}</h3>
                          <p>{topic.desc}</p>
                        </div>
                      </div>

                      <div className="topic-notes-list">
                        {verifiedNotes.length === 0 ? (
                          <div className="empty-topic-state">
                            <FolderOpen size={28} style={{ opacity: 0.4 }} />
                            <p>No verified notes yet for this topic.</p>
                          </div>
                        ) : (
                          verifiedNotes.map((note) => (
                            <div key={note.id} className="user-note-row">
                              <div className="user-note-left">
                                <div className="user-note-icon"><FileText size={16} /></div>
                                <div>
                                  <span className="user-note-name">{note.name}</span>
                                  <span className="user-note-size">{(note.size / 1024).toFixed(1)} KB</span>
                                </div>
                              </div>
                              <div className="user-note-actions">
                                <button className="btn btn-ghost btn-sm" onClick={() => openFile(note)}>
                                  <Eye size={13} /> Open
                                </button>
                                <a href={note.fileUrl} download={note.name} className="btn btn-ghost btn-sm" target="_blank" rel="noopener noreferrer">
                                  <Download size={13} />
                                </a>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )
                })
              )
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {viewingNote && (
          <motion.div
            className="pdf-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setViewingNote(null)}
          >
            <motion.div
              className="pdf-viewer-modal glass-panel"
              initial={{ scale: 0.92, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 24 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pdf-viewer-header">
                <div className="pdf-info">
                  <div className="pdf-file-icon">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h3 className="pdf-title">{viewingNote.name}</h3>
                    <p className="pdf-meta">{viewingNote.topic}</p>
                  </div>
                </div>
                <div className="pdf-viewer-actions">
                  <a href={viewingNote.fileUrl} download={viewingNote.name} className="btn btn-ghost btn-sm" target="_blank" rel="noopener noreferrer">
                    <Download size={14} /> Download
                  </a>
                  <button className="pdf-close-btn" onClick={() => setViewingNote(null)}>
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="pdf-viewer-body">
                <iframe src={viewingNote.fileUrl} title={viewingNote.name} width="100%" height="100%" frameBorder="0" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SceneLayout>
  )
}

export default Notes
