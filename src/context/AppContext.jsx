import { createContext, useContext, useEffect, useMemo, useReducer, useCallback } from 'react'

const AppContext = createContext(null)
const STORAGE_KEY = 'studyvault_notes'

/* Topic definitions per language */
const topicsByLanguage = {
  Python: [
    { topic: 'Variables & Data Types', desc: 'Learn about Python data types, variables, and type casting.' },
    { topic: 'Loops and Iteration', desc: 'Master for loops, while loops, and list comprehensions.' },
    { topic: 'Functions', desc: 'Define reusable functions with args, kwargs, and decorators.' },
    { topic: 'OOP Basics', desc: 'Classes, objects, inheritance, and polymorphism in Python.' },
  ],
  HTML: [
    { topic: 'Semantic Tags', desc: 'Use header, nav, main, section, article, and footer elements.' },
    { topic: 'Forms and Validation', desc: 'Build forms with input types, labels, and validation.' },
    { topic: 'Tables and Lists', desc: 'Create structured data with tables and ordered/unordered lists.' },
    { topic: 'Media Embeds', desc: 'Embed images, audio, video, and iframes in web pages.' },
  ],
  CSS: [
    { topic: 'Selectors', desc: 'Target elements with class, ID, attribute, and pseudo selectors.' },
    { topic: 'Box Model', desc: 'Understand margin, border, padding, and content areas.' },
    { topic: 'Flexbox Layout', desc: 'Build flexible layouts with flex containers and items.' },
    { topic: 'Grid Layout', desc: 'Create two-dimensional layouts with CSS Grid.' },
  ],
  JavaScript: [
    { topic: 'Variables & Scope', desc: 'var, let, const and block vs function scope explained.' },
    { topic: 'Functions', desc: 'Arrow functions, closures, callbacks, and higher-order functions.' },
    { topic: 'DOM Manipulation', desc: 'Select, modify, and listen to DOM elements dynamically.' },
    { topic: 'Async Basics', desc: 'Promises, async/await, and fetch API fundamentals.' },
  ],
  React: [
    { topic: 'Components', desc: 'Functional components, JSX syntax, and component composition.' },
    { topic: 'Props and State', desc: 'Passing data with props and managing state with useState.' },
    { topic: 'Hooks', desc: 'useEffect, useRef, useContext, useMemo, and custom hooks.' },
    { topic: 'Routing', desc: 'Client-side routing with React Router and dynamic routes.' },
  ],
  SQL: [
    { topic: 'DDL and DML', desc: 'CREATE, ALTER, DROP, INSERT, UPDATE, DELETE statements.' },
    { topic: 'Filtering with WHERE', desc: 'WHERE, AND, OR, IN, BETWEEN, LIKE operators.' },
    { topic: 'Joins', desc: 'INNER, LEFT, RIGHT, FULL OUTER, and CROSS joins.' },
    { topic: 'GROUP BY', desc: 'Aggregate functions with GROUP BY and HAVING clauses.' },
  ],
}

/* Build initial uploadedNotes: { Python: { "Variables & Data Types": [], ... }, ... } */
const buildEmptyNotes = () => {
  const notes = {}
  for (const [lang, topics] of Object.entries(topicsByLanguage)) {
    notes[lang] = {}
    for (const t of topics) {
      notes[lang][t.topic] = []
    }
  }
  return notes
}

const initialState = {
  role: null,
  action: null,
  language: null,
  toast: null,
  notesLoading: true,
  uploadedNotes: buildEmptyNotes(),
}

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, role: action.payload, action: null, language: null }
    case 'SET_ACTION':
      return { ...state, action: action.payload, language: null }
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload }
    case 'RESET':
      return { ...initialState, uploadedNotes: state.uploadedNotes, notesLoading: false }

    case 'SHOW_TOAST':
      return { ...state, toast: action.payload }
    case 'HIDE_TOAST':
      return { ...state, toast: null }

    case 'SYNC_NOTES':
      return { ...state, uploadedNotes: action.payload, notesLoading: false }

    default:
      return state
  }
}

export { topicsByLanguage }

/* ─── Local storage helpers ─── */

const loadNotesFromStorage = () => {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const parsed = stored ? JSON.parse(stored) : []
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    console.error('Failed to read notes from localStorage:', err)
    return []
  }
}

const saveNotesToStorage = (notes) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  } catch (err) {
    console.error('Failed to write notes to localStorage:', err)
  }
}

const createNoteObject = (noteData) => ({
  id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  verified: false,
  uploadedAt: new Date().toLocaleString(),
  createdAt: new Date().toISOString(),
  ...noteData,
})

const rebuildStateFromNotes = (flatNotes) => {
  const merged = buildEmptyNotes()
  flatNotes.forEach((note) => {
    const { language, topic } = note
    if (merged[language] && merged[language][topic]) {
      merged[language][topic].push(note)
    }
  })
  return merged
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  useEffect(() => {
    const flatNotes = loadNotesFromStorage()
    const merged = rebuildStateFromNotes(flatNotes)
    dispatch({ type: 'SYNC_NOTES', payload: merged })
  }, [])

  const syncNotes = useCallback((flatNotes) => {
    saveNotesToStorage(flatNotes)
    dispatch({ type: 'SYNC_NOTES', payload: rebuildStateFromNotes(flatNotes) })
  }, [])

  const addNote = useCallback(async (noteData) => {
    const flatNotes = loadNotesFromStorage()
    const note = createNoteObject(noteData)
    const nextNotes = [...flatNotes, note]
    syncNotes(nextNotes)
    return note.id
  }, [syncNotes])

  const updateNote = useCallback(async (noteId, updates) => {
    const flatNotes = loadNotesFromStorage()
    const nextNotes = flatNotes.map((note) => (note.id === noteId ? { ...note, ...updates } : note))
    syncNotes(nextNotes)
  }, [syncNotes])

  const deleteNote = useCallback(async (noteId) => {
    const flatNotes = loadNotesFromStorage()
    const nextNotes = flatNotes.filter((note) => note.id !== noteId)
    syncNotes(nextNotes)
  }, [syncNotes])

  const value = useMemo(() => ({ state, dispatch, addNote, updateNote, deleteNote }), [state, addNote, updateNote, deleteNote])
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
