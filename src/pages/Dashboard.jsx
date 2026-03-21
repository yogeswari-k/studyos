import { useUserData } from '../hooks/useUserData'
import { useTheme } from '../ThemeContext'
import { useAuth } from '../hooks/useAuth'

export default function Dashboard({ screenTime = 0, formattedScreenTime = '0m', screenTimeLimit = 360, mobile = false }) {
  const { profile, goals, health, progress, saving } = useUserData()
  const { T, isDark, toggleTheme } = useTheme()
  const { logout } = useAuth()

  const doneCt = goals.filter(g => g.done).length
  const pct    = (v, max) => Math.min(100, Math.round((v / max) * 100))
  const hour   = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'
  const today  = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  // ── MOBILE LAYOUT ──────────────────────────────────────────────────────────
  if (mobile) {
    return (
      <div style={{ background: T.bg, minHeight: '100vh', fontFamily: T.fontBody, transition: 'background 0.3s' }}>

        {saving && (
          <div style={{ position: 'fixed', bottom: 90, right: 16, background: T.accentGreen, color: '#fff', padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 500, zIndex: 999 }}>
            ✓ Saved
          </div>
        )}

        {/* Mobile Header */}
        <div style={{ background: T.bgSidebar, padding: '48px 20px 28px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -80, right: -80, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -50, left: -50, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

          {/* Top bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, position: 'relative' }}>
            <div style={{ fontFamily: T.fontHeading, fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
              StudyOS
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={toggleTheme} style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 20, padding: '7px 14px', color: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: T.fontBody }}>
                {isDark ? '☀ Light' : '☽ Dark'}
              </button>
              <button onClick={logout} style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 20, padding: '7px 14px', color: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: T.fontBody }}>
                Exit
              </button>
            </div>
          </div>

          {/* Greeting */}
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 6, fontFamily: T.fontLabel, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {today}
            </div>
            <div style={{ fontFamily: T.fontHeading, fontSize: 30, fontWeight: 700, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.01em' }}>
              {greeting},
            </div>
            <div style={{ fontFamily: T.fontHeading, fontSize: 30, fontWeight: 700, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.01em', marginBottom: 10 }}>
              {profile?.name?.split(' ')[0] || 'Scholar'} 👋
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
              {profile?.major || 'Student'} · GPA {profile?.gpa || '—'} · 🔥 {progress?.streak || 0} days
            </div>
          </div>
        </div>

        {/* Stats horizontal scroll */}
        <div style={{ padding: '20px 0 0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.textMuted, fontFamily: T.fontLabel, padding: '0 20px', marginBottom: 10 }}>
            Overview
          </div>
          <div style={{ display: 'flex', gap: 12, padding: '0 20px 4px', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {[
              { label: 'Study',    value: progress?.study || 0,    suffix: 'h',  goal: progress?.studyGoal || 5,  goalSuffix: 'h',  color: T.accent,      p: pct(progress?.study || 0, progress?.studyGoal || 5), icon: '📚' },
              { label: 'Academic', value: progress?.academic || 0, suffix: '%',  goal: 100,                       goalSuffix: '%',  color: T.accentGreen,  p: progress?.academic || 0,                             icon: '🎓' },
              { label: 'Goals',    value: doneCt,                  suffix: '',   goal: goals.length,              goalSuffix: ' total', color: T.accentGold, p: pct(doneCt, goals.length || 1),                    icon: '🎯' },
              { label: 'Screen',   value: formattedScreenTime,     suffix: '',   goal: screenTimeLimit / 60,      goalSuffix: 'h limit', color: T.accentTeal, p: pct(screenTime, screenTimeLimit),                 icon: '🖥' },
            ].map(s => (
              <div key={s.label} style={{ background: T.bgCard, border: '1px solid ' + T.borderCard, borderRadius: 18, padding: '16px 18px', minWidth: 140, flexShrink: 0, boxShadow: T.shadowCard }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: T.textMuted, fontFamily: T.fontLabel }}>{s.label}</div>
                  <span style={{ fontSize: 16 }}>{s.icon}</span>
                </div>
                <div style={{ fontFamily: T.fontHeading, fontSize: 30, fontWeight: 700, color: s.color, lineHeight: 1, letterSpacing: '-0.01em' }}>
                  {s.value}{s.suffix}
                </div>
                <div style={{ fontSize: 12, color: T.textMuted, marginTop: 4 }}>
                  of {s.goal}{s.goalSuffix}
                </div>
                <div style={{ height: 3, background: T.bgInput, borderRadius: 99, overflow: 'hidden', marginTop: 10 }}>
                  <div style={{ height: '100%', width: s.p + '%', background: s.color, borderRadius: 99, transition: 'width 1s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Goals Preview */}
        <div style={{ margin: '20px 20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.textMuted, fontFamily: T.fontLabel }}>
              Today's Goals
            </div>
            <div style={{ fontSize: 13, color: T.accent, fontWeight: 600 }}>
              {doneCt}/{goals.length} done
            </div>
          </div>
          <div style={{ background: T.bgCard, border: '1px solid ' + T.borderCard, borderRadius: 18, overflow: 'hidden', boxShadow: T.shadowCard }}>
            {goals.length === 0 ? (
              <div style={{ padding: '24px 20px', textAlign: 'center', color: T.textMuted, fontSize: 14, fontStyle: 'italic' }}>
                No goals yet — tap Goals below to add some
              </div>
            ) : (
              goals.slice(0, 4).map((g, i) => (
                <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: i < Math.min(goals.length, 4) - 1 ? '1px solid ' + T.border : 'none' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid ' + (g.done ? T.accentGreen : T.border), background: g.done ? T.accentGreen : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#fff', flexShrink: 0, transition: 'all 0.2s' }}>
                    {g.done ? '✓' : ''}
                  </div>
                  <div style={{ fontSize: 14, color: g.done ? T.textMuted : T.textPrimary, textDecoration: g.done ? 'line-through' : 'none', flex: 1 }}>
                    {g.text}
                  </div>
                </div>
              ))
            )}
            {goals.length > 4 && (
              <div style={{ padding: '12px 16px', textAlign: 'center', fontSize: 13, color: T.accent, borderTop: '1px solid ' + T.border, fontWeight: 600 }}>
                +{goals.length - 4} more goals
              </div>
            )}
          </div>
        </div>

        {/* Health snapshot */}
        <div style={{ margin: '20px 20px 0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.textMuted, fontFamily: T.fontLabel, marginBottom: 12 }}>
            Health Today
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[
              { icon: '🚶', val: health?.steps || 0,         lbl: 'Steps',    color: T.accentGreen },
              { icon: '💧', val: (health?.water || 0) + 'L', lbl: 'Water',    color: T.accentTeal  },
              { icon: '😴', val: (health?.sleep || 0) + 'h', lbl: 'Sleep',    color: T.accent      },
              { icon: '🧘', val: (health?.mindful || 0) + 'm', lbl: 'Mindful', color: T.accentGold  },
              { icon: '🍎', val: health?.calories || 0,      lbl: 'Calories', color: T.accentRed   },
              { icon: '❤️', val: health?.bpm || 0,           lbl: 'BPM',      color: T.accentRed   },
            ].map(h => (
              <div key={h.lbl} style={{ background: T.bgCard, border: '1px solid ' + T.borderCard, borderRadius: 14, padding: '14px 10px', textAlign: 'center', boxShadow: T.shadowCard }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{h.icon}</div>
                <div style={{ fontFamily: T.fontHeading, fontSize: 18, fontWeight: 700, color: h.color, lineHeight: 1 }}>{h.val}</div>
                <div style={{ fontSize: 10, color: T.textMuted, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: T.fontLabel }}>{h.lbl}</div>
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
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: T.accentGreen, color: '#fff', padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 500, zIndex: 999, boxShadow: T.shadow }}>
          ✓ Changes saved
        </div>
      )}

      {/* Header */}
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
          <div style={{ background: T.bgCard, border: '1px solid ' + T.borderCard, borderRadius: 10, padding: '10px 16px', fontSize: 13, color: T.textSecondary, boxShadow: T.shadowCard }}>
            {profile?.semester || 'Current Semester'}
          </div>
        </div>
      </div>

      <div style={{ height: 1, background: T.border, marginBottom: 32 }} />

      {/* Stat Cards */}
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

      {/* Health Section */}
      <div style={{ background: T.bgCard, border: '1px solid ' + T.borderCard, borderRadius: 16, padding: '24px 28px', boxShadow: T.shadowCard }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontFamily: T.fontHeading, fontSize: 20, fontWeight: 700, color: T.textPrimary, letterSpacing: '-0.01em' }}>Health Overview</div>
          <div style={{ fontSize: 12, color: T.textMuted, fontFamily: T.fontLabel, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Today</div>
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
              <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: T.fontLabel }}>{h.lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}