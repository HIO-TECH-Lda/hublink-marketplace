import express from 'express';
import { OrderController } from '../controllers/orderController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import { validateRequest, createOrderSchema, updateOrderStatusSchema, cancelOrderSchema } from '../utils/validation';

const router = express.Router();

// All order routes require authentication
router.use(authenticateToken);

// Public routes (authenticated users)
// Create order from cart
router.post('/create-from-cart', validateRequest(createOrderSchema), OrderController.createOrderFromCart);

// Create order with specific items
router.post('/create', validateRequest(createOrderSchema), OrderController.createOrder);

// Get user's orders
router.get('/my-orders', OrderController.getUserOrders);

// Get order by ID (user can only see their own orders)
router.get('/:orderId', OrderController.getOrderById);

// Get order by order number (user can only see their own orders)
router.get('/number/:orderNumber', OrderController.getOrderByNumber);

// Get order tracking information
router.get('/:orderId/tracking', OrderController.getOrderTracking);

// Cancel order (user can only cancel their own orders)
router.post('/:orderId/cancel', validateRequest(cancelOrderSchema), OrderController.cancelOrder);

// Get order statistics (user can only see their own statistics)
router.get('/statistics/user', OrderController.getOrderStatistics);

// Admin/Seller routes
// Get all orders (admin only)
router.get('/', authorizeRoles(['admin']), OrderController.getAllOrders);

// Update order status (admin/seller only)
router.patch('/:orderId/status', authorizeRoles(['admin', 'seller']), validateRequest(updateOrderStatusSchema), OrderController.updateOrderStatus);

// Get order statistics (admin can see all statistics)
router.get('/statistics/all', authorizeRoles(['admin']), OrderController.getOrderStatistics);

export default router;
