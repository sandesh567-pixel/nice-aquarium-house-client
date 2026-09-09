import { apiFetch } from './api'

// Thin wrapper over the existing backend wishlist API (server/routes/wishlistRoutes.js).
// No new routes/controllers/models — this just calls what's already there,
// the same way authService.js and orderService.js call auth/orders.

export async function fetchWishlist() {
  const data = await apiFetch('/wishlist', { auth: true })
  return data.wishlist // { products: [...populated product docs] }
}

export async function addToWishlist(productId) {
  const data = await apiFetch('/wishlist', { method: 'POST', auth: true, body: { productId } })
  return data.wishlist
}

export async function removeFromWishlist(productId) {
  const data = await apiFetch(`/wishlist/${encodeURIComponent(productId)}`, { method: 'DELETE', auth: true })
  return data.wishlist
}
