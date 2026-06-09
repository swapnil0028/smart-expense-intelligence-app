import express from 'express';
import * as analyticsController from './analyticsController.js';

const router = express.Router();

// Monthly Summary
router.get('/monthly', analyticsController.getMonthlySummary);

// Category Breakdown
router.get('/categories', analyticsController.getCategoryBreakdown);

// Spending Trends
router.get('/trends', analyticsController.getSpendingTrends);

// Recent Activity
router.get('/recent', analyticsController.getRecentExpenses);
export default router;