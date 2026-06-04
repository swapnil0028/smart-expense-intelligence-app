/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getCurrentUser, login as loginRequest, logout as logoutRequest, register as registerRequest } from '../services/authService.js'

const AuthContext = createContext(null)
const STORAGE_TOKEN_KEY = 'expenseAppAuthToken'
const STORAGE_USER_KEY = 'expenseAppUser'

function getInitialAuthState() {
  if (typeof window === 'undefined') {
    return { token: null, user: null, status: 'ready' }
  }

  const token = window.localStorage.getItem(STORAGE_TOKEN_KEY)
  const userJson = window.localStorage.getItem(STORAGE_USER_KEY)
  const user = userJson ? JSON.parse(userJson) : null
  const status = token ? 'loading' : 'ready'

  return { token, user, status }
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(getInitialAuthState)
  const { token, user, status } = authState

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (token) {
      window.localStorage.setItem(STORAGE_TOKEN_KEY, token)
    } else {
      window.localStorage.removeItem(STORAGE_TOKEN_KEY)
    }

    if (user) {
      window.localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user))
    } else {
      window.localStorage.removeItem(STORAGE_USER_KEY)
    }
  }, [token, user])

  useEffect(() => {
    if (status !== 'loading') return

    async function fetchUser() {
      const result = await getCurrentUser(token)
      if (result.success) {
        setAuthState({ token, user: result.user, status: 'ready' })
      } else {
        setAuthState({ token: null, user: null, status: 'ready' })
      }
    }

    fetchUser()
  }, [token, status])

  const login = async (email, password) => {
    const result = await loginRequest(email, password)
    if (result.success) {
      setAuthState({ token: result.token, user: result.user, status: 'ready' })
    }
    return result
  }

  const register = async (name, email, password) => {
    const result = await registerRequest(name, email, password)
    if (result.success) {
      setAuthState({ token: result.token, user: result.user, status: 'ready' })
    }
    return result
  }

  const logout = async () => {
    await logoutRequest(token)
    setAuthState({ token: null, user: null, status: 'ready' })
  }

  const value = useMemo(
    () => ({ token, user, status, login, logout, register, isAuthenticated: Boolean(user) }),
    [token, user, status],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }
  return context
}
