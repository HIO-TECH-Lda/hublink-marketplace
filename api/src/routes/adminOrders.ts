import express from 'express';
import { AdminOrderController } from '../controllers/adminOrderController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

// All routes require admin authentication
router.use(authenticateToken);
router.use(requireAdmin);

// Get order statistics
router.get('/stats', AdminOrderController.getOrderStats);

// Get all orders with filters
router.get('/', AdminOrderController.getOrders);

// Get order by ID
router.get('/:orderId', AdminOrderController.getOrderById);

// Update order status
router.patch('/:orderId/status', AdminOrderController.updateOrderStatus);

export default router;

