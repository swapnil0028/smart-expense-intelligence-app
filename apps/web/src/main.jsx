import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BudgetProvider } from './context/BudgetContext.jsx'
import { ExpenseProvider } from './context/ExpenseContext.jsx'
import { HistoryProvider } from './context/HistoryContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BudgetProvider>
        <ExpenseProvider>
          <HistoryProvider>
            <App />
          </HistoryProvider>
        </ExpenseProvider>
      </BudgetProvider>
    </ThemeProvider>
  </StrictMode>,
)
