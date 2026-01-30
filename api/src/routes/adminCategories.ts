import { Router } from 'express';
import { AdminCategoryController } from '../controllers/adminCategoryController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import { uploadSingleImage } from '../middleware/upload';

const router = Router();

// All routes require admin authentication
router.use(authenticateToken);
router.use(authorizeRoles('admin'));

// Get category statistics
router.get('/stats', AdminCategoryController.getCategoryStats);

// Get all categories with filters
router.get('/', AdminCategoryController.getCategories);

// Create category (with image upload support)
router.post('/', uploadSingleImage, AdminCategoryController.createCategory);

// Get category by ID
router.get('/:categoryId', AdminCategoryController.getCategoryById);

// Update category (with image upload support)
router.put('/:categoryId', uploadSingleImage, AdminCategoryController.updateCategory);

// Update category status (activate/deactivate)
router.patch('/:categoryId/status', AdminCategoryController.updateCategoryStatus);

// Delete category
router.delete('/:categoryId', AdminCategoryController.deleteCategory);

export default router;

