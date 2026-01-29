import { Router } from 'express';
import { AdminBlogController } from '../controllers/adminBlogController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import { uploadSingleImage } from '../middleware/upload';

const router = Router();

// All routes require admin authentication
router.use(authenticateToken);
router.use(authorizeRoles('admin'));

// Get blog statistics
router.get('/stats', AdminBlogController.getBlogStats);

// Get all posts with filters
router.get('/', AdminBlogController.getPosts);

// Get categories
router.get('/categories', AdminBlogController.getCategories);

// Create post (with image upload support)
router.post('/', uploadSingleImage, AdminBlogController.createPost);

// Get post by ID
router.get('/:postId', AdminBlogController.getPostById);

// Update post (with image upload support)
router.put('/:postId', uploadSingleImage, AdminBlogController.updatePost);

// Update post status
router.patch('/:postId/status', AdminBlogController.updatePostStatus);

// Toggle featured status
router.patch('/:postId/featured', AdminBlogController.toggleFeatured);

// Delete post
router.delete('/:postId', AdminBlogController.deletePost);

export default router;

