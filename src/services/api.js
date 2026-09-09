// Every real API call in this app goes through here. When VITE_API_BASE_URL
// is not set, the app runs entirely on mock data (see productService.js) —
// this file is only exercised once a backend is actually configured.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || null
export const isApiConfigured = () => !!API_BASE_URL

const TOKEN_KEY = 'nah_auth_token'

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export const setToken = (token) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* storage unavailable */
  }
}

export async function apiFetch(path, { method = 'GET', body, auth = false } = {}) {
  if (!API_BASE_URL) {
    throw new Error('API is not configured — set VITE_API_BASE_URL to use live data.')
  }

  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  let res
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('Could not reach the server. Check your connection and try again.')
  }

  let data = null
  try {
    data = await res.json()
  } catch {
    /* empty or non-JSON response body */
  }

  if (!res.ok) {
    throw new Error(data?.message || `Request failed (${res.status})`)
  }
  return data
}
