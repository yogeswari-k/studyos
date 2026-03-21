/* eslint-disable */
import { useState, useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { ThemeProvider, useTheme } from './ThemeContext'
import LoginPage from './pages/Login'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import LearningPath from './pages/LearningPath'
import Health from './pages/Health'
import Goals from './pages/Goals'
import { GoalReminder } from './components/GoalReminder'

const isMobile = () => window.innerWidth <= 768

function useScreenTime() {
  const startRef = useRef(0)
  const [screenTime, setScreenTime] = useState(() => {
    try {
      const today = new Date().toDateString()
      const saved = localStorage.getItem('screenTime')
      if (saved) {
        const p = JSON.parse(saved)
        if (p.date === today) return p.minutes
      }
    } catch (e) {}
    return 0
  })

  useEffect(() => {
    startRef.current = Date.now()
    const iv = setInterval(() => {
      try {
        const mins = Math.round((Date.now() - startRef.current) / 60000)
        const today = new Date().toDateString()
        const saved = localStorage.getItem('screenTime')
        let base = 0
        if (saved) {
          const p = JSON.parse(saved)
          if (p.date === today) base = p.baseMinutes || 0
        }
        const total = base + mins
        setScreenTime(total)
        localStorage.setItem('screenTime', JSON.stringify({ date: today, minutes: total, baseMinutes: base }))
      } catch (e) {}
    }, 60000)

    const onUnload = () => {
      try {
        const mins = Math.round((Date.now() - startRef.current) / 60000)
        const today = new Date().toDateString()
        const saved = localStorage.getItem('screenTime')
        let base = 0
        if (saved) {
          const p = JSON.parse(saved)
          if (p.date === today) base = p.baseMinutes || 0
        }
        localStorage.setItem('screenTime', JSON.stringify({ date: today, minutes: base + mins, baseMinutes: base + mins }))
      } catch (e) {}
    }

    window.addEventListener('beforeunload', onUnload)
    return () => {
      clearInterval(iv)
      window.removeEventListener('beforeunload', onUnload)
    }
  }, [])

  const fmt = (m) => {
    if (m < 60) return m + 'm'
    const h = Math.floor(m / 60)
    const min = m % 60
    return min > 0 ? h + 'h ' + min + 'm' : h + 'h'
  }

  return { screenTime, formattedTime: fmt(screenTime) }
}

const BOTTOM_NAV = [
  { path: '/',         icon: '⚡', label: 'Home'     },
  { path: '/goals',    icon: '🎯', label: 'Goals'    },
  { path: '/learning', icon: '📚', label: 'Learning' },
  { path: '/health',   icon: '💚', label: 'Health'   },
  { path: '/profile',  icon: '👤', label: 'Profile'  },
]

const SIDE_NAV = [
  { path: '/',         icon: '⚡', label: 'Dashboard'     },
  { path: '/goals',    icon: '🎯', label: 'Goals'         },
  { path: '/learning', icon: '📚', label: 'Learning Path'  },
  { path: '/health',   icon: '💚', label: 'Health'        },
  { path: '/profile',  icon: '👤', label: 'Profile'       },
]

function BottomNav() {
  const { T } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: T.bgCard,
      borderTop: '1px solid ' + T.border,
      display: 'flex', alignItems: 'center',
      paddingTop: 8,
      paddingBottom: 'calc(8px + env(safe-area-inset-bottom))',
      zIndex: 1000,
      boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
    }}>
      {BOTTOM_NAV.map(function(n) {
        const active = location.pathname === n.path
        return (
          <div key={n.path}
            onClick={function() { navigate(n.path) }}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 3, cursor: 'pointer', padding: '4px 0',
            }}>
            <div style={{
              width: 40, height: 26, borderRadius: 13,
              background: active ? T.accent + '20' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, transition: 'all 0.2s',
              transform: active ? 'scale(1.1)' : 'scale(1)',
            }}>
              {n.icon}
            </div>
            <span style={{
              fontSize: 10, fontFamily: T.fontLabel,
              fontWeight: active ? 600 : 400,
              color: active ? T.accent : T.textMuted,
            }}>
              {n.label}
            </span>
          </div>
        )
      })}
    </nav>
  )
}

