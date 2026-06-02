import { Outlet } from 'react-router-dom'
import AIPanel from '../components/AIPanel'
import Sidebar from '../components/Sidebar'

export default function DashboardLayout() {
  return (
    <div className="dashboard-shell">
      <Sidebar />

      <main className="main-area">
        <Outlet />
      </main>

      <AIPanel />
    </div>
  )
}
