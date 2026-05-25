import { useState, useEffect } from 'react'

const MUSCLES = {
  chest:      { label: 'Chest',        color: '#00d4ff', group: 'Upper Body', exercises: ['Barbell Bench Press','Incline Dumbbell Press','Cable Chest Flye','Pec Deck Machine','Push-Up','Dumbbell Flye'] },
  shoulders:  { label: 'Shoulders',    color: '#0099ff', group: 'Upper Body', exercises: ['Overhead Press','Lateral Raise','Rear Delt Flye','Arnold Press','Front Raise','Face Pull'] },
  biceps:     { label: 'Biceps',       color: '#00ff88', group: 'Arms',       exercises: ['Barbell Curl','Hammer Curl','Incline Dumbbell Curl','Preacher Curl','Cable Curl','Concentration Curl'] },
  triceps:    { label: 'Triceps',      color: '#ff6b35', group: 'Arms',       exercises: ['Tricep Pushdown','Skull Crusher','Overhead Extension','Close Grip Bench Press','Tricep Dip','Rope Pushdown'] },
  forearms:   { label: 'Forearms',     color: '#ffaa00', group: 'Arms',       exercises: ['Wrist Curl','Reverse Curl','Farmers Carry','Zottman Curl','Dead Hang'] },
  abs:        { label: 'Abs & Core',   color: '#cc44ff', group: 'Core',       exercises: ['Cable Crunch','Hanging Leg Raise','Plank','Ab Rollout','Russian Twist','Bicycle Crunch'] },
  quads:      { label: 'Quads',        color: '#ff3366', group: 'Legs',       exercises: ['Barbell Back Squat','Leg Press','Leg Extension','Hack Squat','Bulgarian Split Squat','Front Squat'] },
  calves:     { label: 'Calves',       color: '#00ffcc', group: 'Legs',       exercises: ['Standing Calf Raise','Seated Calf Raise','Leg Press Calf Raise'] },
  back:       { label: 'Back',         color: '#0066ff', group: 'Upper Body', exercises: ['Deadlift','Pull-Up','Barbell Row','Lat Pulldown','Seated Cable Row','T-Bar Row'] },
  hamstrings: { label: 'Hamstrings',   color: '#ff9900', group: 'Legs',       exercises: ['Romanian Deadlift','Leg Curl','Bulgarian Split Squat','Stiff Leg Deadlift','Nordic Curl'] },
  glutes:     { label: 'Glutes',       color: '#ff44aa', group: 'Legs',       exercises: ['Hip Thrust','Bulgarian Split Squat','Glute Bridge','Cable Kickback','Sumo Squat'] },
  traps:      { label: 'Traps',        color: '#aaaaff', group: 'Upper Body', exercises: ['Barbell Shrug','Face Pull','Upright Row','Dumbbell Shrug','Cable Shrug'] },
}

const GOALS = {
  chest:      'Build a fuller, defined chest with visible separation and width.',
  shoulders:  'Create wide, capped shoulders for a powerful V-taper look.',
  biceps:     'Build peak and fullness in the bicep for defined arms.',
  triceps:    'Add size to the back of the arm — triceps are 2/3 of arm size.',
  forearms:   'Build thick, defined forearms for a complete arm look.',
  abs:        'Reveal a defined six-pack with weighted core work and low body fat.',
  quads:      'Build quad sweep and thickness for strong, defined legs.',
  calves:     'Build diamond-shaped calves for complete leg development.',
  back:       'Build width and thickness for a powerful, V-tapered back.',
  hamstrings: 'Build full, balanced hamstrings that complement your quads.',
  glutes:     'Build round, lifted glutes with hip thrusts and split squats.',
  traps:      'Build thick traps and a powerful upper back.',
}

