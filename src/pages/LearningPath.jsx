import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../ThemeContext'
import { db } from '../firebase/config'
import {
  collection, addDoc, getDocs,
  deleteDoc, doc, updateDoc, serverTimestamp
} from 'firebase/firestore'

export default function LearningPath({ mobile = false }) {
  const { user } = useAuth()
  const { T } = useTheme()
  const uid = user?.uid

  const [modules,  setModules]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form,     setForm]     = useState({ name: '', subject: '', description: '' })

  useEffect(() => {
    if (!uid) return
    const load = async () => {
      const snap = await getDocs(collection(db, 'users', uid, 'learning'))
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
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

  const STATUS_COLOR = {
    pending:   T.textMuted,
    active:    T.accent,
    completed: T.accentGreen,
  }

  const STATUS_LABEL = {
    pending:   'Not Started',
    active:    'In Progress',
    completed: 'Complete',
  }

  if (loading) return (
    <div style={{ padding: 32, fontFamily: T.fontBody, color: T.textMuted, background: T.bg, minHeight: '100vh' }}>
      Loading your curriculum...
    </div>
  )

  return (
    <div style={{ background: T.bg, minHeight: '100vh', fontFamily: T.fontBody, transition: 'background 0.3s' }}>

      {saving && (
        <div style={{ position: 'fixed', bottom: mobile ? 90 : 24, right: 16, background: T.accentGreen, color: '#fff', padding: '8px 18px', borderRadius: mobile ? 20 : 4, fontSize: 13, fontWeight: 500, zIndex: 999 }}>
          ✓ Saved
        </div>
      )}

      {/* Header */}
      <div style={{ background: mobile ? T.bgSidebar : T.bg, padding: mobile ? '52px 20px 24px' : '32px 36px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: T.fontHeading, fontSize: mobile ? 28 : 36, fontWeight: 700, color: mobile ? '#fff' : T.textPrimary, letterSpacing: '-0.02em' }}>
              Learning Path
            </div>
            <div style={{ fontSize: 13, color: mobile ? 'rgba(255,255,255,0.5)' : T.textMuted, marginTop: 4 }}>
              {modules.length} modules · {doneCt} completed · {activeCt} in progress
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{ background: mobile ? 'rgba(255,255,255,0.15)' : T.accent, border: 'none', borderRadius: 12, padding: mobile ? '10px 16px' : '11px 20px', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: T.fontBody }}>
            {showForm ? '✕ Cancel' : '+ Add Module'}
          </button>
        </div>
      </div>

      <div style={{ padding: mobile ? '16px' : '24px 36px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { l: 'Total',       v: modules.length,                    c: T.accentBlue  },
            { l: 'In Progress', v: activeCt,                          c: T.accent      },
            { l: 'Completed',   v: doneCt,                            c: T.accentGreen },
            { l: 'Remaining',   v: modules.length - doneCt - activeCt, c: T.textMuted  },
          ].map(s => (
            <div key={s.l} style={{ background: T.bgCard, border: '1px solid ' + T.borderCard, borderRadius: 14, padding: mobile ? '12px' : '16px', textAlign: 'center', boxShadow: T.shadowCard }}>
              <div style={{ fontFamily: T.fontHeading, fontSize: mobile ? 24 : 28, fontWeight: 700, color: s.c, lineHeight: 1 }}>{s.v}</div>
              <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: T.fontLabel }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Add Module Form */}
        {showForm && (
          <div style={{ background: T.bgCard, border: '1px solid ' + T.border, borderLeft: '4px solid ' + T.accent, borderRadius: 16, padding: 20, marginBottom: 20, boxShadow: T.shadowCard }}>
            <div style={{ fontFamily: T.fontHeading, fontSize: 18, fontWeight: 700, color: T.accent, marginBottom: 16 }}>
              New Module
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: T.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: T.fontLabel, marginBottom: 5 }}>Module Name *</div>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Data Structures & Algorithms"
                style={{ width: '100%', background: T.bgInput, border: '1px solid ' + T.border, borderRadius: 10, padding: '11px 14px', color: T.textPrimary, fontSize: 14, fontFamily: T.fontBody, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: T.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: T.fontLabel, marginBottom: 5 }}>Subject / Language</div>
              <input
                value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                placeholder="e.g. Python, Mathematics"
                style={{ width: '100%', background: T.bgInput, border: '1px solid ' + T.border, borderRadius: 10, padding: '11px 14px', color: T.textPrimary, fontSize: 14, fontFamily: T.fontBody, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: T.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: T.fontLabel, marginBottom: 5 }}>Description (optional)</div>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="What will you learn in this module?"
                rows={3}
                style={{ width: '100%', background: T.bgInput, border: '1px solid ' + T.border, borderRadius: 10, padding: '11px 14px', color: T.textPrimary, fontSize: 14, fontFamily: T.fontBody, outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
              />
            </div>

            <button
              onClick={addModule}
              disabled={!form.name.trim() || saving}
              style={{ padding: '11px 24px', background: T.accent, border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: T.fontBody, opacity: !form.name.trim() ? 0.5 : 1 }}>
              {saving ? 'Saving...' : 'Add to Curriculum'}
            </button>
          </div>
        )}

        {/* Empty state */}
        {modules.length === 0 ? (
          <div style={{ background: T.bgCard, border: '1px solid ' + T.borderCard, borderRadius: 16, padding: 40, textAlign: 'center', boxShadow: T.shadowCard }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📚</div>
            <div style={{ fontFamily: T.fontHeading, fontSize: 20, color: T.textPrimary, marginBottom: 6 }}>No modules yet</div>
            <div style={{ fontSize: 14, color: T.textMuted }}>Click "Add Module" to build your curriculum</div>
          </div>
        ) : (
          <div>
            {modules.map((m, i) => (
              <div key={m.id} style={{
                background: m.status === 'active' ? T.bgCard : m.status === 'completed' ? T.bgCard : T.bg,
                border: '1px solid ' + T.borderCard,
                borderLeft: '4px solid ' + STATUS_COLOR[m.status],
                borderRadius: 14, padding: mobile ? '16px' : '18px 20px',
                marginBottom: 10, boxShadow: T.shadowCard,
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>

                  {/* Badge */}
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: T.fontHeading, fontSize: 15, fontWeight: 700,
                    background: m.status === 'completed' ? T.accentGreen : m.status === 'active' ? T.accent : T.bgInput,
                    color: m.status === 'pending' ? T.textMuted : '#fff',
                  }}>
                    {m.status === 'completed' ? '✓' : i + 1}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                      <div style={{ fontSize: mobile ? 15 : 15, fontWeight: 600, color: m.status === 'completed' ? T.textMuted : T.textPrimary, textDecoration: m.status === 'completed' ? 'line-through' : 'none', fontFamily: T.fontBody }}>
                        {m.name}
                      </div>
                      {m.subject && (
                        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: T.bgInput, color: T.textSecondary, border: '1px solid ' + T.border, fontFamily: T.fontLabel }}>
                          {m.subject}
                        </span>
                      )}
                      <span style={{ fontSize: 11, color: STATUS_COLOR[m.status], fontFamily: T.fontLabel }}>
                        {STATUS_LABEL[m.status]}
                      </span>
                    </div>

                    {m.description && (
                      <div style={{ fontSize: 13, color: T.textMuted, marginBottom: 10 }}>
                        {m.description}
                      </div>
                    )}

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {m.status === 'pending' && (
                        <button onClick={() => changeStatus(m.id, 'active')}
                          style={{ padding: '6px 14px', background: T.accent, border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontFamily: T.fontBody, cursor: 'pointer' }}>
                          ▶ Start
                        </button>
                      )}
                      {m.status === 'active' && (
                        <>
                          <button onClick={() => changeStatus(m.id, 'completed')}
                            style={{ padding: '6px 14px', background: T.accentGreen, border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontFamily: T.fontBody, cursor: 'pointer' }}>
                            ✓ Complete
                          </button>
                          <button onClick={() => changeStatus(m.id, 'pending')}
                            style={{ padding: '6px 14px', background: T.bgInput, border: '1px solid ' + T.border, borderRadius: 8, color: T.textSecondary, fontSize: 13, fontFamily: T.fontBody, cursor: 'pointer' }}>
                            ↩ Pause
                          </button>
                        </>
                      )}
                      {m.status === 'completed' && (
                        <button onClick={() => changeStatus(m.id, 'active')}
                          style={{ padding: '6px 14px', background: T.bgInput, border: '1px solid ' + T.border, borderRadius: 8, color: T.textSecondary, fontSize: 13, fontFamily: T.fontBody, cursor: 'pointer' }}>
                          ↩ Reopen
                        </button>
                      )}
                      <button onClick={() => deleteModule(m.id)}
                        style={{ padding: '6px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: T.accentRed, fontSize: 13, fontFamily: T.fontBody, cursor: 'pointer' }}>
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
    </div>
  )
}