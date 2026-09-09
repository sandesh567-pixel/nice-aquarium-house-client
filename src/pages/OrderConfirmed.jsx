import { Link, useLocation, Navigate } from 'react-router-dom'
import { Check } from '../utils/icons.jsx'

export default function OrderConfirmed() {
  const { state } = useLocation()
  if (!state?.orderId) return <Navigate to="/" replace />

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-16 text-center">
      <div className="h-16 w-16 rounded-full bg-reef/15 text-reef flex items-center justify-center mx-auto mb-5">
        <Check size={30} />
      </div>
      <h1 className="font-display text-2xl sm:text-3xl text-ink mb-2">Order Confirmed! 🎉</h1>
      <p className="font-mono text-lagoon-dark font-medium mb-4">Order #{state.orderId}</p>
      <p className="text-ink/60 mb-1">Thank you for your order.</p>
      <p className="text-ink/60 mb-8">Estimated Delivery: <strong className="text-ink">2–4 business days</strong></p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/orders/track" state={{ orderId: state.orderId }} className="h-12 px-6 rounded-full bg-lagoon text-white font-medium flex items-center justify-center hover:bg-lagoon-dark transition-colors">
          Track Order
        </Link>
        <Link to="/shop" className="h-12 px-6 rounded-full border border-mist text-ink font-medium flex items-center justify-center hover:bg-mist transition-colors">
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}
