import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { db } from '../firebase/config'
import {
  collection, addDoc, getDocs,
  deleteDoc, doc, updateDoc, serverTimestamp
} from 'firebase/firestore'
import { T } from '../theme'

function PageHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 28, paddingBottom: 16, borderBottom: '3px double ' + T.border }}>
      <div style={{ fontFamily: T.fontHeading, fontStyle: 'italic', fontSize: 36, fontWeight: 800, color: T.textPrimary, lineHeight: 1.1 }}>{title}</div>
      {subtitle && <div style={{ color: T.textMuted, fontSize: 14, fontStyle: 'italic', marginTop: 6 }}>{subtitle}</div>}
    </div>
  )
}

const STATUS_COLORS = {
  pending:    T.textMuted,
  active:     '#8b4513',
  completed:  '#4a7c59',
}

const STATUS_LABELS = {
  pending:   'Not Started',
  active:    'In Progress',
  completed: 'Complete',
}

export default function LearningPath() {
  const { user } = useAuth()
  const uid = user?.uid

  const [modules,   setModules]   = useState([])
  const [loading,   setLoading]   = useState(true)
  const [saving,    setSaving]    = useState(false)
  const [showForm,  setShowForm]  = useState(false)
  const [form,      setForm]      = useState({ name: '', subject: '', description: '' })

  // Load modules from Firestore
  useEffect(() => {
    if (!uid) return
    const load = async () => {
      const snap = await getDocs(collection(db, 'users', uid, 'learning'))
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      // Sort by order field, then createdAt
      data.sort((a, b) => (a.order || 0) - (b.order || 0))
      setModules(data)
      setLoading(false)
    }
    load()
  }, [uid])

  const addModule = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    const ref = await addDoc(collection(db, 'users', uid, 'learning'), {
      name:        form.name.trim(),
      subject:     form.subject.trim(),
      description: form.description.trim(),
      status:      'pending',
      order:       modules.length,
      createdAt:   serverTimestamp(),
    })
    setModules(prev => [...prev, {
      id:          ref.id,
      name:        form.name.trim(),
      subject:     form.subject.trim(),
      description: form.description.trim(),
      status:      'pending',
      order:       modules.length,
    }])
    setForm({ name: '', subject: '', description: '' })
    setShowForm(false)
    setSaving(false)
  }

  const changeStatus = async (id, newStatus) => {
    setSaving(true)
    await updateDoc(doc(db, 'users', uid, 'learning', id), {
      status: newStatus,
      ...(newStatus === 'completed' ? { completedAt: serverTimestamp() } : {}),
      ...(newStatus === 'active'    ? { startedAt:   serverTimestamp() } : {}),
    })
    setModules(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m))
    setSaving(false)
  }

  const deleteModule = async (id) => {
    setSaving(true)
    await deleteDoc(doc(db, 'users', uid, 'learning', id))
    setModules(prev => prev.filter(m => m.id !== id))
    setSaving(false)
  }

  const doneCt   = modules.filter(m => m.status === 'completed').length
  const activeCt = modules.filter(m => m.status === 'active').length

  if (loading) return (
    <div style={{ padding: 32, fontFamily: T.fontBody, color: T.textMuted, fontStyle: 'italic' }}>
      Loading your curriculum...
    </div>
  )

  return (
    <div style={{ padding: 32, minHeight: '100vh', background: T.bg, backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(139,101,43,0.05) 31px, rgba(139,101,43,0.05) 32px)', fontFamily: T.fontBody }}>

      {saving && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: T.accentGreen, color: '#fff', padding: '8px 18px', borderRadius: 4, fontSize: 14, fontStyle: 'italic', zIndex: 999 }}>
          ✓ Saved to records
        </div>
      )}

      <PageHeader title="Learning Path" subtitle="Build your personal curriculum — add, start and complete your modules" />

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
        {[
          { l: 'Total Modules',  v: modules.length, c: T.accentBlue  },
          { l: 'In Progress',    v: activeCt,        c: T.accent      },
          { l: 'Completed',      v: doneCt,          c: T.accentGreen },
          { l: 'Remaining',      v: modules.length - doneCt - activeCt, c: T.textMuted },
        ].map(s => (
          <div key={s.l} style={{ background: T.bgCard, border: '1px solid ' + T.border, borderTop: '3px solid ' + T.accentGold, borderRadius: 4, padding: '14px 20px', flex: 1 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.textMuted, marginBottom: 6, fontFamily: T.fontLabel }}>{s.l}</div>
            <div style={{ fontFamily: T.fontHeading, fontStyle: 'italic', fontSize: 28, fontWeight: 800, color: s.c }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Add Module Button */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ padding: '10px 22px', background: showForm ? T.bgHover : T.accent, border: '1px solid ' + T.border, borderRadius: 4, color: showForm ? T.textPrimary : '#fff', fontFamily: T.fontHeading, fontStyle: 'italic', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
        >
          {showForm ? '✕ Cancel' : '+ Add New Module'}
        </button>
      </div>

      {/* Add Module Form */}
      {showForm && (
        <div style={{ background: T.bgCard, border: '1px solid ' + T.border, borderLeft: '4px solid ' + T.accent, borderRadius: 4, padding: 24, marginBottom: 24, maxWidth: 560 }}>
          <div style={{ fontFamily: T.fontHeading, fontStyle: 'italic', fontSize: 18, fontWeight: 700, color: T.accent, marginBottom: 18 }}>
            ✒ New Module Entry
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: T.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: T.fontLabel, marginBottom: 5 }}>Module Name *</div>
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Data Structures & Algorithms"
              style={{ width: '100%', background: T.bgInput, border: '1px solid ' + T.border, borderBottom: '2px solid ' + T.borderStrong, borderRadius: 4, padding: '10px 14px', color: T.textPrimary, fontSize: 15, fontFamily: T.fontBody, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: T.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: T.fontLabel, marginBottom: 5 }}>Subject / Language</div>
            <input
              value={form.subject}
              onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              placeholder="e.g. Python, Mathematics, History"
              style={{ width: '100%', background: T.bgInput, border: '1px solid ' + T.border, borderBottom: '2px solid ' + T.borderStrong, borderRadius: 4, padding: '10px 14px', color: T.textPrimary, fontSize: 15, fontFamily: T.fontBody, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: T.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: T.fontLabel, marginBottom: 5 }}>Description (optional)</div>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="What will you learn in this module?"
              rows={3}
              style={{ width: '100%', background: T.bgInput, border: '1px solid ' + T.border, borderBottom: '2px solid ' + T.borderStrong, borderRadius: 4, padding: '10px 14px', color: T.textPrimary, fontSize: 14, fontFamily: T.fontBody, fontStyle: 'italic', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
            />
          </div>

          <button
            onClick={addModule}
            disabled={!form.name.trim() || saving}
            style={{ padding: '11px 24px', background: T.accent, border: 'none', borderRadius: 4, color: '#fff', fontFamily: T.fontHeading, fontStyle: 'italic', fontSize: 15, fontWeight: 600, cursor: 'pointer', opacity: !form.name.trim() ? 0.5 : 1 }}
          >
            {saving ? 'Saving...' : 'Add to Curriculum'}
          </button>
        </div>
      )}

      {/* Module List */}
      {modules.length === 0 ? (
        <div style={{ background: T.bgCard, border: '1px solid ' + T.border, borderRadius: 4, padding: 40, textAlign: 'center', color: T.textMuted, fontStyle: 'italic', maxWidth: 560 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📜</div>
          <div style={{ fontFamily: T.fontHeading, fontSize: 18, marginBottom: 6 }}>Your curriculum is empty</div>
          <div style={{ fontSize: 14 }}>Click "Add New Module" above to begin building your learning path</div>
        </div>
      ) : (
        <div style={{ maxWidth: 620 }}>
          {modules.map((m, i) => (
            <div key={m.id} style={{
              background: m.status === 'active' ? T.bgCard : m.status === 'completed' ? 'rgba(74,124,89,0.04)' : T.bg,
              border: '1px solid ' + T.border,
              borderLeft: '4px solid ' + (m.status === 'completed' ? T.accentGreen : m.status === 'active' ? T.accent : T.border),
              borderRadius: 4, padding: '18px 20px', marginBottom: 10,
              boxShadow: m.status === 'active' ? '0 2px 12px rgba(139,69,19,0.1)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>

                {/* Number badge */}
                <div style={{
                  width: 34, height: 34, borderRadius: 4, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: T.fontHeading, fontStyle: 'italic', fontSize: 16, fontWeight: 700,
                  background: m.status === 'completed' ? T.accentGreen : m.status === 'active' ? T.accent : T.bgHover,
                  color: m.status === 'pending' ? T.textMuted : '#fff',
                }}>
                  {m.status === 'completed' ? '✓' : i + 1}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <div style={{ fontFamily: T.fontBody, fontSize: 16, fontWeight: 600, color: m.status === 'completed' ? T.textMuted : T.textPrimary, textDecoration: m.status === 'completed' ? 'line-through' : 'none' }}>
                      {m.name}
                    </div>
                    {m.subject && (
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 2, background: T.bgHover, color: T.textSecondary, border: '1px solid ' + T.border, fontFamily: T.fontLabel, letterSpacing: '0.05em' }}>
                        {m.subject}
                      </span>
                    )}
                    <span style={{ fontSize: 11, fontFamily: T.fontLabel, letterSpacing: '0.05em', color: STATUS_COLORS[m.status], fontStyle: 'italic' }}>
                      — {STATUS_LABELS[m.status]}
                    </span>
                  </div>

                  {m.description && (
                    <div style={{ fontSize: 13, color: T.textMuted, fontStyle: 'italic', marginTop: 5 }}>
                      {m.description}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                    {m.status === 'pending' && (
                      <button onClick={() => changeStatus(m.id, 'active')} style={{ padding: '5px 14px', background: T.accent, border: 'none', borderRadius: 4, color: '#fff', fontSize: 13, fontFamily: T.fontBody, fontStyle: 'italic', cursor: 'pointer' }}>
                        ▶ Start Module
                      </button>
                    )}
                    {m.status === 'active' && (
                      <>
                        <button onClick={() => changeStatus(m.id, 'completed')} style={{ padding: '5px 14px', background: T.accentGreen, border: 'none', borderRadius: 4, color: '#fff', fontSize: 13, fontFamily: T.fontBody, fontStyle: 'italic', cursor: 'pointer' }}>
                          ✓ Mark Complete
                        </button>
                        <button onClick={() => changeStatus(m.id, 'pending')} style={{ padding: '5px 14px', background: T.bgHover, border: '1px solid ' + T.border, borderRadius: 4, color: T.textSecondary, fontSize: 13, fontFamily: T.fontBody, fontStyle: 'italic', cursor: 'pointer' }}>
                          ↩ Pause
                        </button>
                      </>
                    )}
                    {m.status === 'completed' && (
                      <button onClick={() => changeStatus(m.id, 'active')} style={{ padding: '5px 14px', background: T.bgHover, border: '1px solid ' + T.border, borderRadius: 4, color: T.textSecondary, fontSize: 13, fontFamily: T.fontBody, fontStyle: 'italic', cursor: 'pointer' }}>
                        ↩ Reopen
                      </button>
                    )}
                    <button onClick={() => deleteModule(m.id)} style={{ padding: '5px 14px', background: 'rgba(139,32,32,0.08)', border: '1px solid rgba(139,32,32,0.2)', borderRadius: 4, color: T.accentRed, fontSize: 13, fontFamily: T.fontBody, fontStyle: 'italic', cursor: 'pointer' }}>
                      ✕ Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
