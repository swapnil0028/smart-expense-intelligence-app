import Expense from '../models/Expense.js'

export async function createExpense(req, res) {
  try {
    const { amount, category, description, date } = req.body
    const expense = new Expense({
      amount,
      category,
      description,
      date: date ? new Date(date) : undefined,
      userId: req.user.id,
    })

    await expense.save()
    return res.status(201).json(expense)
  } catch (err) {
    console.error('createExpense error:', err)
    return res.status(500).json({ error: 'Failed to create expense' })
  }
}

export async function getExpenses(req, res) {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 })
    return res.json(expenses)
  } catch (err) {
    console.error('getExpenses error:', err)
    return res.status(500).json({ error: 'Failed to fetch expenses' })
  }
}

export async function updateExpense(req, res) {
  try {
    const { id } = req.params
    const updates = { ...req.body }
    if (updates.date) updates.date = new Date(updates.date)

    const expense = await Expense.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      updates,
      { new: true },
    )

    if (!expense) return res.status(404).json({ error: 'Expense not found' })
    return res.json(expense)
  } catch (err) {
    console.error('updateExpense error:', err)
    return res.status(500).json({ error: 'Failed to update expense' })
  }
}

export async function deleteExpense(req, res) {
  try {
    const { id } = req.params
    const expense = await Expense.findOneAndDelete({ _id: id, userId: req.user.id })
    if (!expense) return res.status(404).json({ error: 'Expense not found' })
    return res.json({ message: 'Expense deleted' })
  } catch (err) {
    console.error('deleteExpense error:', err)
    return res.status(500).json({ error: 'Failed to delete expense' })
  }
}
