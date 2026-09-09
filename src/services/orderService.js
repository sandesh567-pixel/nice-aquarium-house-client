import { apiFetch } from './api'

export async function submitOrder({ items, customer, deliveryAddress, deliveryMethod, paymentMethod }) {
  const payload = {
    items: items.map((i) => ({ productId: i.id, qty: i.qty })),
    customer,
    deliveryAddress,
    deliveryMethod,
    paymentMethod,
  }
  const data = await apiFetch('/orders', { method: 'POST', auth: true, body: payload })
  return data.order
}

export async function trackOrder(orderNumber) {
  const data = await apiFetch(`/orders/track/${encodeURIComponent(orderNumber)}`, { auth: true })
  return data.order
}

export async function fetchMyOrders() {
  const data = await apiFetch('/orders/mine', { auth: true })
  return data.orders
}

// --- Admin ---

export async function fetchAllOrders({ status } = {}) {
  const params = new URLSearchParams()
  if (status) params.set('status', status)
  const qs = params.toString()
  const data = await apiFetch(`/orders${qs ? `?${qs}` : ''}`, { auth: true })
  return data.orders
}

export async function updateOrderStatus(id, status) {
  const data = await apiFetch(`/orders/${encodeURIComponent(id)}/status`, { method: 'PATCH', auth: true, body: { status } })
  return data.order
}
