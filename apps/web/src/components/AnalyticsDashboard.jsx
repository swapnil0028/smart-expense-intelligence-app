import { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AnalyticsDashboard = () => {
  const [monthly, setMonthly] = useState(null);
  const [categories, setCategories] = useState([]);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BUDGET = 20000;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resMonthly, resCats, resTrends] = await Promise.all([
          fetch('http://localhost:5001/api/analytics/monthly'),
          fetch('http://localhost:5001/api/analytics/categories'),
          fetch('http://localhost:5001/api/analytics/trends')
        ]);

        if (!resMonthly.ok || !resCats.ok || !resTrends.ok) throw new Error("Failed to fetch data");

        const monthlyData = await resMonthly.json();
        const catsData = await resCats.json();
        const trendsData = await resTrends.json();

        setMonthly(monthlyData);
        setCategories(Object.entries(catsData).map(([name, value]) => ({ name, value })));
        setTrends(trendsData.map(t => ({ ...t, displayDate: `${t.month}/${t.year}` })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center animate-pulse text-gray-500">Loading Intelligence Dashboard...</div>;
  if (error) return <div className="p-8 text-center text-red-500 border border-red-200 bg-red-50 rounded-lg m-4">Error: {error}</div>;

  const spent = monthly?.totalExpenses || 0;
  const remaining = BUDGET - spent;
  const progress = Math.min((spent / BUDGET) * 100, 100);
  const isNearLimit = progress >= 90;

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* Budget Card - Priority 3 */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Monthly Budget</h2>
            <p className="text-3xl font-bold text-gray-900">₹{BUDGET.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className={`text-lg font-semibold ${isNearLimit ? 'text-red-600' : 'text-green-600'}`}>
              {remaining > 0 ? `₹${remaining.toLocaleString()} Left` : 'Over Budget!'}
            </p>
          </div>
        </div>

        <div className="relative pt-1">
          <div className="overflow-hidden h-4 mb-2 text-xs flex rounded bg-gray-200">
            <div 
              style={{ width: `${progress}%` }} 
              className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${isNearLimit ? 'bg-red-500' : 'bg-blue-500'}`}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Spent: ₹{spent.toLocaleString()}</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
        </div>
        
        {isNearLimit && (
          <div className="mt-3 p-2 bg-red-50 text-red-700 text-xs font-bold rounded flex items-center">
            ⚠️ Warning: You have used {progress.toFixed(1)}% of your budget!
          </div>
        )}
      </div>

      {/* Charts Grid - Priority 2 & 4 */}
      {categories.length === 0 ? (
        <div className="bg-white p-12 rounded-xl text-center border-2 border-dashed border-gray-200">
          <p className="text-gray-400">No expenses recorded yet. Start adding data to see analytics!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart: Expense By Category */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-700 font-semibold mb-4">Expense By Category</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categories} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart: Top Spending */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-700 font-semibold mb-4">Top Spending Categories</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categories}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Chart: Monthly Trend */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 md:col-span-2">
            <h3 className="text-gray-700 font-semibold mb-4">Spending Over Time</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="displayDate" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="totalAmount" stroke="#4f46e5" strokeWidth={3} dot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;