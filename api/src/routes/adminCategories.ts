import { Router } from 'express';
import { AdminCategoryController } from '../controllers/adminCategoryController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();

// All routes require admin authentication
router.use(authenticateToken);
router.use(authorizeRoles('admin'));

// Get category statistics
router.get('/stats', AdminCategoryController.getCategoryStats);

// Get all categories with filters
router.get('/', AdminCategoryController.getCategories);

// Create category
router.post('/', AdminCategoryController.createCategory);

// Get category by ID
router.get('/:categoryId', AdminCategoryController.getCategoryById);

// Update category
router.put('/:categoryId', AdminCategoryController.updateCategory);

// Update category status (activate/deactivate)
router.patch('/:categoryId/status', AdminCategoryController.updateCategoryStatus);

// Delete category
router.delete('/:categoryId', AdminCategoryController.deleteCategory);

export default router;

