import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { fetchCategories as fetchCategoriesService } from '../services/productService'

// Single source of truth for category data across the whole app —
// customer-facing pages and admin screens alike. Wraps the existing
// productService.fetchCategories(), which already auto-switches between
// the live API and the mock catalog depending on isApiConfigured(); this
// context adds nothing new there, it just fetches once and shares the
// result instead of every consumer re-fetching independently.
const CategoryContext = createContext(null)

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState(null) // null = loading
  const [error, setError] = useState(null)

  const reload = useCallback(() => {
    setError(null)
    return fetchCategoriesService()
      .then(setCategories)
      .catch((err) => setError(err.message))
  }, [])

  useEffect(() => { reload() }, [reload])

  const list = categories || []
  const getCategory = (slug) => list.find((c) => c.slug === slug)

  return (
    <CategoryContext.Provider value={{ categories: list, loading: categories === null, error, getCategory, reload }}>
      {children}
    </CategoryContext.Provider>
  )
}

export const useCategories = () => {
  const ctx = useContext(CategoryContext)
  if (!ctx) throw new Error('useCategories must be used within CategoryProvider')
  return ctx
}
