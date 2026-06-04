import { NavLink } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext.jsx'

const sidebarLinks = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'History', path: '/history' },
  { label: 'Analytics', path: '/analytics' },
  { label: 'Budgets', path: '/budgets' },
  { label: 'Settings', path: '/settings' },
]

export default function Sidebar() {
  const { logout, user } = useAuthContext()

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">Smart Expense</div>
      <nav className="sidebar-nav" aria-label="Primary navigation">
        {sidebarLinks.map((link) => (
          <NavLink key={link.path} to={link.path}>
            {link.label}
          </NavLink>
        ))}
      </nav>
      {user ? (
        <div style={{ marginTop: 24 }}>
          <div style={{ color: '#6b7280', marginBottom: 12 }}>Signed in as</div>
          <div style={{ color: '#111827', fontWeight: 700, marginBottom: 16 }}>{user.name}</div>
          <button
            type="button"
            onClick={logout}
            style={{ width: '100%', minHeight: 44, borderRadius: 12, border: 'none', background: '#ef4444', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      ) : null}
    </aside>
  )
}
