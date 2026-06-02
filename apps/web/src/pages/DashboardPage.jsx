import { useMemo } from 'react'
import BudgetSummary from '../components/BudgetSummary'
import ExpenseForm from '../components/ExpenseForm'
import GraphSection from '../components/GraphSection'
import { useBudgetContext } from '../context/BudgetContext.jsx'
import { useExpenseContext } from '../context/ExpenseContext.jsx'

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

  const budget = budgetState.dashboardBudget
  const expenses = expenseState.expenses

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

      <GraphSection />
    </div>
  )
}
