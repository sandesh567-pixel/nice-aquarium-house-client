import { Link } from 'react-router-dom'
import { Fish, Leaf, Waves } from '../../utils/icons.jsx'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0F5A63] via-[#0C4650] to-[#0A2A33]">
      {/* ambient bubbles, decorative only */}
      <div className="absolute inset-0 pointer-events-none [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden="true">
        {[12, 28, 47, 63, 81, 92].map((left, i) => (
          <span
            key={left}
            className="absolute bottom-0 rounded-full bg-white/10 motion-safe:animate-[rise2_9s_linear_infinite]"
            style={{ left: `${left}%`, width: 6 + (i % 3) * 4, height: 6 + (i % 3) * 4, animationDelay: `${i * 1.3}s` }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 lg:py-28">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-lagoon-light bg-white/10 rounded-full px-3 py-1 mb-5">
            <Waves size={13} /> Serving Kathmandu Valley
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] mb-5">
            Bring Your Aquarium to Life
          </h1>
          <p className="text-white/70 text-base sm:text-lg mb-8 max-w-md">
            Everything you need to build, stock and maintain a beautiful aquarium — fish, plants, tanks and gear, picked for Kathmandu's water and climate.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/shop" className="inline-flex items-center gap-2 rounded-full bg-white text-ink font-semibold px-6 py-3.5 hover:bg-white/90 transition-colors min-h-11">
              <Fish size={18} /> Shop Now
            </Link>
            <Link to="/shop?category=aquariums" className="inline-flex items-center gap-2 rounded-full border border-white/30 text-white font-medium px-6 py-3.5 hover:bg-white/10 transition-colors min-h-11">
              Explore Aquariums
            </Link>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes rise2 {
          0% { transform: translateY(0); opacity: 0; }
          15% { opacity: 1; }
          100% { transform: translateY(-320px); opacity: 0; }
        }
      `}</style>
    </section>
  )
}
