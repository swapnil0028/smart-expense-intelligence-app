/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)
const THEME_STORAGE_KEY = 'expenseAppTheme'
const defaultTheme = 'light'

function getInitialTheme() {
  if (typeof window === 'undefined') {
    return defaultTheme
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
  return storedTheme === 'dark' ? 'dark' : defaultTheme
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const value = {
    theme,
    setTheme,
    toggleTheme: () => setTheme((current) => (current === 'light' ? 'dark' : 'light')),
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useThemeContext() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider')
  }

  return context
}
