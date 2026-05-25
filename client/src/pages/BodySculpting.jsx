import { useState, useEffect } from 'react'

const MUSCLES = {
  chest:      { label: 'Chest',        color: '#c9a84c', group: 'Upper Body', view: 'front', exercises: ['Barbell Bench Press','Incline Dumbbell Press','Cable Chest Flye','Pec Deck Machine','Push-Up','Dumbbell Flye'] },
  shoulders:  { label: 'Shoulders',    color: '#4c8eaf', group: 'Upper Body', view: 'both',  exercises: ['Overhead Press','Lateral Raise','Rear Delt Flye','Arnold Press','Front Raise','Face Pull'] },
  biceps:     { label: 'Biceps',       color: '#4caf7d', group: 'Arms',       view: 'front', exercises: ['Barbell Curl','Hammer Curl','Incline Dumbbell Curl','Preacher Curl','Cable Curl','Concentration Curl'] },
  triceps:    { label: 'Triceps',      color: '#af6b4c', group: 'Arms',       view: 'both',  exercises: ['Tricep Pushdown','Skull Crusher','Overhead Extension','Close Grip Bench Press','Tricep Dip','Rope Pushdown'] },
  abs:        { label: 'Abs & Core',   color: '#9b59b6', group: 'Core',       view: 'front', exercises: ['Cable Crunch','Hanging Leg Raise','Plank','Ab Rollout','Russian Twist','Bicycle Crunch'] },
  quads:      { label: 'Quads',        color: '#e74c3c', group: 'Legs',       view: 'front', exercises: ['Barbell Back Squat','Leg Press','Leg Extension','Hack Squat','Bulgarian Split Squat','Front Squat'] },
  calves:     { label: 'Calves',       color: '#1abc9c', group: 'Legs',       view: 'both',  exercises: ['Standing Calf Raise','Seated Calf Raise','Leg Press Calf Raise'] },
  back:       { label: 'Back',         color: '#3498db', group: 'Upper Body', view: 'back',  exercises: ['Deadlift','Pull-Up','Barbell Row','Lat Pulldown','Seated Cable Row','T-Bar Row'] },
  hamstrings: { label: 'Hamstrings',   color: '#e67e22', group: 'Legs',       view: 'back',  exercises: ['Romanian Deadlift','Leg Curl','Bulgarian Split Squat','Stiff Leg Deadlift','Nordic Curl'] },
  glutes:     { label: 'Glutes',       color: '#d4537e', group: 'Legs',       view: 'back',  exercises: ['Hip Thrust','Bulgarian Split Squat','Glute Bridge','Cable Kickback','Sumo Squat'] },
  traps:      { label: 'Traps',        color: '#7f8c8d', group: 'Upper Body', view: 'back',  exercises: ['Barbell Shrug','Face Pull','Upright Row','Dumbbell Shrug','Cable Shrug'] },
  forearms:   { label: 'Forearms',     color: '#27ae60', group: 'Arms',       view: 'both',  exercises: ['Wrist Curl','Reverse Curl','Farmers Carry','Zottman Curl','Dead Hang'] },
}

const GOALS_BY_MUSCLE = {
  chest:      { sculpt: 'Build a fuller, defined chest with visible separation', cardio: 'Cable flyes and push-up variations for tone without bulk' },
  shoulders:  { sculpt: 'Create wide, capped shoulders for a V-taper look', cardio: 'High rep lateral raises and band work for definition' },
  biceps:     { sculpt: 'Build peak and fullness in the bicep', cardio: 'High rep curls with controlled tempo for toned arms' },
  triceps:    { sculpt: 'Add size to the back of the arm — triceps are 2/3 of arm size', cardio: 'Pushdowns and extensions for arm definition' },
  abs:        { sculpt: 'Build visible, defined abs with weighted core work', cardio: 'Plank variations and cardio to reduce body fat over abs' },
  quads:      { sculpt: 'Build quad sweep and thickness for defined legs', cardio: 'High rep squats and lunges for lean, toned legs' },
  calves:     { sculpt: 'Build diamond-shaped calves with full range of motion', cardio: 'High rep calf raises for tone and definition' },
  back:       { sculpt: 'Build width and thickness for a powerful back', cardio: 'Pull-up and row variations for a lean, strong back' },
  hamstrings: { sculpt: 'Build full, balanced hamstrings that complement your quads', cardio: 'Romanian deadlifts and leg curls for toned legs' },
  glutes:     { sculpt: 'Build round, full glutes with hip thrusts and split squats', cardio: 'Glute bridges and kickbacks for shape and lift' },
  traps:      { sculpt: 'Build thick traps for a powerful, athletic look', cardio: 'Face pulls and light shrugs for posture and definition' },
  forearms:   { sculpt: 'Build thick, veiny forearms for a complete arm look', cardio: 'Wrist work and grip training for functional definition' },
}

