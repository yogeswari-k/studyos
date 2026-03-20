import { useUserData } from '../hooks/useUserData'
import { T } from '../theme'

function Card({ children, style }) {
  return (
    <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderTop: `3px solid ${T.accentGold}`, borderRadius: 4, padding: 22, boxShadow: '0 2px 8px rgba(44,24,16,0.07)', ...style }}>
      {children}
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <div style={{ fontFamily: T.fontHeading, fontStyle: 'italic', fontSize: 18, fontWeight: 700, color: T.accent, marginBottom: 16, paddingBottom: 8, borderBottom: `1px solid ${T.border}`, letterSpacing: '0.02em' }}>
      {children}
    </div>
  )
}

export default function Dashboard({ screenTime = 0, formattedScreenTime = '0m', screenTimeLimit = 360 }) {
  const { profile, goals, health, progress, saving } = useUserData()
  const doneCt = goals.filter(g => g.done).length
  const pct = (v, max) => Math.min(100, Math.round((v / max) * 100))
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div style={{ padding: 32, minHeight: '100vh', background: T.bg, backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(139,101,43,0.05) 31px, rgba(139,101,43,0.05) 32px)' }}>

      {saving && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: T.accentGreen, color: '#fff', padding: '8px 18px', borderRadius: 4, fontSize: 14, fontFamily: T.fontBody, fontStyle: 'italic', zIndex: 999 }}>
          ✓ Saved to records
        </div>
      )}

      {/* Newspaper Header */}
      <div style={{ textAlign: 'center', marginBottom: 32, paddingBottom: 20, borderBottom: `3px double ${T.border}` }}>
        <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.textMuted, fontFamily: T.fontLabel, marginBottom: 8 }}>
          {today}
        </div>
        <div style={{ fontFamily: T.fontHeading, fontStyle: 'italic', fontSize: 46, fontWeight: 800, color: T.textPrimary, lineHeight: 1, letterSpacing: '-0.01em' }}>
          The StudyOS Gazette
        </div>
        <div style={{ fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: T.textMuted, fontFamily: T.fontLabel, marginTop: 8 }}>
          Good morning, {profile?.name?.split(' ')[0] || 'Scholar'} — Est. Your First Login
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 12, fontSize: 13, color: T.textSecondary, fontStyle: 'italic', fontFamily: T.fontBody }}>
          <span>🔥 {progress?.streak || 0}-day streak</span>
          <span style={{ color: T.border }}>|</span>
          <span>{goals.length} active goals</span>
          <span style={{ color: T.border }}>|</span>
          <span>GPA {profile?.gpa || '—'}</span>
        </div>
      </div>

      {/* Stat Cards — newspaper columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: "Today's Study",    val: `${progress?.study || 0}h`,    sub: `of ${progress?.studyGoal || 5}h goal`, p: pct(progress?.study || 0, progress?.studyGoal || 5), color: T.accent },
          { label: 'Academic Score',   val: `${progress?.academic || 0}%`, sub: 'semester average',                      p: progress?.academic || 0,                             color: T.accentBlue },
          { label: 'Goals Completed',  val: `${doneCt}/${goals.length}`,   sub: `${goals.length - doneCt} remaining`,    p: pct(doneCt, goals.length || 1),                      color: T.accentGreen },
          { label: 'Screen Time',      val: formattedScreenTime,           sub: `of ${screenTimeLimit / 60}h limit`,     p: pct(screenTime, screenTimeLimit),                    color: T.accentGold },
        ].map(s => (
          <Card key={s.label}>
            <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.textMuted, marginBottom: 10, fontFamily: T.fontLabel }}>{s.label}</div>
            <div style={{ fontFamily: T.fontHeading, fontStyle: 'italic', fontSize: 32, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: 13, color: T.textMuted, marginTop: 6, fontStyle: 'italic' }}>{s.sub}</div>
            <div style={{ height: 4, background: T.bgHover, borderRadius: 0, marginTop: 12, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${s.p}%`, background: s.color, transition: 'width 1s ease' }} />
            </div>
          </Card>
        ))}
      </div>

      {/* Health Section */}
      <Card>
        <SectionTitle>✦ Health & Wellness Bulletin</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 12 }}>
          {[
            { icon: '🚶', val: health?.steps || 0,        lbl: 'Steps',       color: T.accentGreen },
            { icon: '💧', val: `${health?.water || 0}L`,  lbl: 'Hydration',   color: T.accentBlue },
            { icon: '😴', val: `${health?.sleep || 0}h`,  lbl: 'Sleep',       color: T.accent },
            { icon: '🧘', val: `${health?.mindful || 0}m`,lbl: 'Mindfulness', color: T.accentGold },
            { icon: '🍎', val: health?.calories || 0,     lbl: 'Calories',    color: T.accentRed },
            { icon: '❤️', val: `${health?.bpm || 0} bpm`, lbl: 'Heart Rate',  color: T.accentRed },
          ].map(h => (
            <div key={h.lbl} style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 4, padding: '14px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{h.icon}</div>
              <div style={{ fontFamily: T.fontHeading, fontStyle: 'italic', fontSize: 18, fontWeight: 700, color: h.color }}>{h.val}</div>
              <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: T.fontLabel }}>{h.lbl}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

