import { useUserData } from '../hooks/useUserData'
import { useTheme } from '../ThemeContext'
import { useAuth } from '../hooks/useAuth'

export default function Dashboard({ screenTime = 0, formattedScreenTime = '0m', screenTimeLimit = 360, mobile = false }) {
  const { profile, goals, health, progress, saving } = useUserData()
  const { T, isDark, toggleTheme } = useTheme()
  const { logout } = useAuth()

  const doneCt   = goals.filter(g => g.done).length
  const pct      = (v, max) => Math.min(100, Math.round((v / max) * 100))
  const hour     = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'
  const today    = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  // ── MOBILE LAYOUT ──────────────────────────────────────────────────────────
  if (mobile) {
    return (
      <div style={{ background: T.bg, minHeight: '100vh', fontFamily: T.fontBody, transition: 'background 0.3s' }}>

        {saving && (
          <div style={{ position: 'fixed', bottom: 90, right: 16, background: T.accentGreen, color: '#fff', padding: '8px 16px', borderRadius: 20, fontSize: 12, fontWeight: 500, zIndex: 999 }}>
            ✓ Saved
          </div>
        )}

        {/* Mobile Header */}
        <div style={{ background: T.bgSidebar, padding: '44px 16px 22px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -60, right: -60, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

          {/* Top bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, position: 'relative' }}>
            <div style={{ fontFamily: T.fontHeading, fontSize: 18, fontWeight: 700, color: '#fff' }}>StudyOS</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={toggleTheme} style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 16, padding: '6px 12px', color: '#fff', fontSize: 12, cursor: 'pointer' }}>
                {isDark ? '☀' : '☽'}
              </button>
              <button onClick={logout} style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 16, padding: '6px 12px', color: '#fff', fontSize: 12, cursor: 'pointer' }}>
                Exit
              </button>
            </div>
          </div>

          {/* Greeting */}
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginBottom: 4, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {today}
            </div>
            <div style={{ fontFamily: T.fontHeading, fontSize: 24, fontWeight: 700, color: '#fff', lineHeight: 1.2, letterSpacing: '-0.01em', marginBottom: 6 }}>
              {greeting}, {profile?.name?.split(' ')[0] || 'Scholar'} 👋
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
              {profile?.major || 'Student'} · GPA {profile?.gpa || '—'} · 🔥 {progress?.streak || 0} days
            </div>
          </div>
        </div>

        {/* Stats — 2x2 grid (fits perfectly on phone) */}
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.textMuted, marginBottom: 10 }}>
            Overview
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'Study Time',  value: (progress?.study || 0) + 'h',    sub: 'Goal: ' + (progress?.studyGoal || 5) + 'h', color: T.accent,      icon: '📚', p: pct(progress?.study || 0, progress?.studyGoal || 5) },
              { label: 'Academic',    value: (progress?.academic || 0) + '%', sub: 'Semester avg',                               color: T.accentGreen,  icon: '🎓', p: progress?.academic || 0 },
              { label: 'Goals Done',  value: doneCt + '/' + goals.length,     sub: (goals.length - doneCt) + ' remaining',        color: T.accentGold,   icon: '🎯', p: pct(doneCt, goals.length || 1) },
              { label: 'Screen Time', value: formattedScreenTime,             sub: 'Limit: ' + (screenTimeLimit / 60) + 'h',      color: T.accentTeal,   icon: '🖥', p: pct(screenTime, screenTimeLimit) },
            ].map(s => (
              <div key={s.label} style={{ background: T.bgCard, border: '1px solid ' + T.borderCard, borderRadius: 16, padding: '14px', boxShadow: T.shadowCard }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: T.textMuted }}>{s.label}</div>
                  <span style={{ fontSize: 14 }}>{s.icon}</span>
                </div>
                <div style={{ fontFamily: T.fontHeading, fontSize: 26, fontWeight: 700, color: s.color, lineHeight: 1, letterSpacing: '-0.01em' }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 11, color: T.textMuted, marginTop: 3, marginBottom: 8 }}>
                  {s.sub}
                </div>
                <div style={{ height: 3, background: T.bgInput, borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: s.p + '%', background: s.color, borderRadius: 99, transition: 'width 1s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Goals Preview */}
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.textMuted }}>
              Today's Goals
            </div>
            <div style={{ fontSize: 12, color: T.accent, fontWeight: 600 }}>
              {doneCt}/{goals.length} done
            </div>
          </div>
          <div style={{ background: T.bgCard, border: '1px solid ' + T.borderCard, borderRadius: 16, overflow: 'hidden', boxShadow: T.shadowCard }}>
            {goals.length === 0 ? (
              <div style={{ padding: '18px 16px', textAlign: 'center', color: T.textMuted, fontSize: 13 }}>
                No goals yet — tap Goals below to add some
              </div>
            ) : (
              goals.slice(0, 3).map((g, i) => (
                <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderBottom: i < Math.min(goals.length, 3) - 1 ? '1px solid ' + T.border : 'none' }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid ' + (g.done ? T.accentGreen : T.border), background: g.done ? T.accentGreen : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#fff', flexShrink: 0 }}>
                    {g.done ? '✓' : ''}
                  </div>
                  <div style={{ fontSize: 13, color: g.done ? T.textMuted : T.textPrimary, textDecoration: g.done ? 'line-through' : 'none', flex: 1 }}>
                    {g.text}
                  </div>
                </div>
              ))
            )}
            {goals.length > 3 && (
              <div style={{ padding: '10px 14px', textAlign: 'center', fontSize: 12, color: T.accent, borderTop: '1px solid ' + T.border, fontWeight: 600 }}>
                +{goals.length - 3} more goals
              </div>
            )}
          </div>
        </div>

        {/* Health snapshot — 3x2 compact grid */}
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.textMuted, marginBottom: 10 }}>
            Health Today
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {[
              { icon: '🚶', val: health?.steps || 0,           lbl: 'Steps',    color: T.accentGreen },
              { icon: '💧', val: (health?.water || 0) + 'L',   lbl: 'Water',    color: T.accentTeal  },
              { icon: '😴', val: (health?.sleep || 0) + 'h',   lbl: 'Sleep',    color: T.accent      },
              { icon: '🧘', val: (health?.mindful || 0) + 'm', lbl: 'Mindful',  color: T.accentGold  },
              { icon: '🍎', val: health?.calories || 0,        lbl: 'Calories', color: T.accentRed   },
              { icon: '❤️', val: health?.bpm || 0,             lbl: 'BPM',      color: T.accentRed   },
            ].map(h => (
              <div key={h.lbl} style={{ background: T.bgCard, border: '1px solid ' + T.borderCard, borderRadius: 12, padding: '12px 8px', textAlign: 'center', boxShadow: T.shadowCard }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{h.icon}</div>
                <div style={{ fontFamily: T.fontHeading, fontSize: 15, fontWeight: 700, color: h.color, lineHeight: 1 }}>{h.val}</div>
                <div style={{ fontSize: 9, color: T.textMuted, marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h.lbl}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: 24 }} />
      </div>
    )
  }

  // ── DESKTOP LAYOUT ─────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '32px 36px', minHeight: '100vh', background: T.bg, transition: 'background 0.3s' }}>

      {saving && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: T.accentGreen, color: '#fff', padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 500, zIndex: 999 }}>
          ✓ Changes saved
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36 }}>
        <div>
          <div style={{ fontSize: 12, color: T.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: T.fontLabel, fontWeight: 600, marginBottom: 8 }}>{today}</div>
          <div style={{ fontFamily: T.fontHeading, fontSize: 36, fontWeight: 700, color: T.textPrimary, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            {greeting}, {profile?.name?.split(' ')[0] || 'Scholar'}
          </div>
          <div style={{ fontSize: 14, color: T.textMuted, marginTop: 8 }}>
            {profile?.major} · {profile?.year} · GPA {profile?.gpa || '—'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ background: T.bgCard, border: '1px solid ' + T.borderCard, borderRadius: 10, padding: '10px 16px', fontSize: 13, color: T.textSecondary, boxShadow: T.shadowCard }}>
            🔥 {progress?.streak || 0} day streak
          </div>
        </div>
      </div>

      <div style={{ height: 1, background: T.border, marginBottom: 32 }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginBottom: 32 }}>
        {[
          { label: 'Study Time',     value: (progress?.study || 0) + 'h',    sub: 'Goal: ' + (progress?.studyGoal || 5) + 'h', p: pct(progress?.study || 0, progress?.studyGoal || 5), color: T.accent,      icon: '📚' },
          { label: 'Academic Score', value: (progress?.academic || 0) + '%', sub: 'Semester average',                           p: progress?.academic || 0,                             color: T.accentGreen,  icon: '🎓' },
          { label: 'Goals Done',     value: doneCt + '/' + goals.length,     sub: (goals.length - doneCt) + ' remaining',        p: pct(doneCt, goals.length || 1),                      color: T.accentGold,   icon: '🎯' },
          { label: 'Screen Time',    value: formattedScreenTime,             sub: 'Limit: ' + (screenTimeLimit / 60) + 'h',      p: pct(screenTime, screenTimeLimit),                    color: T.accentTeal,   icon: '🖥' },
        ].map(s => (
          <div key={s.label} style={{ background: T.bgCard, border: '1px solid ' + T.borderCard, borderRadius: 16, padding: '22px 24px', boxShadow: T.shadowCard }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: T.textMuted, fontFamily: T.fontLabel }}>{s.label}</div>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{s.icon}</div>
            </div>
            <div style={{ fontFamily: T.fontHeading, fontSize: 36, fontWeight: 700, color: T.textPrimary, lineHeight: 1, marginBottom: 6, letterSpacing: '-0.02em' }}>{s.value}</div>
            <div style={{ fontSize: 13, color: T.textMuted, marginBottom: 14 }}>{s.sub}</div>
            <div style={{ height: 4, background: T.bgInput, borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: s.p + '%', background: s.color, borderRadius: 99, transition: 'width 1s ease' }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: T.bgCard, border: '1px solid ' + T.borderCard, borderRadius: 16, padding: '24px 28px', boxShadow: T.shadowCard }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontFamily: T.fontHeading, fontSize: 20, fontWeight: 700, color: T.textPrimary }}>Health Overview</div>
          <div style={{ fontSize: 12, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Today</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 12 }}>
          {[
            { icon: '🚶', val: health?.steps || 0,           lbl: 'Steps',    color: T.accentGreen },
            { icon: '💧', val: (health?.water || 0) + 'L',   lbl: 'Water',    color: T.accentTeal  },
            { icon: '😴', val: (health?.sleep || 0) + 'h',   lbl: 'Sleep',    color: T.accent      },
            { icon: '🧘', val: (health?.mindful || 0) + 'm', lbl: 'Mindful',  color: T.accentGold  },
            { icon: '🍎', val: health?.calories || 0,        lbl: 'Calories', color: T.accentRed   },
            { icon: '❤',  val: health?.bpm || 0,             lbl: 'BPM',      color: T.accentRed   },
          ].map(h => (
            <div key={h.lbl} style={{ background: T.bgInput, border: '1px solid ' + T.border, borderRadius: 12, padding: '14px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{h.icon}</div>
              <div style={{ fontFamily: T.fontHeading, fontSize: 18, fontWeight: 700, color: h.color }}>{h.val}</div>
              <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h.lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}  
  