function BodyFigure({ selected, onToggle, view, gender }) {
  const cx = 110, W = 220, H = 480

  const muscleColor = (id) => selected.has(id) ? MUSCLES[id]?.color : 'rgba(255,255,255,0.06)'
  const muscleOpacity = (id) => selected.has(id) ? '0.9' : '0.2'
  const muscleStroke = (id) => selected.has(id) ? MUSCLES[id]?.color : 'rgba(255,255,255,0.15)'

  const frontMuscles = [
    { id: 'chest', d: `M${cx-24} 78 C${cx-26} 78 ${cx-28} 84 ${cx-28} 92 L${cx-26} 118 C${cx-20} 126 ${cx-10} 130 ${cx-2} 130 L${cx+2} 130 C${cx+12} 130 ${cx+20} 126 ${cx+26} 118 L${cx+28} 92 C${cx+28} 84 ${cx+26} 78 ${cx+24} 78 C${cx+16} 74 ${cx+8} 72 ${cx} 72 C${cx-8} 72 ${cx-16} 74 ${cx-24} 78 Z` },
    { id: 'shoulders', d: `M${cx-24} 78 C${cx-32} 74 ${cx-40} 72 ${cx-44} 76 L${cx-50} 98 C${cx-50} 112 ${cx-44} 122 ${cx-34} 126 L${cx-28} 120 C${cx-24} 113 ${cx-24} 100 ${cx-26} 90 Z M${cx+24} 78 C${cx+32} 74 ${cx+40} 72 ${cx+44} 76 L${cx+50} 98 C${cx+50} 112 ${cx+44} 122 ${cx+34} 126 L${cx+28} 120 C${cx+24} 113 ${cx+24} 100 ${cx+26} 90 Z` },
    { id: 'biceps', d: `M${cx-50} 98 L${cx-54} 150 C${cx-54} 162 ${cx-48} 170 ${cx-40} 170 L${cx-36} 160 C${cx-32} 150 ${cx-32} 138 ${cx-36} 126 L${cx-34} 126 C${cx-44} 122 ${cx-50} 112 ${cx-50} 98 Z M${cx+50} 98 L${cx+54} 150 C${cx+54} 162 ${cx+48} 170 ${cx+40} 170 L${cx+36} 160 C${cx+32} 150 ${cx+32} 138 ${cx+36} 126 L${cx+34} 126 C${cx+44} 122 ${cx+50} 112 ${cx+50} 98 Z` },
    { id: 'triceps', d: `M${cx-50} 98 C${cx-52} 112 ${cx-52} 128 ${cx-50} 142 L${cx-44} 165 C${cx-40} 172 ${cx-36} 170 L${cx-36} 160 C${cx-32} 150 ${cx-32} 138 ${cx-36} 128 C${cx-38} 118 ${cx-42} 108 ${cx-44} 100 Z M${cx+50} 98 C${cx+52} 112 ${cx+52} 128 ${cx+50} 142 L${cx+44} 165 C${cx+40} 172 ${cx+36} 170 L${cx+36} 160 C${cx+32} 150 ${cx+32} 138 ${cx+36} 128 C${cx+38} 118 ${cx+42} 108 ${cx+44} 100 Z` },
    { id: 'forearms', d: `M${cx-54} 150 L${cx-56} 195 C${cx-55} 205 ${cx-50} 210 ${cx-44} 208 L${cx-40} 195 C${cx-38} 182 ${cx-38} 168 ${cx-40} 158 Z M${cx+54} 150 L${cx+56} 195 C${cx+55} 205 ${cx+50} 210 ${cx+44} 208 L${cx+40} 195 C${cx+38} 182 ${cx+38} 168 ${cx+40} 158 Z` },
    { id: 'abs', d: `M${cx-22} 130 C${cx-24} 136 ${cx-24} 148 ${cx-22} 160 L${cx-20} 205 C${cx-16} 215 ${cx-8} 220 ${cx} 220 C${cx+8} 220 ${cx+16} 215 ${cx+20} 205 L${cx+22} 160 C${cx+24} 148 ${cx+24} 136 ${cx+22} 130 C${cx+12} 134 ${cx+2} 134 ${cx-2} 134 C${cx-12} 134 ${cx-22} 130 ${cx-22} 130 Z` },
    { id: 'quads', d: `M${cx-20} 220 L${cx-22} 268 C${cx-24} 290 ${cx-22} 315 ${cx-18} 342 L${cx-14} 368 C${cx-10} 375 ${cx-4} 376 ${cx} 374 L${cx+2} 315 C${cx+4} 285 ${cx+2} 258 ${cx+2} 235 L${cx} 220 Z M${cx+20} 220 L${cx+22} 268 C${cx+24} 290 ${cx+22} 315 ${cx+18} 342 L${cx+14} 368 C${cx+10} 375 ${cx+4} 376 ${cx} 374 L${cx-2} 315 C${cx-4} 285 ${cx-2} 258 ${cx-2} 235 L${cx} 220 Z` },
    { id: 'calves', d: `M${cx-18} 368 C${cx-20} 385 ${cx-18} 412 ${cx-14} 436 L${cx-8} 462 L${cx-2} 462 L${cx} 435 C${cx} 412 ${cx-2} 390 ${cx-6} 370 Z M${cx+18} 368 C${cx+20} 385 ${cx+18} 412 ${cx+14} 436 L${cx+8} 462 L${cx+2} 462 L${cx} 435 C${cx} 412 ${cx+2} 390 ${cx+6} 370 Z` },
  ]

  const backMuscles = [
    { id: 'traps', d: `M${cx-22} 62 C${cx-30} 64 ${cx-36} 72 ${cx-36} 82 L${cx-32} 104 C${cx-26} 110 ${cx-16} 114 ${cx-6} 114 L${cx+6} 114 C${cx+16} 114 ${cx+26} 110 ${cx+32} 104 L${cx+36} 82 C${cx+36} 72 ${cx+30} 64 ${cx+22} 62 C${cx+14} 58 ${cx+6} 56 ${cx} 56 C${cx-6} 56 ${cx-14} 58 ${cx-22} 62 Z` },
    { id: 'shoulders', d: `M${cx-26} 78 C${cx-34} 74 ${cx-42} 72 ${cx-46} 76 L${cx-52} 100 C${cx-52} 114 ${cx-46} 124 ${cx-36} 128 L${cx-30} 120 C${cx-26} 112 ${cx-26} 98 ${cx-28} 88 Z M${cx+26} 78 C${cx+34} 74 ${cx+42} 72 ${cx+46} 76 L${cx+52} 100 C${cx+52} 114 ${cx+46} 124 ${cx+36} 128 L${cx+30} 120 C${cx+26} 112 ${cx+26} 98 ${cx+28} 88 Z` },
    { id: 'triceps', d: `M${cx-52} 100 L${cx-56} 152 C${cx-56} 165 ${cx-50} 172 ${cx-42} 172 L${cx-38} 160 C${cx-34} 148 ${cx-34} 134 ${cx-38} 122 L${cx-36} 120 C${cx-46} 124 ${cx-52} 114 ${cx-52} 100 Z M${cx+52} 100 L${cx+56} 152 C${cx+56} 165 ${cx+50} 172 ${cx+42} 172 L${cx+38} 160 C${cx+34} 148 ${cx+34} 134 ${cx+38} 122 L${cx+36} 120 C${cx+46} 124 ${cx+52} 114 ${cx+52} 100 Z` },
    { id: 'forearms', d: `M${cx-56} 152 L${cx-58} 198 C${cx-57} 208 ${cx-52} 213 ${cx-46} 211 L${cx-42} 198 C${cx-40} 184 ${cx-40} 170 ${cx-42} 160 Z M${cx+56} 152 L${cx+58} 198 C${cx+57} 208 ${cx+52} 213 ${cx+46} 211 L${cx+42} 198 C${cx+40} 184 ${cx+40} 170 ${cx+42} 160 Z` },
    { id: 'back', d: `M${cx-28} 112 C${cx-30} 118 ${cx-30} 130 ${cx-28} 142 L${cx-24} 185 C${cx-20} 198 ${cx-12} 205 ${cx-4} 205 L${cx+4} 205 C${cx+12} 205 ${cx+20} 198 ${cx+24} 185 L${cx+28} 142 C${cx+30} 130 ${cx+30} 118 ${cx+28} 112 Z` },
    { id: 'glutes', d: `M${cx-22} 205 C${cx-24} 216 ${cx-24} 232 ${cx-22} 248 L${cx-18} 278 C${cx-14} 288 ${cx-6} 292 ${cx} 292 L${cx+6} 292 C${cx+14} 288 ${cx+18} 278 ${cx+22} 248 L${cx+24} 232 C${cx+24} 216 ${cx+22} 205 L${cx} 208 Z` },
    { id: 'hamstrings', d: `M${cx-20} 288 L${cx-22} 332 C${cx-22} 354 ${cx-20} 374 ${cx-16} 390 L${cx-12} 412 C${cx-10} 420 ${cx-4} 422 ${cx} 418 L${cx+2} 380 C${cx+4} 355 ${cx+2} 328 ${cx} 290 Z M${cx+20} 288 L${cx+22} 332 C${cx+22} 354 ${cx+20} 374 ${cx+16} 390 L${cx+12} 412 C${cx+10} 420 ${cx+4} 422 ${cx} 418 L${cx-2} 380 C${cx-4} 355 ${cx-2} 328 ${cx} 290 Z` },
    { id: 'calves', d: `M${cx-16} 412 C${cx-18} 428 ${cx-16} 450 ${cx-12} 465 L${cx-6} 472 L${cx} 472 L${cx+2} 448 C${cx+2} 428 ${cx} 410 ${cx-4} 405 Z M${cx+16} 412 C${cx+18} 428 ${cx+16} 450 ${cx+12} 465 L${cx+6} 472 L${cx} 472 L${cx-2} 448 C${cx-2} 428 ${cx} 410 ${cx+4} 405 Z` },
  ]

  const muscles = view === 'front' ? frontMuscles : backMuscles

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ cursor: 'pointer', display: 'block' }}>
      {/* Body base */}
      <ellipse cx={cx} cy={35} rx={18} ry={22} fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
      {/* Neck */}
      <rect x={cx-8} y={54} width={16} height={20} rx={4} fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />

      {muscles.map(({ id, d }) => (
        <path key={id} d={d}
          fill={muscleColor(id)}
          fillOpacity={muscleOpacity(id)}
          stroke={muscleStroke(id)}
          strokeWidth={selected.has(id) ? '1.5' : '0.5'}
          style={{ cursor: 'pointer', transition: 'fill-opacity 0.15s, stroke-width 0.15s' }}
          onClick={() => onToggle(id)}
        />
      ))}

      {/* Body outline */}
      <path d={view === 'front'
        ? `M${cx} 18 C${cx-10} 18 ${cx-20} 28 ${cx-20} 44 L${cx-24} 58 C${cx-30} 64 ${cx-32} 74 ${cx-30} 86 L${cx-28} 136 C${cx-28} 152 ${cx-26} 165 ${cx-22} 170 L${cx-20} 215 C${cx-20} 228 ${cx-18} 240 ${cx-16} 246 L${cx-16} 310 C${cx-18} 322 ${cx-20} 345 ${cx-20} 368 L${cx-18} 420 C${cx-14} 445 ${cx-10} 458 ${cx-8} 470 L${cx+8} 470 C${cx+10} 458 ${cx+14} 445 ${cx+18} 420 L${cx+20} 368 C${cx+20} 345 ${cx+18} 322 ${cx+16} 310 L${cx+16} 246 C${cx+18} 240 ${cx+20} 228 ${cx+20} 215 L${cx+22} 170 C${cx+26} 165 ${cx+28} 152 ${cx+28} 136 L${cx+30} 86 C${cx+32} 74 ${cx+30} 64 ${cx+24} 58 L${cx+20} 44 C${cx+20} 28 ${cx+10} 18 ${cx} 18 Z`
        : `M${cx} 18 C${cx-10} 18 ${cx-20} 28 ${cx-20} 44 L${cx-24} 58 C${cx-30} 64 ${cx-32} 74 ${cx-30} 86 L${cx-28} 138 C${cx-28} 155 ${cx-26} 168 ${cx-22} 172 L${cx-20} 216 C${cx-20} 230 ${cx-18} 242 ${cx-16} 248 L${cx-16} 315 C${cx-18} 328 ${cx-20} 348 ${cx-20} 372 L${cx-18} 425 C${cx-14} 448 ${cx-10} 462 ${cx-8} 475 L${cx+8} 475 C${cx+10} 462 ${cx+14} 448 ${cx+18} 425 L${cx+20} 372 C${cx+20} 348 ${cx+18} 328 ${cx+16} 315 L${cx+16} 248 C${cx+18} 242 ${cx+20} 230 ${cx+20} 216 L${cx+22} 172 C${cx+26} 168 ${cx+28} 155 ${cx+28} 138 L${cx+30} 86 C${cx+32} 74 ${cx+30} 64 ${cx+24} 58 L${cx+20} 44 C${cx+20} 28 ${cx+10} 18 ${cx} 18 Z`}
        fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.75" />
    </svg>
  )
}

