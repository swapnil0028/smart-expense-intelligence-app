/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'

const ExpenseContext = createContext(null)
const STORAGE_KEY = 'expenseAppExpenseState'

function getInitialExpenseState() {
  if (typeof window === 'undefined') {
    return {
      expenses: [],
    }
  }

  const storedValue = window.localStorage.getItem(STORAGE_KEY)

  if (!storedValue) {
    return {
      expenses: [],
    }
  }

  try {
    const parsed = JSON.parse(storedValue)
    return {
      expenses: parsed.expenses || [],
    }
  } catch (error) {
    return {
      expenses: [],
    }
  }
}

export function ExpenseProvider({ children }) {
  const [expenseState, setExpenseState] = useState(getInitialExpenseState)

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ expenses: expenseState.expenses }),
    )
  }, [expenseState.expenses])

  return (
    <ExpenseContext.Provider value={{ expenseState, setExpenseState }}>
      {children}
    </ExpenseContext.Provider>
  )
}

export function useExpenseContext() {
  const context = useContext(ExpenseContext)

  if (!context) {
    throw new Error('useExpenseContext must be used within ExpenseProvider')
  }

  return context
}
