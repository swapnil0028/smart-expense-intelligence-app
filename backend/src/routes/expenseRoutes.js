import express from 'express'
import { check } from 'express-validator'
import {
	createExpense,
	getExpenses,
	updateExpense,
	deleteExpense,
} from '../controllers/expenseController.js'
import validateRequest from '../middleware/validateRequest.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

const createValidators = [
	check('amount').exists().withMessage('amount is required').isNumeric().withMessage('amount must be a number'),
	check('category').exists().withMessage('category is required').isString().withMessage('category must be a string'),
	check('description').optional().isString(),
	check('date').optional().isISO8601().withMessage('date must be ISO8601'),
]

const updateValidators = [
	check('amount').optional().isNumeric().withMessage('amount must be a number'),
	check('category').optional().isString(),
	check('description').optional().isString(),
	check('date').optional().isISO8601().withMessage('date must be ISO8601'),
]

router.use(authMiddleware)

router.post('/', createValidators, validateRequest, createExpense)
router.get('/', getExpenses)
router.put('/:id', updateValidators, validateRequest, updateExpense)
router.delete('/:id', deleteExpense)

export default router
