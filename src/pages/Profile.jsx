import { useUserData } from '../hooks/useUserData'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'

export default function Profile() {
  const { profile, updateProfile, saving } = useUserData()
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)
  const [draft,   setDraft]   = useState(profile)

  const save = async () => { await updateProfile(draft); setEditing(false) }

  return (
    <div style={{ padding:28, color:'#e2e8f0', fontFamily:"'Instrument Sans',sans-serif" }}>
      {saving && <div style={{ position:'fixed', bottom:24, right:24, background:'#34d399', color:'#fff', padding:'8px 18px', borderRadius:99, fontSize:13, fontFamily:"'DM Mono',monospace", zIndex:999 }}>✓ Saved</div>}
      <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, marginBottom:8 }}>My Profile 👤</h1>
      <p style={{ color:'#64748b', marginBottom:28 }}>Logged in as {user?.email}</p>

      <div style={{ background:'#0e1420', border:'1px solid rgba(99,148,255,0.15)', borderRadius:20, padding:28, maxWidth:500 }}>
        {editing ? (
          <>
            {[['name','Name'],['major','Major'],['year','Year'],['gpa','GPA'],['semester','Semester'],['credits','Credits']].map(([k,l]) => (
              <div key={k} style={{ marginBottom:14 }}>
                <div style={{ fontSize:12, color:'#64748b', fontFamily:"'DM Mono',monospace", marginBottom:5 }}>{l.toUpperCase()}</div>
                <input value={draft?.[k] || ''} onChange={e => setDraft(d => ({...d,[k]:e.target.value}))}
                  style={{ width:'100%', background:'#141c2e', border:'1px solid rgba(99,148,255,0.15)', borderRadius:8, padding:'9px 14px', color:'#e2e8f0', fontSize:14, fontFamily:"'Instrument Sans',sans-serif", outline:'none', boxSizing:'border-box' }} />
              </div>
            ))}
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={save} style={{ padding:'9px 20px', background:'#4f8eff', border:'none', borderRadius:10, color:'#fff', fontWeight:600, cursor:'pointer', fontFamily:"'Instrument Sans',sans-serif" }}>Save</button>
              <button onClick={() => setEditing(false)} style={{ padding:'9px 20px', background:'transparent', border:'1px solid rgba(99,148,255,0.2)', borderRadius:10, color:'#64748b', cursor:'pointer', fontFamily:"'Instrument Sans',sans-serif" }}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <div style={{ display:'flex', gap:20, alignItems:'center', marginBottom:20 }}>
              <div style={{ width:64, height:64, borderRadius:'50%', background:'linear-gradient(135deg,#4f8eff,#a78bfa)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:24 }}>
                {profile?.name?.[0] || 'S'}
              </div>
              <div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800 }}>{profile?.name || 'Student'}</div>
                <div style={{ color:'#64748b', fontSize:14, marginTop:2 }}>{profile?.major} · {profile?.year} · GPA {profile?.gpa}</div>
              </div>
            </div>
            <button onClick={() => { setDraft(profile); setEditing(true) }} style={{ padding:'9px 20px', background:'#4f8eff', border:'none', borderRadius:10, color:'#fff', fontWeight:600, cursor:'pointer', fontFamily:"'Instrument Sans',sans-serif" }}>
              ✏️ Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  )
}
