import { NavLink } from 'react-router-dom'

const sidebarLinks = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'History', path: '/history' },
  { label: 'Analytics', path: '/analytics' },
  { label: 'Budgets', path: '/budgets' },
  { label: 'Settings', path: '/settings' },
]

export default function Sidebar() {
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
    </aside>
  )
}
