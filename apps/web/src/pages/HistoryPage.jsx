import { useState } from 'react'
import { useHistoryContext } from '../context/HistoryContext.jsx'
import ExpenseDetailsModal from '../components/ExpenseDetailsModal'

const mockExpenses = [
  {
    id: '1',
    category: 'Food',
    amount: '₹500',
    date: '03 June 2026',
    notes: 'Lunch at the cafe',
  },
  {
    id: '2',
    category: 'Travel',
    amount: '₹1,200',
    date: '02 June 2026',
    notes: 'Taxi ride to the airport',
  },
  {
    id: '3',
    category: 'Bills',
    amount: '₹2,500',
    date: '01 June 2026',
    notes: 'Monthly utility bill',
  },
]

export default function HistoryPage() {
  const { historyState } = useHistoryContext()
  const [expenses, setExpenses] = useState(mockExpenses)
  const [selectedExpense, setSelectedExpense] = useState(null)

  const { monthlyRecords } = historyState
  const hasHistory = monthlyRecords.length > 0

  const handleOpenDetails = (expense) => setSelectedExpense(expense)
  const handleCloseDetails = () => setSelectedExpense(null)

  const handleDeleteExpense = (id) => {
    setExpenses((currentExpenses) => currentExpenses.filter((expense) => expense.id !== id))
    handleCloseDetails()
  }

  const handleEditExpense = (expense) => {
    window.alert('Edit is currently mocked. Replace this with a real edit flow.')
    setSelectedExpense(expense)
  }

  return (
    <section className="history-page">
      <div className="page-heading">
        <h1>History</h1>
        <p>Monthly expense records</p>
      </div>

      {hasHistory ? (
        <div className="history-list">
          {monthlyRecords.map((record) => (
            <article className="history-card" key={record.month}>
              <div>
                <h2>{record.month}</h2>
                <dl>
                  <div>
                    <dt>Budget</dt>
                    <dd>{record.budget}</dd>
                  </div>
                  <div>
                    <dt>Spent</dt>
                    <dd>{record.spent}</dd>
                  </div>
                </dl>
              </div>

              <button type="button">View details</button>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No previous budgets available.</h2>
          <p>History will appear here after you create budgets and track spending.</p>
        </div>
      )}

      <section className="expense-list-section">
        <div className="page-heading">
          <h2>Recent expenses</h2>
          <p>Click an expense to view full details.</p>
        </div>

        {expenses.length > 0 ? (
          <div className="expense-list">
            {expenses.map((expense) => (
              <article className="expense-item" key={expense.id}>
                <button
                  type="button"
                  className="expense-item-button"
                  onClick={() => handleOpenDetails(expense)}
                >
                  <div>
                    <p className="expense-category">{expense.category}</p>
                    <p className="expense-date">{expense.date}</p>
                  </div>
                  <span className="expense-amount">{expense.amount}</span>
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>No expenses found.</h2>
            <p>Add your first expense to begin tracking.</p>
          </div>
        )}
      </section>

      {selectedExpense && (
        <ExpenseDetailsModal
          expense={selectedExpense}
          onClose={handleCloseDetails}
          onEdit={handleEditExpense}
          onDelete={handleDeleteExpense}
        />
      )}
    </section>
  )
}
