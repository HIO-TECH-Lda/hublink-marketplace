import express from 'express';
import { RefundController } from '../controllers/refundController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import { validateRequest, rejectRefundSchema, createRefundRequestSchema } from '../utils/validation';

const router = express.Router();

// All refund routes require authentication
router.use(authenticateToken);

// Buyer routes (buyer role)
router.post('/request', 
  authorizeRoles('buyer'), 
  validateRequest(createRefundRequestSchema), 
  RefundController.createRefundRequest
);

router.get('/my-refunds', 
  authorizeRoles('buyer'), 
  RefundController.getBuyerRefunds
);

router.get('/my-refunds/:refundId', 
  authorizeRoles('buyer'), 
  RefundController.getBuyerRefundById
);

// Seller routes (seller role)
router.get('/statistics', 
  authorizeRoles('seller'), 
  RefundController.getStatistics
);

router.get('/', 
  authorizeRoles('seller'), 
  RefundController.getRefunds
);

router.get('/:refundId', 
  authorizeRoles('seller'), 
  RefundController.getRefundById
);

router.patch('/:refundId/approve', 
  authorizeRoles('seller'), 
  RefundController.approveRefund
);

router.patch('/:refundId/reject', 
  authorizeRoles('seller'), 
  validateRequest(rejectRefundSchema), 
  RefundController.rejectRefund
);

// Admin routes (admin role)
router.get('/admin/all', 
  authorizeRoles('admin'), 
  RefundController.getAllRefunds
);

router.get('/admin/statistics', 
  authorizeRoles('admin'), 
  RefundController.getAllStatistics
);

router.get('/admin/:refundId', 
  authorizeRoles('admin'), 
  RefundController.getAnyRefundById
);

router.patch('/admin/:refundId/approve', 
  authorizeRoles('admin'), 
  RefundController.approveRefundByAdmin
);

router.patch('/admin/:refundId/reject', 
  authorizeRoles('admin'), 
  validateRequest(rejectRefundSchema), 
  RefundController.rejectRefundByAdmin
);

export default router;

