import express from 'express';
import { CartController } from '../controllers/cartController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest, addToCartSchema, updateCartItemSchema, removeFromCartSchema } from '../utils/validation';

const router = express.Router();

// All cart routes require authentication
router.use(authenticateToken);

// Get user's cart
router.get('/', CartController.getCart);

// Get cart summary
router.get('/summary', CartController.getCartSummary);

// Check cart item availability
router.get('/availability', CartController.checkCartAvailability);

// Add item to cart
router.post('/add', validateRequest(addToCartSchema), CartController.addToCart);

// Update item quantity in cart
router.put('/update', validateRequest(updateCartItemSchema), CartController.updateCartItem);

// Remove item from cart
router.delete('/remove', validateRequest(removeFromCartSchema), CartController.removeFromCart);

// Clear cart
router.delete('/clear', CartController.clearCart);

// Merge guest cart with user cart
router.post('/merge', CartController.mergeGuestCart);

// Apply discount to cart
router.post('/discount', CartController.applyDiscount);

export default router;
