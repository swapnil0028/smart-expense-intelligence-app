import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, status } = useAuthContext()

  if (status === 'loading') {
    return <div style={{ padding: 24 }}>Loading…</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
