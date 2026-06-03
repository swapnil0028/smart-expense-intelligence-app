import { useExpenseContext } from '../context/ExpenseContext.jsx'

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)

export default function BudgetSummary({
  budget,
  onBudgetChange,
  remainingBudget,
  totalBudget,
  totalExpenses,
}) {
  const { expenseState } = useExpenseContext()
  const expenses = expenseState.expenses || []

  const breakdown = expenses.reduce((acc, e) => {
    const cat = e.category || 'Other'
    const amt = Number(e.amount) || 0
    acc[cat] = (acc[cat] || 0) + amt
    return acc
  }, {})

  const breakdownEntries = Object.entries(breakdown)
  return (
    <section className="budget-summary" aria-label="Budget summary">
      <article className="summary-card">
        <h2>Total Budget</h2>
        <label className="budget-input">
          Budget:
          <input
            aria-label="Budget amount"
            min="0"
            onChange={(event) => onBudgetChange(event.target.value)}
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
        {breakdownEntries.length > 0 && (
          <ul className="expense-breakdown">
            {breakdownEntries.map(([cat, amt]) => (
              <li key={cat}>
                <span>{cat}</span>
                <span>{formatCurrency(amt)}</span>
              </li>
            ))}
          </ul>
        )}
      </article>

      <article className="summary-card">
        <h2>Remaining Budget</h2>
        <p>{formatCurrency(remainingBudget)}</p>
      </article>
    </section>
  )
}
