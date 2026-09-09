import { Link } from 'react-router-dom'
import { Heart, ShoppingCart } from '../../utils/icons.jsx'
import { ProductTileFor } from './ProductTile'
import StarRating from '../ui/StarRating'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useCategories } from '../../context/CategoryContext'

export default function ProductCard({ product }) {
  const { getCategory } = useCategories()
  const { addItem } = useCart()
  const { toggle, isWishlisted } = useWishlist()
  const wishlisted = isWishlisted(product.id)
  const category = getCategory(product.category)
  const hasDiscount = !!product.discountPrice
  const discountPct = hasDiscount ? Math.round(100 - (product.discountPrice / product.price) * 100) : 0
  const outOfStock = product.stock === 0

  return (
    <div className="group relative flex flex-col rounded-2xl border border-mist bg-white overflow-hidden transition-shadow hover:shadow-md">
      <Link to={`/products/${product.slug}`} className="relative block aspect-square" aria-label={product.name}>
        <ProductTileFor product={product} className="h-full w-full" />
        {hasDiscount && (
          <span className="absolute top-2 right-2 rounded-full bg-coral text-white text-xs font-semibold px-2 py-1">
            -{discountPct}%
          </span>
        )}
        {outOfStock && (
          <span className="absolute inset-x-2 bottom-2 rounded-full bg-ink/80 text-white text-xs font-medium text-center py-1">
            Out of stock
          </span>
        )}
      </Link>

      <button
        type="button"
        onClick={() => toggle(product.id)}
        aria-pressed={wishlisted}
        aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        className="absolute top-2 left-2 h-9 w-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm hover:bg-white transition-colors"
      >
        <Heart size={17} className={wishlisted ? 'fill-coral text-coral' : 'text-ink/60'} />
      </button>

      <div className="flex flex-col gap-1.5 p-3 flex-1">
        <span className="text-xs text-lagoon-dark font-medium">{category?.name}</span>
        <Link to={`/products/${product.slug}`} className="font-medium text-ink leading-snug line-clamp-2 hover:text-lagoon-dark transition-colors">
          {product.name}
        </Link>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="font-mono font-semibold text-ink">Rs. {(product.discountPrice || product.price).toLocaleString('en-IN')}</span>
          {hasDiscount && (
            <span className="font-mono text-xs text-ink/40 line-through">Rs. {product.price.toLocaleString('en-IN')}</span>
          )}
        </div>

        <button
          type="button"
          disabled={outOfStock}
          onClick={() => addItem(product, 1)}
          className="mt-auto inline-flex items-center justify-center gap-1.5 rounded-full h-10 px-4 text-sm font-medium transition-colors
            bg-lagoon text-white hover:bg-lagoon-dark disabled:bg-mist disabled:text-ink/40 disabled:cursor-not-allowed"
        >
          <ShoppingCart size={16} />
          {outOfStock ? 'Notify Me' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}
