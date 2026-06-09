import Expense from './Expense.js';

// GET /api/analytics/monthly
export const getMonthlySummary = async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const stats = await Expense.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: "$amount" },
          transactionCount: { $sum: 1 }
        }
      }
    ]);

    const result = stats.length > 0 ? stats[0] : { totalExpenses: 0, transactionCount: 0 };
    delete result._id;

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching monthly summary", error: error.message });
  }
};

// GET /api/analytics/categories
export const getCategoryBreakdown = async (req, res) => {
  try {
    const breakdown = await Expense.aggregate([
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      }
    ]);

    const formatted = breakdown.reduce((acc, curr) => {
      acc[curr._id] = curr.total;
      return acc;
    }, {});

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Error fetching category breakdown", error: error.message });
  }
};

// GET /api/analytics/trends
export const getSpendingTrends = async (req, res) => {
  try {
    const trends = await Expense.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          totalAmount: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          totalAmount: 1
        }
      }
    ]);

    res.json(trends);
  } catch (error) {
    res.status(500).json({ message: "Error fetching spending trends", error: error.message });
  }
};

// GET /api/analytics/recent
export const getRecentExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 }).limit(5);
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recent data", error: error.message });
  }
};