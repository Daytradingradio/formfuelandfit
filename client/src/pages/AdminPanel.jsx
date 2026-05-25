import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'

const EXERCISES = {
  "Chest": ["Barbell Bench Press","Incline Barbell Bench Press","Decline Barbell Bench Press","Dumbbell Bench Press","Incline Dumbbell Press","Decline Dumbbell Press","Dumbbell Flye","Incline Dumbbell Flye","Cable Chest Flye","Low Cable Flye","High Cable Flye","Pec Deck Machine","Push-Up","Wide Grip Push-Up","Diamond Push-Up","Chest Dip","Machine Chest Press","Smith Machine Bench Press"],
  "Back": ["Deadlift","Romanian Deadlift","Sumo Deadlift","Barbell Row","Pendlay Row","Dumbbell Row","Cable Row","Seated Cable Row","Wide Grip Cable Row","Pull-Up","Chin-Up","Neutral Grip Pull-Up","Lat Pulldown","Wide Grip Lat Pulldown","Close Grip Lat Pulldown","T-Bar Row","Chest Supported Row","Face Pull","Straight Arm Pulldown","Good Morning","Back Extension","Hyperextension"],
  "Shoulders": ["Overhead Press","Barbell Overhead Press","Seated Dumbbell Press","Arnold Press","Lateral Raise","Dumbbell Lateral Raise","Cable Lateral Raise","Machine Lateral Raise","Front Raise","Dumbbell Front Raise","Cable Front Raise","Rear Delt Flye","Rear Delt Cable Flye","Reverse Pec Deck","Face Pull","Upright Row","Shrug","Dumbbell Shrug","Barbell Shrug"],
  "Biceps": ["Barbell Curl","EZ Bar Curl","Dumbbell Curl","Alternating Dumbbell Curl","Hammer Curl","Incline Dumbbell Curl","Concentration Curl","Preacher Curl","Cable Curl","High Cable Curl","Machine Curl","Spider Curl","Reverse Curl","Zottman Curl","21s"],
  "Triceps": ["Tricep Pushdown","Rope Pushdown","Straight Bar Pushdown","Overhead Tricep Extension","Dumbbell Overhead Extension","EZ Bar Overhead Extension","Skull Crusher","Close Grip Bench Press","Tricep Dip","Bench Dip","Kickback","Cable Kickback","Diamond Push-Up","JM Press"],
  "Legs": ["Barbell Back Squat","Front Squat","Hack Squat","Goblet Squat","Romanian Deadlift","Stiff Leg Deadlift","Leg Press","Bulgarian Split Squat","Lunge","Walking Lunge","Reverse Lunge","Leg Extension","Leg Curl","Lying Leg Curl","Seated Leg Curl","Leg Press Calf Raise","Standing Calf Raise","Seated Calf Raise","Step Up","Box Jump","Sumo Squat","Hip Thrust","Glute Bridge","Abductor Machine","Adductor Machine"],
  "Abs & Core": ["Plank","Side Plank","Cable Crunch","Crunch","Decline Crunch","Hanging Leg Raise","Hanging Knee Raise","Ab Rollout","Russian Twist","Bicycle Crunch","Reverse Crunch","Dragon Flag","Toes to Bar","Dead Bug","Pallof Press","Woodchop","Mountain Climber","V-Up","Hollow Body Hold"],
  "Cardio": ["Treadmill Run","Stationary Bike","Rowing Machine","Stairmaster","Jump Rope","Box Jump","Burpee","Kettlebell Swing","Battle Ropes","Sled Push","Farmers Carry","Sprints","Jump Squat"]
}

const ALL_EXERCISES = Object.entries(EXERCISES).flatMap(([group, exs]) => exs.map(ex => ({ name: ex, group })))

