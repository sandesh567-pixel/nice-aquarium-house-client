// Service layer for products/categories.
//
// This automatically uses the real backend once VITE_API_BASE_URL is set
// (see client/.env.example) — otherwise it falls back to the mock catalog
// in src/data/products.js so the app works with zero setup. No component
// ever needs to know which source is active.
import { products, getProductBySlug, getProductsByCategory, getRelatedProducts, featuredProducts, newArrivals } from '../data/products'
import { categories, getCategory } from '../data/categories'
import { apiFetch, isApiConfigured } from './api'

const delay = (ms = 250) => new Promise((res) => setTimeout(res, ms))

export async function fetchProducts({ category, search, sort, minPrice, maxPrice, difficulty, inStockOnly } = {}) {
  if (isApiConfigured()) {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (search) params.set('search', search)
    if (sort) params.set('sort', sort)
    if (minPrice != null) params.set('minPrice', minPrice)
    if (maxPrice != null) params.set('maxPrice', maxPrice)
    if (difficulty) params.set('difficulty', difficulty)
    if (inStockOnly) params.set('inStockOnly', 'true')
    const data = await apiFetch(`/products?${params.toString()}`)
    return data.products
  }

  await delay()
  let list = [...products]
  if (category) list = list.filter((p) => p.category === category)
  if (search) {
    const q = search.trim().toLowerCase()
    list = list.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.subcategory || '').toLowerCase().includes(q) ||
      (p.scientificName || '').toLowerCase().includes(q)
    )
  }
  if (difficulty) list = list.filter((p) => p.difficulty === difficulty)
  if (inStockOnly) list = list.filter((p) => p.stock > 0)
  if (minPrice != null) list = list.filter((p) => (p.discountPrice || p.price) >= minPrice)
  if (maxPrice != null) list = list.filter((p) => (p.discountPrice || p.price) <= maxPrice)

  switch (sort) {
    case 'price-asc': list.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price)); break
    case 'price-desc': list.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price)); break
    case 'rating': list.sort((a, b) => b.rating - a.rating); break
    case 'newest': list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break
    case 'best-selling': list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0)); break
    default: break
  }
  return list
}

// Admin-only: same /products endpoint as fetchProducts(), but returns the
// full paginated envelope ({ products, total, page, pages }) instead of
// just the array, so AdminProducts.jsx can show page controls. Kept
// separate from fetchProducts() rather than changing its return shape,
// since every other caller (Shop.jsx, Wishlist.jsx, Home.jsx, Cart.jsx)
// expects a plain array.
export async function fetchProductsPage({ page = 1, limit = 24 } = {}) {
  if (isApiConfigured()) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    return apiFetch(`/products?${params.toString()}`)
  }

  await delay()
  const total = products.length
  const pages = Math.max(1, Math.ceil(total / limit))
  const start = (page - 1) * limit
  return { products: products.slice(start, start + limit), total, page, pages }
}

export async function fetchProductBySlug(slug) {
  if (isApiConfigured()) {
    try {
      const data = await apiFetch(`/products/${encodeURIComponent(slug)}`)
      return data.product
    } catch {
      return null
    }
  }
  await delay(150)
  return getProductBySlug(slug) || null
}

export async function fetchRelatedProducts(product, limit = 4) {
  if (isApiConfigured()) {
    const data = await apiFetch(`/products/${encodeURIComponent(product.slug)}/related`)
    return data.products.slice(0, limit)
  }
  await delay(150)
  return getRelatedProducts(product, limit)
}

export async function fetchCategories() {
  if (isApiConfigured()) {
    const data = await apiFetch('/categories')
    return data.categories
  }
  await delay(100)
  return categories
}

export async function fetchCategory(slug) {
  if (isApiConfigured()) {
    try {
      const data = await apiFetch(`/categories/${encodeURIComponent(slug)}`)
      return data.category
    } catch {
      return null
    }
  }
  await delay(100)
  return getCategory(slug) || null
}

export async function fetchFeatured() {
  if (isApiConfigured()) {
    const data = await apiFetch('/products?sort=best-selling&limit=8')
    return data.products
  }
  await delay(150)
  return featuredProducts
}

export async function fetchNewArrivals() {
  if (isApiConfigured()) {
    const data = await apiFetch('/products?sort=newest&limit=8')
    return data.products
  }
  await delay(150)
  return newArrivals
}

export { getProductsByCategory }
