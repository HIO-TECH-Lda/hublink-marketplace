import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import {
  validateRequest,
  createCategorySchema,
  updateCategorySchema
} from '../utils/validation';

const router = Router();

// Public routes (no authentication required)
// Get all categories
router.get('/', CategoryController.getAllCategories);

// Get root categories
router.get('/roots', CategoryController.getRootCategories);

// Get featured categories
router.get('/featured', CategoryController.getFeaturedCategories);

// Build category tree
router.get('/tree', CategoryController.buildCategoryTree);

// Search categories
router.get('/search', CategoryController.searchCategories);

// Get category by ID
router.get('/:categoryId', CategoryController.getCategoryById);

// Get category by slug
router.get('/slug/:slug', CategoryController.getCategoryBySlug);

// Get category children
router.get('/:parentId/children', CategoryController.getCategoryChildren);

// Get category path
router.get('/:categoryId/path', CategoryController.getCategoryPath);

// Get category descendants
router.get('/:categoryId/descendants', CategoryController.getCategoryDescendants);

// Get category with product count
router.get('/:categoryId/with-products', CategoryController.getCategoryWithProductCount);

// Admin routes (admin authentication required)
// Create new category (admin only)
router.post('/', 
  authenticateToken, 
  requireAdmin, 
  validateRequest(createCategorySchema), 
  CategoryController.createCategory
);

// Update category (admin only)
router.put('/:categoryId', 
  authenticateToken, 
  requireAdmin, 
  validateRequest(updateCategorySchema), 
  CategoryController.updateCategory
);

// Delete category (admin only)
router.delete('/:categoryId', 
  authenticateToken, 
  requireAdmin, 
  CategoryController.deleteCategory
);

export default router;
