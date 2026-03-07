import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const { login, signup, loginWithGoogle, resetPassword, error, clearError } = useAuth()
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const handleSubmit = async () => {
    if (!email || !password) return
    setLoading(true)
    clearError()
    setSuccess('')
    try {
      if (mode === 'login') await login(email, password)
      if (mode === 'signup') await signup(email, password, name)
    } catch (e) {
      console.log(e)
    }
    setLoading(false)
  }

  const handleGoogle = async () => {
    setLoading(true)
    clearError()
    try {
      await loginWithGoogle()
    } catch (e) {
      console.log(e)
    }
    setLoading(false)
  }

  const handleReset = async () => {
    if (!email) return
    setLoading(true)
    try {
      await resetPassword(email)
      setSuccess('Reset email sent! Check your inbox.')
    } catch (e) {
      console.log(e)
    }
    setLoading(false)
  }

  const switchMode = (m) => {
    setMode(m)
    clearError()
    setSuccess('')
  }

  const inputStyle = {
    width: '100%',
    background: '#141c2e',
    border: '1px solid rgba(99,148,255,0.15)',
    borderRadius: 10,
    padding: '12px 14px',
    color: '#e2e8f0',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: 16,
    fontFamily: 'sans-serif',
  }

  const btnStyle = {
    width: '100%',
    background: 'linear-gradient(135deg,#4f8eff,#a78bfa)',
    border: 'none',
    borderRadius: 12,
    padding: '13px 0',
    color: '#fff',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    marginBottom: 14,
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080c12', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#0e1420', border: '1px solid rgba(99,148,255,0.15)', borderRadius: 24, padding: '40px 36px', width: '100%', maxWidth: 420 }}>

        <div style={{ fontWeight: 800, fontSize: 32, color: '#4f8eff', textAlign: 'center', marginBottom: 6 }}>
          StudyOS
        </div>
        <div style={{ textAlign: 'center', color: '#64748b', fontSize: 14, marginBottom: 32 }}>
          {mode === 'reset' ? 'Reset your password' : 'Your Academic Command Center'}
        </div>

        {mode !== 'reset' && (
          <div style={{ display: 'flex', background: '#141c2e', borderRadius: 12, padding: 4, marginBottom: 28, gap: 4 }}>
            {['login', 'signup'].map((m) => (
              <button key={m} onClick={() => switchMode(m)} style={{
                flex: 1, padding: '9px 0', borderRadius: 8, border: 'none',
                background: mode === m ? '#4f8eff' : 'transparent',
                color: mode === m ? '#fff' : '#64748b',
                fontWeight: 600, fontSize: 14, cursor: 'pointer',
              }}>
                {m === 'login' ? 'Login' : 'Sign Up'}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '10px 14px', color: '#f87171', fontSize: 13, marginBottom: 16 }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)', borderRadius: 10, padding: '10px 14px', color: '#34d399', fontSize: 13, marginBottom: 16 }}>
            {success}
          </div>
        )}

        {mode === 'signup' && (
          <>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>YOUR NAME</div>
            <input style={inputStyle} type="text" placeholder="Alex Johnson" value={name} onChange={(e) => setName(e.target.value)} />
          </>
        )}

        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>EMAIL</div>
        <input style={inputStyle} type="email" placeholder="you@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} />

        {mode !== 'reset' && (
          <>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>PASSWORD</div>
            <input style={inputStyle} type="password" placeholder="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} />
            {mode === 'login' && (
              <div style={{ textAlign: 'right', marginTop: -10, marginBottom: 16 }}>
                <button onClick={() => switchMode('reset')} style={{ color: '#4f8eff', fontSize: 12, cursor: 'pointer', background: 'none', border: 'none' }}>
                  Forgot password?
                </button>
              </div>
            )}
          </>
        )}

        {mode === 'reset' ? (
          <>
            <button onClick={handleReset} style={btnStyle}>
              {loading ? 'Sending...' : 'Send Reset Email'}
            </button>
            <div style={{ textAlign: 'center' }}>
              <button onClick={() => switchMode('login')} style={{ color: '#4f8eff', cursor: 'pointer', background: 'none', border: 'none', fontWeight: 600 }}>
                Back to Login
              </button>
            </div>
          </>
        ) : (
          <>
            <button onClick={handleSubmit} disabled={loading} style={{ ...btnStyle, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Login to StudyOS' : 'Create Account'}
            </button>

            <button onClick={handleGoogle} style={{ width: '100%', background: '#141c2e', border: '1px solid rgba(99,148,255,0.2)', borderRadius: 12, padding: '12px 0', color: '#e2e8f0', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 16 }}>
              Continue with Google
            </button>

            <div style={{ textAlign: 'center', color: '#64748b', fontSize: 13 }}>
              {mode === 'login' ? (
                <>No account?{' '}
                  <button onClick={() => switchMode('signup')} style={{ color: '#4f8eff', cursor: 'pointer', background: 'none', border: 'none', fontWeight: 600 }}>
                    Sign up free
                  </button>
                </>
              ) : (
                <>Have an account?{' '}
                  <button onClick={() => switchMode('login')} style={{ color: '#4f8eff', cursor: 'pointer', background: 'none', border: 'none', fontWeight: 600 }}>
                    Login
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}