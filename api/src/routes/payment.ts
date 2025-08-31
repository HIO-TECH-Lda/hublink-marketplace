import express from 'express';
import { PaymentController } from '../controllers/paymentController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import { validateRequest } from '../utils/validation';
import { 
  createPaymentIntentSchema, 
  confirmPaymentSchema, 
  refundPaymentSchema, 
  createManualPaymentSchema 
} from '../utils/validation';

const router = express.Router();

// Payment intent creation (requires authentication)
router.post('/create-intent', 
  authenticateToken, 
  validateRequest(createPaymentIntentSchema), 
  PaymentController.createPaymentIntent
);

// Confirm payment (requires authentication)
router.post('/confirm', 
  authenticateToken, 
  validateRequest(confirmPaymentSchema), 
  PaymentController.confirmPayment
);

// Process refund (requires authentication, admin/seller only)
router.post('/refund', 
  authenticateToken, 
  authorizeRoles('admin', 'seller'), 
  validateRequest(refundPaymentSchema), 
  PaymentController.processRefund
);

// Stripe webhook (no authentication required - webhook signature verification)
router.post('/webhook/stripe', 
  PaymentController.handleStripeWebhook
);

// Get payment by ID (requires authentication)
router.get('/:paymentId', 
  authenticateToken, 
  PaymentController.getPaymentById
);

// Get payments by user ID (requires authentication)
router.get('/user/payments', 
  authenticateToken, 
  PaymentController.getPaymentsByUserId
);

// Get payment by order ID (requires authentication)
router.get('/order/:orderId', 
  authenticateToken, 
  PaymentController.getPaymentByOrderId
);

// Get payments by status (admin only)
router.get('/status/:status', 
  authenticateToken, 
  authorizeRoles('admin'), 
  PaymentController.getPaymentsByStatus
);

// Create manual payment (requires authentication)
router.post('/manual', 
  authenticateToken, 
  validateRequest(createManualPaymentSchema), 
  PaymentController.createManualPayment
);

// Mark manual payment as completed (admin/seller only)
router.patch('/manual/:paymentId/complete', 
  authenticateToken, 
  authorizeRoles('admin', 'seller'), 
  PaymentController.markManualPaymentCompleted
);

// Get payment statistics (admin only)
router.get('/statistics/overview', 
  authenticateToken, 
  authorizeRoles('admin'), 
  PaymentController.getPaymentStatistics
);

export default router;