function DesktopSidebar() {
  const [expanded, setExpanded] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()
  const { T, isDark, toggleTheme } = useTheme()

  return (
    <nav
      onMouseEnter={function() { setExpanded(true) }}
      onMouseLeave={function() { setExpanded(false) }}
      style={{
        width: expanded ? 220 : 68,
        background: T.bgSidebar,
        borderRight: '1px solid ' + (isDark ? 'rgba(78,127,255,0.1)' : 'rgba(255,255,255,0.08)'),
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh',
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        zIndex: 100, flexShrink: 0, overflowX: 'hidden',
        boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
      }}
    >
      <div style={{ padding: '24px 0 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 72 }}>
        {expanded ? (
          <div style={{ padding: '0 20px', width: '100%' }}>
            <div style={{ fontFamily: T.fontHeading, fontSize: 24, fontWeight: 700, color: '#fff' }}>StudyOS</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 3 }}>Academic Platform</div>
          </div>
        ) : (
          <div style={{ fontFamily: T.fontHeading, fontSize: 22, fontWeight: 700, color: '#fff' }}>S</div>
        )}
      </div>

      <div style={{ flex: 1, padding: '12px 0' }}>
        {SIDE_NAV.map(function(n) {
          const active = location.pathname === n.path
          return (
            <div key={n.path}
              onClick={function() { navigate(n.path) }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: expanded ? '12px 20px' : '12px 0',
                justifyContent: expanded ? 'flex-start' : 'center',
                cursor: 'pointer',
                color: active ? '#fff' : 'rgba(255,255,255,0.45)',
                background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                borderLeft: active ? '3px solid ' + (isDark ? T.accent : '#7BA7FF') : '3px solid transparent',
                transition: 'all 0.2s', margin: '2px 0',
              }}>
              <span style={{ fontSize: 18, width: expanded ? 24 : 68, textAlign: 'center', flexShrink: 0 }}>{n.icon}</span>
              {expanded && (
                <span style={{ fontSize: 14, fontWeight: active ? 600 : 400, whiteSpace: 'nowrap', fontFamily: T.fontBody }}>
                  {n.label}
                </span>
              )}
            </div>
          )
        })}
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '12px 0' }}>
        <div
          onClick={toggleTheme}
          style={{ display: 'flex', alignItems: 'center', gap: 12, padding: expanded ? '11px 20px' : '11px 0', justifyContent: expanded ? 'flex-start' : 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.45)' }}>
          <span style={{ fontSize: 18, width: expanded ? 24 : 68, textAlign: 'center', flexShrink: 0 }}>
            {isDark ? '☀' : '☽'}
          </span>
          {expanded && (
            <span style={{ fontSize: 14, fontFamily: T.fontBody, whiteSpace: 'nowrap' }}>
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </span>
          )}
        </div>
        <div
          onClick={logout}
          style={{ display: 'flex', alignItems: 'center', gap: 12, padding: expanded ? '11px 20px' : '11px 0', justifyContent: expanded ? 'flex-start' : 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.35)' }}>
          <span style={{ fontSize: 18, width: expanded ? 24 : 68, textAlign: 'center', flexShrink: 0 }}>⇤</span>
          {expanded && (
            <span style={{ fontSize: 14, fontFamily: T.fontBody, whiteSpace: 'nowrap' }}>Sign Out</span>
          )}
        </div>
      </div>
    </nav>
  )
}

function LoadingScreen() {
  const { T } = useTheme()
  return (
    <div style={{ background: T.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <div style={{ fontFamily: T.fontHeading, fontWeight: 700, fontSize: 42, color: T.accent, letterSpacing: '-0.02em' }}>StudyOS</div>
      <div style={{ color: T.textMuted, fontSize: 14, fontFamily: T.fontBody }}>Loading workspace...</div>
      <div style={{ width: 160, height: 3, background: T.border, borderRadius: 99, overflow: 'hidden', marginTop: 8 }}>
        <div style={{ height: '100%', width: '60%', background: T.accent, borderRadius: 99, animation: 'load 1.5s ease infinite' }} />
      </div>
      <style>{`@keyframes load{0%{width:0%}50%{width:80%}100%{width:0%}}`}</style>
    </div>
  )
}

function AppShell() {
  const { T } = useTheme()
  const { screenTime, formattedTime } = useScreenTime()
  const [mobile, setMobile] = useState(isMobile())
  const LIMIT = 360

  useEffect(() => {
    const handler = function() { setMobile(isMobile()) }
    window.addEventListener('resize', handler)
    return function() { window.removeEventListener('resize', handler) }
  }, [])

  const pct = Math.round((screenTime / LIMIT) * 100)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: T.bg, color: T.textPrimary, fontFamily: T.fontBody, transition: 'background 0.3s, color 0.3s' }}>
      {pct >= 80 && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 2000,
          background: pct >= 100 ? T.accentRed : T.accentGold,
          color: '#fff', padding: '10px 20px', textAlign: 'center',
          fontSize: 13, fontFamily: T.fontBody, fontWeight: 500,
        }}>
          {pct >= 100 ? '⚠ Screen time limit reached — take a break' : '⚠ ' + pct + '% of daily screen time used'}
        </div>
      )}

      {!mobile && <DesktopSidebar />}

      <main style={{
        flex: 1, overflowY: 'auto',
        paddingTop: pct >= 80 ? '42px' : '0',
        paddingBottom: mobile ? '80px' : '0',
        width: mobile ? '100%' : 'auto',
      }}>
        <Routes>
          <Route path="/"         element={<Dashboard screenTime={screenTime} formattedScreenTime={formattedTime} screenTimeLimit={LIMIT} mobile={mobile} />} />
          <Route path="/profile"  element={<Profile mobile={mobile} />} />
          <Route path="/learning" element={<LearningPath mobile={mobile} />} />
          <Route path="/health"   element={<Health mobile={mobile} />} />
          <Route path="/goals"    element={<Goals mobile={mobile} />} />
        </Routes>
      </main>

      {mobile && <BottomNav />}
      <GoalReminder />
    </div>
  )
}

function RootApp() {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return <LoginPage />
  return <AppShell />
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <RootApp />
      </BrowserRouter>
    </ThemeProvider>
  )
}