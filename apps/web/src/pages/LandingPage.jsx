import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px', background: '#f5f7fb' }}>
      <section style={{ maxWidth: 520, width: '100%', textAlign: 'center', background: '#ffffff', borderRadius: 24, padding: '48px 36px', boxShadow: '0 24px 60px rgba(15, 23, 42, 0.08)' }}>
        <div style={{ fontSize: 44, marginBottom: 20 }}>💡</div>
        <h1 style={{ margin: 0, fontSize: 36, lineHeight: 1.1, color: '#111827' }}>Smart Expense Intelligence</h1>
        <p style={{ margin: '18px 0 32px', color: '#4b5563', fontSize: 16, lineHeight: 1.75 }}>
          Register, login, and keep your expenses organized with secure JWT authentication.
        </p>
        <div style={{ display: 'grid', gap: '14px', justifyItems: 'center' }}>
          <button
            type="button"
            onClick={() => navigate('/register')}
            style={{ minWidth: 220, minHeight: 44, borderRadius: 12, border: '1px solid #2563eb', background: '#ffffff', color: '#2563eb', fontWeight: 700, cursor: 'pointer' }}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => navigate('/login')}
            style={{ minWidth: 220, minHeight: 44, borderRadius: 12, border: 'none', background: '#2563eb', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}
          >
            Login
          </button>
        </div>
      </section>
    </main>
  )
}
