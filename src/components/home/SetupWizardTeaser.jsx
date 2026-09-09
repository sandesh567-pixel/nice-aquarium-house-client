import { Link } from 'react-router-dom'
import { Waves, ArrowRight } from '../../utils/icons.jsx'

export default function SetupWizardTeaser() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-4 sm:py-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#157A78] to-[#0A2A33] px-6 py-10 sm:px-12 sm:py-14">
        <div className="relative max-w-lg">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/80 bg-white/10 rounded-full px-3 py-1 mb-4">
            <Waves size={13} /> New to fishkeeping?
          </span>
          <h2 className="font-display text-2xl sm:text-3xl text-white mb-3">Build Your Aquarium</h2>
          <p className="text-white/70 mb-6 text-sm sm:text-base">
            Answer a few quick questions about your space and goals — we'll put together a complete setup, priced and ready to add to cart.
          </p>
          <Link to="/setup-wizard" className="inline-flex items-center gap-2 rounded-full bg-white text-ink font-semibold px-6 py-3 hover:bg-white/90 transition-colors min-h-11">
            Start the Wizard <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
