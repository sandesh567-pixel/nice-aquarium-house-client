import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, Search, Heart, ShoppingCart, User, ChevronDown, Fish } from '../../utils/icons.jsx'
import { useCategories } from '../../context/CategoryContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useAuth } from '../../context/AuthContext'

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
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { count } = useCart()
  const { ids } = useWishlist()
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const userMenuRef = useRef(null)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const submitSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/shop?q=${encodeURIComponent(query.trim())}`)
      setSearchOpen(false)
      setMenuOpen(false)
    }
  }

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    setMenuOpen(false)
    navigate('/')
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

            {/* User / Admin dropdown (visible on both mobile and desktop) */}
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((o) => !o)}
                className="relative flex h-11 w-11 items-center justify-center text-ink rounded-full hover:bg-mist transition-colors"
                aria-label="Account menu"
                aria-expanded={userMenuOpen}
              >
                <User size={22} />
                {isAuthenticated && (
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-reef" />
                )}
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-mist bg-white shadow-lg p-2 z-50">
                  {isAuthenticated ? (
                    <>
                      <div className="px-3 py-2 border-b border-mist mb-1">
                        <p className="text-sm font-medium text-ink truncate">{user?.name || 'Account'}</p>
                        <p className="text-xs text-ink/50 truncate">{user?.email}</p>
                      </div>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-3 py-2 rounded-xl text-sm font-semibold text-lagoon-dark bg-lagoon/10 hover:bg-lagoon/20 mb-1"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <Link
                        to="/account"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-3 py-2 rounded-xl text-sm text-ink/80 hover:bg-mist hover:text-ink"
                      >
                        My Account
                      </Link>
                      <Link
                        to="/account/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-3 py-2 rounded-xl text-sm text-ink/80 hover:bg-mist hover:text-ink"
                      >
                        My Orders
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm text-coral hover:bg-coral/10 mt-1"
                      >
                        Log Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-3 py-2.5 rounded-xl text-sm font-medium text-white bg-lagoon hover:bg-lagoon-dark text-center mb-1"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-3 py-2 rounded-xl text-sm text-ink/80 hover:bg-mist hover:text-ink text-center"
                      >
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

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
          <form onSubmit={submitSearch} className="flex items-center gap-2">
            <label htmlFor="mobile-search" className="sr-only">Search products</label>
            <input
              id="mobile-search"
              type="search"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search fish, plants, gear..."
              className="flex-1 h-11 rounded-full border border-mist bg-mist/60 px-4 text-sm text-ink placeholder:text-ink/40 focus:bg-white"
            />
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="h-11 w-11 flex items-center justify-center text-ink"
              aria-label="Close search"
            >
              <X size={22} />
            </button>
          </form>
        </div>
      )}

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setMenuOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-80 max-w-[85%] bg-white shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between px-4 h-16 border-b border-mist">
              <span className="font-display text-lg text-ink">Menu</span>
              <button
                className="h-11 w-11 -mr-2 flex items-center justify-center text-ink"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Account section */}
              <div>
                {isAuthenticated ? (
                  <div className="space-y-1">
                    <div className="px-3 py-2 mb-1">
                      <p className="text-sm font-medium text-ink truncate">{user?.name || 'Account'}</p>
                      <p className="text-xs text-ink/50 truncate">{user?.email}</p>
                    </div>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-lagoon-dark bg-lagoon/10"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      to="/account"
                      onClick={() => setMenuOpen(false)}
                      className="block px-3 py-2.5 rounded-xl text-sm text-ink/80 hover:bg-mist"
                    >
                      My Account
                    </Link>
                    <Link
                      to="/account/orders"
                      onClick={() => setMenuOpen(false)}
                      className="block px-3 py-2.5 rounded-xl text-sm text-ink/80 hover:bg-mist"
                    >
                      My Orders
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-coral hover:bg-coral/10"
                    >
                      Log Out
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="h-11 flex items-center justify-center rounded-full bg-lagoon text-white text-sm font-medium"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMenuOpen(false)}
                      className="h-11 flex items-center justify-center rounded-full border border-mist text-ink text-sm font-medium"
                    >
                      Create Account
                    </Link>
                  </div>
                )}
              </div>

              {/* Shop links */}
              <nav aria-label="Mobile primary" className="space-y-1">
                {primaryLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-xl text-base font-medium text-ink hover:bg-mist"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/wishlist"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-base font-medium text-ink hover:bg-mist"
                >
                  Wishlist{ids.length > 0 ? ` (${ids.length})` : ''}
                </Link>
              </nav>

              {/* More categories */}
              {categories.length > 6 && (
                <div>
                  <p className="px-3 mb-1 text-xs font-semibold uppercase tracking-wide text-ink/40">More categories</p>
                  <div className="space-y-1">
                    {categories.slice(6).map((c) => (
                      <Link
                        key={c.slug}
                        to={`/shop?category=${c.slug}`}
                        onClick={() => setMenuOpen(false)}
                        className="block px-3 py-2 rounded-xl text-sm text-ink/70 hover:bg-mist hover:text-ink"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </header>
  )
}
