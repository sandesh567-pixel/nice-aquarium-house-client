import { NavLink } from 'react-router-dom'
import { Home, Fish, Search, Heart, ShoppingCart } from '../../utils/icons.jsx'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'

const items = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/shop', label: 'Shop', icon: Fish },
  { to: '/shop?focus=search', label: 'Search', icon: Search },
  { to: '/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/cart', label: 'Cart', icon: ShoppingCart },
]

export default function MobileBottomNav() {
  const { count } = useCart()
  const { ids } = useWishlist()

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-mist pb-[env(safe-area-inset-bottom)]"
      aria-label="Bottom navigation"
    >
      <div className="grid grid-cols-5">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={label}
            to={to}
            end={end}
            className="flex flex-col items-center justify-center gap-0.5 py-2.5 min-h-[44px] text-ink/50 [&.active]:text-lagoon-dark"
            style={({ isActive }) => ({ color: isActive ? 'var(--color-lagoon-dark)' : undefined })}
          >
            <span className="relative">
              <Icon size={22} />
              {label === 'Cart' && count > 0 && (
                <span className="absolute -top-1.5 -right-2 h-4 min-w-4 px-1 rounded-full bg-coral text-white text-[10px] leading-4 text-center">{count}</span>
              )}
              {label === 'Wishlist' && ids.length > 0 && (
                <span className="absolute -top-1.5 -right-2 h-4 min-w-4 px-1 rounded-full bg-coral text-white text-[10px] leading-4 text-center">{ids.length}</span>
              )}
            </span>
            <span className="text-[11px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
