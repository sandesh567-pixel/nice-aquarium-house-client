import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllOrders, updateOrderStatus } from '../services/orderService'
import AdminGuard from '../components/admin/AdminGuard'
import StatusBadge, { formatOrderDate, ORDER_STATUSES } from '../components/order/StatusBadge'
import { AlertTriangle, Info, ChevronLeft, Check } from '../utils/icons.jsx'

// Status-only management, deliberately: this screen changes order.status
// and nothing else. paymentStatus is a separate field with no UI here and
// no automatic link to status changes — see PROJECT_STATUS.md /
// AI_CONTINUATION_PROMPT.md for why. Do not add a paymentStatus control
// to this file without that being its own explicit, separate task.

export default function AdminOrders() {
  const [orders, setOrders] = useState(null) // null = loading
  const [listError, setListError] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const [drafts, setDrafts] = useState({}) // orderId -> status selected but not yet saved
  const [savingId, setSavingId] = useState(null)
  const [rowError, setRowError] = useState('')

  const loadOrders = (status) => {
    setListError('')
    fetchAllOrders({ status: status || undefined })
      .then(setOrders)
      .catch((err) => setListError(err.message))
  }

  useEffect(() => {
    setOrders(null)
    loadOrders(statusFilter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter])

  const saveStatus = async (order) => {
    const next = drafts[order.id]
    if (!next || next === order.status) return
    setRowError('')
    setSavingId(order.id)
    try {
      const updated = await updateOrderStatus(order.id, next)
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: updated.status } : o)))
      setDrafts((prev) => {
        const rest = { ...prev }
        delete rest[order.id]
        return rest
      })
    } catch (err) {
      // Never claim success if the API rejected it.
      setRowError(err.message)
    } finally {
      setSavingId(null)
    }
  }

  return (
    <AdminGuard>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-10">
        <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-ink/50 hover:text-ink mb-4">
          <ChevronLeft size={15} /> Admin Dashboard
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h1 className="font-display text-2xl sm:text-3xl text-ink">Manage Orders</h1>
          <label className="flex items-center gap-2 text-sm text-ink/70">
            Status
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-lg border border-mist px-3 text-sm"
            >
              <option value="">All</option>
              {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
        </div>

        {rowError && (
          <p className="flex items-center gap-2 text-sm text-coral mb-4">
            <AlertTriangle size={15} className="shrink-0" /> {rowError}
          </p>
        )}

        {listError ? (
          <p className="flex items-center gap-2 text-sm text-coral">
            <AlertTriangle size={15} className="shrink-0" /> Couldn't load orders: {listError}
          </p>
        ) : orders === null ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => <div key={i} className="h-32 rounded-2xl bg-mist animate-pulse" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex items-start gap-2 rounded-xl bg-sand/10 border border-sand/30 p-3 text-xs text-sand-dark">
            <Info size={16} className="shrink-0 mt-0.5" />
            <p>No orders found{statusFilter ? ` with status "${statusFilter}"` : ''}.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-mist bg-white p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-mono text-sm font-medium text-lagoon-dark">#{order.orderNumber}</p>
                    <p className="text-xs text-ink/50">{formatOrderDate(order.createdAt)}</p>
                    <p className="text-xs text-ink/50 mt-1">{order.customer?.fullName} · {order.customer?.phone}</p>
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

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-mist">
                  <span className="font-mono font-semibold text-ink">Total: Rs. {order.total.toLocaleString('en-IN')}</span>

                  <div className="flex items-center gap-1.5">
                    <select
                      value={drafts[order.id] ?? order.status}
                      onChange={(e) => setDrafts((prev) => ({ ...prev, [order.id]: e.target.value }))}
                      className="h-9 rounded-lg border border-mist px-2 text-sm"
                      aria-label={`Change status for order ${order.orderNumber}`}
                    >
                      {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button
                      onClick={() => saveStatus(order)}
                      disabled={savingId === order.id || !drafts[order.id] || drafts[order.id] === order.status}
                      aria-label={`Save status for order ${order.orderNumber}`}
                      className="h-9 w-9 flex items-center justify-center rounded-lg border border-mist text-reef disabled:opacity-30"
                    >
                      <Check size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminGuard>
  )
}
