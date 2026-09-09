import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// Shared gate for every /admin/* page. Not signed in -> /login (remembers
// where to return to); signed in but not an admin -> /account; otherwise
// render the page. When no backend is configured there's nothing to
// gate against, so the page itself is responsible for showing its own
// "not connected" message.
export default function AdminGuard({ children }) {
  const { user, loading, isAuthenticated, apiConfigured } = useAuth()
  const location = useLocation()
  const isAdmin = isAuthenticated && user?.role === 'admin'

  if (!apiConfigured || loading) return children
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  if (!isAdmin) return <Navigate to="/account" replace />
  return children
}
