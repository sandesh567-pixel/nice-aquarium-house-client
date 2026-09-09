import { useState } from 'react'
import { BookOpen, ChevronDown } from '../utils/icons.jsx'

const guides = [
  {
    category: 'Beginner Guides',
    title: 'How to Set Up Your First Aquarium',
    summary: 'Rinse gravel, position the tank away from direct sun, fill, add a conditioned water and let the filter run for at least 24–48 hours before adding fish — patience here prevents most early losses.',
  },
  {
    category: 'Fish Care',
    title: 'Best Fish for Beginners',
    summary: 'Guppies, platies, corydoras and bettas tolerate small mistakes well and are a forgiving way to learn the basics of feeding and water changes.',
  },
  {
    category: 'Water Chemistry',
    title: 'How Often Should You Change Aquarium Water?',
    summary: 'Most freshwater community tanks do well with a 20–25% water change every 1–2 weeks, more often in smaller or heavily stocked tanks.',
  },
  {
    category: 'Aquarium Setup',
    title: 'How to Choose an Aquarium Filter',
    summary: 'Match filter flow rate to tank volume — aim for the full tank volume turned over roughly 4 times per hour for most freshwater setups.',
  },
  {
    category: 'Aquascaping',
    title: 'How to Start Aquascaping',
    summary: 'Begin with hardscape (rock and driftwood) before substrate and plants — it is far easier to plan planting around a fixed layout than the reverse.',
  },
  {
    category: 'Tank Maintenance',
    title: 'Troubleshooting Cloudy Water',
    summary: 'New tank cloudiness is usually a harmless bacterial bloom that clears within a week; ongoing cloudiness often points to overfeeding.',
  },
]

const categoryFilters = ['All', ...new Set(guides.map((g) => g.category))]

export default function Guides() {
  const [active, setActive] = useState('All')
  const [openIndex, setOpenIndex] = useState(null)

  const filtered = active === 'All' ? guides : guides.filter((g) => g.category === active)

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen size={20} className="text-lagoon-dark" />
        <h1 className="font-display text-2xl sm:text-3xl text-ink">Aquarium Guides</h1>
      </div>
      <p className="text-ink/60 mb-6 max-w-lg">Plain-language answers to the questions we hear most in the shop.</p>

      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6">
        {categoryFilters.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`shrink-0 px-3.5 py-2 rounded-full text-sm font-medium border transition-colors ${active === c ? 'bg-lagoon text-white border-lagoon' : 'border-mist text-ink/60'}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((g, i) => {
          const open = openIndex === i
          return (
            <div key={g.title} className="rounded-2xl border border-mist bg-white overflow-hidden">
              <button
                onClick={() => setOpenIndex(open ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left"
                aria-expanded={open}
              >
                <div>
                  <span className="text-xs font-medium text-lagoon-dark">{g.category}</span>
                  <h2 className="font-medium text-ink mt-0.5">{g.title}</h2>
                </div>
                <ChevronDown size={18} className={`shrink-0 text-ink/40 transition-transform ${open ? 'rotate-180' : ''}`} />
              </button>
              {open && <p className="px-4 sm:px-5 pb-5 text-sm text-ink/65 leading-relaxed">{g.summary}</p>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
