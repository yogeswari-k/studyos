import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { T } from '../theme'

const NAV = [
  { path: '/',         icon: '❧', label: 'Dashboard'    },
  { path: '/profile',  icon: '✒', label: 'Profile'      },
  { path: '/learning', icon: '📜', label: 'Learning Path' },
  { path: '/health',   icon: '✦', label: 'Health'       },
  { path: '/goals',    icon: '⚑', label: 'Goals'        },
]

export default function Sidebar() {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()

  return (
    <nav
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: hovered ? 210 : 64,
        background: T.bgSidebar,
        borderRight: `2px solid ${T.accentGold}`,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '28px 0', gap: 2,
        position: 'sticky', top: 0, height: '100vh',
        transition: 'width .3s cubic-bezier(.4,0,.2,1)',
        zIndex: 10, flexShrink: 0, overflowX: 'hidden',
      }}
    >
      {/* Logo */}
      <div style={{
        fontFamily: T.fontHeading,
        fontWeight: 700,
        fontStyle: 'italic',
        fontSize: 22,
        color: T.accentGold,
        marginBottom: 28,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        width: hovered ? 170 : 36,
        textAlign: 'center',
        transition: 'width .3s',
        letterSpacing: '0.02em',
      }}>
        {hovered ? 'StudyOS' : 'S'}
      </div>

      {/* Divider */}
      <div style={{ width: '80%', height: 1, background: T.accentGold, opacity: 0.3, marginBottom: 12 }} />

      {/* Nav items */}
      {NAV.map(n => {
        const active = location.pathname === n.path
        return (
          <div
            key={n.path}
            onClick={() => navigate(n.path)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center',
              gap: 12, padding: '11px 20px', cursor: 'pointer',
              color: active ? T.accentGold : T.textMuted,
              background: active ? 'rgba(200,169,81,0.12)' : 'transparent',
              position: 'relative', transition: 'all .2s',
              borderLeft: active ? `3px solid ${T.accentGold}` : '3px solid transparent',
            }}
          >
            <span style={{ fontSize: 18, width: 24, textAlign: 'center', flexShrink: 0 }}>{n.icon}</span>
            <span style={{
              opacity: hovered ? 1 : 0,
              fontSize: 15,
              fontFamily: T.fontBody,
              fontStyle: 'italic',
              whiteSpace: 'nowrap',
              transition: 'opacity .2s',
              letterSpacing: '0.03em',
            }}>
              {n.label}
            </span>
          </div>
        )
      })}

      <div style={{ flex: 1 }} />

      {/* Divider */}
      <div style={{ width: '80%', height: 1, background: T.accentGold, opacity: 0.3, marginBottom: 12 }} />

      {/* Logout */}
      <div
        onClick={logout}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          gap: 12, padding: '11px 20px', cursor: 'pointer',
          color: T.textMuted, transition: 'all .2s',
        }}
      >
        <span style={{ fontSize: 18, width: 24, textAlign: 'center', flexShrink: 0 }}>⇤</span>
        <span style={{ opacity: hovered ? 1 : 0, fontSize: 15, fontFamily: T.fontBody, fontStyle: 'italic', whiteSpace: 'nowrap', transition: 'opacity .2s' }}>
          Logout
        </span>
      </div>
    </nav>
  )
}
