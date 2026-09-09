import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { isApiConfigured } from '../services/api'
import { useAuth } from './AuthContext'
import { fetchWishlist, addToWishlist as apiAddToWishlist, removeFromWishlist as apiRemoveFromWishlist } from '../services/wishlistService'

const WishlistContext = createContext(null)
const STORAGE_KEY = 'nah_wishlist_v1'

// Guest wishlist (no backend configured, or not signed in) lives in
// localStorage, same as before. Signed-in users with a backend configured
// get a server-backed wishlist via /api/wishlist instead. The two are
// intentionally kept separate — signing in does not merge a guest
// wishlist into the account's server wishlist; signing out reveals
// whatever guest wishlist was there before, untouched.
function readLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeLocal(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {
    /* storage unavailable */
  }
}

export function WishlistProvider({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const serverBacked = isApiConfigured() && isAuthenticated

  const [ids, setIds] = useState(() => (isApiConfigured() ? [] : readLocal()))
  const [loading, setLoading] = useState(isApiConfigured())
  const [error, setError] = useState(null)

  // Load the right source once auth state is known: server wishlist for a
  // signed-in user, localStorage otherwise. Re-runs on login/logout so a
  // page refresh never loses an authenticated user's wishlist, and logging
  // out cleanly falls back to the guest list instead of showing stale
  // server data.
  useEffect(() => {
    if (authLoading) return

    if (serverBacked) {
      let active = true
      setLoading(true)
      setError(null)
      fetchWishlist()
        .then((wishlist) => {
          if (!active) return
          setIds((wishlist.products || []).map((p) => p.id))
        })
        .catch((err) => {
          if (active) setError(err.message)
        })
        .finally(() => {
          if (active) setLoading(false)
        })
      return () => { active = false }
    }

    setIds(readLocal())
    setLoading(false)
    setError(null)
  }, [serverBacked, authLoading])

  // Persist to localStorage only in guest mode — server mode's source of
  // truth is the backend, not the browser.
  useEffect(() => {
    if (!serverBacked) writeLocal(ids)
  }, [ids, serverBacked])

  const toggle = useCallback((id) => {
    setIds((prev) => {
      const alreadyIn = prev.includes(id)
      const next = alreadyIn ? prev.filter((x) => x !== id) : [...prev, id]

      if (serverBacked) {
        const call = alreadyIn ? apiRemoveFromWishlist(id) : apiAddToWishlist(id)
        call.catch((err) => {
          setError(err.message)
          // Revert the optimistic update if the server call failed.
          setIds((current) => (alreadyIn ? [...current, id] : current.filter((x) => x !== id)))
        })
      }
      return next
    })
  }, [serverBacked])

  const remove = useCallback((id) => {
    setIds((prev) => prev.filter((x) => x !== id))
    if (serverBacked) {
      apiRemoveFromWishlist(id).catch((err) => {
        setError(err.message)
        setIds((current) => (current.includes(id) ? current : [...current, id]))
      })
    }
  }, [serverBacked])

  const isWishlisted = (id) => ids.includes(id)

  return (
    <WishlistContext.Provider value={{ ids, toggle, isWishlisted, remove, loading, error, isServerBacked: serverBacked }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
