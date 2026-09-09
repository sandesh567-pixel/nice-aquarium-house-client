import { useState } from 'react'
import { CategoryIcon } from '../../utils/icons.jsx'
import { useCategories } from '../../context/CategoryContext'

// Nice Aquarium House doesn't use stock photography for its demo catalog —
// instead every product gets a "glass tile": a gradient tied to its category
// (open water, planted, marine, glass tank, driftwood, sand) with a rising
// bubble field and a waterline highlight along the top edge. It reads as one
// consistent, branded system rather than mismatched photos.
const gradients = {
  fish: 'from-[#1C7A82] via-[#146267] to-[#0B3C40]',
  marine: 'from-[#0E4B6B] via-[#0A3450] to-[#062333]',
  plant: 'from-[#3E8F55] via-[#2F6E42] to-[#1E4A2C]',
  tank: 'from-[#1B5A66] via-[#123F49] to-[#0A2A33]',
  food: 'from-[#E2A24B] via-[#C9822C] to-[#8F5B1B]',
  equipment: 'from-[#4A6670] via-[#33474F] to-[#1F2C31]',
  hardscape: 'from-[#8A7460] via-[#5F4E3E] to-[#3A2F25]',
  decor: 'from-[#D96A5A] via-[#B94E40] to-[#7A2F26]',
  water: 'from-[#4FB8AF] via-[#157A78] to-[#0E5C5B]',
}

// Exported so AdminCategories.jsx's tile picker can list exactly the
// valid `category.tile` values without a second, hand-maintained list.
export const TILE_KEYS = Object.keys(gradients)

export default function ProductTile({ tile = 'equipment', icon, className = '', bubbles = true }) {
  const grad = gradients[tile] || gradients.equipment
  const bubblePositions = [
    { left: '18%', size: 6, delay: '0s', duration: '6s' },
    { left: '38%', size: 4, delay: '1.2s', duration: '7.5s' },
    { left: '58%', size: 8, delay: '0.4s', duration: '5.5s' },
    { left: '76%', size: 5, delay: '2s', duration: '8s' },
    { left: '85%', size: 3, delay: '0.8s', duration: '6.5s' },
  ]

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${grad} ${className}`}>
      {/* waterline highlight */}
      <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/20 to-transparent" />
      {bubbles && (
        <div className="absolute inset-0 [mask-image:linear-gradient(to_top,transparent,black_15%)]">
          {bubblePositions.map((b, i) => (
            <span
              key={i}
              className="absolute bottom-0 rounded-full bg-white/30 motion-safe:animate-[rise_var(--dur)_linear_infinite]"
              style={{
                left: b.left,
                width: b.size,
                height: b.size,
                animationDelay: b.delay,
                '--dur': b.duration,
              }}
            />
          ))}
        </div>
      )}
      <div className="relative flex h-full w-full items-center justify-center">
        <CategoryIcon name={icon} className="h-[38%] w-[38%] text-white/90 drop-shadow-sm" strokeWidth={1.4} />
      </div>
      <style>{`
        @keyframes rise {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.4; }
          100% { transform: translateY(-110%); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

export function ProductTileFor({ product, className, bubbles }) {
  const { getCategory } = useCategories()
  const [imgError, setImgError] = useState(false)

  // Real admin-provided image takes priority; falls back to the gradient
  // tile if no image is set, or if the URL fails to load — existing
  // products (no imageUrl) are completely unaffected, same as before.
  if (product.imageUrl && !imgError) {
    return (
      <img
        src={product.imageUrl}
        alt={product.name}
        className={`object-cover ${className || ''}`}
        onError={() => setImgError(true)}
      />
    )
  }

  const cat = getCategory(product.category)
  return <ProductTile tile={product.tile} icon={cat?.icon} className={className} bubbles={bubbles} />
}
