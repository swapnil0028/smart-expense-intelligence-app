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
      </article>

      <article className="summary-card">
        <h2>Remaining Budget</h2>
        <p>{formatCurrency(remainingBudget)}</p>
      </article>
    </section>
  )
}
