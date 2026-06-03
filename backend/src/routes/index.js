import express from 'express'
import { getStatus } from '../controllers/statusController.js'
import { getHealth } from '../controllers/healthController.js'
import userRoutes from './userRoutes.js'
import expenseRoutes from './expenseRoutes.js'
import budgetRoutes from './budgetRoutes.js'

const router = express.Router()

router.get('/', getStatus)
router.get('/health', getHealth)
router.use('/users', userRoutes)
router.use('/expenses', expenseRoutes)
router.use('/budgets', budgetRoutes)

export default router
