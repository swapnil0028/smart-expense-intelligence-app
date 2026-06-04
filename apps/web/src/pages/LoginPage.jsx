import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext.jsx'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(email.trim(), password)
    setLoading(false)

    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.message || 'Unable to login')
    }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: '#f5f7fb' }}>
      <section style={{ width: '100%', maxWidth: 420, background: '#ffffff', borderRadius: 24, padding: 40, boxShadow: '0 24px 60px rgba(15, 23, 42, 0.08)' }}>
        <h1 style={{ margin: 0, fontSize: 30, color: '#111827' }}>Login</h1>
        <p style={{ color: '#4b5563', margin: '12px 0 24px' }}>Sign in to access your expense dashboard.</p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <label style={{ display: 'grid', gap: 8 }}>
            <span style={{ color: '#374151' }}>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              style={{ width: '100%', minHeight: 44, borderRadius: 12, border: '1px solid #d1d5db', padding: '0 14px' }}
            />
          </label>
          <label style={{ display: 'grid', gap: 8 }}>
            <span style={{ color: '#374151' }}>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              style={{ width: '100%', minHeight: 44, borderRadius: 12, border: '1px solid #d1d5db', padding: '0 14px' }}
            />
          </label>
          {error && <div style={{ color: '#dc2626' }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ minHeight: 48, borderRadius: 12, border: 'none', background: '#2563eb', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}>
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>

        <p style={{ marginTop: 20, color: '#4b5563', fontSize: 14 }}>
          Don’t have an account? <Link to="/register" style={{ color: '#2563eb' }}>Register</Link>
        </p>
      </section>
    </main>
  )
}
