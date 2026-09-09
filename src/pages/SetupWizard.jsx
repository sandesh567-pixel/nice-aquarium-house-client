import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Waves, ArrowRight, Check } from '../utils/icons.jsx'
import { useCart } from '../context/CartContext'
import { products } from '../data/products'

const sizes = [
  { id: 'nano', label: 'Nano', desc: 'Under 30 L — desks & small spaces' },
  { id: 'small', label: 'Small', desc: '30–80 L — a first real tank' },
  { id: 'medium', label: 'Medium', desc: '80–150 L — a proper community tank' },
  { id: 'large', label: 'Large', desc: '150 L+ — statement centerpiece' },
]
const types = [
  { id: 'freshwater', label: 'Freshwater', desc: 'Classic community fish' },
  { id: 'planted', label: 'Planted', desc: 'Live plants, aquascaped' },
  { id: 'marine', label: 'Marine', desc: 'Saltwater & reef fish' },
]

// Simple rules mapping size+type to a recommended bundle — a stand-in for a
// real recommendation engine, but the pricing and product refs are real
// catalog entries so "Add All to Cart" works.
function buildRecommendation(size, type) {
  const pick = (slugMatch) => products.find((p) => p.slug === slugMatch)
  const tank = {
    nano: pick('nano-cube-20l'),
    small: type === 'marine' ? pick('rimless-ultra-clear-60l') : pick('rimless-ultra-clear-60l'),
    medium: type === 'planted' ? pick('planted-tank-starter-80l') : pick('community-tank-110l'),
    large: type === 'marine' ? pick('marine-reef-ready-150l') : pick('custom-aquascape-200l'),
  }[size]

  const filter = type === 'marine' ? pick('canisterpro-1000-external-filter') : pick('aquaflow-hob-filter-500')
  const light = type === 'planted' ? pick('growbright-planted-tank-light') : type === 'marine' ? pick('reefglow-marine-led') : pick('fullspectrum-led-bar-45cm')
  const heater = type === 'marine' ? pick('thermosafe-heater-200w') : pick('thermosafe-heater-100w')
  const substrate = type === 'planted' ? pick('premium-aquasoil-3l') : pick('natural-river-gravel')
  const plant = type === 'planted' ? pick('java-fern') : type === 'marine' ? null : pick('anubias-nana')
  const food = type === 'marine' ? pick('marine-pellets') : pick('tropical-flakes')
  const conditioner = pick('tap-water-conditioner-250ml')

  return [tank, filter, light, heater, substrate, plant, food, conditioner].filter(Boolean)
}

export default function SetupWizard() {
  const [step, setStep] = useState(0)
  const [size, setSize] = useState(null)
  const [type, setType] = useState(null)
  const { addItem } = useCart()
  const navigate = useNavigate()

  const recommendation = size && type ? buildRecommendation(size, type) : []
  const total = recommendation.reduce((sum, p) => sum + (p.discountPrice || p.price), 0)

  const addAllToCart = () => {
    recommendation.forEach((p) => addItem(p, 1))
    navigate('/cart')
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 mb-2">
        <Waves size={20} className="text-lagoon-dark" />
        <h1 className="font-display text-2xl sm:text-3xl text-ink">Build Your Aquarium</h1>
      </div>
      <p className="text-ink/60 mb-8 max-w-lg">Answer two quick questions and we'll put together a starter setup, priced and ready to add to cart.</p>

      {step === 0 && (
        <StepChooser
          title="What size aquarium do you have in mind?"
          options={sizes}
          onSelect={(id) => { setSize(id); setStep(1) }}
        />
      )}

      {step === 1 && (
        <StepChooser
          title="What type of tank?"
          options={types}
          onSelect={(id) => { setType(id); setStep(2) }}
          onBack={() => setStep(0)}
        />
      )}

      {step === 2 && (
        <div>
          <button onClick={() => setStep(1)} className="text-sm text-lagoon-dark font-medium mb-5">← Back</button>
          <h2 className="font-display text-xl text-ink mb-1">Recommended Setup</h2>
          <p className="text-sm text-ink/50 mb-5">{sizes.find((s) => s.id === size)?.label} · {types.find((t) => t.id === type)?.label}</p>

          <ul className="space-y-2 mb-6">
            {recommendation.map((p) => (
              <li key={p.id} className="flex items-center justify-between rounded-xl border border-mist bg-white p-3.5">
                <div className="flex items-center gap-2">
                  <Check size={15} className="text-reef shrink-0" />
                  <span className="text-sm text-ink">{p.name}</span>
                </div>
                <span className="font-mono text-sm text-ink/70">Rs. {(p.discountPrice || p.price).toLocaleString('en-IN')}</span>
              </li>
            ))}
          </ul>

          <div className="rounded-2xl bg-lagoon-dark text-white p-5 flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-white/60 text-xs">Estimated Total</p>
              <p className="font-mono text-xl font-semibold">Rs. {total.toLocaleString('en-IN')}</p>
            </div>
            <button onClick={addAllToCart} className="inline-flex items-center gap-2 rounded-full bg-white text-ink font-semibold px-5 py-3 hover:bg-white/90 transition-colors">
              Add All to Cart <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function StepChooser({ title, options, onSelect, onBack }) {
  return (
    <div>
      {onBack && <button onClick={onBack} className="text-sm text-lagoon-dark font-medium mb-5">← Back</button>}
      <h2 className="font-display text-xl text-ink mb-5">{title}</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => onSelect(o.id)}
            className="text-left rounded-2xl border border-mist bg-white p-4 hover:border-lagoon hover:shadow-sm transition-all"
          >
            <p className="font-medium text-ink">{o.label}</p>
            <p className="text-xs text-ink/50 mt-0.5">{o.desc}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
