import { useEffect, useState } from 'react'
import { useThemeContext } from '../context/ThemeContext.jsx'

const currencyOptions = ['INR', 'USD', 'EUR']

export default function SettingsPage() {
  const { theme, setTheme, toggleTheme } = useThemeContext()
  const [currency, setCurrency] = useState('INR')

  useEffect(() => {
    const savedCurrency = window.localStorage.getItem('expenseAppCurrency')
    if (savedCurrency) {
      setCurrency(savedCurrency)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem('expenseAppCurrency', currency)
  }, [currency])

  return (
    <section className="settings-page">
      <div className="page-heading">
        <h1>Settings</h1>
        <p>Manage appearance, exports, currency, and account settings.</p>
      </div>

      <section className="settings-panel">
        <h2>Theme</h2>
        <div className="settings-row">
          <button
            type="button"
            className={theme === 'light' ? 'active-theme' : ''}
            onClick={() => setTheme('light')}
          >
            Light
          </button>
          <button
            type="button"
            className={theme === 'dark' ? 'active-theme' : ''}
            onClick={() => setTheme('dark')}
          >
            Dark
          </button>
          <button type="button" onClick={toggleTheme} className="secondary-button">
            Toggle theme
          </button>
        </div>
      </section>

      <section className="settings-panel">
        <h2>Currency</h2>
        <div className="settings-row">
          <label>
            Currency
            <select value={currency} onChange={(event) => setCurrency(event.target.value)}>
              {currencyOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="settings-panel">
        <h2>Export Data</h2>
        <div className="settings-row">
          <button type="button" onClick={() => window.alert('Export will be ready soon.')}>Export Data</button>
        </div>
      </section>

      <section className="settings-panel">
        <h2>Account</h2>
        <div className="settings-row">
          <div>
            <p className="settings-label">Username</p>
            <p className="settings-value">Demo User</p>
          </div>
          <button type="button">Manage account</button>
        </div>
      </section>
    </section>
  )
}