const SAMPLE_WORKOUT = {
  title: '4-Week Muscle Builder', goal: 'muscle', weeks: 4,
  days: [
    { day_number: 1, day_name: 'Day 1', focus: 'Chest & Triceps', notes: 'Focus on mind-muscle connection. Control the negative on every rep.', exercises: [
      { name: 'Barbell Bench Press', sets: 4, reps: '6-8', rest_seconds: 120, weight_note: 'Heavy' },
      { name: 'Incline Dumbbell Press', sets: 3, reps: '8-12', rest_seconds: 90, weight_note: 'Moderate' },
      { name: 'Cable Chest Flye', sets: 3, reps: '12-15', rest_seconds: 60, weight_note: '' },
      { name: 'Tricep Pushdown', sets: 3, reps: '12-15', rest_seconds: 60, weight_note: '' },
      { name: 'Skull Crusher', sets: 3, reps: '10-12', rest_seconds: 60, weight_note: '' },
    ]},
    { day_number: 2, day_name: 'Day 2', focus: 'Back & Biceps', notes: 'Pull with your elbows not your hands.', exercises: [
      { name: 'Pull-Up', sets: 4, reps: '6-10', rest_seconds: 120, weight_note: 'Add weight if easy' },
      { name: 'Barbell Row', sets: 4, reps: '6-8', rest_seconds: 120, weight_note: 'Heavy' },
      { name: 'Seated Cable Row', sets: 3, reps: '10-12', rest_seconds: 90, weight_note: '' },
      { name: 'Lat Pulldown', sets: 3, reps: '10-12', rest_seconds: 90, weight_note: '' },
      { name: 'Barbell Curl', sets: 3, reps: '10-12', rest_seconds: 60, weight_note: '' },
      { name: 'Hammer Curl', sets: 3, reps: '12', rest_seconds: 60, weight_note: '' },
    ]},
    { day_number: 3, day_name: 'Day 3', focus: 'Rest / Active Recovery', notes: 'Light walk or 20 min low-intensity cardio.', exercises: [] },
    { day_number: 4, day_name: 'Day 4', focus: 'Legs', notes: 'No skipping leg day. This is where the most growth happens.', exercises: [
      { name: 'Barbell Back Squat', sets: 4, reps: '6-8', rest_seconds: 180, weight_note: 'Heavy' },
      { name: 'Romanian Deadlift', sets: 3, reps: '8-10', rest_seconds: 120, weight_note: '' },
      { name: 'Leg Press', sets: 3, reps: '10-12', rest_seconds: 90, weight_note: '' },
      { name: 'Leg Curl', sets: 3, reps: '12', rest_seconds: 60, weight_note: '' },
      { name: 'Standing Calf Raise', sets: 4, reps: '15-20', rest_seconds: 45, weight_note: '' },
    ]},
    { day_number: 5, day_name: 'Day 5', focus: 'Shoulders & Abs', notes: 'Strict form on all shoulder work — no momentum.', exercises: [
      { name: 'Overhead Press', sets: 4, reps: '6-8', rest_seconds: 120, weight_note: 'Heavy' },
      { name: 'Lateral Raise', sets: 4, reps: '12-15', rest_seconds: 60, weight_note: 'Light — strict' },
      { name: 'Rear Delt Flye', sets: 3, reps: '15', rest_seconds: 60, weight_note: '' },
      { name: 'Plank', sets: 3, reps: '45-60 sec', rest_seconds: 45, weight_note: '' },
      { name: 'Cable Crunch', sets: 3, reps: '15', rest_seconds: 45, weight_note: '' },
    ]},
  ]
}

const SAMPLE_NUTRITION = {
  title: 'Muscle Building Nutrition Plan', calories: 2800, protein_g: 200, carbs_g: 310, fats_g: 75,
  notes: 'Eat within 1 hour of waking. Biggest carb meals around your workout. Minimum 1 gallon water daily.',
  meals: [
    { meal_name: 'Breakfast', meal_time: '7:00 AM', calories: 550, protein_g: 40, carbs_g: 60, fats_g: 15, foods: ['5 whole eggs scrambled', '1 cup oatmeal with berries', '1 banana', 'Black coffee'] },
    { meal_name: 'Mid-Morning Snack', meal_time: '10:00 AM', calories: 350, protein_g: 35, carbs_g: 30, fats_g: 8, foods: ['Greek yogurt (plain, full fat)', '1 scoop whey protein', 'Handful of almonds'] },
    { meal_name: 'Lunch', meal_time: '1:00 PM', calories: 650, protein_g: 50, carbs_g: 70, fats_g: 15, foods: ['8oz grilled chicken breast', '1.5 cups white rice', 'Broccoli & green beans', 'Olive oil drizzle'] },
    { meal_name: 'Pre-Workout', meal_time: '3:30 PM', calories: 400, protein_g: 30, carbs_g: 55, fats_g: 5, foods: ['1 scoop whey protein', '1 large apple', '1 rice cake with honey', 'Creatine 5g'] },
    { meal_name: 'Post-Workout', meal_time: '6:00 PM', calories: 500, protein_g: 45, carbs_g: 55, fats_g: 8, foods: ['8oz lean ground beef or salmon', '1 cup sweet potato', 'Side salad with vinaigrette'] },
    { meal_name: 'Dinner', meal_time: '8:00 PM', calories: 350, protein_g: 35, carbs_g: 25, fats_g: 12, foods: ['8oz sirloin steak or tuna', 'Steamed vegetables', '1/2 cup quinoa or brown rice'] },
    { meal_name: 'Evening Snack', meal_time: '10:00 PM', calories: 200, protein_g: 25, carbs_g: 15, fats_g: 5, foods: ['1 cup cottage cheese', 'Handful of walnuts'] },
  ]
}

