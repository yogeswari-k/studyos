import { useUserData } from '../hooks/useUserData'

export default function Health() {
  const { health, updateHealth, saving } = useUserData()
  const pct = (v, max) => Math.min(100, Math.round((v / max) * 100))

  const fields = [
    { label:'Steps',       field:'steps',   val:health?.steps||0,   goal:health?.stepsGoal||8000,  unit:'',  color:'#34d399', step:500,  icon:'🚶' },
    { label:'Hydration',   field:'water',   val:health?.water||0,   goal:health?.waterGoal||2.5,   unit:'L', color:'#4f8eff', step:0.1,  icon:'💧' },
    { label:'Sleep',       field:'sleep',   val:health?.sleep||0,   goal:health?.sleepGoal||8,     unit:'h', color:'#a78bfa', step:0.5,  icon:'😴' },
    { label:'Mindfulness', field:'mindful', val:health?.mindful||0, goal:health?.mindfulGoal||15,  unit:'m', color:'#f472b6', step:5,    icon:'🧘' },
  ]

  const update = (field, val) => updateHealth({ [field]: Math.max(0, parseFloat(val.toFixed(1))) })

  return (
    <div style={{ padding:28, color:'#e2e8f0', fontFamily:"'Instrument Sans',sans-serif" }}>
      {saving && <div style={{ position:'fixed', bottom:24, right:24, background:'#34d399', color:'#fff', padding:'8px 18px', borderRadius:99, fontSize:13, fontFamily:"'DM Mono',monospace", zIndex:999 }}>✓ Saved</div>}

      <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, marginBottom:4 }}>Health Tracker 💚</h1>
      <p style={{ color:'#64748b', marginBottom:28 }}>All changes saved to cloud automatically</p>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16, maxWidth:700 }}>
        {fields.map(f => (
          <div key={f.field} style={{ background:'#0e1420', border:'1px solid rgba(99,148,255,0.12)', borderRadius:16, padding:22 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
              <span style={{ fontSize:28 }}>{f.icon}</span>
              <div>
                <div style={{ fontSize:11, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'#64748b', fontFamily:"'DM Mono',monospace" }}>{f.label}</div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, color:f.color }}>{f.val}{f.unit}</div>
              </div>
            </div>
            <div style={{ fontSize:12, color:'#64748b', marginBottom:6 }}>Goal: {f.goal}{f.unit}</div>
            <div style={{ height:6, background:'rgba(255,255,255,0.07)', borderRadius:99, overflow:'hidden', marginBottom:14 }}>
              <div style={{ height:'100%', width:`${pct(f.val,f.goal)}%`, background:f.color, borderRadius:99, transition:'width .5s ease' }} />
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <button onClick={() => update(f.field, f.val - f.step)} style={{ padding:'6px 14px', background:'#141c2e', border:'1px solid rgba(99,148,255,0.15)', borderRadius:8, color:'#e2e8f0', cursor:'pointer', fontSize:16, fontWeight:700 }}>−</button>
              <span style={{ flex:1, textAlign:'center', fontSize:13, color:'#64748b', fontFamily:"'DM Mono',monospace" }}>{pct(f.val,f.goal)}% of goal</span>
              <button onClick={() => update(f.field, f.val + f.step)} style={{ padding:'6px 14px', background:'#141c2e', border:'1px solid rgba(99,148,255,0.15)', borderRadius:8, color:'#e2e8f0', cursor:'pointer', fontSize:16, fontWeight:700 }}>+</button>
            </div>
          </div>
        ))}
      </div>

      {/* Extra stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16, maxWidth:700, marginTop:16 }}>
        {[
          { icon:'🍎', label:'Calories',  field:'calories', val:health?.calories||0, unit:'kcal', color:'#fb923c', step:50 },
          { icon:'❤️', label:'Heart Rate', field:'bpm',     val:health?.bpm||0,      unit:'bpm',  color:'#f87171', step:1 },
        ].map(f => (
          <div key={f.field} style={{ background:'#0e1420', border:'1px solid rgba(99,148,255,0.12)', borderRadius:16, padding:22 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
              <span style={{ fontSize:28 }}>{f.icon}</span>
              <div>
                <div style={{ fontSize:11, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'#64748b', fontFamily:"'DM Mono',monospace" }}>{f.label}</div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, color:f.color }}>{f.val} <span style={{ fontSize:14 }}>{f.unit}</span></div>
              </div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={() => update(f.field, f.val - f.step)} style={{ padding:'6px 14px', background:'#141c2e', border:'1px solid rgba(99,148,255,0.15)', borderRadius:8, color:'#e2e8f0', cursor:'pointer', fontSize:16, fontWeight:700 }}>−</button>
              <button onClick={() => update(f.field, f.val + f.step)} style={{ padding:'6px 14px', background:'#141c2e', border:'1px solid rgba(99,148,255,0.15)', borderRadius:8, color:'#e2e8f0', cursor:'pointer', fontSize:16, fontWeight:700 }}>+</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
