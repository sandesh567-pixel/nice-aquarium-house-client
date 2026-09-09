import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchDashboardStats } from '../services/adminService'
import { useAuth } from '../context/AuthContext'
import AdminGuard from '../components/admin/AdminGuard'
import {
  AlertTriangle, Info, DollarSign, ShoppingCart, Users, Package, TrendingUp, ChevronRight, Tags,
} from '../utils/icons.jsx'

const CARDS = [
  { key: 'totalSales', label: 'Total Sales', icon: DollarSign, format: (v) => `Rs. ${v.toLocaleString('en-IN')}`, accent: 'bg-reef/10 text-reef' },
  { key: 'orders', label: 'Orders', icon: ShoppingCart, format: (v) => v.toLocaleString('en-IN'), accent: 'bg-lagoon/10 text-lagoon-dark' },
  { key: 'customers', label: 'Customers', icon: Users, format: (v) => v.toLocaleString('en-IN'), accent: 'bg-lagoon/10 text-lagoon-dark' },
  { key: 'products', label: 'Products', icon: Package, format: (v) => v.toLocaleString('en-IN'), accent: 'bg-sand/10 text-sand-dark' },
  { key: 'lowStock', label: 'Low Stock', icon: AlertTriangle, format: (v) => v.toLocaleString('en-IN'), accent: 'bg-coral/10 text-coral' },
]

export default function AdminDashboard() {
  const { user, isAuthenticated, apiConfigured } = useAuth()
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)

  const isAdmin = isAuthenticated && user?.role === 'admin'

  useEffect(() => {
    if (!apiConfigured || !isAdmin) return
    let active = true
    setError(null)
    fetchDashboardStats()
      .then((data) => { if (active) setStats(data) })
      .catch((err) => { if (active) setError(err.message) })
    return () => { active = false }
  }, [apiConfigured, isAdmin])

  return (
    <AdminGuard>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp size={22} className="text-lagoon-dark" />
          <h1 className="font-display text-2xl sm:text-3xl text-ink">Admin Dashboard</h1>
        </div>

        {!apiConfigured ? (
          <div className="flex items-start gap-2 rounded-xl bg-sand/10 border border-sand/30 p-3 text-xs text-sand-dark">
            <Info size={16} className="shrink-0 mt-0.5" />
            <p>No backend is connected yet, so dashboard stats aren't available in this demo.</p>
          </div>
        ) : error ? (
          <div className="flex items-start gap-2 rounded-xl bg-coral/10 border border-coral/30 p-3 text-sm text-coral">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <p>Couldn't load dashboard stats right now ({error}). Please try again later.</p>
          </div>
        ) : stats === null ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 animate-pulse">
            {CARDS.map((c) => (
              <div key={c.key} className="border border-mist rounded-2xl p-4 space-y-3">
                <div className="h-8 w-8 rounded-full bg-mist" />
                <div className="h-4 w-3/4 bg-mist rounded" />
                <div className="h-3 w-1/2 bg-mist rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {CARDS.map(({ key, label, icon: Icon, format, accent }) => (
              <div key={key} className="border border-mist rounded-2xl p-4">
                <div className={`h-9 w-9 rounded-full flex items-center justify-center mb-3 ${accent}`}>
                  <Icon size={17} />
                </div>
                <p className="font-display text-xl text-ink leading-tight">{format(stats[key] ?? 0)}</p>
                <p className="text-xs text-ink/50 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 grid sm:grid-cols-3 gap-3">
          <Link
            to="/admin/products"
            className="flex items-center justify-between rounded-2xl border border-mist bg-white p-4 sm:p-5 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-lagoon/10 flex items-center justify-center">
                <Package size={18} className="text-lagoon-dark" />
              </div>
              <div>
                <p className="font-medium text-ink text-sm">Manage Products</p>
                <p className="text-xs text-ink/50">Add, edit, and update stock</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-ink/30" />
          </Link>

          <Link
            to="/admin/orders"
            className="flex items-center justify-between rounded-2xl border border-mist bg-white p-4 sm:p-5 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-lagoon/10 flex items-center justify-center">
                <ShoppingCart size={18} className="text-lagoon-dark" />
              </div>
              <div>
                <p className="font-medium text-ink text-sm">Manage Orders</p>
                <p className="text-xs text-ink/50">Update order status</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-ink/30" />
          </Link>

          <Link
            to="/admin/categories"
            className="flex items-center justify-between rounded-2xl border border-mist bg-white p-4 sm:p-5 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-lagoon/10 flex items-center justify-center">
                <Tags size={18} className="text-lagoon-dark" />
              </div>
              <div>
                <p className="font-medium text-ink text-sm">Manage Categories</p>
                <p className="text-xs text-ink/50">Add, edit, and delete categories</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-ink/30" />
          </Link>
        </div>

        <p className="text-xs text-ink/40 mt-6">
          Payment-status management isn't built yet.
        </p>
      </div>
    </AdminGuard>
  )
}
