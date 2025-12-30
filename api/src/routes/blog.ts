import { Router } from 'express';
import { BlogController } from '../controllers/blogController';

const router = Router();

// Public routes (no authentication required)
// Get published posts
router.get('/', BlogController.getPublishedPosts);

// Get post by slug
router.get('/slug/:slug', BlogController.getPostBySlug);

// Get categories
router.get('/categories', BlogController.getCategories);

// Get tags
router.get('/tags', BlogController.getTags);

export default router;

