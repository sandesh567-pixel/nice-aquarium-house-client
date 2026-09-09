import { Link, Navigate } from 'react-router-dom'
import { User, Package, Heart, MapPin, Settings, LogOut, LayoutDashboard } from '../utils/icons.jsx'
import { useAuth } from '../context/AuthContext'

const sections = [
  { icon: Package, label: 'My Orders', desc: 'View past and current orders', to: '/account/orders' },
  { icon: Heart, label: 'Wishlist', desc: 'Products you have saved', to: '/wishlist' },
  { icon: MapPin, label: 'Addresses', desc: 'Manage delivery addresses', to: '#' },
  { icon: Settings, label: 'Account Settings', desc: 'Update your details', to: '#' },
]

export default function Account() {
  const { user, loading, isAuthenticated, apiConfigured, logout } = useAuth()

  if (apiConfigured && !loading && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: '/account' }} replace />
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-14 w-14 rounded-full bg-lagoon/10 flex items-center justify-center">
          <User size={26} className="text-lagoon-dark" />
        </div>
        <div className="flex-1">
          <h1 className="font-display text-xl text-ink">{user ? user.name : 'My Account'}</h1>
          <p className="text-sm text-ink/50">
            {isAuthenticated
              ? user.email
              : 'No backend connected yet — this is a preview of the account dashboard.'}
          </p>
        </div>
        {isAuthenticated && (
          <button onClick={logout} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-coral h-10 px-3 rounded-full border border-mist">
            <LogOut size={15} /> Log out
          </button>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {sections.map(({ icon: Icon, label, desc, to }) => (
          <Link key={label} to={to} className="flex items-start gap-3 rounded-2xl border border-mist bg-white p-4 hover:shadow-sm transition-shadow">
            <div className="h-10 w-10 rounded-full bg-mist flex items-center justify-center shrink-0">
              <Icon size={18} className="text-ink/60" />
            </div>
            <div>
              <p className="font-medium text-ink text-sm">{label}</p>
              <p className="text-xs text-ink/50">{desc}</p>
            </div>
          </Link>
        ))}
        {user?.role === 'admin' && (
          <Link to="/admin" className="flex items-start gap-3 rounded-2xl border border-lagoon/30 bg-lagoon/5 p-4 hover:shadow-sm transition-shadow">
            <div className="h-10 w-10 rounded-full bg-lagoon/15 flex items-center justify-center shrink-0">
              <LayoutDashboard size={18} className="text-lagoon-dark" />
            </div>
            <div>
              <p className="font-medium text-ink text-sm">Admin Dashboard</p>
              <p className="text-xs text-ink/50">Sales, orders, customers and product stats</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}
