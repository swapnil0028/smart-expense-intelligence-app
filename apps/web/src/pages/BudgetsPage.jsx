import { useMemo } from 'react'
import { useBudgetContext } from '../context/BudgetContext.jsx'

const formatCurrency = (value) => {
  const amount = Number(String(value).replace(/[^0-9.-]/g, ''))
  if (!Number.isFinite(amount)) {
    return value
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function BudgetsPage() {
  const { budgetState } = useBudgetContext()
  const { currentBudget, previousBudgets } = budgetState

  const hasPreviousBudgets = previousBudgets.length > 0

  const sortedPreviousBudgets = useMemo(
    () => [...previousBudgets].reverse(),
    [previousBudgets],
  )

  return (
    <section className="budgets-page">
      <div className="page-heading">
        <h1>Budgets</h1>
        <p>Plan current spending and review older monthly budgets.</p>
      </div>

      <section className="budget-panel current-budget" aria-label="Current budget">
        <div>
          <h2>Current Budget</h2>
          <p>{currentBudget.month}</p>
        </div>
        <strong>{formatCurrency(currentBudget.budget)}</strong>
      </section>

      <section className="budget-panel" aria-label="Previous budgets">
        <div className="section-heading-row">
          <h2>Previous Budgets</h2>
          {!hasPreviousBudgets && <span className="tag">Empty</span>}
        </div>

        {hasPreviousBudgets ? (
          <div className="previous-budget-list">
            {sortedPreviousBudgets.map((budget) => (
              <article className="previous-budget-card" key={budget.month}>
                <h3>{budget.month}</h3>
                <p>Budget: {formatCurrency(budget.budget)}</p>
                <p>Spent: {formatCurrency(budget.spent)}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>No previous budgets available.</h2>
            <p>Start tracking budgets and past months will appear here.</p>
          </div>
        )}
      </section>

      <section className="budget-panel" aria-label="Create new budget">
        <h2>Create New Budget</h2>
        <form className="create-budget-form">
          <input aria-label="Budget month" placeholder="Month" type="text" />
          <input aria-label="Budget year" placeholder="Year" type="number" />
          <input aria-label="Budget amount" placeholder="Budget amount" type="number" />
          <button type="button">Create Budget</button>
        </form>
      </section>
    </section>
  )
}
