import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const member = await login(form.email, form.password)
      navigate(member.is_admin ? '/admin' : '/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={styles.logo}>Form, Fuel & Fit</div>
        <h1 style={styles.title}>Welcome back</h1>
        <p style={styles.sub}>Sign in to your training dashboard</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handle} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input type="email" required value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input type="password" required value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--gold)' }}>Sign up</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  wrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'var(--black)' },
  card: { width: '100%', maxWidth: '420px', background: 'var(--surface)', border: '1px solid var(--border)', padding: '2.5rem', borderRadius: '4px' },
  logo: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', letterSpacing: '0.1em', color: 'var(--gold)', marginBottom: '1.5rem' },
  title: { fontSize: '1.5rem', fontWeight: '500', color: 'var(--white)', marginBottom: '0.4rem' },
  sub: { fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '2rem' },
  error: { background: 'rgba(224,85,85,0.12)', border: '1px solid rgba(224,85,85,0.3)', color: '#e07777', padding: '0.75rem 1rem', borderRadius: '2px', fontSize: '0.85rem', marginBottom: '1.5rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)' },
  footer: { marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--muted)' }
}
