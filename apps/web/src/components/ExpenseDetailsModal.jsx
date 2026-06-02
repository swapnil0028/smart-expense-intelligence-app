export default function ExpenseDetailsModal({ expense, onClose, onEdit, onDelete }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="expense-modal-title">
      <div className="expense-modal">
        <div className="expense-modal-header">
          <div>
            <h2 id="expense-modal-title">Expense Details</h2>
            <p>{expense.category}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close expense details">
            ×
          </button>
        </div>

        <div className="expense-modal-details">
          <div>
            <dt>Category</dt>
            <dd>{expense.category}</dd>
          </div>
          <div>
            <dt>Amount</dt>
            <dd>{expense.amount}</dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>{expense.date}</dd>
          </div>
          <div>
            <dt>Notes</dt>
            <dd>{expense.notes}</dd>
          </div>
        </div>

        <div className="expense-modal-actions">
          <button type="button" onClick={() => onEdit(expense)}>
            Edit
          </button>
          <button type="button" className="delete-expense-button" onClick={() => onDelete(expense.id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