function MaleBodyFront({ selected, onToggle }) {
  const c = (id) => selected.has(id)
  const fill = (id) => c(id) ? MUSCLES[id].color : '#1a2035'
  const stroke = (id) => c(id) ? MUSCLES[id].color : '#2a4080'
  const glow = (id) => c(id) ? `drop-shadow(0 0 6px ${MUSCLES[id].color})` : 'none'

  return (
    <svg viewBox="0 0 200 520" width="200" height="520" style={{ display: 'block' }}>
      <defs>
        <filter id="glow-chest"><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>

      {/* HEAD */}
      <ellipse cx="100" cy="32" rx="24" ry="28" fill="#1a2035" stroke="#3a5090" strokeWidth="1.5"/>
      {/* Neck */}
      <rect x="88" y="56" width="24" height="22" rx="4" fill="#1a2035" stroke="#2a4080" strokeWidth="1"/>

      {/* TORSO outline */}
      <path d="M60 78 C55 78 48 82 46 90 L44 140 C44 155 46 168 50 175 L52 220 C52 232 54 242 58 248 L58 265 L142 265 L142 248 C146 242 148 232 148 220 L150 175 C154 168 156 155 156 140 L154 90 C152 82 145 78 140 78 Z" fill="#0d1025" stroke="#2a4080" strokeWidth="1.5"/>

      {/* CHEST */}
      <g onClick={() => onToggle('chest')} style={{ cursor: 'pointer', filter: glow('chest') }}>
        <path d="M68 85 C62 85 58 90 58 98 L59 122 C62 130 72 136 84 136 L98 136 L98 88 C90 84 78 83 68 85 Z" fill={fill('chest')} stroke={stroke('chest')} strokeWidth={c('chest') ? 2 : 1} opacity="0.9"/>
        <path d="M132 85 C138 85 142 90 142 98 L141 122 C138 130 128 136 116 136 L102 136 L102 88 C110 84 122 83 132 85 Z" fill={fill('chest')} stroke={stroke('chest')} strokeWidth={c('chest') ? 2 : 1} opacity="0.9"/>
      </g>

      {/* SHOULDERS */}
      <g onClick={() => onToggle('shoulders')} style={{ cursor: 'pointer', filter: glow('shoulders') }}>
        <ellipse cx="48" cy="95" rx="16" ry="22" fill={fill('shoulders')} stroke={stroke('shoulders')} strokeWidth={c('shoulders') ? 2 : 1} opacity="0.9"/>
        <ellipse cx="152" cy="95" rx="16" ry="22" fill={fill('shoulders')} stroke={stroke('shoulders')} strokeWidth={c('shoulders') ? 2 : 1} opacity="0.9"/>
      </g>

      {/* BICEPS */}
      <g onClick={() => onToggle('biceps')} style={{ cursor: 'pointer', filter: glow('biceps') }}>
        <path d="M34 114 C30 118 28 130 29 145 L32 165 C35 172 40 175 45 173 L50 160 C52 148 50 132 46 120 Z" fill={fill('biceps')} stroke={stroke('biceps')} strokeWidth={c('biceps') ? 2 : 1} opacity="0.9"/>
        <path d="M166 114 C170 118 172 130 171 145 L168 165 C165 172 160 175 155 173 L150 160 C148 148 150 132 154 120 Z" fill={fill('biceps')} stroke={stroke('biceps')} strokeWidth={c('biceps') ? 2 : 1} opacity="0.9"/>
      </g>

      {/* TRICEPS (sides) */}
      <g onClick={() => onToggle('triceps')} style={{ cursor: 'pointer', filter: glow('triceps') }}>
        <path d="M34 114 C28 120 26 135 27 150 L30 168 C33 174 38 175 42 172 L46 160 C44 145 42 128 42 116 Z" fill={fill('triceps')} stroke={stroke('triceps')} strokeWidth={c('triceps') ? 2 : 1} opacity="0.85"/>
        <path d="M166 114 C172 120 174 135 173 150 L170 168 C167 174 162 175 158 172 L154 160 C156 145 158 128 158 116 Z" fill={fill('triceps')} stroke={stroke('triceps')} strokeWidth={c('triceps') ? 2 : 1} opacity="0.85"/>
      </g>

      {/* FOREARMS */}
      <g onClick={() => onToggle('forearms')} style={{ cursor: 'pointer', filter: glow('forearms') }}>
        <path d="M29 168 L26 205 C26 212 30 218 36 218 L40 205 C42 192 42 178 40 170 Z" fill={fill('forearms')} stroke={stroke('forearms')} strokeWidth={c('forearms') ? 2 : 1} opacity="0.9"/>
        <path d="M171 168 L174 205 C174 212 170 218 164 218 L160 205 C158 192 158 178 160 170 Z" fill={fill('forearms')} stroke={stroke('forearms')} strokeWidth={c('forearms') ? 2 : 1} opacity="0.9"/>
      </g>

      {/* ABS */}
      <g onClick={() => onToggle('abs')} style={{ cursor: 'pointer', filter: glow('abs') }}>
        <rect x="72" y="138" width="56" height="22" rx="4" fill={fill('abs')} stroke={stroke('abs')} strokeWidth={c('abs') ? 2 : 1} opacity="0.9"/>
        <rect x="72" y="164" width="56" height="22" rx="4" fill={fill('abs')} stroke={stroke('abs')} strokeWidth={c('abs') ? 2 : 1} opacity="0.9"/>
        <rect x="72" y="190" width="56" height="22" rx="4" fill={fill('abs')} stroke={stroke('abs')} strokeWidth={c('abs') ? 2 : 1} opacity="0.9"/>
        {/* dividing line */}
        <line x1="100" y1="138" x2="100" y2="212" stroke={c('abs') ? MUSCLES.abs.color : '#2a4080'} strokeWidth="1" opacity="0.5"/>
      </g>

      {/* HIP area */}
      <path d="M58 248 L58 265 L142 265 L142 248 C138 244 128 242 116 242 L84 242 C72 242 62 244 58 248 Z" fill="#0d1025" stroke="#2a4080" strokeWidth="1"/>

      {/* QUADS */}
      <g onClick={() => onToggle('quads')} style={{ cursor: 'pointer', filter: glow('quads') }}>
        <path d="M60 268 C56 272 54 285 55 305 L58 345 C60 360 65 372 70 375 L80 375 C86 370 88 355 87 335 L84 295 C82 278 78 268 72 266 Z" fill={fill('quads')} stroke={stroke('quads')} strokeWidth={c('quads') ? 2 : 1} opacity="0.9"/>
        <path d="M140 268 C144 272 146 285 145 305 L142 345 C140 360 135 372 130 375 L120 375 C114 370 112 355 113 335 L116 295 C118 278 122 268 128 266 Z" fill={fill('quads')} stroke={stroke('quads')} strokeWidth={c('quads') ? 2 : 1} opacity="0.9"/>
        {/* inner quads */}
        <path d="M84 268 C88 272 92 288 92 310 L90 345 C89 358 86 368 82 372 L80 372 L80 375 C86 370 88 355 87 335 L84 295 C82 278 80 268 78 266 Z" fill={fill('quads')} stroke={stroke('quads')} strokeWidth="0.5" opacity="0.6"/>
        <path d="M116 268 C112 272 108 288 108 310 L110 345 C111 358 114 368 118 372 L120 372 L120 375 C114 370 112 355 113 335 L116 295 C118 278 120 268 122 266 Z" fill={fill('quads')} stroke={stroke('quads')} strokeWidth="0.5" opacity="0.6"/>
      </g>

      {/* KNEES */}
      <ellipse cx="72" cy="380" rx="12" ry="8" fill="#1a2035" stroke="#2a4080" strokeWidth="1"/>
      <ellipse cx="128" cy="380" rx="12" ry="8" fill="#1a2035" stroke="#2a4080" strokeWidth="1"/>

      {/* CALVES */}
      <g onClick={() => onToggle('calves')} style={{ cursor: 'pointer', filter: glow('calves') }}>
        <path d="M62 388 C58 396 57 415 59 438 L62 460 C64 468 68 472 72 470 L76 458 C78 440 77 418 74 398 Z" fill={fill('calves')} stroke={stroke('calves')} strokeWidth={c('calves') ? 2 : 1} opacity="0.9"/>
        <path d="M138 388 C142 396 143 415 141 438 L138 460 C136 468 132 472 128 470 L124 458 C122 440 123 418 126 398 Z" fill={fill('calves')} stroke={stroke('calves')} strokeWidth={c('calves') ? 2 : 1} opacity="0.9"/>
      </g>

      {/* ANKLES/FEET */}
      <rect x="62" y="470" width="18" height="12" rx="3" fill="#1a2035" stroke="#2a4080" strokeWidth="1"/>
      <rect x="120" y="470" width="18" height="12" rx="3" fill="#1a2035" stroke="#2a4080" strokeWidth="1"/>

      {/* Body outline glow */}
      <path d="M60 78 C55 78 30 85 28 120 L26 170 L24 215 L58 248 L58 268 L60 375 L62 388 L62 470 L80 470 L80 390 L82 375 L60 268 L58 248" fill="none" stroke="#1a3060" strokeWidth="1"/>
      <path d="M140 78 C145 78 170 85 172 120 L174 170 L176 215 L142 248 L142 268 L140 375 L138 388 L138 470 L120 470 L120 390 L118 375 L140 268 L142 248" fill="none" stroke="#1a3060" strokeWidth="1"/>
    </svg>
  )
}

