import express from 'express'
import { getBudgets } from '../controllers/budgetController.js'

const router = express.Router()

router.get('/', getBudgets)

export default router
