import { useState } from 'react'
import { Mail, Check } from '../../utils/icons.jsx'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
  }

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
      <div className="rounded-3xl bg-lagoon-dark px-6 py-10 sm:px-12 sm:py-14 text-center">
        <Mail size={26} className="mx-auto text-white/80 mb-3" />
        <h2 className="font-display text-2xl sm:text-3xl text-white mb-2">Aquarium tips, in your inbox</h2>
        <p className="text-white/60 max-w-md mx-auto mb-6 text-sm sm:text-base">
          Occasional care guides, new arrivals and Kathmandu-specific water tips. No spam.
        </p>
        {submitted ? (
          <p className="inline-flex items-center gap-2 text-white font-medium bg-white/10 rounded-full px-5 py-3">
            <Check size={18} /> You're subscribed — welcome aboard!
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 h-12 rounded-full px-5 text-ink placeholder:text-ink/40"
            />
            <button type="submit" className="h-12 rounded-full bg-sand text-ink font-semibold px-6 hover:bg-sand-dark transition-colors">
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
