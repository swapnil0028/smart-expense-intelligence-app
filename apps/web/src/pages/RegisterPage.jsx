import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext.jsx'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuthContext()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!name.trim() || !email.trim() || !password) {
      setError('Please complete all fields')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    const result = await register(name.trim(), email.trim(), password)
    setLoading(false)

    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.message || 'Unable to register')
    }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: '#f5f7fb' }}>
      <section style={{ width: '100%', maxWidth: 420, background: '#ffffff', borderRadius: 24, padding: 40, boxShadow: '0 24px 60px rgba(15, 23, 42, 0.08)' }}>
        <h1 style={{ margin: 0, fontSize: 30, color: '#111827' }}>Register</h1>
        <p style={{ color: '#4b5563', margin: '12px 0 24px' }}>Create your account to secure your expense data.</p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <label style={{ display: 'grid', gap: 8 }}>
            <span style={{ color: '#374151' }}>Name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              style={{ width: '100%', minHeight: 44, borderRadius: 12, border: '1px solid #d1d5db', padding: '0 14px' }}
            />
          </label>
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
          <label style={{ display: 'grid', gap: 8 }}>
            <span style={{ color: '#374151' }}>Confirm Password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              style={{ width: '100%', minHeight: 44, borderRadius: 12, border: '1px solid #d1d5db', padding: '0 14px' }}
            />
          </label>
          {error && <div style={{ color: '#dc2626' }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ minHeight: 48, borderRadius: 12, border: 'none', background: '#2563eb', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}>
            {loading ? 'Creating account…' : 'Register'}
          </button>
        </form>

        <p style={{ marginTop: 20, color: '#4b5563', fontSize: 14 }}>
          Already have an account? <Link to="/login" style={{ color: '#2563eb' }}>Login</Link>
        </p>
      </section>
    </main>
  )
}
