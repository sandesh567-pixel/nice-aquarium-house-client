import { Clock, CircleCheck, Package, PackageCheck, Truck, X, Info } from '../../utils/icons.jsx'

// Mirrors the `ORDER_STATUSES` enum in server/models/Order.js. Shared by
// MyOrders.jsx (customer) and AdminOrders.jsx (admin) so the status→color
// mapping and the canonical status list each live in exactly one place.
const STATUS_STYLE = {
  Pending: { icon: Clock, className: 'bg-sand/10 text-sand-dark' },
  Confirmed: { icon: CircleCheck, className: 'bg-lagoon/10 text-lagoon-dark' },
  Processing: { icon: Package, className: 'bg-lagoon/10 text-lagoon-dark' },
  Packed: { icon: PackageCheck, className: 'bg-lagoon/10 text-lagoon-dark' },
  'Out for Delivery': { icon: Truck, className: 'bg-sand/10 text-sand-dark' },
  Delivered: { icon: CircleCheck, className: 'bg-reef/10 text-reef' },
  Cancelled: { icon: X, className: 'bg-coral/10 text-coral' },
}

export const ORDER_STATUSES = Object.keys(STATUS_STYLE)

export default function StatusBadge({ status }) {
  const style = STATUS_STYLE[status] || { icon: Info, className: 'bg-mist text-ink/60' }
  const Icon = style.icon
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${style.className}`}>
      <Icon size={13} /> {status}
    </span>
  )
}

export function formatOrderDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
