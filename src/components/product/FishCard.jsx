import { Link } from 'react-router-dom'
import { Heart, ShoppingCart } from '../../utils/icons.jsx'
import { ProductTileFor } from './ProductTile'
import StarRating from '../ui/StarRating'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'

const difficultyStyles = {
  Beginner: 'bg-reef/15 text-reef',
  Intermediate: 'bg-sand/20 text-sand-dark',
  Advanced: 'bg-coral/15 text-coral',
}

export default function FishCard({ product }) {
  const { addItem } = useCart()
  const { toggle, isWishlisted } = useWishlist()
  const wishlisted = isWishlisted(product.id)
  const outOfStock = product.stock === 0

  return (
    <div className="group relative flex flex-col rounded-2xl border border-mist bg-white overflow-hidden transition-shadow hover:shadow-md">
      <Link to={`/products/${product.slug}`} className="relative block aspect-[4/3]" aria-label={product.name}>
        <ProductTileFor product={product} className="h-full w-full" />
        {product.isLive && (
          <span className="absolute top-2 right-2 rounded-full bg-ink/80 text-white text-[11px] font-medium px-2 py-1">
            Live Fish
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

      <div className="flex flex-col gap-1.5 p-3">
        <Link to={`/products/${product.slug}`} className="font-medium text-ink hover:text-lagoon-dark transition-colors">
          {product.name}
        </Link>
        <span className="text-xs italic text-ink/50">{product.scientificName}</span>

        <span className={`self-start text-[11px] font-medium px-2 py-0.5 rounded-full ${difficultyStyles[product.difficulty] || 'bg-mist text-ink/60'}`}>
          {product.difficulty}
        </span>

        <dl className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-ink/60 font-mono mt-1">
          <div><dt className="inline text-ink/40">Size </dt><dd className="inline">{product.adultSize}</dd></div>
          <div><dt className="inline text-ink/40">Temp </dt><dd className="inline">{product.temperature}</dd></div>
          <div><dt className="inline text-ink/40">pH </dt><dd className="inline">{product.ph}</dd></div>
          <div><dt className="inline text-ink/40">Tank </dt><dd className="inline">{product.minimumTankSize}+</dd></div>
        </dl>

        <StarRating rating={product.rating} reviewCount={product.reviewCount} />

        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="font-mono font-semibold text-ink">Rs. {(product.discountPrice || product.price).toLocaleString('en-IN')}</span>
          {product.discountPrice && <span className="font-mono text-xs text-ink/40 line-through">Rs. {product.price.toLocaleString('en-IN')}</span>}
        </div>

        <button
          type="button"
          disabled={outOfStock}
          onClick={() => addItem(product, 1)}
          className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-full h-10 px-4 text-sm font-medium transition-colors
            bg-lagoon text-white hover:bg-lagoon-dark disabled:bg-mist disabled:text-ink/40 disabled:cursor-not-allowed"
        >
          <ShoppingCart size={16} />
          {outOfStock ? 'Notify Me' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}
