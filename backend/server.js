import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import statusRouter from './src/routes/index.js'
import connectDB from './src/config/db.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5001

app.use(cors())
app.use(express.json())
app.use('/api', statusRouter)

// connect to MongoDB (if MONGODB_URI provided)
connectDB()

app.get('/', (req, res) => {
  res.json({ message: 'Backend Running' })
})

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`)
})
