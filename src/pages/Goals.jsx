import { useState } from 'react'
import { useUserData } from '../hooks/useUserData'
import { useTheme } from '../ThemeContext'

export default function Goals({ mobile = false }) {
  const { goals, toggleGoal, addNewGoal, removeGoal, saving } = useUserData()
  const { T } = useTheme()
  const [newText, setNewText] = useState('')
  const [showInput, setShowInput] = useState(false)
  const doneCt = goals.filter(g => g.done).length

  const handleAdd = async () => {
    if (!newText.trim()) return
    await addNewGoal(newText.trim())
    setNewText('')
    setShowInput(false)
  }

  const P = mobile
    ? { padding: '16px', fontSize: 14 }
    : { padding: '32px 36px', fontSize: 15 }

  return (
    <div style={{ background: T.bg, minHeight: '100vh', fontFamily: T.fontBody, transition: 'background 0.3s' }}>

      {saving && <div style={{ position: 'fixed', bottom: mobile ? 90 : 24, right: 16, background: T.accentGreen, color: '#fff', padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 500, zIndex: 999 }}>✓ Saved</div>}

      {/* Header */}
      <div style={{ background: mobile ? T.bgSidebar : T.bg, padding: mobile ? '52px 20px 24px' : '32px 36px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: T.fontHeading, fontSize: mobile ? 28 : 36, fontWeight: 700, color: mobile ? '#fff' : T.textPrimary, letterSpacing: '-0.02em' }}>Goals</div>
            <div style={{ fontSize: 13, color: mobile ? 'rgba(255,255,255,0.5)' : T.textMuted, marginTop: 4 }}>{doneCt} of {goals.length} completed today</div>
          </div>
          <button onClick={() => setShowInput(!showInput)}
            style={{ background: mobile ? 'rgba(255,255,255,0.15)' : T.accent, border: 'none', borderRadius: 12, padding: mobile ? '10px 16px' : '11px 20px', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: T.fontBody }}>
            + Add Goal
          </button>
        </div>
      </div>

      <div style={{ padding: mobile ? '16px' : '24px 36px' }}>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { l: 'Done',       v: doneCt,                                                           c: T.accentGreen },
            { l: 'Completion', v: `${goals.length ? Math.round((doneCt/goals.length)*100) : 0}%`,  c: T.accent      },
            { l: 'Total',      v: goals.length,                                                     c: T.accentGold  },
          ].map(s => (
            <div key={s.l} style={{ background: T.bgCard, border: `1px solid ${T.borderCard}`, borderRadius: 14, padding: mobile ? '14px 12px' : '18px 16px', textAlign: 'center', boxShadow: T.shadowCard }}>
              <div style={{ fontFamily: T.fontHeading, fontSize: mobile ? 26 : 32, fontWeight: 700, color: s.c, lineHeight: 1 }}>{s.v}</div>
              <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: T.fontLabel }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Add input */}
        {showInput && (
          <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 16, padding: 16, marginBottom: 16, boxShadow: T.shadowCard }}>
            <input
              value={newText} onChange={e => setNewText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="What do you want to accomplish today?"
              autoFocus
              style={{ width: '100%', background: T.bgInput, border: `1px solid ${T.border}`, borderRadius: 10, padding: '12px 14px', color: T.textPrimary, fontSize: 15, fontFamily: T.fontBody, outline: 'none', boxSizing: 'border-box', marginBottom: 10 }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleAdd} style={{ flex: 1, padding: '11px 0', background: T.accent, border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: T.fontBody }}>Add Goal</button>
              <button onClick={() => setShowInput(false)} style={{ padding: '11px 16px', background: T.bgInput, border: `1px solid ${T.border}`, borderRadius: 10, color: T.textMuted, fontSize: 14, cursor: 'pointer', fontFamily: T.fontBody }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Goals list */}
        <div style={{ background: T.bgCard, border: `1px solid ${T.borderCard}`, borderRadius: 16, overflow: 'hidden', boxShadow: T.shadowCard }}>
          {goals.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div>
              <div style={{ fontFamily: T.fontHeading, fontSize: 18, color: T.textPrimary, marginBottom: 6 }}>No goals yet</div>
              <div style={{ fontSize: 14, color: T.textMuted }}>Tap "Add Goal" to get started</div>
            </div>
          ) : (
            goals.map((g, i) => (
              <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: mobile ? '16px' : '14px 20px', borderBottom: i < goals.length - 1 ? `1px solid ${T.border}` : 'none' }}>
                <div onClick={() => toggleGoal(g.id)}
                  style={{ width: 24, height: 24, borderRadius: '50%', border: `2px solid ${g.done ? T.accentGreen : T.border}`, background: g.done ? T.accentGreen : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 12, color: '#fff', flexShrink: 0, transition: 'all 0.2s' }}>
                  {g.done ? '✓' : ''}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: mobile ? 15 : 14, color: g.done ? T.textMuted : T.textPrimary, textDecoration: g.done ? 'line-through' : 'none' }}>{g.text}</div>
                  <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2, fontFamily: T.fontLabel }}>{g.cat}</div>
                </div>
                <div onClick={() => removeGoal(g.id)} style={{ fontSize: 16, cursor: 'pointer', color: T.textMuted, padding: '4px 8px' }}>✕</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
