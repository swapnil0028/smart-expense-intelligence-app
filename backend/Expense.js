import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    index: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  notes: String,
});

const Expense = mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);
export default Expense;