import express from 'express'
import { check } from 'express-validator'
import { createBudget, getBudgets, updateBudget, deleteBudget } from '../controllers/budgetController.js'
import validateRequest from '../middleware/validateRequest.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

const createValidators = [
  check('category').exists().withMessage('category is required').isString(),
  check('amount').exists().withMessage('amount is required').isNumeric(),
  check('month').exists().withMessage('month is required').isInt({ min: 1, max: 12 }),
  check('year').exists().withMessage('year is required').isInt({ min: 2000 }),
]

const updateValidators = [
  check('category').optional().isString(),
  check('amount').optional().isNumeric(),
  check('month').optional().isInt({ min: 1, max: 12 }),
  check('year').optional().isInt({ min: 2000 }),
]

router.use(authMiddleware)

router.post('/', createValidators, validateRequest, createBudget)
router.get('/', getBudgets)
router.put('/:id', updateValidators, validateRequest, updateBudget)
router.delete('/:id', deleteBudget)

export default router
