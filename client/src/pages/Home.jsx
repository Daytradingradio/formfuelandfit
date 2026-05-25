import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#f5f2ee', fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 4rem', background: 'linear-gradient(to bottom, rgba(10,10,10,0.95) 0%, transparent 100%)' }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', letterSpacing: '0.12em', color: '#c9a84c' }}>Form, Fuel & Fit</div>
        <div style={{ display: 'flex', gap: '2.5rem', listStyle: 'none' }}>
          {['Goals','About','Plans','Nutrition','Training'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: 'rgba(245,242,238,0.85)', textDecoration: 'none', fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{l}</a>
          ))}
        </div>
        <button onClick={() => navigate('/signup')} style={{ background: '#c9a84c', color: '#0a0a0a', padding: '0.6rem 1.6rem', borderRadius: '2px', fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>Get Started</button>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 4rem 6rem', paddingTop: '120px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'url("/images/sawyer_hero.jpg") center 15% / 75% auto no-repeat' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0.5) 50%, rgba(10,10,10,0.7) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '80px 80px', maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 30%, transparent 100%)' }} />

        <div style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative', zIndex: 1 }}>
          <span style={{ display: 'block', width: '40px', height: '1px', background: '#c9a84c' }} />
          Online Personal Training
        </div>

        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(5rem, 12vw, 10rem)', lineHeight: 0.92, letterSpacing: '0.02em', color: '#f5f2ee', position: 'relative', zIndex: 1, margin: 0 }}>
          Build<br />Your<br /><span style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic', color: '#c9a84c', fontSize: '0.75em' }}>Best Body.</span>
        </h1>

        <p style={{ marginTop: '2rem', maxWidth: '480px', fontSize: '1rem', color: 'rgba(245,242,238,0.85)', lineHeight: 1.7, position: 'relative', zIndex: 1 }}>
          Custom workout programs and precision nutrition plans designed by Sawyer Kurisko — 5 years of real training, real results, built around your goals.
        </p>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '2.5rem', position: 'relative', zIndex: 1 }}>
          <button onClick={() => navigate('/signup')} style={{ background: '#c9a84c', color: '#0a0a0a', padding: '1rem 2.5rem', borderRadius: '2px', fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>Start Today</button>
          <button onClick={() => document.getElementById('goals').scrollIntoView({ behavior: 'smooth' })} style={{ background: 'transparent', color: '#f5f2ee', padding: '1rem 2.5rem', borderRadius: '2px', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}>View Programs</button>
        </div>

        <div style={{ position: 'absolute', right: '4rem', bottom: '6rem', display: 'flex', flexDirection: 'column', gap: '2rem', zIndex: 1 }}>
          {[['5+','Years Training'],['3','Program Goals'],['100%','Custom Plans']].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.8rem', lineHeight: 1, color: '#f5f2ee', letterSpacing: '0.05em' }}>{n}</div>
              <div style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(245,242,238,0.85)', marginTop: '0.2rem' }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* GOALS */}
      <section id="goals" style={{ padding: '7rem 4rem' }}>
        <div style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ display: 'block', width: '30px', height: '1px', background: '#c9a84c' }} />What's Your Goal
        </div>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1, letterSpacing: '0.04em', color: '#f5f2ee', marginBottom: '3.5rem' }}>Choose Your Path</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {[
            { icon: '💪', title: 'Build Muscle', desc: 'Progressive overload programs built to add lean mass. Structured splits, compound lifts, and recovery protocols.' },
            { icon: '🔥', title: 'Lose Weight', desc: 'Fat loss programs that protect muscle. Caloric strategies, cardio integration, and sustainable habit building.' },
            { icon: '🥗', title: 'Clean Nutrition', desc: 'Personalized macro targets and daily meal frameworks. Fueling performance and body composition together.' },
            { icon: '⚡', title: 'Body Sculpting', desc: 'Shape and define specific muscle groups. Targeted programs that create the look you\'re working toward.' },
          ].map(g => (
            <div key={g.title} style={{ background: '#111111', padding: '2.5rem 2rem', cursor: 'pointer', transition: 'background 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#161616'}
              onMouseLeave={e => e.currentTarget.style.background = '#111111'}>
              <span style={{ fontSize: '2rem', marginBottom: '1.5rem', display: 'block' }}>{g.icon}</span>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.6rem', letterSpacing: '0.05em', color: '#f5f2ee', marginBottom: '0.75rem' }}>{g.title}</div>
              <p style={{ fontSize: '0.85rem', color: 'rgba(245,242,238,0.85)', lineHeight: 1.7 }}>{g.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: '7rem 4rem', background: '#161616' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <img src="/images/sawyer_about.jpg" style={{ width: '100%', maxHeight: '480px', objectFit: 'cover', objectPosition: 'center 25%', display: 'block', borderRadius: '2px' }} alt="Sawyer Kurisko" />
            <div style={{ position: 'absolute', bottom: '-1.5rem', right: '-1.5rem', width: '60%', height: '60%', border: '1px solid rgba(201,168,76,0.15)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '2rem', left: '-2rem', background: '#c9a84c', color: '#0a0a0a', padding: '1.5rem', textAlign: 'center', width: '90px' }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', lineHeight: 1, display: 'block' }}>5</span>
              <span style={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, display: 'block', marginTop: '0.2rem' }}>Years Dedicated</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ display: 'block', width: '30px', height: '1px', background: '#c9a84c' }} />Your Coach
            </div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', lineHeight: 1, letterSpacing: '0.04em', color: '#f5f2ee', marginBottom: '1.5rem' }}>
              Meet <span style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic', color: '#c9a84c' }}>Sawyer</span><br />Kurisko
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'rgba(245,242,238,0.85)', lineHeight: 1.8, marginBottom: '1.25rem' }}>At 19, Sawyer Kurisko has spent the last five years building something most people spend a lifetime chasing — a disciplined, structured approach to training and nutrition that actually works.</p>
            <p style={{ fontSize: '0.95rem', color: 'rgba(245,242,238,0.85)', lineHeight: 1.8, marginBottom: '1.25rem' }}>No shortcuts. No fads. Just consistent effort, an obsession with proper form, and a deep understanding of how food fuels performance. What Sawyer teaches is what Sawyer lives.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '2rem' }}>
              {['Strength Training','Nutrition Coaching','Body Composition','Fat Loss','Muscle Building','Remote Coaching'].map(p => (
                <span key={p} style={{ padding: '0.4rem 1rem', border: '1px solid rgba(255,255,255,0.08)', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(245,242,238,0.85)' }}>{p}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="plans" style={{ padding: '7rem 4rem' }}>
        <div style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ display: 'block', width: '30px', height: '1px', background: '#c9a84c' }} />Membership Plans
        </div>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1, letterSpacing: '0.04em', color: '#f5f2ee', marginBottom: '3.5rem' }}>Choose Your Level</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {[
            { tier: 'Essential', price: 30, featured: false, features: ['Custom workout plan (updated monthly)','Personalized meal plan + macros','Member dashboard access','Workout logging & tracking','Program updates as you progress'] },
            { tier: 'Pro', price: 75, featured: true, features: ['Everything in Essential','Bi-weekly check-in calls with Sawyer','Weekly plan adjustments','Direct messaging support','Form review (video feedback)','Nutrition diary review'] },
            { tier: 'Elite', price: 150, featured: false, features: ['Everything in Pro','Weekly 1-on-1 video calls','Fully custom daily meal plans','Priority response (24hr)','Supplement guidance','Unlimited plan revisions'] },
          ].map(p => (
            <div key={p.tier} style={{ background: p.featured ? 'linear-gradient(160deg, rgba(201,168,76,0.06) 0%, #161616 60%)' : '#161616', border: p.featured ? '1px solid #c9a84c' : '1px solid rgba(255,255,255,0.08)', padding: '2.5rem 2rem', position: 'relative' }}>
              {p.featured && <div style={{ position: 'absolute', top: '-1px', left: '50%', transform: 'translateX(-50%)', background: '#c9a84c', color: '#0a0a0a', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500, padding: '0.3rem 1rem' }}>Most Popular</div>}
              <div style={{ fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,242,238,0.85)', marginBottom: '1rem' }}>{p.tier}</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '4rem', lineHeight: 1, color: '#f5f2ee', letterSpacing: '0.02em' }}><sup style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.2rem', verticalAlign: 'top', marginTop: '0.5rem' }}>$</sup>{p.price}</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(245,242,238,0.85)', marginBottom: '2rem' }}>per month</div>
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '1.5rem 0' }} />
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {p.features.map(f => (
                  <li key={f} style={{ fontSize: '0.85rem', color: 'rgba(245,242,238,0.85)', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <span style={{ color: '#c9a84c', fontSize: '0.75rem', marginTop: '0.15rem', flexShrink: 0 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/signup')} style={{ display: 'block', width: '100%', padding: '0.9rem', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, cursor: 'pointer', borderRadius: '1px', background: p.featured ? '#c9a84c' : 'transparent', color: p.featured ? '#0a0a0a' : '#f5f2ee', border: p.featured ? 'none' : '1px solid rgba(255,255,255,0.08)' }}>Get Started</button>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '7rem 4rem', background: '#161616' }}>
        <div style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ display: 'block', width: '30px', height: '1px', background: '#c9a84c' }} />The Process
        </div>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1, letterSpacing: '0.04em', color: '#f5f2ee', marginBottom: '3.5rem' }}>How It Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {[
            ['01','Sign Up & Tell Us Your Goals','Pick your plan and fill out a quick intake form about your goals, experience, and schedule.'],
            ['02','Sawyer Builds Your Program','Within 48 hours you get a fully custom workout and meal plan built specifically for you.'],
            ['03','Train, Log & Track','Log your workouts in your dashboard. Track your nutrition. See your progress week by week.'],
            ['04','Progress & Evolve','Sawyer reviews your progress and updates your plan to keep you moving forward every month.'],
          ].map(([n, t, d], i, arr) => (
            <div key={n} style={{ padding: '2.5rem 2rem', borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '4rem', lineHeight: 1, color: 'rgba(255,255,255,0.08)', letterSpacing: '0.05em', marginBottom: '1rem' }}>{n}</div>
              <div style={{ fontSize: '1rem', fontWeight: 500, color: '#f5f2ee', marginBottom: '0.75rem' }}>{t}</div>
              <p style={{ fontSize: '0.85rem', color: 'rgba(245,242,238,0.85)', lineHeight: 1.7 }}>{d}</p>
            </div>
          ))}
        </div>
      </section>


      {/* IN-PERSON & VIRTUAL TRAINING */}
      <section id="training" style={{ padding: '7rem 4rem', background: '#0a0a0a' }}>
        <div style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ display: 'block', width: '30px', height: '1px', background: '#c9a84c' }} />1-on-1 Training
        </div>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1, letterSpacing: '0.04em', color: '#f5f2ee', marginBottom: '1rem' }}>Train With Sawyer</h2>
        <p style={{ fontSize: '1rem', color: 'rgba(245,242,238,0.85)', maxWidth: '600px', lineHeight: 1.7, marginBottom: '4rem' }}>
          Want the full hands-on experience? Sawyer trains clients in-person across the Tri-State Area — New York, New Jersey, and Connecticut. Or book a virtual session from anywhere in the world.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '4rem' }}>

          {/* IN-PERSON CARD */}
          <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)', padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: '#c9a84c' }} />
            <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>🏋️</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', letterSpacing: '0.05em', color: '#f5f2ee', marginBottom: '0.5rem' }}>In-Person Training</div>
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: '1.5rem' }}>Tri-State Area · NY · NJ · CT</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3rem', color: '#f5f2ee', lineHeight: 1, marginBottom: '0.25rem' }}>
              <sup style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.2rem', verticalAlign: 'top', marginTop: '0.5rem' }}>$</sup>50
            </div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(245,242,238,0.85)', marginBottom: '2rem' }}>per session · 60–90 minutes</div>
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '1.5rem 0' }} />
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              {[
                'Full 60–90 minute 1-on-1 session',
                'Custom training program provided',
                'Form correction & technique coaching',
                'Available at your gym or local gym',
                'Serving NY, NJ & CT area',
                'Flexible scheduling — morning & evening',
              ].map(f => (
                <li key={f} style={{ fontSize: '0.85rem', color: 'rgba(245,242,238,0.85)', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <span style={{ color: '#c9a84c', flexShrink: 0, marginTop: '0.1rem' }}>✓</span>{f}
                </li>
              ))}
            </ul>
            <a href="https://calendly.com/sawyerkurisko/in-person-training" target="_blank" rel="noopener noreferrer"
              style={{ display: 'block', textAlign: 'center', padding: '1rem', background: '#c9a84c', color: '#0a0a0a', fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: '2px', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#e8c97a'}
              onMouseLeave={e => e.currentTarget.style.background = '#c9a84c'}>
              Book In-Person Session
            </a>
          </div>

          {/* VIRTUAL CARD */}
          <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)', padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: '#4c8eaf' }} />
            <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>💻</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', letterSpacing: '0.05em', color: '#f5f2ee', marginBottom: '0.5rem' }}>Virtual Training</div>
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#4c8eaf', marginBottom: '1.5rem' }}>Train From Anywhere · Zoom / FaceTime</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3rem', color: '#f5f2ee', lineHeight: 1, marginBottom: '0.25rem' }}>
              <sup style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.2rem', verticalAlign: 'top', marginTop: '0.5rem' }}>$</sup>50
            </div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(245,242,238,0.85)', marginBottom: '2rem' }}>per session · 60–90 minutes</div>
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '1.5rem 0' }} />
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              {[
                'Full 60–90 minute live video session',
                'Real-time form coaching via camera',
                'Custom program emailed after session',
                'Train from your home or any gym',
                'Available worldwide — any timezone',
                'Zoom or FaceTime — your choice',
              ].map(f => (
                <li key={f} style={{ fontSize: '0.85rem', color: 'rgba(245,242,238,0.85)', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <span style={{ color: '#4c8eaf', flexShrink: 0, marginTop: '0.1rem' }}>✓</span>{f}
                </li>
              ))}
            </ul>
            <a href="https://calendly.com/sawyerkurisko/virtual-training" target="_blank" rel="noopener noreferrer"
              style={{ display: 'block', textAlign: 'center', padding: '1rem', background: 'transparent', color: '#f5f2ee', fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: '2px', border: '1px solid rgba(255,255,255,0.2)', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#4c8eaf'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}>
              Book Virtual Session
            </a>
          </div>
        </div>

        {/* SESSION PACKAGES */}
        <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)', padding: '2.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '2rem', marginBottom: '2rem' }}>
            {[
              { sessions: '1', price: '$50', label: 'Single Session', note: 'Try it out' },
              { sessions: '5', price: '$225', label: '5-Session Pack', note: 'Save $25' },
              { sessions: '10', price: '$400', label: '10-Session Pack', note: 'Save $100' },
              { sessions: '20', price: '$700', label: '20-Session Pack', note: 'Best value — save $300' },
            ].map((p, i, arr) => (
              <div key={p.sessions} style={{ padding: '1.5rem 2rem', borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', color: '#f5f2ee', lineHeight: 1 }}>{p.price}</div>
                <div style={{ fontWeight: 500, fontSize: '0.9rem', margin: '0.5rem 0 0.25rem' }}>{p.label}</div>
                <div style={{ fontSize: '0.75rem', color: '#c9a84c' }}>{p.note}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.85rem', color: 'rgba(245,242,238,0.85)', marginBottom: '1.5rem' }}>
              All packages available for in-person or virtual sessions. Payment collected at time of booking.
            </p>
            <a href="https://calendly.com/sawyerkurisko" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-block', padding: '1rem 3rem', background: '#c9a84c', color: '#0a0a0a', fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: '2px' }}>
              View All Available Times →
            </a>
          </div>
        </div>

        {/* WHAT TO EXPECT */}
        <div style={{ marginTop: '4rem' }}>
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', letterSpacing: '0.04em', color: '#f5f2ee', marginBottom: '2rem' }}>What to Expect</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {[
              { icon: '📋', title: 'Before Your Session', desc: 'You'll receive a short intake form covering your goals, fitness level, and any injuries. Sawyer reviews it before you meet so every minute of your session is dialed in.' },
              { icon: '⚡', title: 'During Your Session', desc: 'Expect to work hard. Every session is structured — warmup, main lifts, accessory work, and a cooldown. Sawyer coaches your form rep by rep and pushes you to your limit.' },
              { icon: '📱', title: 'After Your Session', desc: 'You'll get a full written breakdown of what you did, what to work on, and your next session plan. Plus direct access to Sawyer via the member messaging system.' },
            ].map(w => (
              <div key={w.title} style={{ background: '#111111', padding: '2.5rem 2rem' }}>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }}>{w.icon}</span>
                <div style={{ fontWeight: 500, fontSize: '1rem', color: '#f5f2ee', marginBottom: '0.75rem' }}>{w.title}</div>
                <p style={{ fontSize: '0.85rem', color: 'rgba(245,242,238,0.85)', lineHeight: 1.7 }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '3rem 4rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', letterSpacing: '0.12em', color: '#c9a84c' }}>Form, Fuel & Fit</div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {['Programs','About','Pricing','Contact','Instagram'].map(l => (
            <a key={l} href="#" style={{ fontSize: '0.75rem', color: 'rgba(245,242,238,0.85)', textDecoration: 'none', letterSpacing: '0.05em' }}>{l}</a>
          ))}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'rgba(245,242,238,0.85)', letterSpacing: '0.05em' }}>© 2026 Form, Fuel & Fit — Sawyer Kurisko</div>
      </footer>

    </div>
  )
}
