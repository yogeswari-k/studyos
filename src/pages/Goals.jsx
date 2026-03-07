import { useState } from 'react'
import { useUserData } from '../hooks/useUserData'

export default function Goals() {
  const { goals, toggleGoal, addNewGoal, removeGoal, saving } = useUserData()
  const [newText, setNewText] = useState('')
  const doneCt = goals.filter(g => g.done).length

  const handleAdd = async () => {
    if (!newText.trim()) return
    await addNewGoal(newText.trim())
    setNewText('')
  }

  return (
    <div style={{ padding:28, color:'#e2e8f0', fontFamily:"'Instrument Sans',sans-serif" }}>
      {saving && <div style={{ position:'fixed', bottom:24, right:24, background:'#34d399', color:'#fff', padding:'8px 18px', borderRadius:99, fontSize:13, fontFamily:"'DM Mono',monospace", zIndex:999 }}>✓ Saved</div>}

      <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, marginBottom:4 }}>Goals 🎯</h1>
      <p style={{ color:'#64748b', marginBottom:28 }}>Tap to check off · All changes saved to cloud</p>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:24 }}>
        {[
          { l:'Done Today',   v:`${doneCt}/${goals.length}`, c:'#4f8eff' },
          { l:'Completion',   v:`${goals.length ? Math.round((doneCt/goals.length)*100) : 0}%`, c:'#34d399' },
          { l:'Total Goals',  v:goals.length, c:'#a78bfa' },
        ].map(s => (
          <div key={s.l} style={{ background:'#0e1420', border:'1px solid rgba(99,148,255,0.12)', borderRadius:16, padding:20 }}>
            <div style={{ fontSize:11, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'#64748b', marginBottom:8, fontFamily:"'DM Mono',monospace" }}>{s.l}</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, color:s.c }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Goals list */}
      <div style={{ background:'#0e1420', border:'1px solid rgba(99,148,255,0.12)', borderRadius:16, padding:22, maxWidth:600 }}>
        {goals.length === 0 && (
          <div style={{ color:'#64748b', textAlign:'center', padding:'20px 0', fontSize:14 }}>No goals yet — add one below!</div>
        )}
        {goals.map(g => (
          <div key={g.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 0', borderBottom:'1px solid rgba(99,148,255,0.08)' }}>
            <div onClick={() => toggleGoal(g.id)} style={{
              width:22, height:22, borderRadius:'50%', flexShrink:0, cursor:'pointer',
              border:`2px solid ${g.done ? '#34d399' : 'rgba(99,148,255,0.2)'}`,
              background: g.done ? '#34d399' : 'transparent',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:12, color:'#fff', transition:'all .2s',
            }}>
              {g.done ? '✓' : ''}
            </div>
            <div style={{ flex:1, fontSize:14, textDecoration:g.done?'line-through':'none', color:g.done?'#64748b':'#e2e8f0' }}>{g.text}</div>
            <span style={{ fontSize:11, fontFamily:"'DM Mono',monospace", padding:'2px 8px', borderRadius:99, background:'rgba(79,142,255,0.1)', color:'#4f8eff', border:'1px solid rgba(79,142,255,0.2)' }}>{g.cat}</span>
            <div onClick={() => removeGoal(g.id)} style={{ fontSize:14, cursor:'pointer', color:'#64748b', padding:'0 4px' }}>✕</div>
          </div>
        ))}

        {/* Add goal input */}
        <div style={{ display:'flex', gap:8, marginTop:16 }}>
          <input
            value={newText}
            onChange={e => setNewText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="Add a new goal and press Enter..."
            style={{ flex:1, background:'#141c2e', border:'1px solid rgba(99,148,255,0.15)', borderRadius:8, padding:'9px 14px', color:'#e2e8f0', fontSize:14, fontFamily:"'Instrument Sans',sans-serif", outline:'none' }}
          />
          <button onClick={handleAdd} style={{ padding:'9px 18px', background:'#4f8eff', border:'none', borderRadius:8, color:'#fff', fontWeight:600, cursor:'pointer', fontFamily:"'Instrument Sans',sans-serif" }}>+ Add</button>
        </div>
      </div>
    </div>
  )
}
