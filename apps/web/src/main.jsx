import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext.jsx'
import { BudgetProvider } from './context/BudgetContext.jsx'
import { ExpenseProvider } from './context/ExpenseContext.jsx'
import { HistoryProvider } from './context/HistoryContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <BudgetProvider>
          <ExpenseProvider>
            <HistoryProvider>
              <App />
            </HistoryProvider>
          </ExpenseProvider>
        </BudgetProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)
