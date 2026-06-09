/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'

const HistoryContext = createContext(null)

export function HistoryProvider({ children }) {
  const [historyState, setHistoryState] = useState({
    monthlyRecords: [],
  })

  return (
    <HistoryContext.Provider value={{ historyState, setHistoryState }}>
      {children}
    </HistoryContext.Provider>
  )
}

export function useHistoryContext() {
  const context = useContext(HistoryContext)

  if (!context) {
    throw new Error('useHistoryContext must be used within HistoryProvider')
  }

  return context
}
