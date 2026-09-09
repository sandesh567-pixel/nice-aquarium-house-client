import { useCategories } from '../../context/CategoryContext'

const difficulties = ['Beginner', 'Intermediate', 'Advanced']

export default function FilterPanel({ filters, onChange, onClear }) {
  const { categories } = useCategories()
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-ink text-sm mb-3">Category</h3>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm text-ink/70">
            <input
              type="radio"
              name="category"
              checked={!filters.category}
              onChange={() => onChange({ category: '' })}
            />
            All categories
          </label>
          {categories.map((c) => (
            <label key={c.slug} className="flex items-center gap-2 text-sm text-ink/70">
              <input
                type="radio"
                name="category"
                checked={filters.category === c.slug}
                onChange={() => onChange({ category: c.slug })}
              />
              {c.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-ink text-sm mb-3">Difficulty</h3>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm text-ink/70">
            <input type="radio" name="difficulty" checked={!filters.difficulty} onChange={() => onChange({ difficulty: '' })} />
            Any
          </label>
          {difficulties.map((d) => (
            <label key={d} className="flex items-center gap-2 text-sm text-ink/70">
              <input type="radio" name="difficulty" checked={filters.difficulty === d} onChange={() => onChange({ difficulty: d })} />
              {d}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-ink text-sm mb-3">Price (Rs.)</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => onChange({ minPrice: e.target.value })}
            className="w-full h-10 rounded-lg border border-mist px-3 text-sm"
          />
          <span className="text-ink/40">–</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => onChange({ maxPrice: e.target.value })}
            className="w-full h-10 rounded-lg border border-mist px-3 text-sm"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-ink/70">
        <input
          type="checkbox"
          checked={filters.inStockOnly}
          onChange={(e) => onChange({ inStockOnly: e.target.checked })}
        />
        In stock only
      </label>

      <button type="button" onClick={onClear} className="text-sm font-medium text-lagoon-dark hover:underline">
        Clear all filters
      </button>
    </div>
  )
}
