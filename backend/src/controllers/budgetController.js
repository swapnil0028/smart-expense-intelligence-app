import Budget from '../models/Budget.js'

export async function createBudget(req, res) {
  try {
    const { category, amount, month, year } = req.body

    if (!category || amount === undefined || month === undefined || year === undefined) {
      return res.status(400).json({ success: false, message: 'category, amount, month, and year are required' })
    }

    const budget = await Budget.create({
      userId: req.user.id,
      category,
      amount: Number(amount),
      month: Number(month),
      year: Number(year),
    })

    return res.status(201).json({ success: true, data: budget })
  } catch (err) {
    console.error('createBudget error:', err)
    return res.status(500).json({ success: false, error: 'Failed to create budget' })
  }
}

export async function getBudgets(req, res) {
  try {
    const budgets = await Budget.find({ userId: req.user.id }).sort({ year: -1, month: -1 })
    return res.json({ success: true, data: budgets })
  } catch (err) {
    console.error('getBudgets error:', err)
    return res.status(500).json({ success: false, error: 'Failed to fetch budgets' })
  }
}

export async function updateBudget(req, res) {
  try {
    const { id } = req.params
    const updates = req.body

    const budget = await Budget.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      updates,
      { new: true },
    )

    if (!budget) return res.status(404).json({ success: false, error: 'Budget not found' })
    return res.json({ success: true, data: budget })
  } catch (err) {
    console.error('updateBudget error:', err)
    return res.status(500).json({ success: false, error: 'Failed to update budget' })
  }
}

export async function deleteBudget(req, res) {
  try {
    const { id } = req.params
    const budget = await Budget.findOneAndDelete({ _id: id, userId: req.user.id })
    if (!budget) return res.status(404).json({ success: false, error: 'Budget not found' })
    return res.json({ success: true, message: 'Budget deleted' })
  } catch (err) {
    console.error('deleteBudget error:', err)
    return res.status(500).json({ success: false, error: 'Failed to delete budget' })
  }
}
