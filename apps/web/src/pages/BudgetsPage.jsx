import { useEffect, useMemo, useState } from 'react'
import { useAuthContext } from '../context/AuthContext.jsx'
import { useExpenseContext } from '../context/ExpenseContext.jsx'
import { getBudgets, createBudget, deleteBudget } from '../services/budgetService.js'

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
  const { token } = useAuthContext()
  const { expenseState } = useExpenseContext()
  const [budgets, setBudgets] = useState([])
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const expenses = expenseState.expenses || []
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  // Load budgets on mount
  useEffect(() => {
    async function loadBudgets() {
      try {
        const result = await getBudgets(token)
        if (result.success) {
          setBudgets(Array.isArray(result.data) ? result.data : [])
        } else {
          setError(result.message || 'Failed to load budgets')
        }
      } catch (err) {
        console.error('loadBudgets error:', err)
        setError('Error loading budgets')
      }
    }

    if (token) {
      loadBudgets()
    }
  }, [token])

  // Calculate spent per category
  const spentByCategory = useMemo(() => {
    const map = {}
    expenses.forEach((exp) => {
      const cat = exp.category || 'Other'
      map[cat] = (map[cat] || 0) + (Number(exp.amount) || 0)
    })
    return map
  }, [expenses])

  // Calculate total budget, spent, and remaining
  const totals = useMemo(() => {
    let totalBudget = 0
    let totalSpent = 0

    budgets.forEach((b) => {
      if (b.month === currentMonth && b.year === currentYear) {
        totalBudget += Number(b.amount) || 0
        totalSpent += spentByCategory[b.category] || 0
      }
    })

    return {
      totalBudget,
      totalSpent,
      remaining: totalBudget - totalSpent,
      isOverspent: totalSpent > totalBudget,
    }
  }, [budgets, spentByCategory, currentMonth, currentYear])

  const handleCreateBudget = async (event) => {
    event.preventDefault()
    setError('')

    if (!category.trim() || !amount) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    const result = await createBudget(token, category.trim(), amount, currentMonth, currentYear)
    setLoading(false)

    if (result.success) {
      setBudgets([...budgets, result.data])
      setCategory('')
      setAmount('')
    } else {
      setError(result.message || 'Failed to create budget')
    }
  }

  const handleDeleteBudget = async (id) => {
    const result = await deleteBudget(token, id)
    if (result.success) {
      setBudgets(budgets.filter((b) => b._id !== id))
    } else {
      setError(result.message || 'Failed to delete budget')
    }
  }

  const currentBudgets = budgets.filter((b) => b.month === currentMonth && b.year === currentYear)

  return (
    <section className="dashboard-content">
      <h1>Budgets</h1>

      {/* Summary Cards */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
          <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 8 }}>Total Budget</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text)' }}>{formatCurrency(totals.totalBudget)}</div>
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
          <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 8 }}>Total Spent</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: totals.isOverspent ? '#dc2626' : 'var(--text)' }}>{formatCurrency(totals.totalSpent)}</div>
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
          <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 8 }}>Remaining</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: totals.remaining < 0 ? '#dc2626' : '#10b981' }}>{formatCurrency(totals.remaining)}</div>
        </div>
      </section>

      {/* Create Budget Form */}
      <section style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 24 }}>
        <h2 style={{ marginTop: 0 }}>Add Budget</h2>
        <form onSubmit={handleCreateBudget} style={{ display: 'grid', gap: 12, maxWidth: 400 }}>
          <input
            type="text"
            placeholder="Category (Food, Travel, etc.)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ minHeight: 44, borderRadius: 8, border: '1px solid var(--border)', padding: '0 12px' }}
          />
          <input
            type="number"
            placeholder="Budget Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ minHeight: 44, borderRadius: 8, border: '1px solid var(--border)', padding: '0 12px' }}
          />
          {error && <div style={{ color: '#dc2626' }}>{error}</div>}
          <button
            type="submit"
            disabled={loading}
            style={{ minHeight: 44, borderRadius: 8, border: 'none', background: '#2563eb', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}
          >
            {loading ? 'Creating...' : 'Add Budget'}
          </button>
        </form>
      </section>

      {/* Budget List */}
      <section style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
        <h2 style={{ marginTop: 0 }}>Current Budgets</h2>
        {currentBudgets.length === 0 ? (
          <div style={{ color: 'var(--muted)', textAlign: 'center', padding: '24px 0' }}>No budgets created yet.</div>
        ) : (
          <div style={{ display: 'grid', gap: 16 }}>
            {currentBudgets.map((budget) => {
              const spent = spentByCategory[budget.category] || 0
              const remaining = budget.amount - spent
              const percentage = Math.min(100, Math.round((spent / budget.amount) * 100))
              const isOverspent = spent > budget.amount

              return (
                <div
                  key={budget._id}
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: 16,
                    background: isOverspent ? 'rgba(220, 38, 38, 0.05)' : 'transparent',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text)' }}>{budget.category}</div>
                      <div style={{ color: 'var(--muted)', fontSize: 14 }}>
                        {formatCurrency(spent)} / {formatCurrency(budget.amount)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteBudget(budget._id)}
                      style={{ minHeight: 32, minWidth: 32, borderRadius: 8, border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ background: 'var(--border)', borderRadius: 8, height: 12, overflow: 'hidden', marginBottom: 8 }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${percentage}%`,
                        background: isOverspent ? '#dc2626' : '#2563eb',
                        transition: 'width 0.3s',
                      }}
                    />
                  </div>

                  {/* Status */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span>{percentage}%</span>
                    {isOverspent ? (
                      <span style={{ color: '#dc2626', fontWeight: 700 }}>⚠ Exceeded by {formatCurrency(spent - budget.amount)}</span>
                    ) : (
                      <span style={{ color: '#10b981', fontWeight: 700 }}>Remaining: {formatCurrency(remaining)}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </section>
  )
}
