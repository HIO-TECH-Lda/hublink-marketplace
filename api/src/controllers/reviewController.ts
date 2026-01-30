import { Request, Response } from 'express';
import { ReviewService } from '../services/reviewService';
import Messages from '../utils/messages';

export class ReviewController {
  /**
   * Create a new review
   */
  static async createReview(req: Request, res: Response) {
    try {
      const { productId, orderId, rating, title, content, images } = req.body;
      const userId = req.user!.userId;

      const review = await ReviewService.createReview({
        productId,
        userId,
        orderId,
        rating,
        title,
        content,
        images
      });

      return res.status(201).json({
        success: true,
        message: Messages.REVIEW.CREATED,
        data: review
      });
    } catch (error: any) {
      console.error('Create review error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to create review'
      });
    }
  }

  /**
   * Get all reviews (no product filter)
   */
  static async getAllReviews(req: Request, res: Response) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        status = 'all',
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const result = await ReviewService.getAllReviews({
        page: Number(page),
        limit: Number(limit),
        status: status as string,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc'
      });

      return res.json({
        success: true,
        message: Messages.REVIEW.FETCH_SUCCESS,
        data: result
      });
    } catch (error: any) {
      console.error('Get all reviews error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || Messages.REVIEW.FETCH_FAILED
      });
    }
  }

  /**
   * Get reviews for a product
   */
  static async getProductReviews(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const { 
        page = 1, 
        limit = 10, 
        status = 'approved',
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const result = await ReviewService.getProductReviews(productId, {
        page: Number(page),
        limit: Number(limit),
        status: status as string,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc'
      });

      return res.json({
        success: true,
        message: Messages.REVIEW.FETCH_SUCCESS,
        data: result
      });
    } catch (error: any) {
      console.error('Get product reviews error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || Messages.REVIEW.FETCH_FAILED
      });
    }
  }

  /**
   * Update a review
   */
  static async updateReview(req: Request, res: Response) {
    try {
      const { reviewId } = req.params;
      const { rating, title, content, images } = req.body;
      const userId = req.user!.userId;

      const review = await ReviewService.updateReview(reviewId, userId, {
        rating,
        title,
        content,
        images
      });

      return res.json({
        success: true,
        message: Messages.REVIEW.UPDATED,
        data: review
      });
    } catch (error: any) {
      console.error('Update review error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to update review'
      });
    }
  }

  /**
   * Delete a review
   */
  static async deleteReview(req: Request, res: Response) {
    try {
      const { reviewId } = req.params;
      const userId = req.user!.userId;

      await ReviewService.deleteReview(reviewId, userId);

      return res.json({
        success: true,
        message: Messages.REVIEW.DELETED
      });
    } catch (error: any) {
      console.error('Delete review error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || Messages.REVIEW.FETCH_FAILED
      });
    }
  }

  /**
   * Moderate a review (admin only)
   */
  static async moderateReview(req: Request, res: Response) {
    try {
      const { reviewId } = req.params;
      const { status, notes } = req.body;
      const moderatorId = (req as any).user.id;

      // Check if user is admin
      if ((req as any).user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: Messages.AUTH.ADMIN_ONLY
        });
      }

      const review = await ReviewService.moderateReview(
        reviewId,
        status as 'approved' | 'rejected',
        moderatorId,
        notes
      );

      return res.json({
        success: true,
        message: `Review ${status} successfully`,
        data: review
      });
    } catch (error: any) {
      console.error('Moderate review error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to moderate review'
      });
    }
  }

  /**
   * Mark review as helpful/not helpful
   */
  static async markReviewHelpful(req: Request, res: Response) {
    try {
      const { reviewId } = req.params;
      const { isHelpful } = req.body;
      const userId = req.user!.userId;

      const review = await ReviewService.markReviewHelpful(reviewId, userId, isHelpful);

      return res.json({
        success: true,
        message: Messages.REVIEW.HELPFUL_MARKED,
        data: review
      });
    } catch (error: any) {
      console.error('Mark review helpful error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || Messages.REVIEW.FETCH_FAILED
      });
    }
  }

  /**
   * Get review statistics for a product
   */
  static async getReviewStatistics(req: Request, res: Response) {
    try {
      const { productId } = req.params;

      const statistics = await ReviewService.getReviewStatistics(productId);

      return res.json({
        success: true,
        message: Messages.REVIEW.FETCH_SUCCESS,
        data: statistics
      });
    } catch (error: any) {
      console.error('Get review statistics error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || Messages.REVIEW.FETCH_FAILED
      });
    }
  }

  /**
   * Get pending reviews for moderation (admin only)
   */
  static async getPendingReviews(req: Request, res: Response) {
    try {
      // Check if user is admin
      if ((req as any).user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: Messages.AUTH.ADMIN_ONLY
        });
      }

      const { 
        page = 1, 
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const result = await ReviewService.getPendingReviews({
        page: Number(page),
        limit: Number(limit),
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc'
      });

      return res.json({
        success: true,
        message: Messages.REVIEW.FETCH_SUCCESS,
        data: result
      });
    } catch (error: any) {
      console.error('Get pending reviews error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || Messages.REVIEW.FETCH_FAILED
      });
    }
  }

  /**
   * Get user's reviews
   */
  static async getUserReviews(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const { 
        page = 1, 
        limit = 10,
        status
      } = req.query;

      const result = await ReviewService.getUserReviews(userId, {
        page: Number(page),
        limit: Number(limit),
        status: status as string
      });

      return res.json({
        success: true,
        message: Messages.REVIEW.FETCH_SUCCESS,
        data: result
      });
    } catch (error: any) {
      console.error('Get user reviews error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || Messages.REVIEW.FETCH_FAILED
      });
    }
  }

  /**
   * Get recent reviews for dashboard
   */
  static async getRecentReviews(req: Request, res: Response) {
    try {
      const { limit = 10 } = req.query;

      const reviews = await ReviewService.getRecentReviews(Number(limit));

      return res.json({
        success: true,
        message: Messages.REVIEW.RECENT_REVIEWS_RETRIEVED,
        data: reviews
      });
    } catch (error: any) {
      console.error('Get recent reviews error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || Messages.REVIEW.FETCH_FAILED
      });
    }
  }

  /**
   * Get review analytics for admin dashboard
   */
  static async getReviewAnalytics(req: Request, res: Response) {
    try {
      // Check if user is admin
      if ((req as any).user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: Messages.AUTH.ADMIN_ONLY
        });
      }

      const analytics = await ReviewService.getReviewAnalytics();

      return res.json({
        success: true,
        message: Messages.REVIEW.ANALYTICS_RETRIEVED,
        data: analytics
      });
    } catch (error: any) {
      console.error('Get review analytics error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || Messages.ANALYTICS.FETCH_FAILED
      });
    }
  }

  /**
   * Send review request email
   */
  static async sendReviewRequest(req: Request, res: Response) {
    try {
      const { orderId } = req.body;

      await ReviewService.sendReviewRequest(orderId);

      return res.json({
        success: true,
        message: Messages.REVIEW.REQUEST_SENT,
      });
    } catch (error: any) {
      console.error('Send review request error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || Messages.NEWSLETTER.EMAIL_FAILED
      });
    }
  }

  /**
   * Get seller's reviews (all reviews on seller's products)
   */
  static async getSellerReviews(req: Request, res: Response) {
    try {
      const sellerId = req.user!.userId;
      const { 
        page = 1, 
        limit = 50,
        status
      } = req.query;

      const result = await ReviewService.getSellerReviews(sellerId, {
        page: Number(page),
        limit: Number(limit),
        status: status as string
      });

      return res.json({
        success: true,
        message: Messages.REVIEW.SELLER_REVIEWS_RETRIEVED,
        data: result
      });
    } catch (error: any) {
      console.error('Get seller reviews error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || Messages.REVIEW.FETCH_FAILED
      });
    }
  }

  /**
   * Get review by ID
   */
  static async getReviewById(req: Request, res: Response) {
    try {
      const { reviewId } = req.params;

      const Review = require('../models/Review').default;
      const review = await Review.findById(reviewId)
        .populate('userId', 'firstName lastName avatar')
        .populate('productId', 'name images primaryImage')
        .populate('orderId', 'orderNumber')
        .populate('moderatedBy', 'firstName lastName');

      if (!review) {
        return res.status(404).json({
          success: false,
          message: Messages.REVIEW.NOT_FOUND
        });
      }

      return res.json({
        success: true,
        message: Messages.REVIEW.FETCH_SUCCESS,
        data: review
      });
    } catch (error: any) {
      console.error('Get review by ID error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || Messages.REVIEW.FETCH_FAILED
      });
    }
  }
}
