import { Router } from 'express';
import { AdminBlogController } from '../controllers/adminBlogController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

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

// Create post
router.post('/', AdminBlogController.createPost);

// Get post by ID
router.get('/:postId', AdminBlogController.getPostById);

// Update post
router.put('/:postId', AdminBlogController.updatePost);

// Update post status
router.patch('/:postId/status', AdminBlogController.updatePostStatus);

// Delete post
router.delete('/:postId', AdminBlogController.deletePost);

export default router;

