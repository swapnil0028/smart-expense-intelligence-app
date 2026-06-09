import AnalyticsDashboard from '../components/AnalyticsDashboard'

export default function AnalyticsPage() {
  return (
    <section className="analytics-page">
      <div className="page-heading">
        <h1>Analytics</h1>
        <p>Live analytics generated from your actual expense data.</p>
      </div>

      <AnalyticsDashboard />
    </section>
  )
}
