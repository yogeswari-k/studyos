/* eslint-disable */
import { useState, useEffect } from 'react'
import { useUserData } from '../hooks/useUserData'
import { useTheme } from '../ThemeContext'

export function GoalReminder() {
  const { goals } = useUserData()
  const { T } = useTheme()
  const [dismissed, setDismissed] = useState(false)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const today = new Date().toDateString()
    const lastDismissed = localStorage.getItem('goalReminderDismissed')
    if (lastDismissed === today) {
      setShow(false)
      return
    }
    const timer = setTimeout(() => {
      const todayStr = new Date().toDateString()
      const hasGoalsToday = goals.some(g => {
        if (!g.createdAt) return false
        const date = g.createdAt?.toDate ? g.createdAt.toDate() : new Date(g.createdAt)
        return date.toDateString() === todayStr
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

  const hour = new Date().getHours()
  const pct  = hour < 12 ? 20 : hour < 17 ? 55 : 85
  const msg  = hour < 12
    ? 'Good morning — start the day with clear goals'
    : hour < 17
    ? 'Good afternoon — still time to plan your tasks'
    : 'Good evening — set goals for tomorrow'

  return (
    <div style={{
      position: 'fixed',
      bottom: 88,
      right: 16,
      zIndex: 1000,
      width: 300,
      background: T.bgCard,
      border: '1px solid ' + T.border,
      borderLeft: '4px solid ' + T.accent,
      borderRadius: 16,
      boxShadow: T.shadowCard,
      fontFamily: T.fontBody,
      overflow: 'hidden',
      animation: 'slideIn 0.4s ease',
    }}>
      {/* Top bar */}
      <div style={{ background: T.accent, padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: T.fontHeading, fontSize: 15, fontWeight: 700, color: '#fff' }}>
          Daily Reminder
        </div>
        <button onClick={dismiss} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 16, padding: 0 }}>
          ✕
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{ fontSize: 14, color: T.textPrimary, marginBottom: 8, lineHeight: 1.5 }}>
          You have not set any goals for today yet.
        </div>
        <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 14, lineHeight: 1.5 }}>
          {msg}
        </div>

        {/* Time of day bar */}
        <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 5 }}>{msg}</div>
        <div style={{ height: 4, background: T.bgInput, borderRadius: 99, overflow: 'hidden', marginBottom: 4 }}>
          <div style={{ height: '100%', width: pct + '%', background: T.accentGold, borderRadius: 99, transition: 'width 1s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: T.textMuted, marginBottom: 14, fontFamily: T.fontLabel, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <span>Morning</span>
          <span>Afternoon</span>
          <span>Evening</span>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="/goals" style={{ flex: 1, padding: '9px 0', background: T.accent, border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', textAlign: 'center', textDecoration: 'none', display: 'block', fontFamily: T.fontBody }}>
            Set Goals →
          </a>
          <button onClick={dismiss} style={{ padding: '9px 14px', background: T.bgInput, border: '1px solid ' + T.border, borderRadius: 10, color: T.textMuted, fontSize: 13, cursor: 'pointer', fontFamily: T.fontBody }}>
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