import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AlertTriangle, Info } from '../utils/icons.jsx'

export default function Login() {
  const { login, apiConfigured } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const loggedInUser = await login(form)
      if (location.state?.from) {
        navigate(location.state.from)
      } else if (loggedInUser?.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-10 sm:py-16">
      <h1 className="font-display text-2xl sm:text-3xl text-ink mb-2">Welcome Back</h1>
      <p className="text-ink/60 mb-6">Sign in to view your orders and wishlist across devices.</p>

      {!apiConfigured && (
        <div className="flex items-start gap-2 rounded-xl bg-sand/10 border border-sand/30 p-3 text-xs text-sand-dark mb-5">
          <Info size={16} className="shrink-0 mt-0.5" />
          <p>No backend is connected yet, so accounts can't be created or signed into right now. Your cart and wishlist still work without an account.</p>
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <Field label="Email" type="email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} required />
        <Field label="Password" type="password" value={form.password} onChange={(v) => setForm((f) => ({ ...f, password: v }))} required />

        {error && (
          <p className="flex items-center gap-2 text-sm text-coral"><AlertTriangle size={15} /> {error}</p>
        )}

        <button
          type="submit"
          disabled={submitting || !apiConfigured}
          className="w-full h-12 rounded-full bg-lagoon text-white font-medium hover:bg-lagoon-dark disabled:bg-mist disabled:text-ink/40 transition-colors"
        >
          {submitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="text-sm text-ink/60 mt-5 text-center">
        New here? <Link to="/register" state={{ from: location.state?.from }} className="text-lagoon-dark font-medium">Create an account</Link>
      </p>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', required }) {
  const id = `login-${label.toLowerCase()}`
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink mb-1">{label}</label>
      <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} className="w-full h-11 rounded-lg border border-mist px-3 text-sm" />
    </div>
  )
}