export default function BodySculpting({ getToken, member }) {
  const [selected, setSelected] = useState(new Set())
  const [view, setView] = useState('front')
  const [gender, setGender] = useState('male')
  const [goalType, setGoalType] = useState('sculpt')
  const [sculptingGoals, setSculptingGoals] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  const api = (path, opts) => fetch(path, {
    headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
    ...opts
  }).then(r => r.json())

  useEffect(() => {
    api('/api/sculpting').then(d => {
      if (d.sculpting) {
        const muscles = d.sculpting.selected_muscles || []
        setSelected(new Set(muscles))
        setSculptingGoals(d.sculpting.sculpting_goals || '')
      }
    }).finally(() => setLoading(false))
  }, [])

  const toggleMuscle = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    setSaved(false)
  }

  const saveSculpting = async () => {
    setSaving(true)
    await api('/api/sculpting', {
      method: 'POST',
      body: JSON.stringify({
        selected_muscles: [...selected],
        sculpting_goals: sculptingGoals,
        priority_areas: [...selected]
      })
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const selectedList = [...selected]
  const groups = ['Upper Body', 'Arms', 'Core', 'Legs']

  if (loading) return <div style={{ color: 'var(--muted)', padding: '2rem' }}>Loading...</div>

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', letterSpacing: '0.04em', color: '#f5f2ee', marginBottom: '0.5rem' }}>Body Sculpting</h1>
      <p style={{ color: 'rgba(245,242,238,0.7)', fontSize: '0.9rem', marginBottom: '2rem' }}>
        Tap the muscle groups you want to focus on. Sawyer will see your selections and build your program around them.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', alignItems: 'start' }}>

        {/* BODY FIGURE */}
        <div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              {['front','back'].map(v => (
                <button key={v} onClick={() => setView(v)}
                  style={{ ...btnStyle, ...(view === v ? btnActive : {}) }}>
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {['male','female'].map(g => (
                <button key={g} onClick={() => setGender(g)}
                  style={{ ...btnStyle, ...(gender === g ? btnActive : {}) }}>
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '1rem', display: 'flex', justifyContent: 'center' }}>
            <BodyFigure selected={selected} onToggle={toggleMuscle} view={view} gender={gender} />
          </div>

          <p style={{ fontSize: '0.75rem', color: 'rgba(245,242,238,0.4)', textAlign: 'center', marginTop: '0.5rem' }}>
            Tap muscle groups to select
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div>
          {/* Muscle group chips */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.72rem', color: 'rgba(245,242,238,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Or tap to select</div>
            {groups.map(group => (
              <div key={group} style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.72rem', color: 'rgba(245,242,238,0.4)', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>{group}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {Object.entries(MUSCLES).filter(([,m]) => m.group === group).map(([id, m]) => (
                    <button key={id} onClick={() => toggleMuscle(id)}
                      style={{ ...chipStyle, ...(selected.has(id) ? { borderColor: m.color, color: m.color, background: m.color + '18' } : {}) }}>
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Goal type toggle */}
          {selectedList.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'rgba(245,242,238,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>My goal for these areas</div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
                {[['sculpt','💪 Build & Sculpt'],['cardio','🔥 Tone & Define']].map(([t, l]) => (
                  <button key={t} onClick={() => setGoalType(t)}
                    style={{ ...btnStyle, ...(goalType === t ? btnActive : {}), padding: '0.5rem 1rem', fontSize: '0.82rem' }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selected muscles with exercises */}
          {selectedList.length === 0 ? (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '2rem', textAlign: 'center', color: 'rgba(245,242,238,0.4)', fontSize: '0.9rem' }}>
              Select muscle groups on the body figure or use the chips above to see recommended exercises
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {selectedList.map(id => {
                const m = MUSCLES[id]
                if (!m) return null
                const goalInfo = GOALS_BY_MUSCLE[id]
                return (
                  <div key={id} style={{ background: 'var(--surface)', border: `1px solid ${m.color}33`, borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ background: m.color + '15', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${m.color}22` }}>
                      <div>
                        <span style={{ fontWeight: 500, fontSize: '0.95rem', color: m.color }}>{m.label}</span>
                        <span style={{ fontSize: '0.72rem', color: 'rgba(245,242,238,0.5)', marginLeft: '0.75rem' }}>{m.group}</span>
                      </div>
                      <button onClick={() => toggleMuscle(id)} style={{ background: 'none', border: 'none', color: 'rgba(245,242,238,0.3)', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
                    </div>
                    {goalInfo && (
                      <div style={{ padding: '0.6rem 1rem', background: 'rgba(255,255,255,0.02)', borderBottom: `1px solid ${m.color}15`, fontSize: '0.8rem', color: 'rgba(245,242,238,0.65)', fontStyle: 'italic' }}>
                        {goalType === 'sculpt' ? goalInfo.sculpt : goalInfo.cardio}
                      </div>
                    )}
                    <div style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(245,242,238,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Top exercises</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {m.exercises.map(ex => (
                          <span key={ex} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', padding: '0.3rem 0.75rem', borderRadius: '2px', fontSize: '0.78rem', color: 'rgba(245,242,238,0.75)' }}>{ex}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Notes to Sawyer */}
          {selectedList.length > 0 && (
            <div style={{ marginTop: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', color: 'rgba(245,242,238,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                Additional notes for Sawyer (optional)
              </label>
              <textarea
                value={sculptingGoals}
                onChange={e => { setSculptingGoals(e.target.value); setSaved(false) }}
                placeholder="e.g. I want bigger arms and a more defined chest — I'm okay with bulk. My legs need the most work..."
                rows={3}
                style={{ width: '100%', resize: 'vertical', background: 'var(--surface2)', border: '1px solid var(--border)', color: '#f5f2ee', padding: '0.75rem 1rem', fontFamily: 'inherit', fontSize: '0.85rem', borderRadius: '2px', outline: 'none' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem' }}>
                <button
                  onClick={saveSculpting}
                  disabled={saving}
                  style={{ background: '#c9a84c', color: '#0a0a0a', border: 'none', padding: '0.85rem 2rem', fontSize: '0.82rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '2px', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Saving...' : 'Save & Send to Sawyer'}
                </button>
                {saved && <span style={{ color: '#4caf7d', fontSize: '0.85rem' }}>✓ Saved! Sawyer can now see your focus areas.</span>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const btnStyle = { background: 'none', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(245,242,238,0.5)', padding: '0.35rem 0.85rem', borderRadius: '2px', fontSize: '0.78rem', cursor: 'pointer', letterSpacing: '0.05em' }
const btnActive = { background: 'rgba(201,168,76,0.12)', borderColor: '#c9a84c', color: '#c9a84c' }
const chipStyle = { background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(245,242,238,0.55)', padding: '0.3rem 0.85rem', borderRadius: '2px', fontSize: '0.78rem', cursor: 'pointer', letterSpacing: '0.04em', transition: 'all 0.15s' }
const s = { surface: '#161616', border: 'rgba(255,255,255,0.08)', surface2: '#1e1e1e', muted: 'rgba(245,242,238,0.45)' }
