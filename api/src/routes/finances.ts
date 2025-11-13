import express from 'express';
import { FinanceController } from '../controllers/financeController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import {
  validateRequest,
  createIncomeSchema,
  createExpenseSchema,
  updateTransactionSchema,
  financeUploadAttachmentSchema,
  syncSalesSchema
} from '../utils/validation';

const router = express.Router();

// All finance routes require seller authentication
router.use(authenticateToken);
router.use(authorizeRoles('seller'));

// Get dashboard
router.get('/dashboard', FinanceController.getDashboard);

// Get expense categories
router.get('/categories', FinanceController.getCategories);

// Get transactions
router.get('/transactions', FinanceController.getTransactions);

// Get single transaction
router.get('/transactions/:transactionId', FinanceController.getTransactionById);

// Create income entry
router.post('/income', validateRequest(createIncomeSchema), FinanceController.createIncome);

// Create expense entry
router.post('/expenses', validateRequest(createExpenseSchema), FinanceController.createExpense);

// Update transaction
router.patch('/transactions/:transactionId', validateRequest(updateTransactionSchema), FinanceController.updateTransaction);

// Delete transaction
router.delete('/transactions/:transactionId', FinanceController.deleteTransaction);

// Generate report
router.get('/reports', FinanceController.generateReport);

// Upload attachment
router.post('/transactions/:transactionId/attachments', validateRequest(financeUploadAttachmentSchema), FinanceController.uploadAttachment);

// Sync marketplace sales
router.post('/sync-sales', validateRequest(syncSalesSchema), FinanceController.syncSales);

export default router;

