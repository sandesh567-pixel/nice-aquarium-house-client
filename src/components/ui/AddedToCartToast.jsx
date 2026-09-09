import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check } from '../../utils/icons.jsx'
import { useCart } from '../../context/CartContext'

export default function AddedToCartToast() {
  const { lastAdded, clearLastAdded } = useCart()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!lastAdded) return
    setVisible(true)
    const t = setTimeout(() => setVisible(false), 3500)
    return () => clearTimeout(t)
  }, [lastAdded])

  useEffect(() => {
    if (!visible && lastAdded) {
      const t = setTimeout(clearLastAdded, 300)
      return () => clearTimeout(t)
    }
  }, [visible, lastAdded, clearLastAdded])

  if (!lastAdded) return null

  return (
    <div
      className={`fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}
      role="status"
    >
      <div className="rounded-2xl bg-ink text-white shadow-lg p-4 flex items-center gap-3">
        <span className="h-8 w-8 rounded-full bg-reef/20 text-reef flex items-center justify-center shrink-0">
          <Check size={16} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">Added to cart</p>
          <p className="text-xs text-white/60 line-clamp-1">{lastAdded.name}</p>
        </div>
        <Link to="/cart" onClick={() => setVisible(false)} className="text-xs font-semibold text-lagoon-light shrink-0">
          View Cart
        </Link>
      </div>
    </div>
  )
}
