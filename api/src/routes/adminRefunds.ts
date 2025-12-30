import express from 'express';
import { AdminRefundController } from '../controllers/adminRefundController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

// All routes require admin authentication
router.use(authenticateToken);
router.use(requireAdmin);

// Get refund statistics
router.get('/stats', AdminRefundController.getRefundStats);

// Get all refunds with filters
router.get('/', AdminRefundController.getRefunds);

// Get refund by ID
router.get('/:refundId', AdminRefundController.getRefundById);

// Approve refund
router.patch('/:refundId/approve', AdminRefundController.approveRefund);

// Reject refund
router.patch('/:refundId/reject', AdminRefundController.rejectRefund);

export default router;

