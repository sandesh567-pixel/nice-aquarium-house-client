import { apiFetch } from './api'

// Thin wrapper over the existing backend admin API (server/routes/adminRoutes.js)
// and the existing admin-only product routes (server/routes/productRoutes.js).
// No new backend code — everything here already existed and was already
// smoke-tested at the HTTP level; this file just gives the frontend admin
// screens something to call.

export async function fetchDashboardStats() {
  return apiFetch('/admin/stats', { auth: true })
}

// Product management — POST/PUT/DELETE/PATCH on /api/products are already
// adminOnly-gated server-side. Reads (list/detail) reuse productService.js
// as-is; these are only the mutating calls that didn't exist yet.
export async function createProduct(payload) {
  const data = await apiFetch('/products', { method: 'POST', auth: true, body: payload })
  return data.product
}

export async function updateProduct(id, payload) {
  const data = await apiFetch(`/products/${encodeURIComponent(id)}`, { method: 'PUT', auth: true, body: payload })
  return data.product
}

export async function deleteProduct(id) {
  return apiFetch(`/products/${encodeURIComponent(id)}`, { method: 'DELETE', auth: true })
}

export async function updateProductStock(id, stock) {
  const data = await apiFetch(`/products/${encodeURIComponent(id)}/stock`, { method: 'PATCH', auth: true, body: { stock } })
  return data.product
}

// Category management — POST/PUT/DELETE on /api/categories are already
// adminOnly-gated server-side (reads are public). Reads reuse
// productService.js's fetchCategories()/fetchCategory() as-is; these are
// only the mutating calls that didn't exist yet.
export async function createCategory(payload) {
  const data = await apiFetch('/categories', { method: 'POST', auth: true, body: payload })
  return data.category
}

export async function updateCategory(slug, payload) {
  const data = await apiFetch(`/categories/${encodeURIComponent(slug)}`, { method: 'PUT', auth: true, body: payload })
  return data.category
}

export async function deleteCategory(slug) {
  return apiFetch(`/categories/${encodeURIComponent(slug)}`, { method: 'DELETE', auth: true })
}
