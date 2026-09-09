import { useEffect, useState } from 'react'
import { useWishlist } from '../context/WishlistContext'
import { fetchProductsPage } from '../services/productService'
import ProductCard from '../components/product/ProductCard'
import { ProductGridSkeleton } from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'
import { AlertTriangle } from '../utils/icons.jsx'

// The backend caps `limit` at 100 (see server/controllers/productController.js
// — Math.min(100, ...)), so this must match that real ceiling rather than
// an arbitrary larger number that would just get silently clamped. This
// comfortably covers the current 80-product catalog. If the catalog ever
// grows past 100, this same class of bug (a wishlisted product outside the
// fetched page not resolving) could resurface — the durable long-term fix
// at that point would be a dedicated "fetch products by ID list" endpoint,
// which is out of scope for the currently reported bug.
const CATALOG_FETCH_LIMIT = 100

export default function Wishlist() {
  const { ids, loading: wishlistLoading, error: wishlistError } = useWishlist()
  const [allProducts, setAllProducts] = useState(null)
  const [productsError, setProductsError] = useState(null)

  useEffect(() => {
    let active = true
    fetchProductsPage({ limit: CATALOG_FETCH_LIMIT })
      .then((data) => { if (active) setAllProducts(data.products) })
      .catch((err) => { if (active) setProductsError(err.message) })
    return () => { active = false }
  }, [])

  const loading = wishlistLoading || allProducts === null
  const items = allProducts ? allProducts.filter((p) => ids.includes(p.id)) : []

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10">
      <h1 className="font-display text-2xl sm:text-3xl text-ink mb-6">Your Wishlist</h1>

      {(wishlistError || productsError) && (
        <p className="flex items-center gap-2 text-sm text-coral mb-4">
          <AlertTriangle size={15} className="shrink-0" />
          Couldn't load your wishlist: {wishlistError || productsError}
        </p>
      )}

      {loading ? (
        <ProductGridSkeleton count={4} />
      ) : items.length === 0 ? (
        <EmptyState emoji="💙" title="No saved products yet" actionLabel="Explore Products" actionTo="/shop" />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
