import { Router } from 'express';
import { AdminProductController } from '../controllers/adminProductController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();

// All routes require admin authentication
router.use(authenticateToken);
router.use(authorizeRoles('admin'));

// Get product statistics
router.get('/stats', AdminProductController.getProductStats);

// Get all products with filters
router.get('/', AdminProductController.getProducts);

// Get product by ID
router.get('/:productId', AdminProductController.getProductById);

// Update product
router.put('/:productId', AdminProductController.updateProduct);

// Update product status
router.patch('/:productId/status', AdminProductController.updateProductStatus);

// Delete product (soft delete)
router.delete('/:productId', AdminProductController.deleteProduct);

export default router;

