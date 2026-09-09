import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Check } from '../utils/icons.jsx'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return
    setSent(true)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <h1 className="font-display text-2xl sm:text-3xl text-ink mb-2">Contact Us</h1>
      <p className="text-ink/60 mb-8 max-w-lg">Questions about a fish, a setup, or an order? Reach out — a real person reads every message.</p>

      <div className="grid md:grid-cols-5 gap-10">
        <div className="md:col-span-2 space-y-5">
          <InfoRow icon={Phone} label="Phone" value="+977-1-XXXXXXX" />
          <InfoRow icon={Mail} label="Email" value="hello@niceaquariumhouse.com" />
          <InfoRow icon={MapPin} label="Location" value="Kathmandu, Nepal" />
          <InfoRow icon={Clock} label="Opening Hours" value="Sun–Fri, 10:00 AM – 7:00 PM" />

          <div className="rounded-2xl overflow-hidden border border-mist aspect-video bg-mist flex items-center justify-center text-ink/40 text-sm">
            Map placeholder — connect Google Maps here
          </div>
        </div>

        <div className="md:col-span-3">
          {sent ? (
            <div className="rounded-2xl border border-reef/30 bg-reef/10 p-6 flex items-start gap-3">
              <Check size={20} className="text-reef mt-0.5" />
              <div>
                <p className="font-medium text-ink">Message sent</p>
                <p className="text-sm text-ink/60 mt-1">Thanks, {form.name.split(' ')[0]} — we'll get back to you soon.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4 rounded-2xl border border-mist bg-white p-5 sm:p-6">
              <TextField label="Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} required />
              <TextField label="Email" type="email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} required />
              <TextField label="Phone (optional)" type="tel" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} />
              <TextField label="Message" textarea value={form.message} onChange={(v) => setForm((f) => ({ ...f, message: v }))} required />
              <button type="submit" className="h-12 px-6 rounded-full bg-lagoon text-white font-medium hover:bg-lagoon-dark transition-colors">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-10 w-10 rounded-full bg-lagoon/10 flex items-center justify-center shrink-0">
        <Icon size={17} className="text-lagoon-dark" />
      </div>
      <div>
        <p className="text-xs text-ink/50">{label}</p>
        <p className="text-sm font-medium text-ink">{value}</p>
      </div>
    </div>
  )
}

function TextField({ label, value, onChange, type = 'text', required, textarea }) {
  const id = `contact-${label.toLowerCase().replace(/[^a-z]+/g, '-')}`
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink mb-1">{label}{required && <span className="text-coral"> *</span>}</label>
      {textarea ? (
        <textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} rows={4} required={required} className="w-full rounded-lg border border-mist px-3 py-2 text-sm" />
      ) : (
        <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} className="w-full h-11 rounded-lg border border-mist px-3 text-sm" />
      )}
    </div>
  )
}
