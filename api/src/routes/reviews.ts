import express from 'express';
import { ReviewController } from '../controllers/reviewController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import { validateRequest } from '../utils/validation';
import { 
  createReviewSchema, 
  updateReviewSchema, 
  moderateReviewSchema 
} from '../utils/validation';

const router = express.Router();

// Create review (requires authentication)
router.post('/', 
  authenticateToken, 
  validateRequest(createReviewSchema), 
  ReviewController.createReview
);

// Get reviews for a product (public)
router.get('/product/:productId', 
  ReviewController.getProductReviews
);

// Get review statistics for a product (public)
router.get('/product/:productId/statistics', 
  ReviewController.getReviewStatistics
);

// Get review by ID (public)
router.get('/:reviewId', 
  ReviewController.getReviewById
);

// Update review (requires authentication, owner only)
router.put('/:reviewId', 
  authenticateToken, 
  validateRequest(updateReviewSchema), 
  ReviewController.updateReview
);

// Delete review (requires authentication, owner only)
router.delete('/:reviewId', 
  authenticateToken, 
  ReviewController.deleteReview
);

// Mark review as helpful/not helpful (requires authentication)
router.post('/:reviewId/helpful', 
  authenticateToken, 
  ReviewController.markReviewHelpful
);

// Moderate review (admin only)
router.patch('/:reviewId/moderate', 
  authenticateToken, 
  authorizeRoles('admin'), 
  validateRequest(moderateReviewSchema), 
  ReviewController.moderateReview
);

// Get pending reviews for moderation (admin only)
router.get('/admin/pending', 
  authenticateToken, 
  authorizeRoles('admin'), 
  ReviewController.getPendingReviews
);

// Get review analytics (admin only)
router.get('/admin/analytics', 
  authenticateToken, 
  authorizeRoles('admin'), 
  ReviewController.getReviewAnalytics
);

// Get user's reviews (requires authentication)
router.get('/user/reviews', 
  authenticateToken, 
  ReviewController.getUserReviews
);

// Get recent reviews (public)
router.get('/recent/reviews', 
  ReviewController.getRecentReviews
);

// Send review request email (admin/seller only)
router.post('/send-request', 
  authenticateToken, 
  authorizeRoles('admin', 'seller'), 
  ReviewController.sendReviewRequest
);

export default router;
