import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AlertTriangle, Info } from '../utils/icons.jsx'

export default function Register() {
  const { register, apiConfigured } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await register(form)
      navigate('/account')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-10 sm:py-16">
      <h1 className="font-display text-2xl sm:text-3xl text-ink mb-2">Create an Account</h1>
      <p className="text-ink/60 mb-6">Track your orders and save your wishlist across devices.</p>

      {!apiConfigured && (
        <div className="flex items-start gap-2 rounded-xl bg-sand/10 border border-sand/30 p-3 text-xs text-sand-dark mb-5">
          <Info size={16} className="shrink-0 mt-0.5" />
          <p>No backend is connected yet, so accounts can't be created right now. Your cart and wishlist still work without an account.</p>
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <Field label="Full Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} required />
        <Field label="Email" type="email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} required />
        <Field label="Phone (optional)" type="tel" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} />
        <Field label="Password" type="password" value={form.password} onChange={(v) => setForm((f) => ({ ...f, password: v }))} required hint="At least 6 characters" />

        {error && (
          <p className="flex items-center gap-2 text-sm text-coral"><AlertTriangle size={15} /> {error}</p>
        )}

        <button
          type="submit"
          disabled={submitting || !apiConfigured}
          className="w-full h-12 rounded-full bg-lagoon text-white font-medium hover:bg-lagoon-dark disabled:bg-mist disabled:text-ink/40 transition-colors"
        >
          {submitting ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="text-sm text-ink/60 mt-5 text-center">
        Already have an account? <Link to="/login" className="text-lagoon-dark font-medium">Sign in</Link>
      </p>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', required, hint }) {
  const id = `register-${label.toLowerCase().replace(/[^a-z]+/g, '-')}`
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink mb-1">{label}</label>
      <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} minLength={type === 'password' ? 6 : undefined} className="w-full h-11 rounded-lg border border-mist px-3 text-sm" />
      {hint && <p className="text-xs text-ink/40 mt-1">{hint}</p>}
    </div>
  )
}
