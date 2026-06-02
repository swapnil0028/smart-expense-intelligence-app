export default function ExpenseRow({
  categories,
  expense,
  index,
  onDelete,
  onUpdate,
}) {
  return (
    <div className="expense-row">
      <input
        aria-label={`Amount ${index + 1}`}
        min="0"
        onChange={(event) => onUpdate(expense.id, 'amount', event.target.value)}
        placeholder="Amount"
        type="number"
        value={expense.amount}
      />

      <select
        aria-label={`Category ${index + 1}`}
        onChange={(event) => onUpdate(expense.id, 'category', event.target.value)}
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
        onChange={(event) => onUpdate(expense.id, 'date', event.target.value)}
        type="date"
        value={expense.date}
      />
      <input
        aria-label={`Description ${index + 1}`}
        onChange={(event) => onUpdate(expense.id, 'description', event.target.value)}
        placeholder="Description"
        type="text"
        value={expense.description}
      />
      <button
        className="delete-expense-button"
        onClick={() => onDelete(expense.id)}
        type="button"
        aria-label={`Delete expense row ${index + 1}`}
      >
        x
      </button>
    </div>
  )
}
