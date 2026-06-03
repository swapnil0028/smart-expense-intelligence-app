import mongoose from 'mongoose'

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || ''

  if (!uri) {
    console.log('MONGODB_URI not set; skipping MongoDB connection')
    return
  }

  try {
    await mongoose.connect(uri)
    console.log('MongoDB Connected')
  } catch (err) {
    console.error('MongoDB connection error:', err.message)
    process.exit(1)
  }
}

export default connectDB
