import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const { member, logout, getToken } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('workout')
  const [workoutPlan, setWorkoutPlan] = useState(null)
  const [nutritionPlan, setNutritionPlan] = useState(null)
  const [checkins, setCheckins] = useState([])
  const [checkInWeight, setCheckInWeight] = useState('')
  const [checkInNote, setCheckInNote] = useState('')
  const [loading, setLoading] = useState(true)

  const api = (path) => fetch(path, { headers: { Authorization: `Bearer ${getToken()}` } }).then(r => r.json())

  useEffect(() => {
    Promise.all([
      api('/api/workouts/my-plan'),
      api('/api/nutrition/my-plan'),
      api('/api/members/checkins')
    ]).then(([w, n, c]) => {
      setWorkoutPlan(w.plan)
      setNutritionPlan(n.plan)
      setCheckins(c.checkins || [])
    }).finally(() => setLoading(false))
  }, [])

  const handleCheckIn = async () => {
    if (!checkInWeight) return
    await fetch('/api/members/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ weight_lbs: checkInWeight, notes: checkInNote })
    })
    const c = await api('/api/members/checkins')
    setCheckins(c.checkins || [])
    setCheckInWeight(''); setCheckInNote('')
  }

  const handleCheckout = async (tier) => {
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ tier })
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
  }

  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', color:'var(--muted)' }}>Loading your plan...</div>

  return (
    <div style={s.wrap}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.sidebarLogo}>FFF</div>
        <nav style={s.nav}>
          {['workout', 'nutrition', 'checkin'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ ...s.navBtn, ...(tab === t ? s.navActive : {}) }}>
              {t === 'workout' ? '💪 Workouts' : t === 'nutrition' ? '🥗 Nutrition' : '📊 Check-ins'}
            </button>
          ))}
          {member?.is_admin && (
            <button onClick={() => navigate('/admin')} style={s.navBtn}>⚙️ Admin</button>
          )}
        </nav>
        <div style={s.sidebarFooter}>
          <div style={s.memberName}>{member?.first_name} {member?.last_name}</div>
          <div style={s.memberTier}>{member?.tier || 'essential'} plan</div>
          <button onClick={logout} style={{ ...s.navBtn, marginTop: '0.5rem', fontSize: '0.75rem' }}>Sign out</button>
        </div>
      </aside>

      {/* Main content */}
      <main style={s.main}>

        {/* WORKOUT TAB */}
        {tab === 'workout' && (
          <div>
            <h1 style={s.pageTitle}>Your Workout Plan</h1>
            {member?.subscription_status !== 'active' ? (
              <div style={s.upgradeBanner}>
                <p style={{ marginBottom: '1rem', color: 'var(--muted)' }}>You don't have an active subscription yet. Choose a plan to unlock your custom workout program.</p>
                <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
                  {['essential','pro','elite'].map(t => (
                    <button key={t} className="btn-primary" onClick={() => handleCheckout(t)}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            ) : !workoutPlan ? (
              <div style={s.emptyState}>
                <p>Your workout plan is being built by Sawyer. Check back soon! 💪</p>
              </div>
            ) : (
              <div>
                <div style={s.planHeader}>
                  <h2 style={s.planTitle}>{workoutPlan.title}</h2>
                  <span style={s.badge}>{workoutPlan.weeks} weeks</span>
                </div>
                <div style={s.daysGrid}>
                  {workoutPlan.days?.map(day => (
                    <div key={day.id} style={s.dayCard}>
                      <div style={s.dayHeader}>
                        <span style={s.dayName}>{day.day_name}</span>
                        <span style={s.dayFocus}>{day.focus}</span>
                      </div>
                      <div style={s.exerciseList}>
                        {day.exercises?.map(ex => (
                          <div key={ex.id} style={s.exercise}>
                            <div style={s.exName}>{ex.name}</div>
                            <div style={s.exDetail}>{ex.sets} sets × {ex.reps} reps
                              {ex.weight_note && <span style={{ color: 'var(--gold)', marginLeft: '0.5rem' }}>{ex.weight_note}</span>}
                              {ex.rest_seconds && <span style={{ color: 'var(--muted)', marginLeft: '0.5rem' }}>· {ex.rest_seconds}s rest</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* NUTRITION TAB */}
        {tab === 'nutrition' && (
          <div>
            <h1 style={s.pageTitle}>Your Nutrition Plan</h1>
            {!nutritionPlan ? (
              <div style={s.emptyState}>
                <p>Your nutrition plan is being built by Sawyer. Check back soon! 🥗</p>
              </div>
            ) : (
              <div>
                <div style={s.macroRow}>
                  {[
                    { label: 'Calories', val: nutritionPlan.calories, unit: 'kcal', color: '#c9a84c' },
                    { label: 'Protein', val: nutritionPlan.protein_g + 'g', unit: '', color: '#4caf7d' },
                    { label: 'Carbs', val: nutritionPlan.carbs_g + 'g', unit: '', color: '#4c8eaf' },
                    { label: 'Fats', val: nutritionPlan.fats_g + 'g', unit: '', color: '#af6b4c' },
                  ].map(m => (
                    <div key={m.label} style={s.macroCard}>
                      <div style={{ ...s.macroNum, color: m.color }}>{m.val}</div>
                      <div style={s.macroLabel}>{m.label}</div>
                    </div>
                  ))}
                </div>
                {nutritionPlan.meals?.map(meal => (
                  <div key={meal.id} style={s.mealCard}>
                    <div style={s.mealHeader}>
                      <span style={s.mealName}>{meal.meal_name}</span>
                      <span style={s.mealTime}>{meal.meal_time}</span>
                      <span style={s.mealCals}>{meal.calories} kcal</span>
                    </div>
                    {meal.foods && (
                      <div style={s.foodList}>
                        {(typeof meal.foods === 'string' ? JSON.parse(meal.foods) : meal.foods).map((f, i) => (
                          <span key={i} style={s.foodItem}>{f}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CHECK-INS TAB */}
        {tab === 'checkin' && (
          <div>
            <h1 style={s.pageTitle}>Progress Check-Ins</h1>
            <div style={s.checkInForm}>
              <h3 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '1rem' }}>Log Today's Check-In</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={s.label}>Weight (lbs)</label>
                  <input type="number" value={checkInWeight} onChange={e => setCheckInWeight(e.target.value)} placeholder="185" />
                </div>
                <div>
                  <label style={s.label}>Notes</label>
                  <input value={checkInNote} onChange={e => setCheckInNote(e.target.value)} placeholder="How are you feeling?" />
                </div>
              </div>
              <button className="btn-primary" onClick={handleCheckIn}>Log Check-In</button>
            </div>
            <div style={s.checkInList}>
              {checkins.map(c => (
                <div key={c.id} style={s.checkInRow}>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', color: 'var(--gold)' }}>{c.weight_lbs} <span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontFamily: "'DM Sans', sans-serif" }}>lbs</span></span>
                  <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{c.notes}</span>
                  <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>{new Date(c.checked_in_at).toLocaleDateString()}</span>
                </div>
              ))}
              {checkins.length === 0 && <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>No check-ins yet. Log your first one above!</p>}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

const s = {
  wrap: { display: 'flex', minHeight: '100vh', background: 'var(--black)' },
  sidebar: { width: '220px', flexShrink: 0, background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', padding: '1.5rem 1rem' },
  sidebarLogo: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', letterSpacing: '0.1em', color: 'var(--gold)', marginBottom: '2rem', paddingLeft: '0.5rem' },
  nav: { display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 },
  navBtn: { background: 'none', border: 'none', color: 'var(--muted)', padding: '0.7rem 0.75rem', textAlign: 'left', fontSize: '0.85rem', borderRadius: '4px', transition: 'all 0.15s' },
  navActive: { background: 'var(--surface2)', color: 'var(--white)' },
  sidebarFooter: { borderTop: '1px solid var(--border)', paddingTop: '1rem' },
  memberName: { fontSize: '0.85rem', fontWeight: '500', color: 'var(--white)' },
  memberTier: { fontSize: '0.72rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.2rem' },
  main: { flex: 1, padding: '2.5rem 3rem', overflowY: 'auto' },
  pageTitle: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', letterSpacing: '0.04em', color: 'var(--white)', marginBottom: '2rem' },
  planHeader: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' },
  planTitle: { fontSize: '1.1rem', fontWeight: '500' },
  badge: { background: 'var(--gold-dim)', color: 'var(--gold)', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.3rem 0.75rem', borderRadius: '2px' },
  daysGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' },
  dayCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' },
  dayHeader: { background: 'var(--surface2)', padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  dayName: { fontWeight: '500', fontSize: '0.9rem' },
  dayFocus: { fontSize: '0.72rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.08em' },
  exerciseList: { padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  exercise: { borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' },
  exName: { fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.2rem' },
  exDetail: { fontSize: '0.8rem', color: 'var(--muted)' },
  emptyState: { background: 'var(--surface)', border: '1px solid var(--border)', padding: '2.5rem', textAlign: 'center', borderRadius: '4px', color: 'var(--muted)' },
  upgradeBanner: { background: 'var(--surface)', border: '1px solid var(--border)', padding: '2rem', borderRadius: '4px' },
  macroRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' },
  macroCard: { background: 'var(--surface)', border: '1px solid var(--border)', padding: '1.25rem', borderRadius: '4px', textAlign: 'center' },
  macroNum: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', letterSpacing: '0.04em' },
  macroLabel: { fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.25rem' },
  mealCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', marginBottom: '1rem', overflow: 'hidden' },
  mealHeader: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', background: 'var(--surface2)' },
  mealName: { fontWeight: '500', fontSize: '0.9rem', flex: 1 },
  mealTime: { fontSize: '0.75rem', color: 'var(--muted)' },
  mealCals: { fontSize: '0.75rem', color: 'var(--gold)' },
  foodList: { padding: '0.75rem 1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' },
  foodItem: { background: 'var(--surface2)', border: '1px solid var(--border)', padding: '0.3rem 0.75rem', borderRadius: '2px', fontSize: '0.8rem', color: 'var(--muted)' },
  checkInForm: { background: 'var(--surface)', border: '1px solid var(--border)', padding: '1.5rem', borderRadius: '4px', marginBottom: '2rem' },
  checkInList: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  checkInRow: { background: 'var(--surface)', border: '1px solid var(--border)', padding: '1rem 1.25rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '1.5rem' },
  label: { display: 'block', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.4rem' }
}
