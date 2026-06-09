import { useState, useEffect } from 'react'
import ExpenseDetailsModal from '../components/ExpenseDetailsModal'
import { useAuthContext } from '../context/AuthContext.jsx'
import { getBudgets } from '../services/budgetService.js'

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function HistoryPage() {
  const [expenses, setExpenses] = useState([])
  const [monthlyRecords, setMonthlyRecords] = useState([])
  const [selectedExpense, setSelectedExpense] = useState(null)
  const [loading, setLoading] = useState(true)
  const { token } = useAuthContext()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resRecent, resTrends, budgetsResult] = await Promise.all([
          fetch('http://localhost:5001/api/analytics/recent'),
          fetch('http://localhost:5001/api/analytics/trends'),
          getBudgets(token),
        ])
        
        const recentData = await resRecent.json()
        const trendsData = await resTrends.json()
        const budgets = budgetsResult.success ? budgetsResult.data : []

        const groupedBudgets = budgets.reduce((acc, budget) => {
          const key = `${budget.month}-${budget.year}`
          acc[key] = (acc[key] || 0) + Number(budget.amount || 0)
          return acc
        }, {})

        setExpenses(recentData)
        setMonthlyRecords(trendsData.map((t) => ({
          month: `${monthNames[t.month - 1]} ${t.year}`,
          spent: `₹${t.totalAmount.toLocaleString()}`,
          budget: groupedBudgets[`${t.month}-${t.year}`] || null,
        })))
      } catch (err) {
        console.error('Failed to load history', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [token])

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

  if (loading) return <div className="p-8 text-center">Loading Records...</div>

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
                    <dd>{record.budget ? `₹${record.budget.toLocaleString()}` : 'Not set'}</dd>
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
                  onClick={() => handleOpenDetails({ ...expense, notes: expense.notes || expense.description })}
                >
                  <div>
                    <p className="expense-category">{expense.category}</p>
                    <p className="expense-date">{new Date(expense.date).toLocaleDateString()}</p>
                  </div>
                  <span className="expense-amount">₹{expense.amount.toLocaleString()}</span>
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
