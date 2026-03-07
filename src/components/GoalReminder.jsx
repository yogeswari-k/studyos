import { useState, useEffect } from 'react'
import { useUserData } from '../hooks/useUserData'
import { T } from '../theme'

// ── Goal Reminder Notification ────────────────────────────────────────────────
// Add this component to your App.jsx or Dashboard.jsx
// It checks if user has added any goals today and shows a reminder if not

export function GoalReminder() {
  const { goals } = useUserData()
  const [dismissed, setDismissed] = useState(false)
  const [show, setShow]           = useState(false)

  useEffect(() => {
    // Check if already dismissed today
    const today = new Date().toDateString()
    const lastDismissed = localStorage.getItem('goalReminderDismissed')
    if (lastDismissed === today) {
      setShow(false)
      return
    }

    // Wait 5 seconds before showing — gives app time to load goals
    const timer = setTimeout(() => {
      const today = new Date().toDateString()
      // Check if any goals were created today
      const hasGoalsToday = goals.some(g => {
        if (!g.createdAt) return false
        // Firestore timestamp OR JS date
        const date = g.createdAt?.toDate ? g.createdAt.toDate() : new Date(g.createdAt)
        return date.toDateString() === today
      })

      if (!hasGoalsToday) {
        setShow(true)
      }
    }, 5000)

    return () => clearTimeout(timer)
  }, [goals])

  const dismiss = () => {
    const today = new Date().toDateString()
    localStorage.setItem('goalReminderDismissed', today)
    setShow(false)
    setDismissed(true)
  }

  if (!show || dismissed) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 28,
      right: 28,
      zIndex: 1000,
      width: 320,
      background: T.bgCard,
      border: '1px solid ' + T.border,
      borderLeft: '4px solid ' + T.accent,
      borderRadius: 4,
      boxShadow: '0 8px 32px rgba(44,24,16,0.18)',
      fontFamily: T.fontBody,
      overflow: 'hidden',
      animation: 'slideIn 0.4s ease',
    }}>
      {/* Top bar */}
      <div style={{ background: T.accent, padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: T.fontHeading, fontStyle: 'italic', fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: '0.02em' }}>
          ✦ Daily Reminder
        </div>
        <button onClick={dismiss} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: 0 }}>
          ✕
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 18px 18px' }}>
        <div style={{ fontSize: 15, color: T.textPrimary, marginBottom: 8, lineHeight: 1.5 }}>
          You have not recorded any goals for today yet.
        </div>
        <div style={{ fontSize: 13, color: T.textMuted, fontStyle: 'italic', marginBottom: 16, lineHeight: 1.5 }}>
          "A goal properly set is halfway reached." Set your intentions for the day.
        </div>

        {/* Progress dots showing time of day */}
        <TimeOfDayBar />

        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <a href="/goals" style={{ flex: 1, padding: '9px 0', background: T.accent, border: 'none', borderRadius: 4, color: '#fff', fontSize: 13, fontFamily: T.fontHeading, fontStyle: 'italic', fontWeight: 600, cursor: 'pointer', textAlign: 'center', textDecoration: 'none', display: 'block' }}>
            Set Today's Goals →
          </a>
          <button onClick={dismiss} style={{ padding: '9px 14px', background: T.bgHover, border: '1px solid ' + T.border, borderRadius: 4, color: T.textMuted, fontSize: 13, fontFamily: T.fontBody, fontStyle: 'italic', cursor: 'pointer' }}>
            Later
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(120%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>
  )
}

// Shows a small bar indicating morning / afternoon / evening
function TimeOfDayBar() {
  const hour = new Date().getHours()
  const period = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'
  const pct    = hour < 12 ? 20 : hour < 17 ? 55 : 85
  const msg    = hour < 12
    ? 'Good morning — start the day with clear goals'
    : hour < 17
    ? 'Good afternoon — still time to plan your tasks'
    : 'Good evening — set goals for tomorrow'

  return (
    <div>
      <div style={{ fontSize: 12, color: T.textMuted, fontStyle: 'italic', marginBottom: 6 }}>{msg}</div>
      <div style={{ height: 4, background: T.bgHover, borderRadius: 0, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: pct + '%', background: T.accentGold, transition: 'width 1s ease' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: T.textMuted, marginTop: 4, fontFamily: T.fontLabel, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        <span>Morning</span>
        <span>Afternoon</span>
        <span>Evening</span>
      </div>
    </div>
  )
}
