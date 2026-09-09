import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2 } from '../utils/icons.jsx'
import { useCart } from '../context/CartContext'
import { fetchProducts } from '../services/productService'
import ProductTile from '../components/product/ProductTile'
import { useCategories } from '../context/CategoryContext'
import EmptyState from '../components/ui/EmptyState'

const DELIVERY_CHARGE = 100 // NPR — configurable, not hard-coded elsewhere in the UI

export default function Cart() {
  const { getCategory } = useCategories()
  const { items, updateQty, removeItem, subtotal } = useCart()

  // Cart items only store a lightweight snapshot (see CartContext.addItem)
  // — no stock field. Reuse the same pattern Wishlist.jsx already uses to
  // resolve full product data (the mock/live-aware productService), so
  // the "+" button can be capped at each item's current available stock,
  // matching the ceiling ProductDetail.jsx already applies. If this fetch
  // fails, the ceiling is simply not applied — this is a soft UX
  // improvement, not the source of truth; the backend still re-validates
  // stock at checkout regardless.
  const [stockById, setStockById] = useState({})

  useEffect(() => {
    let active = true
    fetchProducts()
      .then((products) => {
        if (!active) return
        const map = {}
        products.forEach((p) => { map[p.id] = p.stock })
        setStockById(map)
      })
      .catch(() => {
        /* no ceiling applied — see comment above */
      })
    return () => { active = false }
  }, [])

  if (items.length === 0) {
    return (
      <EmptyState
        emoji="🐠"
        title="Your cart is empty"
        message="Looks like your aquarium is waiting for something special."
        actionLabel="Start Shopping"
        actionTo="/shop"
      />
    )
  }

  const delivery = DELIVERY_CHARGE
  const total = subtotal + delivery

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-10">
      <h1 className="font-display text-2xl sm:text-3xl text-ink mb-6">Your Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => {
            const category = getCategory(item.category)
            const available = stockById[item.id] // undefined until loaded, or if the product can't be found
            const canIncrease = available === undefined || item.qty < available
            const outOfStock = available === 0
            return (
              <div key={item.id} className="flex gap-3 sm:gap-4 rounded-2xl border border-mist bg-white p-3 sm:p-4">
                <Link to={`/products/${item.slug}`} className="h-20 w-20 sm:h-24 sm:w-24 rounded-xl overflow-hidden shrink-0">
                  <ProductTile tile={item.tile} icon={category?.icon} className="h-full w-full" bubbles={false} />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${item.slug}`} className="font-medium text-ink hover:text-lagoon-dark line-clamp-1">{item.name}</Link>
                  <p className="text-xs text-ink/50 mt-0.5">{category?.name}</p>
                  <p className="font-mono text-sm text-ink mt-1">Rs. {item.price.toLocaleString('en-IN')}</p>
                  {outOfStock && <p className="text-xs text-coral font-medium mt-1">Out of stock</p>}

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center rounded-full border border-mist h-9">
                      <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-9 h-9 flex items-center justify-center text-ink" aria-label={`Decrease quantity of ${item.name}`}><Minus size={14} /></button>
                      <span className="w-7 text-center text-sm font-mono">{item.qty}</span>
                      <button
                        onClick={() => canIncrease && updateQty(item.id, item.qty + 1)}
                        disabled={!canIncrease}
                        className="w-9 h-9 flex items-center justify-center text-ink disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-ink/40 hover:text-coral h-9 w-9 flex items-center justify-center" aria-label={`Remove ${item.name} from cart`}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="hidden sm:block font-mono text-sm font-medium text-ink self-start">Rs. {(item.price * item.qty).toLocaleString('en-IN')}</p>
              </div>
            )
          })}
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-mist bg-white p-5 sticky top-24">
            <h2 className="font-display text-lg text-ink mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-ink/70"><span>Subtotal</span><span className="font-mono">Rs. {subtotal.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between text-ink/70"><span>Delivery</span><span className="font-mono">Rs. {delivery.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between font-semibold text-ink pt-2 border-t border-mist"><span>Total</span><span className="font-mono">Rs. {total.toLocaleString('en-IN')}</span></div>
            </div>
            <Link to="/checkout" className="mt-5 block text-center h-12 leading-[3rem] rounded-full bg-lagoon text-white font-medium hover:bg-lagoon-dark transition-colors">
              Proceed to Checkout
            </Link>
            <Link to="/shop" className="mt-3 block text-center text-sm text-lagoon-dark font-medium">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
