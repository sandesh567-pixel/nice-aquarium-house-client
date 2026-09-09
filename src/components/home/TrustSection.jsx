import { Fish, ShieldCheck, HeartHandshake, Truck, MessageCircle, Leaf } from '../../utils/icons.jsx'

const points = [
  { icon: Fish, title: 'Healthy Fish', text: 'Quarantined and checked before they ever reach a customer.' },
  { icon: ShieldCheck, title: 'Quality Products', text: 'Equipment we\u2019d use in our own tanks at home.' },
  { icon: HeartHandshake, title: 'Secure Ordering', text: 'Clear pricing, no hidden charges at checkout.' },
  { icon: Leaf, title: 'Expert Advice', text: 'Real guidance for planted tanks, marine setups and beginners alike.' },
  { icon: Truck, title: 'Reliable Delivery', text: 'Careful packing for live fish and fragile glassware.' },
  { icon: MessageCircle, title: 'Customer Support', text: 'Reach us before or after your order — we answer.' },
]

export default function TrustSection() {
  return (
    <section className="bg-mist/60 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="font-display text-2xl sm:text-3xl text-ink mb-8 text-center">Why Shop With Us?</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {points.map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-white rounded-2xl p-4 sm:p-5 border border-mist">
              <div className="h-10 w-10 rounded-full bg-lagoon/10 flex items-center justify-center mb-3">
                <Icon size={19} className="text-lagoon-dark" />
              </div>
              <h3 className="font-medium text-ink text-sm sm:text-base mb-1">{title}</h3>
              <p className="text-xs sm:text-sm text-ink/55">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
