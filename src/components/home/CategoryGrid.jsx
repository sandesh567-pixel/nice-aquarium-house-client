import { Link } from 'react-router-dom'
import { useCategories } from '../../context/CategoryContext'
import ProductTile from '../product/ProductTile'
import { CategoryChipSkeleton } from '../ui/Skeleton'

export default function CategoryGrid() {
  const { categories, loading } = useCategories()

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
      <div className="flex items-end justify-between mb-6">
        <h2 className="font-display text-2xl sm:text-3xl text-ink">Shop by Category</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-4 lg:grid-cols-6 sm:gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <CategoryChipSkeleton key={i} />)
          : categories.map((c) => (
            <Link
              key={c.slug}
              to={`/shop?category=${c.slug}`}
              className="group shrink-0 w-28 sm:w-auto flex flex-col items-center text-center gap-2"
            >
              <div className="relative h-24 w-24 sm:h-28 sm:w-full sm:aspect-square rounded-2xl overflow-hidden ring-1 ring-mist group-hover:ring-lagoon-light transition-all">
                <ProductTile tile={c.tile} icon={c.icon} className="h-full w-full" bubbles={false} />
              </div>
              <span className="text-sm font-medium text-ink leading-tight">{c.name}</span>
            </Link>
          ))}
      </div>
    </section>
  )
}
