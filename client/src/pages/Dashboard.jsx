import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function Dashboard() {
  const { member, logout, getToken } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState('workout')
  const [workoutPlan, setWorkoutPlan] = useState(null)
  const [nutritionPlan, setNutritionPlan] = useState(null)
  const [checkins, setCheckins] = useState([])
  const [messages, setMessages] = useState([])
  const [videos, setVideos] = useState([])
  const [videoCategory, setVideoCategory] = useState('all')
  const [msgInput, setMsgInput] = useState('')
  const [checkInWeight, setCheckInWeight] = useState('')
  const [checkInNote, setCheckInNote] = useState('')
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [sendingMsg, setSendingMsg] = useState(false)
  const messagesEndRef = useRef(null)

  const api = (path, opts) => fetch(path, {
    headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
    ...opts
  }).then(r => r.json())

  useEffect(() => {
    if (searchParams.get('checkout') === 'success') setTab('workout')
    Promise.all([
      api('/api/workouts/my-plan'),
      api('/api/nutrition/my-plan'),
      api('/api/members/checkins'),
      api('/api/messages/unread-count'),
      api('/api/videos')
    ]).then(([w, n, c, u, v]) => {
      setWorkoutPlan(w.plan)
      setNutritionPlan(n.plan)
      setCheckins(c.checkins || [])
      setUnreadCount(u.count || 0)
      setVideos(v.videos || [])
    }).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (tab === 'messages') {
      api('/api/messages').then(d => {
        setMessages(d.messages || [])
        setUnreadCount(0)
      })
    }
    if (tab === 'videos') {
      const url = videoCategory === 'all' ? '/api/videos' : `/api/videos?category=${videoCategory}`
      api(url).then(d => setVideos(d.videos || []))
    }
  }, [tab, videoCategory])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!msgInput.trim()) return
    setSendingMsg(true)
    const data = await api('/api/messages', { method: 'POST', body: JSON.stringify({ body: msgInput }) })
    if (data.message) setMessages(m => [...m, data.message])
    setMsgInput('')
    setSendingMsg(false)
  }

  const handleCheckIn = async () => {
    if (!checkInWeight) return
    await api('/api/members/checkin', { method: 'POST', body: JSON.stringify({ weight_lbs: checkInWeight, notes: checkInNote }) })
    const c = await api('/api/members/checkins')
    setCheckins(c.checkins || [])
    setCheckInWeight(''); setCheckInNote('')
  }

  const handleCheckout = async (tier) => {
    const data = await api('/api/stripe/checkout', { method: 'POST', body: JSON.stringify({ tier }) })
    if (data.url) window.location.href = data.url
  }

  const filteredVideos = videos.filter(v => videoCategory === 'all' || v.category === videoCategory)

  const formatDuration = (secs) => {
    if (!secs) return ''
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--muted)' }}>Loading your plan...</div>

  return (
    <div style={s.wrap}>
      <aside style={s.sidebar}>
        <div style={s.sidebarLogo}>FFF</div>
        <nav style={s.nav}>
          {[
            ['workout', '💪', 'Workouts'],
            ['nutrition', '🥗', 'Nutrition'],
            ['videos', '🎬', 'Video Library'],
            ['checkin', '📊', 'Check-ins'],
            ['messages', '💬', `Messages${unreadCount > 0 ? ` (${unreadCount})` : ''}`],
          ].map(([t, icon, label]) => (
            <button key={t} onClick={() => setTab(t)} style={{ ...s.navBtn, ...(tab === t ? s.navActive : {}), color: unreadCount > 0 && t === 'messages' ? '#c9a84c' : undefined }}>
              {icon} {label}
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

      <main style={s.main}>

        {/* WORKOUT TAB */}
        {tab === 'workout' && (
          <div>
            <h1 style={s.pageTitle}>Your Workout Plan</h1>
            {member?.subscription_status !== 'active' ? (
              <div style={s.upgradeBanner}>
                <p style={{ marginBottom: '1rem', color: 'var(--muted)' }}>Choose a plan to unlock your custom workout program.</p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {[['essential','$30/mo'],['pro','$75/mo'],['elite','$150/mo']].map(([t, p]) => (
                    <button key={t} className="btn-primary" onClick={() => handleCheckout(t)}>
                      {t.charAt(0).toUpperCase() + t.slice(1)} — {p}
                    </button>
                  ))}
                </div>
              </div>
            ) : !workoutPlan ? (
              <div style={s.emptyState}>
                <p>🏗️ Sawyer is building your custom workout plan. Check back within 48 hours!</p>
              </div>
            ) : (
              <div>
                <div style={s.planHeader}>
                  <h2 style={s.planTitle}>{workoutPlan.title}</h2>
                  <span style={s.badge}>{workoutPlan.weeks} weeks · {workoutPlan.goal}</span>
                </div>
                <div style={s.daysGrid}>
                  {workoutPlan.days?.map(day => (
                    <div key={day.id} style={s.dayCard}>
                      <div style={s.dayHeader}>
                        <span style={s.dayName}>{day.day_name}</span>
                        <span style={s.dayFocus}>{day.focus}</span>
                      </div>
                      {day.notes && <p style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', color: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>{day.notes}</p>}
                      <div style={s.exerciseList}>
                        {day.exercises?.map((ex, i) => (
                          <div key={ex.id} style={{ ...s.exercise, borderBottom: i < day.exercises.length - 1 ? '1px solid var(--border)' : 'none' }}>
                            <div style={s.exName}>{ex.name}</div>
                            <div style={s.exDetail}>
                              <span style={{ color: '#c9a84c' }}>{ex.sets} sets × {ex.reps} reps</span>
                              {ex.weight_note && <span style={{ color: 'var(--muted)', marginLeft: '0.75rem' }}>{ex.weight_note}</span>}
                              {ex.rest_seconds && <span style={{ color: 'var(--muted)', marginLeft: '0.75rem' }}>{ex.rest_seconds}s rest</span>}
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
                <p>🥗 Sawyer is building your custom nutrition plan. Check back within 48 hours!</p>
              </div>
            ) : (
              <div>
                <div style={s.macroRow}>
                  {[
                    { label: 'Calories', val: nutritionPlan.calories, unit: 'kcal', color: '#c9a84c' },
                    { label: 'Protein', val: `${nutritionPlan.protein_g}g`, color: '#4caf7d' },
                    { label: 'Carbs', val: `${nutritionPlan.carbs_g}g`, color: '#4c8eaf' },
                    { label: 'Fats', val: `${nutritionPlan.fats_g}g`, color: '#af6b4c' },
                  ].map(m => (
                    <div key={m.label} style={s.macroCard}>
                      <div style={{ ...s.macroNum, color: m.color }}>{m.val}</div>
                      <div style={s.macroLabel}>{m.label}</div>
                    </div>
                  ))}
                </div>
                {nutritionPlan.notes && (
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '1rem 1.25rem', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--muted)' }}>
                    💡 {nutritionPlan.notes}
                  </div>
                )}
                <h3 style={{ fontWeight: 500, marginBottom: '1rem', fontSize: '1rem' }}>Daily Meal Plan</h3>
                {nutritionPlan.meals?.map(meal => (
                  <div key={meal.id} style={s.mealCard}>
                    <div style={s.mealHeader}>
                      <span style={s.mealName}>{meal.meal_name}</span>
                      <span style={s.mealTime}>{meal.meal_time}</span>
                      <span style={{ fontSize: '0.75rem', color: '#4caf7d' }}>{meal.protein_g}g protein</span>
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

        {/* VIDEO LIBRARY TAB */}
        {tab === 'videos' && (
          <div>
            <h1 style={s.pageTitle}>Video Library</h1>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              {[['all','All Videos'],['training','Training'],['nutrition','Nutrition']].map(([cat, label]) => (
                <button key={cat} onClick={() => setVideoCategory(cat)}
                  style={{ ...s.filterBtn, ...(videoCategory === cat ? s.filterActive : {}) }}>
                  {label}
                </button>
              ))}
            </div>
            <div style={s.videoGrid}>
              {filteredVideos.map(v => (
                <div key={v.id} style={s.videoCard}>
                  <div style={s.videoEmbed}>
                    <iframe
                      src={v.video_url}
                      title={v.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ width: '100%', height: '100%', display: 'block' }}
                    />
                  </div>
                  <div style={s.videoInfo}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <div style={s.videoTitle}>{v.title}</div>
                      <span style={{ ...s.videoCat, background: v.category === 'nutrition' ? 'rgba(76,142,175,0.15)' : 'rgba(201,168,76,0.12)', color: v.category === 'nutrition' ? '#4c8eaf' : '#c9a84c' }}>{v.category}</span>
                    </div>
                    {v.description && <p style={s.videoDesc}>{v.description}</p>}
                    {v.duration_seconds && <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.4rem' }}>⏱ {formatDuration(v.duration_seconds)}</div>}
                  </div>
                </div>
              ))}
              {filteredVideos.length === 0 && (
                <div style={s.emptyState}>
                  <p>No videos in this category yet. Check back soon!</p>
                </div>
              )}
            </div>
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
                  <input value={checkInNote} onChange={e => setCheckInNote(e.target.value)} placeholder="How are you feeling today?" />
                </div>
              </div>
              <button className="btn-primary" onClick={handleCheckIn}>Log Check-In</button>
            </div>
            <div style={s.checkInList}>
              {checkins.map(c => (
                <div key={c.id} style={s.checkInRow}>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', color: '#c9a84c' }}>{c.weight_lbs} <span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontFamily: "'DM Sans', sans-serif" }}>lbs</span></span>
                  <span style={{ color: 'var(--muted)', fontSize: '0.85rem', flex: 1 }}>{c.notes}</span>
                  <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>{new Date(c.checked_in_at).toLocaleDateString()}</span>
                </div>
              ))}
              {checkins.length === 0 && <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>No check-ins yet. Log your first one above!</p>}
            </div>
          </div>
        )}

        {/* MESSAGES TAB */}
        {tab === 'messages' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 5rem)' }}>
            <h1 style={{ ...s.pageTitle, marginBottom: '1rem' }}>Messages with Sawyer</h1>
            <div style={s.chatWrap}>
              <div style={s.chatMessages}>
                {messages.length === 0 && (
                  <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '3rem', fontSize: '0.9rem' }}>
                    No messages yet — send Sawyer a message about your goals, questions, or progress!
                  </div>
                )}
                {messages.map(m => (
                  <div key={m.id} style={{ display: 'flex', justifyContent: m.sender === 'member' ? 'flex-end' : 'flex-start', marginBottom: '0.75rem' }}>
                    {m.sender === 'sawyer' && (
                      <div style={s.avatarSmall}>S</div>
                    )}
                    <div style={{ ...s.bubble, ...(m.sender === 'member' ? s.bubbleMember : s.bubbleSawyer) }}>
                      <div style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{m.body}</div>
                      <div style={{ fontSize: '0.65rem', opacity: 0.6, marginTop: '0.3rem', textAlign: m.sender === 'member' ? 'right' : 'left' }}>
                        {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(m.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div style={s.chatInput}>
                <input
                  value={msgInput}
                  onChange={e => setMsgInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Message Sawyer..."
                  style={{ flex: 1, borderRadius: '2px' }}
                />
                <button className="btn-primary" onClick={sendMessage} disabled={sendingMsg} style={{ padding: '0.75rem 1.5rem', whiteSpace: 'nowrap' }}>
                  {sendingMsg ? '...' : 'Send'}
                </button>
              </div>
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
  sidebarLogo: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', letterSpacing: '0.1em', color: '#c9a84c', marginBottom: '2rem', paddingLeft: '0.5rem' },
  nav: { display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 },
  navBtn: { background: 'none', border: 'none', color: 'var(--muted)', padding: '0.7rem 0.75rem', textAlign: 'left', fontSize: '0.85rem', borderRadius: '4px', transition: 'all 0.15s', cursor: 'pointer' },
  navActive: { background: 'var(--surface2)', color: 'var(--white)' },
  sidebarFooter: { borderTop: '1px solid var(--border)', paddingTop: '1rem' },
  memberName: { fontSize: '0.85rem', fontWeight: '500', color: 'var(--white)' },
  memberTier: { fontSize: '0.72rem', color: '#c9a84c', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.2rem' },
  main: { flex: 1, padding: '2.5rem 3rem', overflowY: 'auto' },
  pageTitle: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', letterSpacing: '0.04em', color: 'var(--white)', marginBottom: '2rem' },
  planHeader: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' },
  planTitle: { fontSize: '1.1rem', fontWeight: '500' },
  badge: { background: 'rgba(201,168,76,0.12)', color: '#c9a84c', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.3rem 0.75rem', borderRadius: '2px' },
  daysGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' },
  dayCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' },
  dayHeader: { background: 'var(--surface2)', padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  dayName: { fontWeight: '500', fontSize: '0.9rem' },
  dayFocus: { fontSize: '0.72rem', color: '#c9a84c', textTransform: 'uppercase', letterSpacing: '0.08em' },
  exerciseList: { padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  exercise: { paddingBottom: '0.75rem' },
  exName: { fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.2rem' },
  exDetail: { fontSize: '0.8rem' },
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
  mealCals: { fontSize: '0.75rem', color: '#c9a84c' },
  foodList: { padding: '0.75rem 1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' },
  foodItem: { background: 'var(--surface2)', border: '1px solid var(--border)', padding: '0.3rem 0.75rem', borderRadius: '2px', fontSize: '0.8rem', color: 'var(--muted)' },
  checkInForm: { background: 'var(--surface)', border: '1px solid var(--border)', padding: '1.5rem', borderRadius: '4px', marginBottom: '2rem' },
  checkInList: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  checkInRow: { background: 'var(--surface)', border: '1px solid var(--border)', padding: '1rem 1.25rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '1.5rem' },
  label: { display: 'block', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.4rem' },
  videoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' },
  videoCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' },
  videoEmbed: { position: 'relative', paddingBottom: '56.25%', height: 0 },
  videoInfo: { padding: '1rem' },
  videoTitle: { fontSize: '0.9rem', fontWeight: '500', lineHeight: 1.4 },
  videoDesc: { fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.6, marginTop: '0.4rem' },
  videoCat: { fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.2rem 0.6rem', borderRadius: '2px', flexShrink: 0 },
  filterBtn: { background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)', padding: '0.5rem 1.25rem', borderRadius: '2px', fontSize: '0.8rem', cursor: 'pointer', letterSpacing: '0.05em' },
  filterActive: { background: 'rgba(201,168,76,0.12)', border: '1px solid #c9a84c', color: '#c9a84c' },
  chatWrap: { display: 'flex', flexDirection: 'column', flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' },
  chatMessages: { flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', minHeight: '300px', maxHeight: '60vh' },
  chatInput: { display: 'flex', gap: '0.75rem', padding: '1rem', borderTop: '1px solid var(--border)', background: 'var(--surface2)' },
  bubble: { maxWidth: '70%', padding: '0.75rem 1rem', borderRadius: '4px', wordBreak: 'break-word' },
  bubbleMember: { background: '#c9a84c', color: '#0a0a0a' },
  bubbleSawyer: { background: 'var(--surface2)', color: 'var(--white)', border: '1px solid var(--border)' },
  avatarSmall: { width: '28px', height: '28px', borderRadius: '50%', background: '#c9a84c', color: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, marginRight: '0.5rem', flexShrink: 0, alignSelf: 'flex-end' },
}
