import { useMemo, useState } from 'react'

const createExpense = () => ({
  id: crypto.randomUUID(),
  amount: '',
  category: '',
  date: '',
  description: '',
})

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)

export default function DashboardPage() {
  const [budget, setBudget] = useState('')
  const [expenses, setExpenses] = useState([createExpense(), createExpense()])

  const categories = [
    'Food',
    'Business',
    'Travel',
    'Clothes',
    'Entertainment',
    'Education',
    'Health',
    'Bills',
    'Other',
  ]

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
    setExpenses((currentExpenses) =>
      currentExpenses.map((expense) =>
        expense.id === id ? { ...expense, [field]: value } : expense,
      ),
    )
  }

  const addExpenseRow = () => {
    setExpenses((currentExpenses) => [...currentExpenses, createExpense()])
  }

  const deleteExpenseRow = (id) => {
    setExpenses((currentExpenses) =>
      currentExpenses.filter((expense) => expense.id !== id),
    )
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

      <section className="budget-summary" aria-label="Budget summary">
        <article className="summary-card">
          <h2>Total Budget</h2>
          <label className="budget-input">
            Budget:
            <input
              aria-label="Budget amount"
              min="0"
              onChange={(event) => setBudget(event.target.value)}
              placeholder="18000"
              type="number"
              value={budget}
            />
          </label>
          <p>{formatCurrency(totalBudget)}</p>
        </article>

        <article className="summary-card">
          <h2>Total Expenses</h2>
          <p>{formatCurrency(totalExpenses)}</p>
        </article>

        <article className="summary-card">
          <h2>Remaining Budget</h2>
          <p>{formatCurrency(remainingBudget)}</p>
        </article>
      </section>

      <section className="expense-entry" aria-label="Expense entry">
        {expenses.map((expense, index) => (
          <div className="expense-row" key={expense.id}>
            <input
              aria-label={`Amount ${index + 1}`}
              min="0"
              onChange={(event) => updateExpense(expense.id, 'amount', event.target.value)}
              placeholder="Amount"
              type="number"
              value={expense.amount}
            />

            <select
              aria-label={`Category ${index + 1}`}
              onChange={(event) => updateExpense(expense.id, 'category', event.target.value)}
              value={expense.category}
            >
              <option value="" disabled>
                Category
              </option>
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>

            <input
              aria-label={`Date ${index + 1}`}
              onChange={(event) => updateExpense(expense.id, 'date', event.target.value)}
              type="date"
              value={expense.date}
            />
            <input
              aria-label={`Description ${index + 1}`}
              onChange={(event) =>
                updateExpense(expense.id, 'description', event.target.value)
              }
              placeholder="Description"
              type="text"
              value={expense.description}
            />
            <button
              className="delete-expense-button"
              onClick={() => deleteExpenseRow(expense.id)}
              type="button"
              aria-label={`Delete expense row ${index + 1}`}
            >
              x
            </button>
          </div>
        ))}

        <button
          className="add-expense-button"
          onClick={addExpenseRow}
          type="button"
          aria-label="Add expense row"
        >
          +
        </button>
      </section>

      <section className="graph-area" aria-label="Graphs">
        <div className="graph-tabs">
          <button type="button">Pie Chart</button>
          <button type="button">Line Chart</button>
        </div>

        <div className="graph-placeholder">Graph Placeholder</div>
      </section>
    </div>
  )
}
