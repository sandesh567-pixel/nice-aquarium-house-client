import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Heart, ShoppingCart, Minus, Plus, AlertTriangle, ChevronRight, Star, Info } from '../utils/icons.jsx'
import { fetchProductBySlug, fetchRelatedProducts } from '../services/productService'
import { fetchReviews, submitReview } from '../services/reviewService'
import { useCategories } from '../context/CategoryContext'
import { isFishCategory } from '../data/products'
import { ProductTileFor } from '../components/product/ProductTile'
import ProductCard from '../components/product/ProductCard'
import FishCard from '../components/product/FishCard'
import StarRating from '../components/ui/StarRating'
import EmptyState from '../components/ui/EmptyState'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'

const fishSpecRows = (p) => [
  ['Difficulty', p.difficulty],
  ['Adult Size', p.adultSize],
  ['Lifespan', p.lifespan],
  ['Temperature', p.temperature],
  ['pH', p.ph],
  ['Water Type', p.waterType],
  ['Minimum Tank Size', p.minimumTankSize],
  ['Diet', p.diet],
  ['Compatibility', p.compatibility],
]

const plantSpecRows = (p) => [
  ['Difficulty', p.difficulty],
  ['Lighting', p.lighting],
  ['CO₂ Requirement', p.co2],
  ['Growth Rate', p.growthRate],
  ['Placement', p.placement],
  ['Temperature', p.temperature],
  ['pH', p.ph],
  ['Height', p.height],
]

const genericSpecRows = (p) => Object.entries(p)
  .filter(([k]) => ['subcategory', 'dimensions', 'capacity', 'glassThickness', 'type', 'standIncluded', 'foodType', 'fishType', 'weight', 'feedingInstructions', 'flowRate', 'tankSize', 'spectrum', 'size', 'wattage', 'color', 'use'].includes(k))
  .map(([k, v]) => [k.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()), typeof v === 'boolean' ? (v ? 'Yes' : 'No') : v])

