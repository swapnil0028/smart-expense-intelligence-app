import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import statusRouter from './src/routes/index.js'
import connectDB from './src/config/db.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5001

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  }),
)
app.use(cookieParser())
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
