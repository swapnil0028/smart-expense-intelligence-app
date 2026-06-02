import LoadingSkeleton from '../components/LoadingSkeleton'
import { budgetTrend } from '../data/mockBudgets'
import { categoryBreakdown, monthlySpending } from '../data/mockExpenses'

export default function AnalyticsPage() {
  const loading = false

  if (loading) {
    return <LoadingSkeleton label="Loading analytics..." />
  }

  return (
    <section className="analytics-page">
      <div className="page-heading">
        <h1>Analytics</h1>
        <p>Dummy insights for monthly spending, categories, and budget trends.</p>
      </div>

      <section className="analytics-card">
        <div className="analytics-card-header">
          <h2>Monthly Spending</h2>
          <span>Line chart</span>
        </div>

        <svg className="line-chart" viewBox="0 0 420 180" role="img" aria-label="Monthly spending line chart">
          <polyline points="20,132 145,104 270,98 400,54" />
          <circle cx="20" cy="132" r="5" />
          <circle cx="145" cy="104" r="5" />
          <circle cx="270" cy="98" r="5" />
          <circle cx="400" cy="54" r="5" />
        </svg>

        <div className="analytics-values">
          {monthlySpending.map((item) => (
            <div key={item.month}>
              <span>{item.month}</span>
              <strong>{item.amount}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="analytics-card">
        <div className="analytics-card-header">
          <h2>Category Breakdown</h2>
          <span>Pie chart</span>
        </div>

        <div className="category-breakdown">
          <div className="pie-chart" aria-label="Category breakdown pie chart" role="img" />
          <div className="category-list">
            {categoryBreakdown.map((category) => (
              <div className="category-item" key={category.name}>
                <span style={{ backgroundColor: category.color }} />
                <p>{category.name}</p>
                <strong>{category.amount}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="analytics-card">
        <div className="analytics-card-header">
          <h2>Budget Trend</h2>
          <span>Dummy data</span>
        </div>

        <div className="trend-list">
          {budgetTrend.map((item) => (
            <div className="trend-row" key={item.month}>
              <span>{item.month}</span>
              <p>Budget: {item.budget}</p>
              <strong>Spent: {item.spent}</strong>
            </div>
          ))}
        </div>
      </section>
    </section>
  )
}
