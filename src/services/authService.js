import { apiFetch, setToken } from './api'

export async function registerUser({ name, email, password, phone }) {
  const data = await apiFetch('/auth/register', { method: 'POST', body: { name, email, password, phone } })
  setToken(data.token)
  return data.user
}

export async function loginUser({ email, password }) {
  const data = await apiFetch('/auth/login', { method: 'POST', body: { email, password } })
  setToken(data.token)
  return data.user
}

export function logoutUser() {
  setToken(null)
}

export async function fetchCurrentUser() {
  const data = await apiFetch('/auth/me', { auth: true })
  return data.user
}

export async function updateCurrentUser({ name, phone }) {
  const data = await apiFetch('/auth/me', { method: 'PUT', auth: true, body: { name, phone } })
  return data.user
}
