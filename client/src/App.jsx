import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import AdminPanel from './pages/AdminPanel'

function PrivateRoute({ children }) {
  const { member, loading } = useAuth()
  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', color:'var(--muted)' }}>Loading...</div>
  return member ? children : <Navigate to="/login" />
}

function AdminRoute({ children }) {
  const { member, loading } = useAuth()
  if (loading) return null
  return member?.is_admin ? children : <Navigate to="/dashboard" />
}

function AppRoutes() {
  const { member } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={member ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/signup" element={member ? <Navigate to="/dashboard" /> : <Signup />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
      <Route path="*" element={<Navigate to={member ? '/dashboard' : '/login'} />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
