import { apiFetch } from './api'

// Thin wrapper over the existing backend review API (server/routes/reviewRoutes.js).
// No new routes/controllers/models — this just calls what's already there,
// the same way wishlistService.js and orderService.js call wishlist/orders.
//
// Reviews have no offline/mock fallback (unlike products/wishlist) — there's
// no local review data to fall back to, so these calls only ever run when a
// backend is connected. Callers should check isApiConfigured() first.

export async function fetchReviews(slug) {
  const data = await apiFetch(`/products/${encodeURIComponent(slug)}/reviews`)
  return data.reviews
}

export async function submitReview(slug, { rating, text }) {
  const data = await apiFetch(`/products/${encodeURIComponent(slug)}/reviews`, {
    method: 'POST',
    auth: true,
    body: { rating, text },
  })
  return data.review
}

export async function deleteReview(id) {
  await apiFetch(`/reviews/${encodeURIComponent(id)}`, { method: 'DELETE', auth: true })
}
