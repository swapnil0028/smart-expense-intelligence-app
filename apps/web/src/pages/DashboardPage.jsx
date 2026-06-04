import { useMemo, useEffect, useState } from 'react'
import BudgetSummary from '../components/BudgetSummary'
import ExpenseForm from '../components/ExpenseForm'
import GraphSection from '../components/GraphSection'
import { useBudgetContext } from '../context/BudgetContext.jsx'
import { useExpenseContext } from '../context/ExpenseContext.jsx'
import { useAuthContext } from '../context/AuthContext.jsx'

const createExpense = () => ({
  id: crypto.randomUUID(),
  amount: '',
  category: '',
  date: '',
  description: '',
})

export default function DashboardPage() {
  const { budgetState, setBudgetState } = useBudgetContext()
  const { expenseState, setExpenseState } = useExpenseContext()
  const [saveStatus, setSaveStatus] = useState('')

  const budget = budgetState.dashboardBudget
  const expenses = expenseState.expenses
  const { token } = useAuthContext()

  const totalBudget = Number(budget) || 0

  const totalExpenses = useMemo(
    () =>
      expenses.reduce((total, expense) => {
        return total + (Number(expense.amount) || 0)
      }, 0),
    [expenses],
  )

  const remainingBudget = totalBudget - totalExpenses

  const updateExpense = (id, field, value) => {
    setExpenseState((state) => ({
      ...state,
      expenses: state.expenses.map((expense) =>
        expense.id === id ? { ...expense, [field]: value } : expense,
      ),
    }))
  }

  const addExpenseRow = () => {
    setExpenseState((state) => ({
      ...state,
      expenses: [...state.expenses, createExpense()],
    }))
  }

  const deleteExpenseRow = (id) => {
    setExpenseState((state) => ({
      ...state,
      expenses: state.expenses.filter((expense) => expense.id !== id),
    }))
  }

  const hasUnsaved = expenses.some((e) => !e.id || e.id.length !== 24)

  // Load expenses from backend on mount
  useEffect(() => {
    async function loadExpenses() {
      try {
        const res = await fetch('/api/expenses', {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        })
        if (!res.ok) return
        const data = await res.json()
        const normalized = data.map((e) => ({
          id: e._id || e.id || crypto.randomUUID(),
          amount: e.amount,
          category: e.category,
          date: e.date ? e.date.split('T')[0] : '',
          description: e.description || '',
        }))
        setExpenseState((state) => ({ ...state, expenses: normalized }))
      } catch (err) {
        console.error('Failed to load expenses from API', err)
      }
    }

    loadExpenses()
  }, [setExpenseState])

  // Save any local-only expenses (those with non-mongo ids)
  const saveExpenses = async () => {
    setSaveStatus('')
    const unsaved = expenses.filter((e) => !e.id || e.id.length !== 24)
    if (unsaved.length === 0) {
      setSaveStatus('No new expenses to save')
      return
    }

    let saveError = false

    for (const e of unsaved) {
      try {
        const payload = {
          amount: Number(e.amount) || 0,
          category: e.category,
          description: e.description,
          date: e.date,
        }
        const res = await fetch('/api/expenses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
          },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          const text = await res.text()
          console.error('Expense save failed:', res.status, text)
          saveError = true
          continue
        }

        const saved = await res.json()
        setExpenseState((state) => ({
          ...state,
          expenses: state.expenses.map((ex) =>
            ex.id === e.id
              ? {
                  id: saved._id || ex.id,
                  amount: saved.amount,
                  category: saved.category,
                  date: saved.date ? saved.date.split('T')[0] : '',
                  description: saved.description || '',
                }
              : ex,
          ),
        }))
      } catch (err) {
        console.error('Expense save error:', err)
        saveError = true
      }
    }

    try {
      const resAll = await fetch('/api/expenses', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      })
      if (resAll.ok) {
        const all = await resAll.json()
        const normalized = all.map((e) => ({
          id: e._id || e.id || crypto.randomUUID(),
          amount: e.amount,
          category: e.category,
          date: e.date ? e.date.split('T')[0] : '',
          description: e.description || '',
        }))
        setExpenseState((state) => ({ ...state, expenses: normalized }))
        setSaveStatus(saveError ? 'Saved with some errors' : 'Expenses saved successfully')
      } else {
        setSaveStatus('Failed to refresh saved expenses')
      }
    } catch (err) {
      console.error('Expense reload error:', err)
      setSaveStatus('Failed to refresh expenses')
    }
  }

  return (
    <div className="dashboard-content">
      <section className="period-selection" aria-label="Period selection">
        <select aria-label="Select month" defaultValue="June">
          <option>June</option>
        </select>

        <select aria-label="Select year" defaultValue="2026">
          <option>2026</option>
        </select>

        <select aria-label="Select view" defaultValue="Monthly">
          <option>Monthly</option>
          <option>Weekly</option>
        </select>
      </section>

      <BudgetSummary
        budget={budget}
        onBudgetChange={(value) =>
          setBudgetState((state) => ({ ...state, dashboardBudget: value }))
        }
        remainingBudget={remainingBudget}
        totalBudget={totalBudget}
        totalExpenses={totalExpenses}
      />

      {expenses.length > 0 ? (
        <ExpenseForm
          expenses={expenses}
          onAddExpense={addExpenseRow}
          onDeleteExpense={deleteExpenseRow}
          onUpdateExpense={updateExpense}
        />
      ) : (
        <section className="empty-state">
          <h2>No expenses found.</h2>
          <p>Add your first expense to start tracking spending.</p>
          <button className="primary-button" type="button" onClick={addExpenseRow}>
            Add first expense
          </button>
        </section>
      )}

      {hasUnsaved && (
        <div style={{ margin: '12px 0' }}>
          <button className="primary-button" type="button" onClick={saveExpenses}>
            Save Expenses
          </button>
          {saveStatus && (
            <p className="save-status" style={{ marginTop: '8px' }}>
              {saveStatus}
            </p>
          )}
        </div>
      )}

      <GraphSection />
    </div>
  )
}
