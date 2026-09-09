export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-mist bg-white overflow-hidden animate-pulse">
      <div className="aspect-square bg-mist" />
      <div className="p-3 space-y-2">
        <div className="h-3 w-2/3 rounded bg-mist" />
        <div className="h-3 w-1/3 rounded bg-mist" />
        <div className="h-4 w-1/2 rounded bg-mist" />
        <div className="h-9 w-full rounded-full bg-mist mt-2" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function CategoryChipSkeleton() {
  return <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl bg-mist animate-pulse shrink-0" />
}
