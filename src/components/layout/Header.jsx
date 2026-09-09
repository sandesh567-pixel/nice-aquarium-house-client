import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, Search, Heart, ShoppingCart, User, ChevronDown, Fish } from '../../utils/icons.jsx'
import { useCategories } from '../../context/CategoryContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'

const primaryLinks = [
  { label: 'Fish', to: '/shop?category=freshwater-fish' },
  { label: 'Aquariums', to: '/shop?category=aquariums' },
  { label: 'Plants', to: '/shop?category=live-plants' },
  { label: 'Equipment', to: '/shop?category=filtration' },
  { label: 'Food', to: '/shop?category=fish-food' },
  { label: 'Guides', to: '/guides' },
]

export default function Header() {
  const { categories } = useCategories()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { count } = useCart()
  const { ids } = useWishlist()
  const navigate = useNavigate()

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const submitSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/shop?q=${encodeURIComponent(query.trim())}`)
      setSearchOpen(false)
      setMenuOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-mist">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Mobile: hamburger */}
          <button
            className="lg:hidden h-11 w-11 -ml-2 flex items-center justify-center text-ink"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="Nice Aquarium House home">
            <span className="h-9 w-9 rounded-full bg-lagoon flex items-center justify-center">
              <Fish size={19} className="text-white" strokeWidth={1.6} />
            </span>
            <span className="font-display text-lg text-ink hidden sm:block">Nice Aquarium House</span>
            <span className="font-display text-lg text-ink sm:hidden">NAH</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
            {primaryLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className="px-3 py-2 rounded-full text-sm font-medium text-ink/70 hover:text-ink hover:bg-mist transition-colors"
              >
                {link.label}
              </NavLink>
            ))}
            <div className="relative group">
              <button className="px-3 py-2 rounded-full text-sm font-medium text-ink/70 hover:text-ink hover:bg-mist transition-colors inline-flex items-center gap-1">
                More <ChevronDown size={14} />
              </button>
              <div className="absolute left-0 top-full pt-2 hidden group-hover:block group-focus-within:block">
                <div className="w-48 rounded-xl border border-mist bg-white shadow-lg p-2">
                  {categories.slice(6).map((c) => (
                    <Link key={c.slug} to={`/shop?category=${c.slug}`} className="block px-3 py-2 rounded-lg text-sm text-ink/70 hover:bg-mist hover:text-ink">
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* Desktop search */}
          <form onSubmit={submitSearch} className="hidden md:flex flex-1 max-w-xs">
            <label htmlFor="header-search" className="sr-only">Search products</label>
            <div className="relative w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
              <input
                id="header-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search fish, plants, gear..."
                className="w-full h-10 rounded-full border border-mist bg-mist/60 pl-9 pr-3 text-sm text-ink placeholder:text-ink/40 focus:bg-white"
              />
            </div>
          </form>

          <div className="flex items-center gap-1">
            <button className="md:hidden h-11 w-11 flex items-center justify-center text-ink" onClick={() => setSearchOpen(true)} aria-label="Search">
              <Search size={22} />
            </button>
            <Link to="/account" className="hidden sm:flex h-11 w-11 items-center justify-center text-ink" aria-label="Account">
              <User size={22} />
            </Link>
            <Link to="/wishlist" className="relative hidden sm:flex h-11 w-11 items-center justify-center text-ink" aria-label={`Wishlist, ${ids.length} items`}>
              <Heart size={22} />
              {ids.length > 0 && (
                <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-coral text-white text-[10px] leading-4 text-center">{ids.length}</span>
              )}
            </Link>
            <Link to="/cart" className="relative h-11 w-11 flex items-center justify-center text-ink" aria-label={`Cart, ${count} items`}>
              <ShoppingCart size={22} />
              {count > 0 && (
                <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-coral text-white text-[10px] leading-4 text-center">{count}</span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile search overlay */}
      {searchOpen && (
        <div className="md:hidden border-t border-mist bg-white p-3">
          <form onSubmit={submitSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
              <input
                autoFocus
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search fish, plants, gear..."
                className="w-full h-11 rounded-full border border-mist bg-mist/60 pl-9 pr-3 text-sm"
              />
            </div>
            <button type="button" onClick={() => setSearchOpen(false)} className="h-11 w-11 flex items-center justify-center text-ink/60" aria-label="Close search">
              <X size={20} />
            </button>
          </form>
        </div>
      )}

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setMenuOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[85%] max-w-sm bg-white overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-mist">
              <span className="font-display text-lg text-ink">Menu</span>
              <button onClick={() => setMenuOpen(false)} className="h-11 w-11 flex items-center justify-center text-ink" aria-label="Close menu">
                <X size={22} />
              </button>
            </div>
            <nav className="p-4 space-y-1" aria-label="Mobile">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink/40 px-2 pt-2 pb-1">Shop</p>
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  to={`/shop?category=${c.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-3 rounded-xl text-ink hover:bg-mist"
                >
                  {c.name}
                </Link>
              ))}
              <p className="text-xs font-semibold uppercase tracking-wide text-ink/40 px-2 pt-4 pb-1">More</p>
              <Link to="/guides" onClick={() => setMenuOpen(false)} className="block px-3 py-3 rounded-xl text-ink hover:bg-mist">Aquarium Guides</Link>
              <Link to="/setup-wizard" onClick={() => setMenuOpen(false)} className="block px-3 py-3 rounded-xl text-ink hover:bg-mist">Build Your Aquarium</Link>
              <Link to="/contact" onClick={() => setMenuOpen(false)} className="block px-3 py-3 rounded-xl text-ink hover:bg-mist">Contact</Link>
              <Link to="/about" onClick={() => setMenuOpen(false)} className="block px-3 py-3 rounded-xl text-ink hover:bg-mist">About Us</Link>
              <Link to="/account" onClick={() => setMenuOpen(false)} className="block px-3 py-3 rounded-xl text-ink hover:bg-mist">My Account</Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
