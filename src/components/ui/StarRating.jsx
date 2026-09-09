import { Star } from '../../utils/icons.jsx'

export default function StarRating({ rating, reviewCount, size = 14 }) {
  return (
    <div className="flex items-center gap-1 text-ink/70">
      <Star size={size} className="fill-sand text-sand" />
      <span className="text-sm font-medium font-mono">{rating.toFixed(1)}</span>
      {reviewCount != null && <span className="text-xs text-ink/50 font-mono">({reviewCount})</span>}
    </div>
  )
}
