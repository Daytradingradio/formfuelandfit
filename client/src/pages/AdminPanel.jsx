import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AdminPanel() {
  const { getToken, logout } = useAuth()
  const [members, setMembers] = useState([])
  const [selected, setSelected] = useState(null)
  const [selectedDetail, setSelectedDetail] = useState(null)
  const [tab, setTab] = useState('members')
  const [planForm, setPlanForm] = useState({ title: '', goal: '', weeks: 4, days: [] })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const api = (path, opts) => fetch(path, {
    headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
    ...opts
  }).then(r => r.json())

  useEffect(() => {
    api('/api/admin/members').then(d => setMembers(d.members || []))
  }, [])

  const selectMember = async (m) => {
    setSelected(m)
    const detail = await api(`/api/admin/members/${m.id}`)
    setSelectedDetail(detail)
    setTab('detail')
  }

  const addDay = () => {
    setPlanForm(f => ({
      ...f,
      days: [...f.days, { day_number: f.days.length + 1, day_name: `Day ${f.days.length + 1}`, focus: '', exercises: [] }]
    }))
  }

  const addExercise = (dayIdx) => {
    setPlanForm(f => {
      const days = [...f.days]
      days[dayIdx].exercises = [...days[dayIdx].exercises, { name: '', sets: 3, reps: '8-12', rest_seconds: 60, weight_note: '' }]
      return { ...f, days }
    })
  }

  const updateDay = (dayIdx, field, val) => {
    setPlanForm(f => {
      const days = [...f.days]
      days[dayIdx][field] = val
      return { ...f, days }
    })
  }

  const updateExercise = (dayIdx, exIdx, field, val) => {
    setPlanForm(f => {
      const days = [...f.days]
      days[dayIdx].exercises[exIdx][field] = val
      return { ...f, days }
    })
  }

  const savePlan = async () => {
    if (!selected) return
    setSaving(true)
    const res = await api('/api/admin/workout-plan', {
      method: 'POST',
      body: JSON.stringify({ member_id: selected.id, ...planForm })
    })
    setSaving(false)
    setMsg(res.success ? '✓ Plan saved and sent to member!' : 'Error saving plan')
    setTimeout(() => setMsg(''), 3000)
  }

  const tierColor = { essential: '#c9a84c', pro: '#4caf7d', elite: '#4c8eaf' }

  return (
    <div style={s.wrap}>
      <aside style={s.sidebar}>
        <div style={s.logo}>FFF Admin</div>
        <nav style={s.nav}>
          {[['members', 'All Members'], ['plan', 'Build Plan']].map(([t, l]) => (
            <button key={t} onClick={() => setTab(t)} style={{ ...s.navBtn, ...(tab === t || (tab === 'detail' && t === 'members') ? s.navActive : {}) }}>{l}</button>
          ))}
        </nav>
        <button onClick={logout} style={{ ...s.navBtn, marginTop: 'auto', color: 'var(--muted)', fontSize: '0.75rem' }}>Sign out</button>
      </aside>

      <main style={s.main}>

        {/* MEMBERS LIST */}
        {(tab === 'members' || tab === 'detail') && !selectedDetail && (
          <div>
            <h1 style={s.pageTitle}>All Members</h1>
            <div style={s.memberList}>
              {members.map(m => (
                <div key={m.id} style={s.memberRow} onClick={() => selectMember(m)}>
                  <div style={s.avatar}>{m.first_name?.[0]}{m.last_name?.[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500 }}>{m.first_name} {m.last_name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{m.email}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{ ...s.tierBadge, color: tierColor[m.tier] || 'var(--muted)', borderColor: tierColor[m.tier] || 'var(--border)' }}>{m.tier}</span>
                    <span style={{ ...s.statusDot, background: m.subscription_status === 'active' ? '#4caf7d' : '#666' }}></span>
                  </div>
                </div>
              ))}
              {members.length === 0 && <p style={{ color: 'var(--muted)' }}>No members yet.</p>}
            </div>
          </div>
        )}

        {/* MEMBER DETAIL */}
        {tab === 'detail' && selectedDetail && (
          <div>
            <button onClick={() => { setSelected(null); setSelectedDetail(null); setTab('members') }} style={{ ...s.navBtn, marginBottom: '1.5rem', color: 'var(--muted)' }}>← Back</button>
            <h1 style={s.pageTitle}>{selectedDetail.member.first_name} {selectedDetail.member.last_name}</h1>
            <div style={s.detailGrid}>
              {[
                ['Email', selectedDetail.member.email],
                ['Tier', selectedDetail.member.tier],
                ['Status', selectedDetail.member.subscription_status],
                ['Goal', selectedDetail.member.goal],
                ['Age', selectedDetail.member.age],
                ['Weight', selectedDetail.member.weight_lbs ? selectedDetail.member.weight_lbs + ' lbs' : '—'],
              ].map(([k, v]) => (
                <div key={k} style={s.detailItem}>
                  <span style={s.detailLabel}>{k}</span>
                  <span style={s.detailVal}>{v || '—'}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ fontWeight: 500, marginBottom: '1rem' }}>Recent check-ins</h3>
              {selectedDetail.recent_checkins?.map(c => (
                <div key={c.id} style={{ ...s.memberRow, marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--gold)', fontFamily: "'Bebas Neue'", fontSize: '1.2rem' }}>{c.weight_lbs} lbs</span>
                  <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{c.notes}</span>
                  <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>{new Date(c.checked_in_at).toLocaleDateString()}</span>
                </div>
              ))}
              {!selectedDetail.recent_checkins?.length && <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>No check-ins yet.</p>}
            </div>
            <div style={{ marginTop: '2rem' }}>
              <button className="btn-primary" onClick={() => { setTab('plan') }}>Build Workout Plan for {selectedDetail.member.first_name}</button>
            </div>
          </div>
        )}

        {/* BUILD PLAN */}
        {tab === 'plan' && (
          <div>
            <h1 style={s.pageTitle}>Build Workout Plan</h1>
            {!selected && <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>Select a member first from the Members tab.</p>}
            {selected && <p style={{ color: 'var(--gold)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>Building plan for: {selected.first_name} {selected.last_name}</p>}
            {msg && <div style={s.successMsg}>{msg}</div>}
            <div style={s.formGrid}>
              <div>
                <label style={s.lbl}>Plan Title</label>
                <input value={planForm.title} onChange={e => setPlanForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. 4-Week Muscle Builder" />
              </div>
              <div>
                <label style={s.lbl}>Goal</label>
                <select value={planForm.goal} onChange={e => setPlanForm(f => ({ ...f, goal: e.target.value }))}>
                  <option value="">Select...</option>
                  <option value="muscle">Build Muscle</option>
                  <option value="weight_loss">Lose Weight</option>
                  <option value="sculpting">Body Sculpting</option>
                  <option value="strength">Strength</option>
                </select>
              </div>
              <div>
                <label style={s.lbl}>Weeks</label>
                <input type="number" value={planForm.weeks} onChange={e => setPlanForm(f => ({ ...f, weeks: e.target.value }))} />
              </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontWeight: 500 }}>Training Days</h3>
                <button className="btn-ghost" onClick={addDay} style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>+ Add Day</button>
              </div>
              {planForm.days.map((day, di) => (
                <div key={di} style={s.dayBlock}>
                  <div style={s.dayBlockHeader}>
                    <input value={day.day_name} onChange={e => updateDay(di, 'day_name', e.target.value)} style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--white)', fontWeight: 500, fontSize: '0.95rem', outline: 'none' }} />
                    <input value={day.focus} onChange={e => updateDay(di, 'focus', e.target.value)} placeholder="Focus (e.g. Chest & Triceps)" style={{ flex: 2, background: 'var(--surface2)', fontSize: '0.8rem' }} />
                  </div>
                  <div style={{ padding: '1rem' }}>
                    {day.exercises.map((ex, ei) => (
                      <div key={ei} style={s.exRow}>
                        <input value={ex.name} onChange={e => updateExercise(di, ei, 'name', e.target.value)} placeholder="Exercise name" style={{ flex: 3 }} />
                        <input type="number" value={ex.sets} onChange={e => updateExercise(di, ei, 'sets', e.target.value)} placeholder="Sets" style={{ flex: 1 }} />
                        <input value={ex.reps} onChange={e => updateExercise(di, ei, 'reps', e.target.value)} placeholder="Reps" style={{ flex: 1 }} />
                        <input value={ex.weight_note} onChange={e => updateExercise(di, ei, 'weight_note', e.target.value)} placeholder="Weight note" style={{ flex: 2 }} />
                      </div>
                    ))}
                    <button onClick={() => addExercise(di)} style={{ ...s.navBtn, color: 'var(--gold)', fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}>+ Add Exercise</button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '2rem' }}>
              <button className="btn-primary" onClick={savePlan} disabled={saving || !selected}>
                {saving ? 'Saving...' : 'Save & Send to Member'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

const s = {
  wrap: { display: 'flex', minHeight: '100vh', background: 'var(--black)' },
  sidebar: { width: '200px', flexShrink: 0, background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', padding: '1.5rem 1rem' },
  logo: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', letterSpacing: '0.1em', color: 'var(--gold)', marginBottom: '2rem' },
  nav: { display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 },
  navBtn: { background: 'none', border: 'none', color: 'var(--muted)', padding: '0.7rem 0.75rem', textAlign: 'left', fontSize: '0.85rem', borderRadius: '4px', cursor: 'pointer' },
  navActive: { background: 'var(--surface2)', color: 'var(--white)' },
  main: { flex: 1, padding: '2.5rem 3rem', overflowY: 'auto' },
  pageTitle: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', letterSpacing: '0.04em', color: 'var(--white)', marginBottom: '2rem' },
  memberList: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  memberRow: { display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--surface)', border: '1px solid var(--border)', padding: '1rem 1.25rem', borderRadius: '4px', cursor: 'pointer' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 500, flexShrink: 0 },
  tierBadge: { fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', border: '1px solid', padding: '0.2rem 0.6rem', borderRadius: '2px' },
  statusDot: { width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0 },
  detailGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' },
  detailItem: { background: 'var(--surface)', border: '1px solid var(--border)', padding: '1rem', borderRadius: '4px' },
  detailLabel: { display: 'block', fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' },
  detailVal: { fontSize: '0.95rem', fontWeight: 500 },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' },
  lbl: { display: 'block', fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' },
  dayBlock: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', marginBottom: '1rem', overflow: 'hidden' },
  dayBlockHeader: { background: 'var(--surface2)', padding: '0.75rem 1rem', display: 'flex', gap: '1rem', alignItems: 'center' },
  exRow: { display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' },
  successMsg: { background: 'rgba(76,175,125,0.12)', border: '1px solid rgba(76,175,125,0.3)', color: '#4caf7d', padding: '0.75rem 1rem', borderRadius: '2px', fontSize: '0.85rem', marginBottom: '1.5rem' },
}
