import ExpenseRow from './ExpenseRow'
import { categories } from '../constants/categories'

export default function ExpenseForm({
  expenses,
  onAddExpense,
  onDeleteExpense,
  onUpdateExpense,
}) {
  return (
    <section className="expense-entry" aria-label="Expense entry">
      {expenses.map((expense, index) => (
        <ExpenseRow
          categories={categories}
          expense={expense}
          index={index}
          key={expense.id}
          onDelete={onDeleteExpense}
          onUpdate={onUpdateExpense}
        />
      ))}

      <button
        className="add-expense-button"
        onClick={onAddExpense}
        type="button"
        aria-label="Add expense row"
      >
        +
      </button>
    </section>
  )
}
