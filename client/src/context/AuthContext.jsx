import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('fff_token')
    if (token) {
      fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.ok ? r.json() : null)
        .then(data => { if (data) setMember(data) })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)
    localStorage.setItem('fff_token', data.token)
    setMember(data.member)
    return data.member
  }

  const signup = async (fields) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields)
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)
    localStorage.setItem('fff_token', data.token)
    setMember(data.member)
    return data.member
  }

  const logout = () => {
    localStorage.removeItem('fff_token')
    setMember(null)
  }

  const getToken = () => localStorage.getItem('fff_token')

  return (
    <AuthContext.Provider value={{ member, loading, login, signup, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
