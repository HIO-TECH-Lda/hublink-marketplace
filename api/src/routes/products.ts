import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { authenticateToken, requireSeller, requireAdmin } from '../middleware/auth';
import {
  validateRequest,
  createProductSchema,
  updateProductSchema
} from '../utils/validation';

const router = Router();

// Public routes (no authentication required)
// Get all products with filters
router.get('/', ProductController.getProducts);

// Get featured products
router.get('/featured', ProductController.getFeaturedProducts);

// Get best sellers
router.get('/best-sellers', ProductController.getBestSellers);

// Get new arrivals
router.get('/new-arrivals', ProductController.getNewArrivals);

// Search products
router.get('/search', ProductController.searchProducts);

// Get product by ID
router.get('/:productId', ProductController.getProductById);

// Get product by slug
router.get('/slug/:slug', ProductController.getProductBySlug);

// Get products by category
router.get('/category/:categoryId', ProductController.getProductsByCategory);

// Protected routes (authentication required)
// Create new product (sellers only)
router.post('/', 
  authenticateToken, 
  requireSeller, 
  validateRequest(createProductSchema), 
  ProductController.createProduct
);

// Update product (sellers only)
router.put('/:productId', 
  authenticateToken, 
  requireSeller, 
  validateRequest(updateProductSchema), 
  ProductController.updateProduct
);

// Delete product (sellers only)
router.delete('/:productId', 
  authenticateToken, 
  requireSeller, 
  ProductController.deleteProduct
);

// Update product status (sellers only)
router.patch('/:productId/status', 
  authenticateToken, 
  requireSeller, 
  ProductController.updateProductStatus
);

// Update product stock (sellers only)
router.patch('/:productId/stock', 
  authenticateToken, 
  requireSeller, 
  ProductController.updateProductStock
);

// Get seller products (sellers only)
router.get('/seller/my-products', 
  authenticateToken, 
  requireSeller, 
  ProductController.getSellerProducts
);

export default router;
