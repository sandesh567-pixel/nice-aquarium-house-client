import { Fish, Leaf, HeartHandshake } from '../utils/icons.jsx'

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-14">
      <h1 className="font-display text-3xl sm:text-4xl text-ink mb-6">About Nice Aquarium House</h1>
      <div className="space-y-5 text-ink/70 leading-relaxed">
        <p>
          Nice Aquarium House started as a small Kathmandu shopfront for people who wanted more than a fishbowl and a
          bag of flakes — hobbyists building planted tanks, first-time owners choosing their first betta, and
          aquascapers hunting for the right piece of driftwood.
        </p>
        <p>
          We stock fish, plants, tanks and equipment we'd be comfortable putting in our own homes, and we quarantine
          and check live fish before they're ever offered for sale. If something isn't healthy enough to sell, we
          don't sell it.
        </p>
        <p>
          Most of all, we try to make the hobby less intimidating. Aquariums can feel like a world of confusing
          numbers — pH, nitrates, wattage — and our goal is to translate that into plain advice, whether you're
          setting up your first 20-liter tank or your fifth planted aquascape.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mt-10">
        <ValueCard icon={Fish} title="Fish Care" text="Every fish is quarantined and health-checked first." />
        <ValueCard icon={Leaf} title="Aquascaping" text="Real plants, hardscape and setups we test ourselves." />
        <ValueCard icon={HeartHandshake} title="Beginner Support" text="Honest advice, not upselling." />
      </div>
    </div>
  )
}

function ValueCard({ icon: Icon, title, text }) {
  return (
    <div className="rounded-2xl border border-mist bg-white p-5">
      <div className="h-10 w-10 rounded-full bg-lagoon/10 flex items-center justify-center mb-3">
        <Icon size={18} className="text-lagoon-dark" />
      </div>
      <h3 className="font-medium text-ink text-sm mb-1">{title}</h3>
      <p className="text-xs text-ink/55">{text}</p>
    </div>
  )
}
