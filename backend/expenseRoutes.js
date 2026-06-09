import express from 'express';
import * as expenseController from './expenseController.js';

const router = express.Router();

router.get('/', expenseController.getExpenses);
router.post('/', expenseController.createExpense);

export default router;