export default function ProductDetail() {
  const { getCategory } = useCategories()
  const { slug } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [notFound, setNotFound] = useState(false)
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState('description')
  const { addItem } = useCart()
  const { toggle, isWishlisted } = useWishlist()

  useEffect(() => {
    let active = true
    setProduct(null)
    setNotFound(false)
    setQty(1)
    setTab('description')
    fetchProductBySlug(slug).then((p) => {
      if (!active) return
      if (!p) { setNotFound(true); return }
      setProduct(p)
      fetchRelatedProducts(p).then((r) => active && setRelated(r))
    })
    return () => { active = false }
  }, [slug])

  if (notFound) {
    return <EmptyState emoji="🐠" title="Product not found" message="That product may have sold out permanently or moved." actionLabel="Back to shop" actionTo="/shop" />
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 grid sm:grid-cols-2 gap-8 animate-pulse">
        <div className="aspect-square rounded-2xl bg-mist" />
        <div className="space-y-3">
          <div className="h-4 w-1/3 bg-mist rounded" />
          <div className="h-7 w-2/3 bg-mist rounded" />
          <div className="h-5 w-1/4 bg-mist rounded" />
          <div className="h-24 w-full bg-mist rounded" />
        </div>
      </div>
    )
  }

  const category = getCategory(product.category)
  const isFish = isFishCategory(product.category)
  const outOfStock = product.stock === 0
  const wishlisted = isWishlisted(product.id)
  const specRows = isFish ? fishSpecRows(product) : product.category === 'live-plants' ? plantSpecRows(product) : genericSpecRows(product)

  const handleAddToCart = () => addItem(product, qty)
  const handleBuyNow = () => { addItem(product, qty); navigate('/checkout') }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-10">
      {/* breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-ink/50 mb-5 flex-wrap" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-ink">Home</Link>
        <ChevronRight size={12} />
        <Link to={`/shop?category=${product.category}`} className="hover:text-ink">{category?.name}</Link>
        <ChevronRight size={12} />
        <span className="text-ink/70">{product.name}</span>
      </nav>

      <div className="grid sm:grid-cols-2 gap-8 sm:gap-12">
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden">
            <ProductTileFor product={product} className="h-full w-full" />
            {isFish && product.isLive && (
              <span className="absolute top-3 right-3 rounded-full bg-ink/80 text-white text-xs font-medium px-3 py-1.5">Live Fish</span>
            )}
          </div>
          {isFish && (
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-sand/10 border border-sand/30 p-3 text-xs text-sand-dark">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <p>Live fish availability may vary based on health, weather and transportation conditions.</p>
            </div>
          )}
        </div>

        <div>
          <span className="text-sm font-medium text-lagoon-dark">{category?.name}</span>
          <h1 className="font-display text-2xl sm:text-3xl text-ink mt-1">{product.name}</h1>
          {product.scientificName && <p className="italic text-ink/50 mt-1">{product.scientificName}</p>}

          <div className="mt-3"><StarRating rating={product.rating} reviewCount={product.reviewCount} size={16} /></div>

          <div className="flex items-baseline gap-3 mt-4">
            <span className="font-mono text-2xl font-semibold text-ink">Rs. {(product.discountPrice || product.price).toLocaleString('en-IN')}</span>
            {product.discountPrice && (
              <span className="font-mono text-base text-ink/40 line-through">Rs. {product.price.toLocaleString('en-IN')}</span>
            )}
          </div>

          <p className={`mt-2 text-sm font-medium ${outOfStock ? 'text-coral' : 'text-reef'}`}>
            {outOfStock ? 'Out of stock' : `In stock — ${product.stock} available`}
          </p>

          {!outOfStock && (
            <div className="flex items-center gap-3 mt-5">
              <div className="flex items-center rounded-full border border-mist h-11">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-11 h-11 flex items-center justify-center text-ink" aria-label="Decrease quantity"><Minus size={16} /></button>
                <span className="w-8 text-center font-mono">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="w-11 h-11 flex items-center justify-center text-ink" aria-label="Increase quantity"><Plus size={16} /></button>
              </div>
              <button onClick={() => toggle(product.id)} aria-pressed={wishlisted} className="h-11 w-11 rounded-full border border-mist flex items-center justify-center shrink-0" aria-label="Toggle wishlist">
                <Heart size={19} className={wishlisted ? 'fill-coral text-coral' : 'text-ink/60'} />
              </button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-full bg-lagoon text-white font-medium hover:bg-lagoon-dark disabled:bg-mist disabled:text-ink/40 transition-colors"
            >
              <ShoppingCart size={18} /> {outOfStock ? 'Notify Me' : 'Add to Cart'}
            </button>
            {!outOfStock && (
              <button onClick={handleBuyNow} className="flex-1 h-12 rounded-full border border-lagoon text-lagoon-dark font-medium hover:bg-lagoon/5 transition-colors">
                Buy Now
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <div className="flex gap-1 border-b border-mist overflow-x-auto no-scrollbar">
          {['description', 'specifications', 'shipping', 'reviews'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`shrink-0 px-4 py-3 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${tab === t ? 'border-lagoon text-lagoon-dark' : 'border-transparent text-ink/50'}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="py-6">
          {tab === 'description' && (
            <div className="max-w-2xl text-ink/70 text-sm leading-relaxed space-y-3">
              <p>
                {isFish
                  ? `The ${product.name} is a ${product.difficulty.toLowerCase()}-friendly ${product.waterType.toLowerCase()} fish, reaching about ${product.adultSize} at full size. It does best in water around ${product.temperature} with a pH of ${product.ph}.`
                  : `${product.name} is well suited to Kathmandu's typical tap water once conditioned, and fits comfortably into most home aquarium setups.`}
              </p>
              {isFish && (
                <div>
                  <h3 className="font-medium text-ink mb-2">Care Guide</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Tank Setup:</strong> Minimum {product.minimumTankSize} tank with a secure lid.</li>
                    <li><strong>Water Requirements:</strong> {product.waterType}, {product.temperature}, pH {product.ph}.</li>
                    <li><strong>Feeding:</strong> {product.diet}.</li>
                    <li><strong>Tank Mates:</strong> {product.compatibility}.</li>
                    <li><strong>Common Problems:</strong> Sudden temperature swings and poor water quality are the most common causes of stress — test weekly.</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {tab === 'specifications' && (
            <dl className="max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              {specRows.filter(([, v]) => v != null && v !== '').map(([label, value]) => (
                <div key={label} className="flex justify-between border-b border-mist pb-2">
                  <dt className="text-ink/50">{label}</dt>
                  <dd className="text-ink font-medium text-right">{String(value)}</dd>
                </div>
              ))}
            </dl>
          )}

          {tab === 'shipping' && (
            <div className="max-w-xl text-sm text-ink/70 space-y-2">
              <p>Delivered across Kathmandu Valley in 2–4 business days. Delivery charges are calculated at checkout based on your location.</p>
              <p>{isFish ? 'Live fish are packed in insulated, oxygenated bags and delivered same-day where possible to reduce stress.' : 'Fragile items like glass tanks are double-boxed with protective padding.'}</p>
            </div>
          )}

          {tab === 'reviews' && (
            <div className="max-w-xl space-y-4">
              <div className="flex items-center gap-3">
                <StarRating rating={product.rating} size={20} />
                <span className="text-sm text-ink/50">{product.reviewCount} reviews</span>
              </div>
              <ProductReviews product={product} onReviewSubmitted={(review) => {
                // Keep the header rating/count roughly in sync without a refetch —
                // the server recalculates the authoritative value on its side.
                setProduct((p) => (p ? {
                  ...p,
                  reviewCount: (p.reviewCount || 0) + 1,
                  rating: Math.round((((p.rating || 0) * (p.reviewCount || 0) + review.rating) / ((p.reviewCount || 0) + 1)) * 10) / 10,
                } : p))
              }} />
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-xl sm:text-2xl text-ink mb-5">You may also need</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {related.map((p) => (isFishCategory(p.category) ? <FishCard key={p.id} product={p} /> : <ProductCard key={p.id} product={p} />))}
          </div>
        </section>
      )}
    </div>
  )
}

function ProductReviews({ product, onReviewSubmitted }) {
  const { isAuthenticated, user, apiConfigured } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(apiConfigured)
  const [loadError, setLoadError] = useState(null)

  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  useEffect(() => {
    if (!apiConfigured) { setLoading(false); return }
    let active = true
    setLoading(true)
    setLoadError(null)
    fetchReviews(product.slug)
      .then((data) => { if (active) setReviews(data) })
      .catch((err) => { if (active) setLoadError(err.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [product.slug, apiConfigured])

  const alreadyReviewed = isAuthenticated && user && reviews.some((r) => String(r.user) === String(user.id))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError(null)
    if (!rating) { setSubmitError('Please select a star rating.'); return }
    if (!text.trim()) { setSubmitError('Please write a few words about your experience.'); return }

    setSubmitting(true)
    try {
      const review = await submitReview(product.slug, { rating, text: text.trim() })
      setReviews((prev) => [review, ...prev])
      setRating(0)
      setText('')
      onReviewSubmitted?.(review)
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // No backend configured — there's no local fallback for reviews (unlike
  // products/wishlist), so be upfront about it rather than showing an error.
  if (!apiConfigured) {
    return (
      <div className="flex items-start gap-2 rounded-xl bg-sand/10 border border-sand/30 p-3 text-xs text-sand-dark">
        <Info size={16} className="shrink-0 mt-0.5" />
        <p>No backend is connected yet, so live customer reviews aren't available in this demo.</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {loading && (
        <div className="space-y-3 animate-pulse">
          {[0, 1].map((i) => (
            <div key={i} className="border border-mist rounded-xl p-4 space-y-2">
              <div className="h-3 w-1/4 bg-mist rounded" />
              <div className="h-3 w-1/3 bg-mist rounded" />
              <div className="h-3 w-full bg-mist rounded" />
            </div>
          ))}
        </div>
      )}

      {!loading && loadError && (
        <div className="flex items-start gap-2 rounded-xl bg-coral/10 border border-coral/30 p-3 text-xs text-coral">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <p>Couldn't load reviews right now ({loadError}). Please try again later.</p>
        </div>
      )}

      {!loading && !loadError && reviews.length === 0 && (
        <p className="text-sm text-ink/50">No reviews yet — be the first to review {product.name}.</p>
      )}

      {!loading && !loadError && reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="border border-mist rounded-xl p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-ink text-sm">{r.userName}</span>
                {r.verifiedPurchase && <span className="text-xs text-reef">Verified Purchase</span>}
              </div>
              <div className="flex items-center gap-0.5 mb-2">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} size={13} className={j < r.rating ? 'fill-sand text-sand' : 'text-mist'} />
                ))}
              </div>
              <p className="text-sm text-ink/70">{r.text}</p>
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-mist pt-5">
        {!isAuthenticated ? (
          <div className="flex items-start gap-2 rounded-xl bg-lagoon/5 border border-lagoon/20 p-3 text-sm text-ink/70">
            <Info size={16} className="shrink-0 mt-0.5 text-lagoon-dark" />
            <p>
              <Link to="/login" state={{ from: `/products/${product.slug}` }} className="text-lagoon-dark font-medium hover:underline">
                Sign in
              </Link>{' '}
              to write a review.
            </p>
          </div>
        ) : alreadyReviewed ? (
          <p className="text-sm text-ink/50">You've already reviewed this product — thanks for your feedback!</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <h3 className="font-medium text-ink text-sm">Write a review</h3>
            <div className="flex items-center gap-1" role="radiogroup" aria-label="Your rating">
              {Array.from({ length: 5 }).map((_, i) => {
                const value = i + 1
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    onMouseEnter={() => setHoverRating(value)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`${value} star${value > 1 ? 's' : ''}`}
                    aria-pressed={rating === value}
                    className="p-0.5"
                  >
                    <Star size={22} className={(hoverRating || rating) >= value ? 'fill-sand text-sand' : 'text-mist'} />
                  </button>
                )
              })}
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              placeholder={`Share your experience with ${product.name}...`}
              className="w-full rounded-lg border border-mist px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-lagoon/40"
            />
            {submitError && (
              <p className="flex items-center gap-1.5 text-xs text-coral">
                <AlertTriangle size={13} className="shrink-0" /> {submitError}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-lagoon text-white text-sm font-medium hover:bg-lagoon-dark disabled:bg-mist disabled:text-ink/40 transition-colors"
            >
              {submitting ? 'Submitting…' : 'Submit Review'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
