import { createContext, useContext, useEffect, useState } from 'react'
import { isApiConfigured, getToken, setToken } from '../services/api'
import { registerUser, loginUser, logoutUser, fetchCurrentUser, updateCurrentUser } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isApiConfigured() || !getToken()) {
      setLoading(false)
      return
    }
    fetchCurrentUser()
      .then(setUser)
      .catch(() => setToken(null))
      .finally(() => setLoading(false))
  }, [])

  const wrap = (fn) => async (...args) => {
    setError(null)
    try {
      const u = await fn(...args)
      if (u) setUser(u)
      return u
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const register = wrap(registerUser)
  const login = wrap(loginUser)
  const updateProfile = wrap(updateCurrentUser)

  const logout = () => {
    logoutUser()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, isAuthenticated: !!user, apiConfigured: isApiConfigured(), register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