// Exercise autocomplete input component
function ExerciseInput({ value, onChange, placeholder }) {
  const [query, setQuery] = useState(value || '')
  const [suggestions, setSuggestions] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState('all')
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (e) => { if (!ref.current?.contains(e.target)) setShowDropdown(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleInput = (val) => {
    setQuery(val)
    onChange(val)
    if (val.length >= 1) {
      const filtered = ALL_EXERCISES.filter(ex =>
        ex.name.toLowerCase().includes(val.toLowerCase()) &&
        (selectedGroup === 'all' || ex.group === selectedGroup)
      ).slice(0, 8)
      setSuggestions(filtered)
      setShowDropdown(true)
    } else {
      setShowDropdown(false)
    }
  }

  const handleFocus = () => {
    const filtered = ALL_EXERCISES.filter(ex =>
      selectedGroup === 'all' || ex.group === selectedGroup
    ).slice(0, 10)
    setSuggestions(filtered)
    setShowDropdown(true)
  }

  const pick = (ex) => {
    setQuery(ex.name)
    onChange(ex.name)
    setShowDropdown(false)
  }

  return (
    <div ref={ref} style={{ position: 'relative', flex: 3 }}>
      <input
        value={query}
        onChange={e => handleInput(e.target.value)}
        onFocus={handleFocus}
        placeholder={placeholder || 'Exercise name...'}
        style={{ width: '100%' }}
      />
      {showDropdown && suggestions.length > 0 && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#1e1e1e', border: '1px solid var(--border)', borderTop: 'none', zIndex: 100, maxHeight: '200px', overflowY: 'auto', borderRadius: '0 0 4px 4px' }}>
          <div style={{ display: 'flex', gap: '0.25rem', padding: '0.5rem', flexWrap: 'wrap', borderBottom: '1px solid var(--border)', background: '#161616' }}>
            <button onClick={() => setSelectedGroup('all')} style={{ ...groupBtn, ...(selectedGroup === 'all' ? groupBtnActive : {}) }}>All</button>
            {Object.keys(EXERCISES).map(g => (
              <button key={g} onClick={() => { setSelectedGroup(g); handleInput(query) }} style={{ ...groupBtn, ...(selectedGroup === g ? groupBtnActive : {}) }}>{g}</button>
            ))}
          </div>
          {suggestions.map((ex, i) => (
            <div key={i} onMouseDown={() => pick(ex)}
              style={{ padding: '0.6rem 1rem', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
              onMouseEnter={e => e.currentTarget.style.background = '#2a2a2a'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <span>{ex.name}</span>
              <span style={{ fontSize: '0.7rem', color: '#c9a84c', marginLeft: '0.5rem' }}>{ex.group}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const groupBtn = { background: 'none', border: '1px solid var(--border)', color: 'var(--muted)', padding: '0.2rem 0.5rem', borderRadius: '2px', cursor: 'pointer', fontSize: '0.7rem' }
const groupBtnActive = { borderColor: '#c9a84c', color: '#c9a84c' }

export default function AdminPanel() {
  const { getToken, logout } = useAuth()
  const [members, setMembers] = useState([])
  const [selected, setSelected] = useState(null)
  const [selectedDetail, setSelectedDetail] = useState(null)
  const [tab, setTab] = useState('members')
  const [planForm, setPlanForm] = useState(SAMPLE_WORKOUT)
  const [nutritionForm, setNutritionForm] = useState(SAMPLE_NUTRITION)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [threads, setThreads] = useState([])
  const [activeThread, setActiveThread] = useState(null)
  const [threadMessages, setThreadMessages] = useState([])
  const [replyInput, setReplyInput] = useState('')
  const [videos, setVideos] = useState([])
  const [videoForm, setVideoForm] = useState({ title: '', description: '', category: 'training', video_url: '', duration_seconds: '' })
  const [savingVideo, setSavingVideo] = useState(false)
  const [activeSubTab, setActiveSubTab] = useState('workout')
  const messagesEndRef = useRef(null)

  const api = (path, opts) => fetch(path, {
    headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
    ...opts
  }).then(r => r.json())

  useEffect(() => { api('/api/admin/members').then(d => setMembers(d.members || [])) }, [])

  useEffect(() => {
    if (tab === 'messages') api('/api/messages/admin/all').then(d => setThreads(d.threads || []))
    if (tab === 'videos') api('/api/videos/admin/all').then(d => setVideos(d.videos || []))
  }, [tab])

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [threadMessages])

  const selectMember = async (m) => {
    setSelected(m)
    const detail = await api(`/api/admin/members/${m.id}`)
    setSelectedDetail(detail)
    setTab('detail')
    setActiveSubTab('workout')
    setPlanForm(SAMPLE_WORKOUT)
    setNutritionForm(SAMPLE_NUTRITION)
  }

  const openThread = async (memberId) => {
    setActiveThread(memberId)
    const data = await api(`/api/messages/admin/${memberId}`)
    setThreadMessages(data.messages || [])
  }

  const sendReply = async () => {
    if (!replyInput.trim() || !activeThread) return
    const data = await api(`/api/messages/admin/${activeThread}`, { method: 'POST', body: JSON.stringify({ body: replyInput }) })
    if (data.message) setThreadMessages(m => [...m, data.message])
    setReplyInput('')
    api('/api/messages/admin/all').then(d => setThreads(d.threads || []))
  }

  const savePlan = async () => {
    if (!selected) return
    setSaving(true)
    const res = await api('/api/admin/workout-plan', { method: 'POST', body: JSON.stringify({ member_id: selected.id, ...planForm }) })
    setSaving(false)
    setMsg(res.success ? '✓ Workout plan saved and sent to member!' : 'Error saving plan')
    setTimeout(() => setMsg(''), 4000)
  }

  const saveNutrition = async () => {
    if (!selected) return
    setSaving(true)
    const res = await api('/api/admin/nutrition-plan', { method: 'POST', body: JSON.stringify({ member_id: selected.id, ...nutritionForm }) })
    setSaving(false)
    setMsg(res.success ? '✓ Nutrition plan saved and sent to member!' : 'Error saving nutrition plan')
    setTimeout(() => setMsg(''), 4000)
  }

  const saveVideo = async () => {
    if (!videoForm.title || !videoForm.video_url) return
    setSavingVideo(true)
    const res = await api('/api/videos/admin', { method: 'POST', body: JSON.stringify({ ...videoForm, duration_seconds: parseInt(videoForm.duration_seconds) || null }) })
    setSavingVideo(false)
    if (res.video) {
      setVideos(v => [res.video, ...v])
      setVideoForm({ title: '', description: '', category: 'training', video_url: '', duration_seconds: '' })
      setMsg('✓ Video added!')
      setTimeout(() => setMsg(''), 3000)
    }
  }

  const deleteVideo = async (id) => {
    await api(`/api/videos/admin/${id}`, { method: 'DELETE' })
    setVideos(v => v.filter(x => x.id !== id))
  }

  const addDay = () => setPlanForm(f => ({ ...f, days: [...f.days, { day_number: f.days.length + 1, day_name: `Day ${f.days.length + 1}`, focus: '', notes: '', exercises: [] }] }))
  const addExercise = (di) => setPlanForm(f => { const days = [...f.days]; days[di].exercises = [...days[di].exercises, { name: '', sets: 3, reps: '8-12', rest_seconds: 60, weight_note: '' }]; return { ...f, days } })
  const updateDay = (di, field, val) => setPlanForm(f => { const days = [...f.days]; days[di][field] = val; return { ...f, days } })
  const updateEx = (di, ei, field, val) => setPlanForm(f => { const days = [...f.days]; days[di].exercises[ei][field] = val; return { ...f, days } })
  const removeEx = (di, ei) => setPlanForm(f => { const days = [...f.days]; days[di].exercises = days[di].exercises.filter((_, i) => i !== ei); return { ...f, days } })

  const tierColor = { essential: '#c9a84c', pro: '#4caf7d', elite: '#4c8eaf' }

  return (
    <div style={s.wrap}>
      <aside style={s.sidebar}>
        <div style={s.logo}>FFF Admin</div>
        <nav style={s.nav}>
          {[['members','👥','Members'],['messages','💬','Messages'],['videos','🎬','Videos']].map(([t, icon, label]) => (
            <button key={t} onClick={() => setTab(t)} style={{ ...s.navBtn, ...(tab === t || (tab === 'detail' && t === 'members') ? s.navActive : {}) }}>{icon} {label}</button>
          ))}
        </nav>
        <button onClick={logout} style={{ ...s.navBtn, marginTop: 'auto', color: 'var(--muted)', fontSize: '0.75rem' }}>Sign out</button>
      </aside>

      <main style={s.main}>

        {/* MEMBERS LIST */}
        {tab === 'members' && !selectedDetail && (
          <div>
            <h1 style={s.pageTitle}>All Members</h1>
            <div style={s.memberList}>
              {members.map(m => (
                <div key={m.id} style={s.memberRow} onClick={() => selectMember(m)}>
                  <div style={s.avatar}>{m.first_name?.[0]}{m.last_name?.[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500 }}>{m.first_name} {m.last_name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{m.email} · Goal: {m.goal || 'not set'}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{ ...s.tierBadge, color: tierColor[m.tier] || 'var(--muted)', borderColor: tierColor[m.tier] || 'var(--border)' }}>{m.tier}</span>
                    <span style={{ ...s.statusDot, background: m.subscription_status === 'active' ? '#4caf7d' : '#555' }} />
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
            <button onClick={() => { setSelected(null); setSelectedDetail(null); setTab('members') }} style={{ ...s.navBtn, marginBottom: '1.5rem', color: 'var(--muted)', padding: '0.5rem 0' }}>← Back to members</button>
            <h1 style={s.pageTitle}>{selectedDetail.member.first_name} {selectedDetail.member.last_name}</h1>

            <div style={s.detailGrid}>
              {[['Email', selectedDetail.member.email],['Tier', selectedDetail.member.tier],['Status', selectedDetail.member.subscription_status],['Goal', selectedDetail.member.goal],['Age', selectedDetail.member.age],['Weight', selectedDetail.member.weight_lbs ? selectedDetail.member.weight_lbs + ' lbs' : '—']].map(([k, v]) => (
                <div key={k} style={s.detailItem}><span style={s.detailLabel}>{k}</span><span style={s.detailVal}>{v || '—'}</span></div>
              ))}
            </div>

            {/* Intake notes */}
            {selectedDetail.member.notes && (() => {
              try {
                const intake = JSON.parse(selectedDetail.member.notes)
                return (
                  <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '4px', padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#c9a84c', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>📋 Intake Form</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                      {[['Experience', intake.experience],['Days/Week', intake.days_per_week],['Equipment', intake.equipment],['Diet', intake.diet_style],['Sleep', intake.sleep_hours + ' hrs'],['Injuries', intake.injuries || 'None']].map(([k, v]) => v && (
                        <div key={k}><span style={{ fontSize: '0.7rem', color: 'var(--muted)', display: 'block' }}>{k}</span><span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{v}</span></div>
                      ))}
                    </div>
                    {intake.biggest_challenge && <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--muted)' }}>Challenge: {intake.biggest_challenge}</div>}
                  </div>
                )
              } catch { return null }
            })()}

            {msg && <div style={s.successMsg}>{msg}</div>}

            <div style={{ display: 'flex', gap: '0', margin: '1.5rem 0 0', borderBottom: '1px solid var(--border)' }}>
              {[['workout','💪 Workout Plan'],['nutrition','🥗 Nutrition Plan']].map(([t, l]) => (
                <button key={t} onClick={() => setActiveSubTab(t)} style={{ ...s.subTabBtn, ...(activeSubTab === t ? s.subTabActive : {}) }}>{l}</button>
              ))}
            </div>

            {/* WORKOUT PLAN BUILDER */}
            {activeSubTab === 'workout' && (
              <div style={{ paddingTop: '1.5rem' }}>
                <div style={s.formGrid}>
                  <div><label style={s.lbl}>Plan Title</label><input value={planForm.title} onChange={e => setPlanForm(f => ({ ...f, title: e.target.value }))} /></div>
                  <div><label style={s.lbl}>Goal</label>
                    <select value={planForm.goal} onChange={e => setPlanForm(f => ({ ...f, goal: e.target.value }))}>
                      <option value="muscle">Build Muscle</option>
                      <option value="weight_loss">Lose Weight</option>
                      <option value="sculpting">Body Sculpting</option>
                      <option value="strength">Strength</option>
                    </select>
                  </div>
                  <div><label style={s.lbl}>Weeks</label><input type="number" value={planForm.weeks} onChange={e => setPlanForm(f => ({ ...f, weeks: e.target.value }))} /></div>
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontWeight: 500 }}>Training Days</h3>
                    <button className="btn-ghost" onClick={addDay} style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>+ Add Day</button>
                  </div>

                  {planForm.days.map((day, di) => (
                    <div key={di} style={s.dayBlock}>
                      <div style={s.dayBlockHeader}>
                        <input value={day.day_name} onChange={e => updateDay(di, 'day_name', e.target.value)}
                          style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--white)', fontWeight: 500, fontSize: '0.95rem', outline: 'none' }} />
                        <input value={day.focus} onChange={e => updateDay(di, 'focus', e.target.value)}
                          placeholder="Focus (e.g. Chest & Triceps)"
                          style={{ flex: 2, background: 'var(--surface2)', fontSize: '0.8rem' }} />
                      </div>
                      <div style={{ padding: '0.75rem 1rem' }}>
                        <input value={day.notes} onChange={e => updateDay(di, 'notes', e.target.value)}
                          placeholder="Coach notes for this day..."
                          style={{ width: '100%', marginBottom: '0.75rem', fontSize: '0.8rem' }} />

                        {/* Exercise header labels */}
                        {day.exercises.length > 0 && (
                          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem', paddingLeft: '0.25rem' }}>
                            <div style={{ flex: 3, fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Exercise</div>
                            <div style={{ flex: 1, fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Sets</div>
                            <div style={{ flex: 1, fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Reps</div>
                            <div style={{ flex: 1, fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Rest (s)</div>
                            <div style={{ flex: 2, fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Weight Note</div>
                            <div style={{ width: '24px' }} />
                          </div>
                        )}

                        {day.exercises.map((ex, ei) => (
                          <div key={ei} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                            <ExerciseInput
                              value={ex.name}
                              onChange={val => updateEx(di, ei, 'name', val)}
                              placeholder="Type or search exercise..."
                            />
                            <input type="number" value={ex.sets} onChange={e => updateEx(di, ei, 'sets', e.target.value)} placeholder="3" style={{ flex: 1 }} />
                            <input value={ex.reps} onChange={e => updateEx(di, ei, 'reps', e.target.value)} placeholder="8-12" style={{ flex: 1 }} />
                            <input type="number" value={ex.rest_seconds} onChange={e => updateEx(di, ei, 'rest_seconds', e.target.value)} placeholder="60" style={{ flex: 1 }} />
                            <input value={ex.weight_note} onChange={e => updateEx(di, ei, 'weight_note', e.target.value)} placeholder="e.g. Heavy" style={{ flex: 2 }} />
                            <button onClick={() => removeEx(di, ei)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '1rem', padding: '0.25rem', flexShrink: 0 }}>✕</button>
                          </div>
                        ))}
                        <button onClick={() => addExercise(di)} style={{ ...s.navBtn, color: '#c9a84c', fontSize: '0.8rem', padding: '0.4rem 0', marginTop: '0.25rem' }}>+ Add Exercise</button>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn-primary" onClick={savePlan} disabled={saving} style={{ marginTop: '1.5rem' }}>
                  {saving ? 'Saving...' : '💪 Save Workout Plan → Send to Member'}
                </button>
              </div>
            )}

            {/* NUTRITION PLAN BUILDER */}
            {activeSubTab === 'nutrition' && (
              <div style={{ paddingTop: '1.5rem' }}>
                <div style={s.formGrid}>
                  <div><label style={s.lbl}>Plan Title</label><input value={nutritionForm.title} onChange={e => setNutritionForm(f => ({ ...f, title: e.target.value }))} /></div>
                  <div><label style={s.lbl}>Total Calories</label><input type="number" value={nutritionForm.calories} onChange={e => setNutritionForm(f => ({ ...f, calories: e.target.value }))} /></div>
                  <div><label style={s.lbl}>Protein (g)</label><input type="number" value={nutritionForm.protein_g} onChange={e => setNutritionForm(f => ({ ...f, protein_g: e.target.value }))} /></div>
                  <div><label style={s.lbl}>Carbs (g)</label><input type="number" value={nutritionForm.carbs_g} onChange={e => setNutritionForm(f => ({ ...f, carbs_g: e.target.value }))} /></div>
                  <div><label style={s.lbl}>Fats (g)</label><input type="number" value={nutritionForm.fats_g} onChange={e => setNutritionForm(f => ({ ...f, fats_g: e.target.value }))} /></div>
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <label style={s.lbl}>Coach Notes</label>
                  <textarea value={nutritionForm.notes} onChange={e => setNutritionForm(f => ({ ...f, notes: e.target.value }))} rows={2} style={{ width: '100%', resize: 'vertical' }} />
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                  <h3 style={{ fontWeight: 500, marginBottom: '1rem' }}>Daily Meals</h3>
                  {nutritionForm.meals.map((meal, mi) => (
                    <div key={mi} style={s.dayBlock}>
                      <div style={s.dayBlockHeader}>
                        <input value={meal.meal_name} onChange={e => { const meals = [...nutritionForm.meals]; meals[mi].meal_name = e.target.value; setNutritionForm(f => ({ ...f, meals })) }}
                          style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--white)', fontWeight: 500, outline: 'none' }} />
                        <input value={meal.meal_time} onChange={e => { const meals = [...nutritionForm.meals]; meals[mi].meal_time = e.target.value; setNutritionForm(f => ({ ...f, meals })) }}
                          placeholder="Time" style={{ flex: 1, background: 'var(--surface2)', fontSize: '0.8rem' }} />
                        <input type="number" value={meal.calories} onChange={e => { const meals = [...nutritionForm.meals]; meals[mi].calories = e.target.value; setNutritionForm(f => ({ ...f, meals })) }}
                          placeholder="kcal" style={{ flex: 1, background: 'var(--surface2)', fontSize: '0.8rem' }} />
                        <input type="number" value={meal.protein_g} onChange={e => { const meals = [...nutritionForm.meals]; meals[mi].protein_g = e.target.value; setNutritionForm(f => ({ ...f, meals })) }}
                          placeholder="protein g" style={{ flex: 1, background: 'var(--surface2)', fontSize: '0.8rem' }} />
                      </div>
                      <div style={{ padding: '0.75rem 1rem' }}>
                        <label style={s.lbl}>Foods (one per line)</label>
                        <textarea
                          value={(meal.foods || []).join('\n')}
                          onChange={e => { const meals = [...nutritionForm.meals]; meals[mi].foods = e.target.value.split('\n').filter(Boolean); setNutritionForm(f => ({ ...f, meals })) }}
                          rows={3} style={{ width: '100%', fontSize: '0.82rem', resize: 'vertical' }}
                          placeholder={'5 whole eggs\n1 cup oatmeal\n1 banana'}
                        />
                      </div>
                    </div>
                  ))}
                  <button className="btn-ghost" onClick={() => setNutritionForm(f => ({ ...f, meals: [...f.meals, { meal_name: 'New Meal', meal_time: '', calories: 0, protein_g: 0, carbs_g: 0, fats_g: 0, foods: [] }] }))}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', marginTop: '0.5rem' }}>+ Add Meal</button>
                </div>
                <button className="btn-primary" onClick={saveNutrition} disabled={saving} style={{ marginTop: '1.5rem' }}>
                  {saving ? 'Saving...' : '🥗 Save Nutrition Plan → Send to Member'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* MESSAGES */}
        {tab === 'messages' && (
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem', height: 'calc(100vh - 5rem)' }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', overflowY: 'auto' }}>
              <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontWeight: 500, fontSize: '0.9rem' }}>Conversations</div>
              {threads.map(t => (
                <div key={t.member_id} onClick={() => openThread(t.member_id)}
                  style={{ padding: '1rem', borderBottom: '1px solid var(--border)', cursor: 'pointer', background: activeThread === t.member_id ? 'var(--surface2)' : 'transparent' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{t.first_name} {t.last_name}</span>
                    {t.unread_count > 0 && <span style={{ background: '#c9a84c', color: '#0a0a0a', fontSize: '0.65rem', padding: '0.2rem 0.5rem', borderRadius: '10px', fontWeight: 700 }}>{t.unread_count}</span>}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.last_body}</div>
                </div>
              ))}
              {threads.length === 0 && <p style={{ padding: '1rem', color: 'var(--muted)', fontSize: '0.85rem' }}>No messages yet.</p>}
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', display: 'flex', flexDirection: 'column' }}>
              {!activeThread ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>Select a conversation</div>
              ) : (
                <>
                  <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: 'calc(100vh - 14rem)' }}>
                    {threadMessages.map(m => (
                      <div key={m.id} style={{ display: 'flex', justifyContent: m.sender === 'sawyer' ? 'flex-end' : 'flex-start' }}>
                        <div style={{ maxWidth: '70%', padding: '0.75rem 1rem', borderRadius: '4px', background: m.sender === 'sawyer' ? '#c9a84c' : 'var(--surface2)', color: m.sender === 'sawyer' ? '#0a0a0a' : 'var(--white)', border: m.sender === 'member' ? '1px solid var(--border)' : 'none' }}>
                          <div style={{ fontSize: '0.9rem' }}>{m.body}</div>
                          <div style={{ fontSize: '0.65rem', opacity: 0.6, marginTop: '0.25rem' }}>{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.75rem' }}>
                    <input value={replyInput} onChange={e => setReplyInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendReply()} placeholder="Reply as Sawyer..." style={{ flex: 1 }} />
                    <button className="btn-primary" onClick={sendReply} style={{ padding: '0.75rem 1.5rem' }}>Send</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* VIDEO LIBRARY */}
        {tab === 'videos' && (
          <div>
            <h1 style={s.pageTitle}>Video Library</h1>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ fontWeight: 500, marginBottom: '1rem' }}>Add New Video</h3>
              {msg && <div style={s.successMsg}>{msg}</div>}
              <div style={s.formGrid}>
                <div style={{ gridColumn: '1 / -1' }}><label style={s.lbl}>Video Title</label><input value={videoForm.title} onChange={e => setVideoForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. How to Do a Perfect Squat" /></div>
                <div style={{ gridColumn: '1 / -1' }}><label style={s.lbl}>YouTube Embed URL</label><input value={videoForm.video_url} onChange={e => setVideoForm(f => ({ ...f, video_url: e.target.value }))} placeholder="https://www.youtube.com/embed/VIDEO_ID" /></div>
                <div><label style={s.lbl}>Category</label>
                  <select value={videoForm.category} onChange={e => setVideoForm(f => ({ ...f, category: e.target.value }))}>
                    <option value="training">Training</option>
                    <option value="nutrition">Nutrition</option>
                  </select>
                </div>
                <div><label style={s.lbl}>Duration (seconds)</label><input type="number" value={videoForm.duration_seconds} onChange={e => setVideoForm(f => ({ ...f, duration_seconds: e.target.value }))} placeholder="480" /></div>
                <div style={{ gridColumn: '1 / -1' }}><label style={s.lbl}>Description</label><textarea value={videoForm.description} onChange={e => setVideoForm(f => ({ ...f, description: e.target.value }))} rows={2} style={{ width: '100%' }} /></div>
              </div>
              <button className="btn-primary" onClick={saveVideo} disabled={savingVideo} style={{ marginTop: '1rem' }}>
                {savingVideo ? 'Adding...' : '+ Add Video'}
              </button>
            </div>
            <h3 style={{ fontWeight: 500, marginBottom: '1rem' }}>All Videos ({videos.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {videos.map(v => (
                <div key={v.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '1rem 1.25rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{v.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.2rem' }}>{v.category} · {v.duration_seconds ? Math.floor(v.duration_seconds / 60) + ' min' : ''}</div>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: v.category === 'nutrition' ? '#4c8eaf' : '#c9a84c', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{v.category}</span>
                  <button onClick={() => deleteVideo(v.id)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                </div>
              ))}
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
  logo: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', letterSpacing: '0.1em', color: '#c9a84c', marginBottom: '2rem' },
  nav: { display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 },
  navBtn: { background: 'none', border: 'none', color: 'var(--muted)', padding: '0.7rem 0.75rem', textAlign: 'left', fontSize: '0.85rem', borderRadius: '4px', cursor: 'pointer' },
  navActive: { background: 'var(--surface2)', color: 'var(--white)' },
  main: { flex: 1, padding: '2.5rem 3rem', overflowY: 'auto' },
  pageTitle: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', letterSpacing: '0.04em', color: 'var(--white)', marginBottom: '2rem' },
  memberList: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  memberRow: { display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--surface)', border: '1px solid var(--border)', padding: '1rem 1.25rem', borderRadius: '4px', cursor: 'pointer' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 500, flexShrink: 0, color: 'var(--white)' },
  tierBadge: { fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', border: '1px solid', padding: '0.2rem 0.6rem', borderRadius: '2px' },
  statusDot: { width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0 },
  detailGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' },
  detailItem: { background: 'var(--surface)', border: '1px solid var(--border)', padding: '1rem', borderRadius: '4px' },
  detailLabel: { display: 'block', fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' },
  detailVal: { fontSize: '0.95rem', fontWeight: 500 },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' },
  lbl: { display: 'block', fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' },
  dayBlock: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', marginBottom: '1rem', overflow: 'visible' },
  dayBlockHeader: { background: 'var(--surface2)', padding: '0.75rem 1rem', display: 'flex', gap: '1rem', alignItems: 'center' },
  successMsg: { background: 'rgba(76,175,125,0.12)', border: '1px solid rgba(76,175,125,0.3)', color: '#4caf7d', padding: '0.75rem 1rem', borderRadius: '2px', fontSize: '0.85rem', marginBottom: '1.5rem' },
  subTabBtn: { background: 'none', border: 'none', color: 'var(--muted)', padding: '0.75rem 1.25rem', cursor: 'pointer', fontSize: '0.85rem', borderBottom: '2px solid transparent', marginBottom: '-1px' },
  subTabActive: { color: '#c9a84c', borderBottom: '2px solid #c9a84c' },
}
