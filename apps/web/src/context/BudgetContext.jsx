/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'

const BudgetContext = createContext(null)
const STORAGE_KEY = 'expenseAppBudgetState'

function getInitialBudgetState() {
  if (typeof window === 'undefined') {
    return {
      currentBudget: null,
      previousBudgets: [],
      dashboardBudget: '',
    }
  }

  const storedValue = window.localStorage.getItem(STORAGE_KEY)

  if (!storedValue) {
    return {
      currentBudget: null,
      previousBudgets: [],
      dashboardBudget: '',
    }
  }

  try {
    return JSON.parse(storedValue)
  } catch (error) {
    return {
      currentBudget: null,
      previousBudgets: [],
      dashboardBudget: '',
    }
  }
}

export function BudgetProvider({ children }) {
  const [budgetState, setBudgetState] = useState(getInitialBudgetState)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(budgetState))
  }, [budgetState])

  return (
    <BudgetContext.Provider value={{ budgetState, setBudgetState }}>
      {children}
    </BudgetContext.Provider>
  )
}

export function useBudgetContext() {
  const context = useContext(BudgetContext)

  if (!context) {
    throw new Error('useBudgetContext must be used within BudgetProvider')
  }

  return context
}