function MaleBodyBack({ selected, onToggle }) {
  const c = (id) => selected.has(id)
  const fill = (id) => c(id) ? MUSCLES[id].color : '#1a2035'
  const stroke = (id) => c(id) ? MUSCLES[id].color : '#2a4080'
  const glow = (id) => c(id) ? `drop-shadow(0 0 6px ${MUSCLES[id].color})` : 'none'

  return (
    <svg viewBox="0 0 200 520" width="200" height="520" style={{ display: 'block' }}>
      {/* HEAD */}
      <ellipse cx="100" cy="32" rx="24" ry="28" fill="#1a2035" stroke="#3a5090" strokeWidth="1.5"/>
      <rect x="88" y="56" width="24" height="22" rx="4" fill="#1a2035" stroke="#2a4080" strokeWidth="1"/>

      {/* TORSO back */}
      <path d="M60 78 C55 78 48 82 46 90 L44 140 C44 155 46 168 50 175 L52 220 C52 232 54 242 58 248 L58 265 L142 265 L142 248 C146 242 148 232 148 220 L150 175 C154 168 156 155 156 140 L154 90 C152 82 145 78 140 78 Z" fill="#0d1025" stroke="#2a4080" strokeWidth="1.5"/>

      {/* TRAPS */}
      <g onClick={() => onToggle('traps')} style={{ cursor: 'pointer', filter: glow('traps') }}>
        <path d="M100 60 C88 62 72 68 66 80 L68 100 C76 108 88 112 100 112 C112 112 124 108 132 100 L134 80 C128 68 112 62 100 60 Z" fill={fill('traps')} stroke={stroke('traps')} strokeWidth={c('traps') ? 2 : 1} opacity="0.9"/>
      </g>

      {/* SHOULDERS back */}
      <g onClick={() => onToggle('shoulders')} style={{ cursor: 'pointer', filter: glow('shoulders') }}>
        <ellipse cx="48" cy="95" rx="16" ry="22" fill={fill('shoulders')} stroke={stroke('shoulders')} strokeWidth={c('shoulders') ? 2 : 1} opacity="0.9"/>
        <ellipse cx="152" cy="95" rx="16" ry="22" fill={fill('shoulders')} stroke={stroke('shoulders')} strokeWidth={c('shoulders') ? 2 : 1} opacity="0.9"/>
      </g>

      {/* TRICEPS back */}
      <g onClick={() => onToggle('triceps')} style={{ cursor: 'pointer', filter: glow('triceps') }}>
        <path d="M32 110 C28 120 27 138 29 155 L33 172 C37 178 43 178 47 174 L50 158 C51 140 49 122 46 112 Z" fill={fill('triceps')} stroke={stroke('triceps')} strokeWidth={c('triceps') ? 2 : 1} opacity="0.9"/>
        <path d="M168 110 C172 120 173 138 171 155 L167 172 C163 178 157 178 153 174 L150 158 C149 140 151 122 154 112 Z" fill={fill('triceps')} stroke={stroke('triceps')} strokeWidth={c('triceps') ? 2 : 1} opacity="0.9"/>
      </g>

      {/* FOREARMS back */}
      <g onClick={() => onToggle('forearms')} style={{ cursor: 'pointer', filter: glow('forearms') }}>
        <path d="M29 172 L26 208 C26 215 30 220 36 220 L40 206 C42 193 42 178 40 172 Z" fill={fill('forearms')} stroke={stroke('forearms')} strokeWidth={c('forearms') ? 2 : 1} opacity="0.9"/>
        <path d="M171 172 L174 208 C174 215 170 220 164 220 L160 206 C158 193 158 178 160 172 Z" fill={fill('forearms')} stroke={stroke('forearms')} strokeWidth={c('forearms') ? 2 : 1} opacity="0.9"/>
      </g>

      {/* BACK - lats */}
      <g onClick={() => onToggle('back')} style={{ cursor: 'pointer', filter: glow('back') }}>
        <path d="M66 112 C60 118 56 135 56 155 L58 195 C60 210 66 220 74 222 L98 224 L98 112 C88 110 76 110 66 112 Z" fill={fill('back')} stroke={stroke('back')} strokeWidth={c('back') ? 2 : 1} opacity="0.9"/>
        <path d="M134 112 C140 118 144 135 144 155 L142 195 C140 210 134 220 126 222 L102 224 L102 112 C112 110 124 110 134 112 Z" fill={fill('back')} stroke={stroke('back')} strokeWidth={c('back') ? 2 : 1} opacity="0.9"/>
        {/* spine line */}
        <line x1="100" y1="112" x2="100" y2="224" stroke={c('back') ? MUSCLES.back.color : '#2a4080'} strokeWidth="1.5" opacity="0.4"/>
      </g>

      {/* GLUTES */}
      <g onClick={() => onToggle('glutes')} style={{ cursor: 'pointer', filter: glow('glutes') }}>
        <path d="M58 248 C56 254 55 265 57 278 L62 298 C66 308 74 314 82 312 L98 310 L98 248 Z" fill={fill('glutes')} stroke={stroke('glutes')} strokeWidth={c('glutes') ? 2 : 1} opacity="0.9"/>
        <path d="M142 248 C144 254 145 265 143 278 L138 298 C134 308 126 314 118 312 L102 310 L102 248 Z" fill={fill('glutes')} stroke={stroke('glutes')} strokeWidth={c('glutes') ? 2 : 1} opacity="0.9"/>
      </g>

      {/* HAMSTRINGS */}
      <g onClick={() => onToggle('hamstrings')} style={{ cursor: 'pointer', filter: glow('hamstrings') }}>
        <path d="M60 315 C56 325 55 345 57 368 L60 385 C63 393 68 396 74 394 L80 380 C82 362 82 338 80 318 Z" fill={fill('hamstrings')} stroke={stroke('hamstrings')} strokeWidth={c('hamstrings') ? 2 : 1} opacity="0.9"/>
        <path d="M140 315 C144 325 145 345 143 368 L140 385 C137 393 132 396 126 394 L120 380 C118 362 118 338 120 318 Z" fill={fill('hamstrings')} stroke={stroke('hamstrings')} strokeWidth={c('hamstrings') ? 2 : 1} opacity="0.9"/>
      </g>

      {/* KNEES back */}
      <ellipse cx="72" cy="393" rx="12" ry="8" fill="#1a2035" stroke="#2a4080" strokeWidth="1"/>
      <ellipse cx="128" cy="393" rx="12" ry="8" fill="#1a2035" stroke="#2a4080" strokeWidth="1"/>

      {/* CALVES back */}
      <g onClick={() => onToggle('calves')} style={{ cursor: 'pointer', filter: glow('calves') }}>
        <path d="M62 400 C58 410 57 432 60 452 L63 470 C66 476 70 478 74 476 L77 462 C78 442 77 418 74 404 Z" fill={fill('calves')} stroke={stroke('calves')} strokeWidth={c('calves') ? 2 : 1} opacity="0.9"/>
        <path d="M138 400 C142 410 143 432 140 452 L137 470 C134 476 130 478 126 476 L123 462 C122 442 123 418 126 404 Z" fill={fill('calves')} stroke={stroke('calves')} strokeWidth={c('calves') ? 2 : 1} opacity="0.9"/>
      </g>

      {/* FEET */}
      <rect x="62" y="476" width="18" height="12" rx="3" fill="#1a2035" stroke="#2a4080" strokeWidth="1"/>
      <rect x="120" y="476" width="18" height="12" rx="3" fill="#1a2035" stroke="#2a4080" strokeWidth="1"/>
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
        setSelected(new Set(d.sculpting.selected_muscles || []))
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
      body: JSON.stringify({ selected_muscles: [...selected], sculpting_goals: sculptingGoals, priority_areas: [...selected] })
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const selectedList = [...selected]
  const groups = ['Upper Body', 'Arms', 'Core', 'Legs']

  if (loading) return <div style={{ color: 'rgba(255,255,255,0.6)', padding: '2rem' }}>Loading...</div>

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: '#ffffff' }}>
      <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', letterSpacing: '0.04em', color: '#ffffff', marginBottom: '0.5rem' }}>Body Sculpting</h1>
      <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', marginBottom: '2rem' }}>
        Tap the muscle groups you want to focus on. Sawyer will see your selections and build your plan around them.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem', alignItems: 'start' }}>

        {/* BODY FIGURE */}
        <div>
          {/* Controls */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '4px', background: '#0d1025', borderRadius: '4px', padding: '3px' }}>
              {['front', 'back'].map(v => (
                <button key={v} onClick={() => setView(v)} style={{ background: view === v ? '#00d4ff22' : 'transparent', border: view === v ? '1px solid #00d4ff' : '1px solid transparent', color: view === v ? '#00d4ff' : 'rgba(255,255,255,0.5)', padding: '4px 14px', borderRadius: '3px', fontSize: '0.78rem', cursor: 'pointer', letterSpacing: '0.05em' }}>
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '4px', background: '#0d1025', borderRadius: '4px', padding: '3px' }}>
              {['male', 'female'].map(g => (
                <button key={g} onClick={() => setGender(g)} style={{ background: gender === g ? '#00d4ff22' : 'transparent', border: gender === g ? '1px solid #00d4ff' : '1px solid transparent', color: gender === g ? '#00d4ff' : 'rgba(255,255,255,0.5)', padding: '4px 14px', borderRadius: '3px', fontSize: '0.78rem', cursor: 'pointer', letterSpacing: '0.05em' }}>
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Figure */}
          <div style={{ background: '#060918', border: '1px solid #1a3060', borderRadius: '8px', padding: '16px 8px', display: 'flex', justifyContent: 'center', boxShadow: '0 0 30px rgba(0,100,255,0.1)' }}>
            {view === 'front'
              ? <MaleBodyFront selected={selected} onToggle={toggleMuscle} />
              : <MaleBodyBack selected={selected} onToggle={toggleMuscle} />
            }
          </div>
          <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: '8px' }}>Tap a muscle group to select it</p>

          {/* Legend */}
          {selectedList.length > 0 && (
            <div style={{ marginTop: '12px', background: '#0d1025', borderRadius: '4px', padding: '10px 12px' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Selected</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {selectedList.map(id => (
                  <span key={id} onClick={() => toggleMuscle(id)} style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '2px', background: MUSCLES[id]?.color + '22', border: `1px solid ${MUSCLES[id]?.color}`, color: MUSCLES[id]?.color, cursor: 'pointer' }}>
                    {MUSCLES[id]?.label} ✕
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div>
          {/* Muscle group chips */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Or select by muscle group</div>
            {groups.map(group => (
              <div key={group} style={{ marginBottom: '0.85rem' }}>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', marginBottom: '0.4rem', textTransform: 'uppercase' }}>{group}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {Object.entries(MUSCLES).filter(([, m]) => m.group === group).map(([id, m]) => (
                    <button key={id} onClick={() => toggleMuscle(id)} style={{ background: selected.has(id) ? m.color + '20' : 'rgba(255,255,255,0.05)', border: `1px solid ${selected.has(id) ? m.color : 'rgba(255,255,255,0.2)'}`, color: selected.has(id) ? m.color : 'rgba(255,255,255,0.8)', padding: '0.3rem 0.85rem', borderRadius: '2px', fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.15s' }}>
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Goal type */}
          {selectedList.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Training goal</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[['sculpt', '💪 Build & Sculpt'], ['tone', '🔥 Tone & Define']].map(([t, l]) => (
                  <button key={t} onClick={() => setGoalType(t)} style={{ background: goalType === t ? '#00d4ff22' : 'rgba(255,255,255,0.05)', border: `1px solid ${goalType === t ? '#00d4ff' : 'rgba(255,255,255,0.2)'}`, color: goalType === t ? '#00d4ff' : 'rgba(255,255,255,0.75)', padding: '0.5rem 1.25rem', borderRadius: '2px', fontSize: '0.82rem', cursor: 'pointer' }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selected muscle cards */}
          {selectedList.length === 0 ? (
            <div style={{ background: '#0d1025', border: '1px solid #1a3060', borderRadius: '8px', padding: '2.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>👆</div>
              Tap muscle groups on the body or use the chips above to build your focus list
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {selectedList.map(id => {
                const m = MUSCLES[id]
                if (!m) return null
                return (
                  <div key={id} style={{ background: '#0d1025', border: `1px solid ${m.color}44`, borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ background: m.color + '15', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${m.color}22` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: m.color, boxShadow: `0 0 6px ${m.color}` }} />
                        <span style={{ fontWeight: 500, fontSize: '0.95rem', color: m.color }}>{m.label}</span>
                        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)' }}>{m.group}</span>
                      </div>
                      <button onClick={() => toggleMuscle(id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
                    </div>
                    <div style={{ padding: '0.6rem 1rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', borderBottom: `1px solid ${m.color}15` }}>
                      {GOALS[id]}
                    </div>
                    <div style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Top exercises</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {m.exercises.map(ex => (
                          <span key={ex} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', padding: '0.25rem 0.6rem', borderRadius: '2px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)' }}>{ex}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Notes + save */}
          {selectedList.length > 0 && (
            <div style={{ marginTop: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                Additional notes for Sawyer
              </label>
              <textarea value={sculptingGoals} onChange={e => { setSculptingGoals(e.target.value); setSaved(false) }}
                placeholder="e.g. I want bigger arms and a more defined chest. My legs need the most work..."
                rows={3} style={{ width: '100%', resize: 'vertical', background: '#0d1025', border: '1px solid rgba(255,255,255,0.2)', color: '#ffffff', padding: '0.75rem 1rem', fontFamily: 'inherit', fontSize: '0.85rem', borderRadius: '4px', outline: 'none' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem' }}>
                <button onClick={saveSculpting} disabled={saving}
                  style={{ background: '#00d4ff', color: '#000814', border: 'none', padding: '0.85rem 2rem', fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '3px', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, boxShadow: '0 0 15px rgba(0,212,255,0.3)' }}>
                  {saving ? 'Saving...' : 'Save & Send to Sawyer'}
                </button>
                {saved && <span style={{ color: '#00ff88', fontSize: '0.85rem' }}>✓ Saved! Sawyer can now see your focus areas.</span>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
