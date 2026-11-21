import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronRight, AlertTriangle } from '../utils/icons.jsx'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { submitOrder } from '../services/orderService'
import { isApiConfigured } from '../services/api'
import EmptyState from '../components/ui/EmptyState'

const DELIVERY_CHARGE = 100
const CITIES = ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Chitwan', 'Biratnagar', 'Butwal']
const steps = ['Customer Info', 'Delivery Address', 'Delivery Method', 'Payment', 'Review']

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [placing, setPlacing] = useState(false)
  const [placeError, setPlaceError] = useState('')
  const [form, setForm] = useState({
    fullName: '', phone: '', email: '',
    address: '', city: CITIES[0], postalCode: '', instructions: '',
    deliveryMethod: 'standard',
    paymentMethod: 'cod',
  })

  // Require login before checking out when backend is connected
  useEffect(() => {
    if (isApiConfigured() && !authLoading && !isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' }, replace: true })
    }
  }, [authLoading, isAuthenticated, navigate])

  // Pre-fill customer details from signed-in account
  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        fullName: f.fullName || user.name || '',
        phone: f.phone || user.phone || '',
        email: f.email || user.email || '',
      }))
    }
  }, [user])

  const update = (patch) => setForm((f) => ({ ...f, ...patch }))

  if (isApiConfigured() && (authLoading || !isAuthenticated)) {
    return null
  }

  if (items.length === 0 && !placing) {
    return (
      <EmptyState
        emoji="🛒"
        title="Your cart is empty"
        message="Add a few products before checking out."
        actionLabel="Start Shopping"
        actionTo="/shop"
      />
    )
  }

  const delivery = form.deliveryMethod === 'express' ? DELIVERY_CHARGE * 2 : DELIVERY_CHARGE
  const total = subtotal + delivery

  const canProceed = () => {
    if (step === 0) return form.fullName.trim() && form.phone.trim() && form.email.trim()
    if (step === 1) return form.address.trim() && form.city && form.postalCode.trim()
    return true
  }

  const placeOrder = async () => {
    setPlacing(true)
    setPlaceError('')

    if (isApiConfigured()) {
      try {
        const order = await submitOrder({
          items,
          customer: { fullName: form.fullName, phone: form.phone, email: form.email },
          deliveryAddress: { address: form.address, city: form.city, postalCode: form.postalCode, instructions: form.instructions },
          deliveryMethod: form.deliveryMethod,
          paymentMethod: form.paymentMethod,
        })
        clearCart()
        navigate('/order-confirmed', { state: { orderId: order.orderNumber } })
      } catch (err) {
        setPlaceError(err.message)
        setPlacing(false)
      }
      return
    }

    // No backend configured — simulate order placement so the flow is still demo-able.
    setTimeout(() => {
      const orderId = `AQ-${Math.floor(10000 + Math.random() * 89999)}`
      clearCart()
      navigate('/order-confirmed', { state: { orderId } })
    }, 700)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-10">
      <h1 className="font-display text-2xl sm:text-3xl text-ink mb-6">Checkout</h1>

      {/* Step indicator */}
      <ol className="flex items-center gap-1 mb-8 overflow-x-auto no-scrollbar text-xs sm:text-sm">
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-1 shrink-0">
            <span className={`flex items-center gap-1.5 ${i === step ? 'text-lagoon-dark font-semibold' : i < step ? 'text-reef' : 'text-ink/40'}`}>
              <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[11px] ${i <= step ? 'bg-lagoon text-white' : 'bg-mist text-ink/50'}`}>
                {i < step ? <Check size={12} /> : i + 1}
              </span>
              {s}
            </span>
            {i < steps.length - 1 && <ChevronRight size={14} className="text-ink/20 mx-1" />}
          </li>
        ))}
      </ol>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 rounded-2xl border border-mist bg-white p-5 sm:p-6">
          {step === 0 && (
            <div className="space-y-4">
              <Field label="Full Name" value={form.fullName} onChange={(v) => update({ fullName: v })} required />
              <Field label="Phone" type="tel" value={form.phone} onChange={(v) => update({ phone: v })} required />
              <Field label="Email" type="email" value={form.email} onChange={(v) => update({ email: v })} required />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <Field label="Address" value={form.address} onChange={(v) => update({ address: v })} required />
              <div>
                <label className="block text-sm font-medium text-ink mb-1">City</label>
                <select value={form.city} onChange={(e) => update({ city: e.target.value })} className="w-full h-11 rounded-lg border border-mist px-3 text-sm">
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <Field label="Postal Code" value={form.postalCode} onChange={(v) => update({ postalCode: v })} required />
              <Field label="Delivery Instructions (optional)" value={form.instructions} onChange={(v) => update({ instructions: v })} textarea />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              {[
                { id: 'standard', label: 'Standard Delivery', desc: '2–4 business days', price: DELIVERY_CHARGE },
                { id: 'express', label: 'Express Delivery', desc: 'Next business day, where available', price: DELIVERY_CHARGE * 2 },
              ].map((opt) => (
                <label key={opt.id} className={`flex items-center justify-between rounded-xl border p-4 cursor-pointer ${form.deliveryMethod === opt.id ? 'border-lagoon bg-lagoon/5' : 'border-mist'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="delivery" checked={form.deliveryMethod === opt.id} onChange={() => update({ deliveryMethod: opt.id })} />
                    <div>
                      <p className="font-medium text-ink text-sm">{opt.label}</p>
                      <p className="text-xs text-ink/50">{opt.desc}</p>
                    </div>
                  </div>
                  <span className="font-mono text-sm text-ink">Rs. {opt.price}</span>
                </label>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              {[
                { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
                { id: 'online', label: 'Online Payment', desc: 'eSewa, Khalti or card — processed securely' },
              ].map((opt) => (
                <label key={opt.id} className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer ${form.paymentMethod === opt.id ? 'border-lagoon bg-lagoon/5' : 'border-mist'}`}>
                  <input type="radio" name="payment" checked={form.paymentMethod === opt.id} onChange={() => update({ paymentMethod: opt.id })} />
                  <div>
                    <p className="font-medium text-ink text-sm">{opt.label}</p>
                    <p className="text-xs text-ink/50">{opt.desc}</p>
                  </div>
                </label>
              ))}
              <p className="text-xs text-ink/40 pt-1">This is a demo checkout — no real payment is processed. A payment provider can be connected here later.</p>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5 text-sm">
              <div>
                <h3 className="font-medium text-ink mb-1">Customer</h3>
                <p className="text-ink/60">{form.fullName} · {form.phone} · {form.email}</p>
              </div>
              <div>
                <h3 className="font-medium text-ink mb-1">Deliver To</h3>
                <p className="text-ink/60">{form.address}, {form.city} {form.postalCode}</p>
                {form.instructions && <p className="text-ink/40 text-xs mt-1">Note: {form.instructions}</p>}
              </div>
              <div>
                <h3 className="font-medium text-ink mb-1">Delivery</h3>
                <p className="text-ink/60">{form.deliveryMethod === 'express' ? 'Express Delivery' : 'Standard Delivery'} · Rs. {delivery}</p>
              </div>
              <div>
                <h3 className="font-medium text-ink mb-1">Payment</h3>
                <p className="text-ink/60">{form.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
              </div>

              {placeError && (
                <p className="flex items-center gap-2 text-sm text-coral"><AlertTriangle size={15} /> {placeError}</p>
              )}
            </div>
          )}

          <div className="flex items-center justify-between mt-6 pt-5 border-t border-mist">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="h-11 px-5 rounded-full border border-mist text-sm font-medium text-ink hover:bg-mist"
              >
                Back
              </button>
            ) : <span />}

            {step < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canProceed()}
                className="h-11 px-6 rounded-full bg-lagoon text-white text-sm font-medium hover:bg-lagoon-dark disabled:bg-mist disabled:text-ink/40 transition-colors"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={placeOrder}
                disabled={placing}
                className="h-11 px-6 rounded-full bg-lagoon text-white text-sm font-medium hover:bg-lagoon-dark disabled:bg-mist disabled:text-ink/40 transition-colors"
              >
                {placing ? 'Placing order...' : 'Place Order'}
              </button>
            )}
          </div>
        </div>

        {/* Order summary */}
        <aside className="rounded-2xl border border-mist bg-white p-5 h-fit">
          <h2 className="font-display text-lg text-ink mb-4">Order Summary</h2>
          <ul className="space-y-2 text-sm mb-4">
            {items.map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-3">
                <span className="text-ink/70">{item.name} × {item.qty}</span>
                <span className="font-mono text-ink shrink-0">Rs. {(item.price * item.qty).toLocaleString()}</span>
              </li>
            ))}
          </ul>
          <div className="space-y-1.5 text-sm border-t border-mist pt-3">
            <div className="flex justify-between text-ink/60">
              <span>Subtotal</span>
              <span className="font-mono">Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-ink/60">
              <span>Delivery</span>
              <span className="font-mono">Rs. {delivery}</span>
            </div>
            <div className="flex justify-between font-semibold text-ink pt-2 border-t border-mist">
              <span>Total</span>
              <span className="font-mono">Rs. {total.toLocaleString()}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', required, textarea }) {
  const id = `checkout-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
  const common = {
    id,
    value,
    onChange: (e) => onChange(e.target.value),
    required,
  }
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink mb-1">{label}</label>
      {textarea ? (
        <textarea {...common} rows={3} className="w-full rounded-lg border border-mist px-3 py-2 text-sm" />
      ) : (
        <input {...common} type={type} className="w-full h-11 rounded-lg border border-mist px-3 text-sm" />
      )}
    </div>
  )
}
