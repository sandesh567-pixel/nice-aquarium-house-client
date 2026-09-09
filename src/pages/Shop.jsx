import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, ArrowUpDown, X, Search } from '../utils/icons.jsx'
import { fetchProducts } from '../services/productService'
import { useCategories } from '../context/CategoryContext'
import { isFishCategory } from '../data/products'
import ProductCard from '../components/product/ProductCard'
import FishCard from '../components/product/FishCard'
import FilterPanel from '../components/product/FilterPanel'
import { ProductGridSkeleton } from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'best-selling', label: 'Best Selling' },
]

export default function Shop() {
  const { getCategory } = useCategories()
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '')

  const filters = useMemo(() => ({
    category: searchParams.get('category') || '',
    q: searchParams.get('q') || '',
    sort: searchParams.get('sort') || 'featured',
    difficulty: searchParams.get('difficulty') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    inStockOnly: searchParams.get('inStockOnly') === '1',
  }), [searchParams])

  useEffect(() => {
    let active = true
    setProducts(null)
    fetchProducts({
      category: filters.category || undefined,
      search: filters.q || undefined,
      sort: filters.sort,
      difficulty: filters.difficulty || undefined,
      minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      inStockOnly: filters.inStockOnly,
    }).then((data) => { if (active) setProducts(data) })
    return () => { active = false }
  }, [filters])

  const updateFilters = (patch) => {
    const next = new URLSearchParams(searchParams)
    Object.entries(patch).forEach(([key, value]) => {
      if (value === '' || value === false || value == null) next.delete(key)
      else next.set(key, value === true ? '1' : value)
    })
    setSearchParams(next)
  }

  const clearAll = () => setSearchParams({})

  const submitSearch = (e) => {
    e.preventDefault()
    updateFilters({ q: searchInput })
  }

  const activeCategory = filters.category ? getCategory(filters.category) : null
  const heading = filters.q
    ? `Results for "${filters.q}"`
    : activeCategory
      ? activeCategory.name
      : 'Shop All Products'

  const activeFilterCount = [filters.difficulty, filters.minPrice, filters.maxPrice, filters.inStockOnly].filter(Boolean).length

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10">
      <div className="mb-5">
        <h1 className="font-display text-2xl sm:text-3xl text-ink">{heading}</h1>
        {activeCategory && <p className="text-ink/50 text-sm mt-1">{activeCategory.blurb}</p>}
      </div>

      <form onSubmit={submitSearch} className="sm:hidden mb-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products..."
            className="w-full h-11 rounded-full border border-mist bg-white pl-9 pr-3 text-sm"
          />
        </div>
      </form>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <FilterPanel filters={filters} onChange={updateFilters} onClear={clearAll} />
        </aside>

        <div className="flex-1 min-w-0">
          {/* Mobile filter/sort bar */}
          <div className="flex lg:hidden gap-2 mb-4">
            <button
              onClick={() => setFilterOpen(true)}
              className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-full border border-mist text-sm font-medium text-ink"
            >
              <SlidersHorizontal size={16} /> Filter {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
            <button
              onClick={() => setSortOpen(true)}
              className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-full border border-mist text-sm font-medium text-ink"
            >
              <ArrowUpDown size={16} /> Sort
            </button>
          </div>

          {/* Desktop sort bar */}
          <div className="hidden lg:flex items-center justify-between mb-4">
            <p className="text-sm text-ink/50">{products ? `${products.length} products` : 'Loading...'}</p>
            <label className="flex items-center gap-2 text-sm text-ink/70">
              Sort by
              <select
                value={filters.sort}
                onChange={(e) => updateFilters({ sort: e.target.value })}
                className="h-10 rounded-lg border border-mist px-3 text-sm"
              >
                {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </label>
          </div>

          {!products ? (
            <ProductGridSkeleton count={8} />
          ) : products.length === 0 ? (
            <EmptyState
              emoji="🔍"
              title="No products found"
              message="Try a different search term or clear your filters."
              actionLabel="Clear filters"
              actionTo="/shop"
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {products.map((p) =>
                isFishCategory(p.category)
                  ? <FishCard key={p.id} product={p} />
                  : <ProductCard key={p.id} product={p} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setFilterOpen(false)} />
          <div className="absolute bottom-0 inset-x-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg text-ink">Filters</h2>
              <button onClick={() => setFilterOpen(false)} aria-label="Close filters" className="h-9 w-9 flex items-center justify-center text-ink/60">
                <X size={20} />
              </button>
            </div>
            <FilterPanel filters={filters} onChange={updateFilters} onClear={clearAll} />
            <button
              onClick={() => setFilterOpen(false)}
              className="mt-6 w-full h-12 rounded-full bg-lagoon text-white font-medium"
            >
              Show results
            </button>
          </div>
        </div>
      )}

      {/* Mobile sort drawer */}
      {sortOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setSortOpen(false)} />
          <div className="absolute bottom-0 inset-x-0 rounded-t-3xl bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg text-ink">Sort by</h2>
              <button onClick={() => setSortOpen(false)} aria-label="Close sort" className="h-9 w-9 flex items-center justify-center text-ink/60">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-1">
              {sortOptions.map((o) => (
                <label key={o.value} className="flex items-center gap-3 py-2.5 text-sm text-ink">
                  <input
                    type="radio"
                    name="sort-mobile"
                    checked={filters.sort === o.value}
                    onChange={() => { updateFilters({ sort: o.value }); setSortOpen(false) }}
                  />
                  {o.label}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
