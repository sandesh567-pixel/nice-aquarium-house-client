import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { fetchMyOrders } from '../services/orderService'
import { useAuth } from '../context/AuthContext'
import EmptyState from '../components/ui/EmptyState'
import StatusBadge, { formatOrderDate } from '../components/order/StatusBadge'
import { AlertTriangle, Info } from '../utils/icons.jsx'

export default function MyOrders() {
  const { isAuthenticated, loading: authLoading, apiConfigured } = useAuth()
  const [orders, setOrders] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!apiConfigured || !isAuthenticated) return
    let active = true
    setError(null)
    fetchMyOrders()
      .then((data) => { if (active) setOrders(data) })
      .catch((err) => { if (active) setError(err.message) })
    return () => { active = false }
  }, [apiConfigured, isAuthenticated])

  if (apiConfigured && !authLoading && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: '/account/orders' }} replace />
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6 sm:py-10">
      <h1 className="font-display text-2xl sm:text-3xl text-ink mb-6">My Orders</h1>

      {!apiConfigured ? (
        <div className="flex items-start gap-2 rounded-xl bg-sand/10 border border-sand/30 p-3 text-xs text-sand-dark">
          <Info size={16} className="shrink-0 mt-0.5" />
          <p>No backend is connected yet, so order history isn't available in this demo.</p>
        </div>
      ) : error ? (
        <div className="flex items-start gap-2 rounded-xl bg-coral/10 border border-coral/30 p-3 text-sm text-coral">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <p>Couldn't load your orders right now ({error}). Please try again later.</p>
        </div>
      ) : orders === null ? (
        <div className="space-y-4 animate-pulse">
          {[0, 1, 2].map((i) => (
            <div key={i} className="border border-mist rounded-2xl p-4 space-y-2">
              <div className="h-3 w-1/3 bg-mist rounded" />
              <div className="h-3 w-1/2 bg-mist rounded" />
              <div className="h-3 w-1/4 bg-mist rounded" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState emoji="📦" title="No orders yet" message="Once you place an order, it will show up here." actionLabel="Start Shopping" actionTo="/shop" />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-mist rounded-2xl p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div>
                  <p className="font-mono text-sm font-medium text-lagoon-dark">#{order.orderNumber}</p>
                  <p className="text-xs text-ink/50">{formatOrderDate(order.createdAt)}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <ul className="space-y-1 mb-3">
                {order.items.map((item, i) => (
                  <li key={i} className="flex justify-between text-sm text-ink/70">
                    <span>{item.name} <span className="text-ink/40">× {item.qty}</span></span>
                    <span className="font-mono shrink-0">Rs. {(item.price * item.qty).toLocaleString('en-IN')}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between pt-3 border-t border-mist">
                <span className="text-sm text-ink/60">Total</span>
                <span className="font-mono font-semibold text-ink">Rs. {order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-ink/40 mt-6">
        Need to track a specific delivery by order number instead?{' '}
        <Link to="/orders/track" className="text-lagoon-dark hover:underline">Use order tracking</Link>.
      </p>
    </div>
  )
}
