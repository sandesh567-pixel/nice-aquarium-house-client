import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ChevronRight } from '../../utils/icons.jsx'
import ProductCard from '../product/ProductCard'
import FishCard from '../product/FishCard'
import { ProductGridSkeleton } from '../ui/Skeleton'
import { isFishCategory } from '../../data/products'

export default function ProductRail({ title, subtitle, fetcher, viewAllTo, fishStyle = false }) {
  const [products, setProducts] = useState(null)

  useEffect(() => {
    let active = true
    fetcher().then((data) => { if (active) setProducts(data) })
    return () => { active = false }
  }, [fetcher])

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl text-ink">{title}</h2>
          {subtitle && <p className="text-ink/50 text-sm mt-1">{subtitle}</p>}
        </div>
        {viewAllTo && (
          <Link to={viewAllTo} className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-lagoon-dark hover:text-lagoon">
            View all <ChevronRight size={16} />
          </Link>
        )}
      </div>

      {!products ? (
        <ProductGridSkeleton count={4} />
      ) : products.length === 0 ? (
        <p className="text-ink/50 text-sm">Nothing to show here yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {products.map((p) =>
            fishStyle && isFishCategory(p.category)
              ? <FishCard key={p.id} product={p} />
              : <ProductCard key={p.id} product={p} />
          )}
        </div>
      )}

      {viewAllTo && (
        <Link to={viewAllTo} className="sm:hidden mt-5 inline-flex items-center gap-1 text-sm font-medium text-lagoon-dark">
          View all <ChevronRight size={16} />
        </Link>
      )}
    </section>
  )
}
