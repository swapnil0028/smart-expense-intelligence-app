import mongoose from 'mongoose'

const budgetSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true,
  },
  limit: {
    type: Number,
    required: true,
  },
  spent: {
    type: Number,
    default: 0,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
})

export default mongoose.model('Budget', budgetSchema)
