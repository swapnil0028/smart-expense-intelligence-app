import Expense from './Expense.js';

// GET /api/expenses
export const getExpenses = async (req, res) => {
  try {
    // Fetch all expenses, sorted by most recent first
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expenses", error: error.message });
  }
};

// POST /api/expenses
export const createExpense = async (req, res) => {
  try {
    const { amount, category, date, notes, description } = req.body;
    const newExpense = new Expense({
      amount,
      category,
      date: date || Date.now(),
      notes: notes || description // Handling both field names used in frontend
    });
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    res.status(400).json({ message: "Error saving expense", error: error.message });
  }
};