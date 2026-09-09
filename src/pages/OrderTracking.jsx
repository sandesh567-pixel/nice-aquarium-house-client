import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CircleCheck, Circle, AlertTriangle, Info } from '../utils/icons.jsx'
import { trackOrder } from '../services/orderService'
import { isApiConfigured } from '../services/api'

const stages = ['Pending', 'Confirmed', 'Processing', 'Packed', 'Out for Delivery', 'Delivered']

export default function OrderTracking() {
  const { state } = useLocation()
  const [orderNumberInput, setOrderNumberInput] = useState(state?.orderId || '')
  const [lookupNumber, setLookupNumber] = useState(state?.orderId || '')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(!!state?.orderId)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!lookupNumber) return
    if (!isApiConfigured()) {
      setLoading(false)
      return
    }
    let active = true
    setLoading(true)
    setError('')
    setOrder(null)
    trackOrder(lookupNumber)
      .then((o) => { if (active) setOrder(o) })
      .catch((err) => { if (active) setError(err.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [lookupNumber])

  const submitLookup = (e) => {
    e.preventDefault()
    if (orderNumberInput.trim()) setLookupNumber(orderNumberInput.trim())
  }

  const currentStageIndex = order ? stages.indexOf(order.status) : -1

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
      <h1 className="font-display text-2xl sm:text-3xl text-ink mb-6">Track Your Order</h1>

      {!lookupNumber ? (
        <form onSubmit={submitLookup} className="flex gap-2 mb-8">
          <input
            value={orderNumberInput}
            onChange={(e) => setOrderNumberInput(e.target.value)}
            placeholder="Enter your order number e.g. AQ-10024"
            className="flex-1 h-12 rounded-full border border-mist px-4 text-sm"
          />
          <button type="submit" className="h-12 px-6 rounded-full bg-lagoon text-white font-medium">Track</button>
        </form>
      ) : !isApiConfigured() ? (
        <div className="flex items-start gap-2 rounded-xl bg-sand/10 border border-sand/30 p-4 text-sm text-sand-dark">
          <Info size={18} className="shrink-0 mt-0.5" />
          <p>No backend is connected yet, so order tracking isn't available in this demo.</p>
        </div>
      ) : loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-5 w-40 bg-mist rounded" />
          <div className="h-32 bg-mist rounded-xl" />
        </div>
      ) : error ? (
        <div className="flex items-start gap-2 rounded-xl bg-coral/10 border border-coral/30 p-4 text-sm text-coral">
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          <div>
            <p>Couldn't find that order ({error}).</p>
            <button onClick={() => { setLookupNumber(''); setOrderNumberInput('') }} className="mt-2 text-sm font-medium underline">
              Try another order number
            </button>
          </div>
        </div>
      ) : order ? (
        <>
          <p className="font-mono text-lagoon-dark font-medium mb-8">Order #{order.orderNumber}</p>
          {order.status === 'Cancelled' ? (
            <p className="text-sm text-coral font-medium">This order was cancelled.</p>
          ) : (
            <ol className="relative border-l-2 border-mist ml-3">
              {stages.map((s, i) => {
                const done = i <= currentStageIndex
                return (
                  <li key={s} className="mb-8 ml-6 last:mb-0">
                    <span className={`absolute -left-[11px] flex h-5 w-5 items-center justify-center rounded-full ${done ? 'bg-lagoon text-white' : 'bg-white border-2 border-mist text-ink/30'}`}>
                      {done ? <CircleCheck size={14} /> : <Circle size={10} />}
                    </span>
                    <p className={`font-medium ${done ? 'text-ink' : 'text-ink/40'}`}>{s}</p>
                  </li>
                )
              })}
            </ol>
          )}
        </>
      ) : null}
    </div>
  )
}
