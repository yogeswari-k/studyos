import { useState, useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Sidebar from './components/Sidebar'
import LoginPage from './pages/Login'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import LearningPath from './pages/LearningPath'
import Health from './pages/Health'
import Goals from './pages/Goals'
import { GoalReminder } from './components/GoalReminder'
import { T } from './theme'

function useScreenTime() {
  const startTime = useRef(Date.now())
  const [screenTime, setScreenTime] = useState(() => {
    const today = new Date().toDateString()
    const saved = localStorage.getItem('screenTime')
    if (saved) { const p = JSON.parse(saved); if (p.date === today) return p.minutes }
    return 0
  })
  useEffect(() => {
    const iv = setInterval(() => {
      const mins = Math.round((Date.now() - startTime.current) / 60000)
      const today = new Date().toDateString()
      const saved = localStorage.getItem('screenTime')
      let base = 0
      if (saved) { const p = JSON.parse(saved); if (p.date === today) base = p.baseMinutes || 0 }
      const total = base + mins
      setScreenTime(total)
      localStorage.setItem('screenTime', JSON.stringify({ date: today, minutes: total, baseMinutes: base }))
    }, 60000)
    const onUnload = () => {
      const mins = Math.round((Date.now() - startTime.current) / 60000)
      const today = new Date().toDateString()
      const saved = localStorage.getItem('screenTime')
      let base = 0
      if (saved) { const p = JSON.parse(saved); if (p.date === today) base = p.baseMinutes || 0 }
      localStorage.setItem('screenTime', JSON.stringify({ date: today, minutes: base + mins, baseMinutes: base + mins }))
    }
    window.addEventListener('beforeunload', onUnload)
    return () => { clearInterval(iv); window.removeEventListener('beforeunload', onUnload) }
  }, [])
  const fmt = (m) => m < 60 ? `${m}m` : `${Math.floor(m / 60)}h ${m % 60 > 0 ? m % 60 + 'm' : ''}`
  return { screenTime, formattedTime: fmt(screenTime) }
}

function ScreenTimeWarning({ screenTime, limit }) {
  const pct = Math.round((screenTime / limit) * 100)
  if (pct < 80) return null
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: pct >= 100 ? T.accentRed : T.accentGold,
      color: '#fff', padding: '10px 24px', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontSize: 14, fontFamily: T.fontBody, fontStyle: 'italic',
      borderBottom: '2px solid ' + T.borderStrong,
    }}>
      {pct >= 100
        ? '✦ Screen time limit reached — time to rest your eyes ✦'
        : `✦ ${pct}% of daily screen time used — mind your studies ✦`}
    </div>
  )
}

function LoadingScreen() {
  return (
    <div style={{ background: T.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <div style={{ fontFamily: T.fontHeading, fontWeight: 700, fontSize: 42, color: T.accent, fontStyle: 'italic' }}>StudyOS</div>
      <div style={{ color: T.textMuted, fontSize: 16, fontFamily: T.fontBody, fontStyle: 'italic' }}>Loading your workspace...</div>
    </div>
  )
}

function AppShell() {
  const { screenTime, formattedTime } = useScreenTime()
  const LIMIT = 360
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: T.bg, color: T.textPrimary, fontFamily: T.fontBody }}>
      <ScreenTimeWarning screenTime={screenTime} limit={LIMIT} />
      <Sidebar />
      <main style={{ flex: 1, overflowY: 'auto', paddingTop: (screenTime / LIMIT) >= 0.8 ? '44px' : '0' }}>
        <Routes>
          <Route path="/"         element={<Dashboard screenTime={screenTime} formattedScreenTime={formattedTime} screenTimeLimit={LIMIT} />} />
          <Route path="/profile"  element={<Profile />} />
          <Route path="/learning" element={<LearningPath />} />
          <Route path="/health"   element={<Health />} />
          <Route path="/goals"    element={<Goals />} />
        </Routes>
      </main>

      {/* Goal reminder notification — shows if no goals added today */}
      <GoalReminder />
    </div>
  )
}

function RootApp() {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user)   return <LoginPage />
  return <AppShell />
}

export default function App() {
  return (
    <BrowserRouter>
      <RootApp />
    </BrowserRouter>
  )
}
