import Review, { IReview } from '../models/Review';
import Product from '../models/Product';
import Order from '../models/Order';
import User from '../models/User';
import { EmailService } from './emailService';
import { SellerRatingService } from './sellerRatingService';
import Messages from '../utils/messages';

export interface CreateReviewData {
  productId: string;
  userId: string;
  orderId: string;
  rating: number;
  title: string;
  content: string;
  images?: string[];
}

export interface UpdateReviewData {
  rating?: number;
  title?: string;
  content?: string;
  images?: string[];
}

export interface ReviewStatistics {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>;
  verifiedReviews: number;
  helpfulReviews: number;
}

export interface ReviewListResponse {
  reviews: IReview[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  averageRating: number;
}

export class ReviewService {
  /**
   * Create a new review
   */
  static async createReview(data: CreateReviewData): Promise<IReview> {
    try {
      // Check if user has already reviewed this product
      const existingReview = await Review.findOne({
        userId: data.userId,
        productId: data.productId
      });

      if (existingReview) {
        throw new Error('You have already reviewed this product');
      }

      // Verify order exists and belongs to user
      const order = await Order.findById(data.orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      if (order.userId.toString() !== data.userId) {
        throw new Error('Order does not belong to user');
      }

      // Check if order contains the product
      const hasProduct = order.items.some(item => 
        item.productId.toString() === data.productId
      );

      if (!hasProduct) {
        throw new Error('Order does not contain this product');
      }

      // Check if order is completed
      if (!['delivered', 'completed'].includes(order.status)) {
        throw new Error('Order must be delivered or completed to review');
      }

      // Create review
      const review = new Review({
        ...data,
        isVerified: true // Since we verified the purchase
      });

      await review.save();

      // Update product rating
      await this.updateProductRating(data.productId);

      // Update seller rating (new feature)
      await SellerRatingService.updateSellerRatingFromProductReview(data.productId);

      return review;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  /**
   * Get all reviews (no product filter)
   */
  static async getAllReviews(
    options: {
      page?: number;
      limit?: number;
      status?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    } = {}
  ): Promise<ReviewListResponse> {
    try {
      const { page = 1, limit = 10, status = 'all', sortBy = 'createdAt', sortOrder = 'desc' } = options;

      // Build query
      const query: any = {};
      if (status && status !== 'all') {
        query.status = status;
      }

      // Build sort
      const sort: any = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

      // Get reviews
      const reviews = await Review.find(query)
        .populate('userId', 'firstName lastName email avatar')
        .populate('productId', 'name primaryImage')
        .populate('moderatedBy', 'firstName lastName')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit);

      // Get total count
      const total = await Review.countDocuments(query);

      // Get average rating across all reviews
      const stats = await Review.aggregate([
        ...(status && status !== 'all' ? [{ $match: { status } }] : []),
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' }
          }
        },
        {
          $addFields: {
            averageRating: { $round: ['$averageRating', 1] }
          }
        }
      ]);
      const averageRating = stats.length > 0 ? stats[0].averageRating : 0;

      return {
        reviews,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        averageRating
      };
    } catch (error) {
      console.error('Error getting all reviews:', error);
      throw error;
    }
  }

  /**
   * Get reviews for a product
   */
  static async getProductReviews(
    productId: string,
    options: {
      page?: number;
      limit?: number;
      status?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    } = {}
  ): Promise<ReviewListResponse> {
    try {
      const { page = 1, limit = 10, status = 'approved', sortBy = 'createdAt', sortOrder = 'desc' } = options;

      // Get reviews
      const reviews = await (Review as any).findByProductId(productId, {
        page,
        limit,
        status,
        sortBy,
        sortOrder
      });

      // Get total count
      const total = await Review.countDocuments({ productId, status });

      // Get average rating
      const stats = await (Review as any).getProductStatistics(productId);
      const averageRating = stats.length > 0 ? stats[0].averageRating : 0;

      return {
        reviews,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        averageRating
      };
    } catch (error) {
      console.error('Error getting product reviews:', error);
      throw error;
    }
  }

  /**
   * Update a review
   */
  static async updateReview(
    reviewId: string,
    userId: string,
    updateData: UpdateReviewData
  ): Promise<IReview> {
    try {
      const review = await Review.findById(reviewId);
      if (!review) {
        throw new Error(Messages.REVIEW.NOT_FOUND);
      }

      // Check ownership
      if (review.userId.toString() !== userId) {
        throw new Error(Messages.AUTH.ACCESS_DENIED);
      }

      // Check if review is approved (can't edit approved reviews)
      if (review.status === 'approved') {
        throw new Error('Não é possível editar avaliações aprovadas');
      }

      // Update review
      Object.assign(review, updateData);
      await review.save();

      return review;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  }

  /**
   * Delete a review
   */
  static async deleteReview(reviewId: string, userId: string): Promise<void> {
    try {
      const review = await Review.findById(reviewId);
      if (!review) {
        throw new Error(Messages.REVIEW.NOT_FOUND);
      }

      // Check ownership
      if (review.userId.toString() !== userId) {
        throw new Error(Messages.AUTH.ACCESS_DENIED);
      }

      const productId = review.productId.toString();
      await Review.findByIdAndDelete(reviewId);

      // Update product rating
      await this.updateProductRating(productId);

      // Update seller rating (new feature)
      await SellerRatingService.updateSellerRatingFromProductReview(productId);
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }

  /**
   * Moderate a review (admin only)
   */
  static async moderateReview(
    reviewId: string,
    status: 'approved' | 'rejected',
    moderatorId: string,
    notes?: string
  ): Promise<IReview> {
    try {
      const review = await Review.findById(reviewId);
      if (!review) {
        throw new Error(Messages.REVIEW.NOT_FOUND);
      }

      await (review as any).moderate(status, moderatorId, notes);

      // Update product rating if approved
      if (status === 'approved') {
        await this.updateProductRating(review.productId.toString());
        // Update seller rating (new feature)
        await SellerRatingService.updateSellerRatingFromProductReview(review.productId.toString());
      }

      return review;
    } catch (error) {
      console.error('Error moderating review:', error);
      throw error;
    }
  }

  /**
   * Mark review as helpful/not helpful
   */
  static async markReviewHelpful(
    reviewId: string,
    userId: string,
    isHelpful: boolean
  ): Promise<IReview> {
    try {
      const review = await Review.findById(reviewId);
      if (!review) {
        throw new Error(Messages.REVIEW.NOT_FOUND);
      }

      if (isHelpful) {
        await (review as any).markAsHelpful(userId);
      } else {
        await (review as any).markAsNotHelpful(userId);
      }

      return review;
    } catch (error) {
      console.error('Error marking review helpful:', error);
      throw error;
    }
  }

  /**
   * Get review statistics for a product
   */
      static async getReviewStatistics(productId: string): Promise<ReviewStatistics> {
    try {
      const stats = await (Review as any).getProductStatistics(productId);
      
      if (stats.length === 0) {
        return {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          verifiedReviews: 0,
          helpfulReviews: 0
        };
      }

      const result = stats[0];
      const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      
      // Calculate rating distribution
      result.ratingDistribution.forEach((rating: number) => {
        ratingDistribution[rating as keyof typeof ratingDistribution]++;
      });

      // Get additional statistics
      const verifiedCount = await Review.countDocuments({
        productId,
        status: 'approved',
        isVerified: true
      });

      const helpfulCount = await Review.countDocuments({
        productId,
        status: 'approved',
        $or: [
          { isHelpful: { $gt: 0 } },
          { isNotHelpful: { $gt: 0 } }
        ]
      });

      return {
        averageRating: result.averageRating,
        totalReviews: result.totalReviews,
        ratingDistribution,
        verifiedReviews: verifiedCount,
        helpfulReviews: helpfulCount
      };
    } catch (error) {
      console.error('Error getting review statistics:', error);
      throw error;
    }
  }

  /**
   * Get pending reviews for moderation
   */
  static async getPendingReviews(options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<ReviewListResponse> {
    try {
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;

      const reviews = await (Review as any).findPendingReviews({
        page,
        limit,
        sortBy,
        sortOrder
      });

      const total = await Review.countDocuments({ status: 'pending' });

      return {
        reviews,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        averageRating: 0 // Not applicable for pending reviews
      };
    } catch (error) {
      console.error('Error getting pending reviews:', error);
      throw error;
    }
  }

  /**
   * Get user's reviews
   */
  static async getUserReviews(
    userId: string,
    options: {
      page?: number;
      limit?: number;
      status?: string;
    } = {}
  ): Promise<ReviewListResponse> {
    try {
      const { page = 1, limit = 10, status } = options;

      const query: any = { userId };
      if (status) {
        query.status = status;
      }

      const reviews = await Review.find(query)
        .populate('productId', 'name images primaryImage')
        .populate('orderId', 'orderNumber')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Review.countDocuments(query);

      return {
        reviews,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        averageRating: 0 // Not applicable for user reviews
      };
    } catch (error) {
      console.error('Error getting user reviews:', error);
      throw error;
    }
  }

  /**
   * Update product rating and review count
   */
  private static async updateProductRating(productId: string): Promise<void> {
    try {
      const stats = await (Review as any).getProductStatistics(productId);
      
      if (stats.length > 0) {
        await Product.findByIdAndUpdate(productId, {
          averageRating: stats[0].averageRating,
          totalReviews: stats[0].totalReviews
        });
      } else {
        // No approved reviews, reset to defaults
        await Product.findByIdAndUpdate(productId, {
          averageRating: 0,
          totalReviews: 0
        });
      }
    } catch (error) {
      console.error('Error updating product rating:', error);
      throw error;
    }
  }

  /**
   * Send review request email (to be implemented with email service)
   */
  static async sendReviewRequest(orderId: string): Promise<void> {
    try {
      const order = await Order.findById(orderId)
        .populate('userId', 'email firstName lastName')
        .populate('items.productId', 'name');

      if (!order) {
        throw new Error('Order not found');
      }

      // Send review request email
      await EmailService.sendReviewRequest({
        ...order.toObject(),
        userId: order.userId.toString()
      });
    } catch (error) {
      console.error('Error sending review request:', error);
      throw error;
    }
  }

  /**
   * Get recent reviews for dashboard
   */
  static async getRecentReviews(limit: number = 10): Promise<IReview[]> {
    try {
      return await Review.find({ status: 'approved' })
        .populate('userId', 'firstName lastName avatar')
        .populate('productId', 'name images primaryImage')
        .sort({ createdAt: -1 })
        .limit(limit);
    } catch (error) {
      console.error('Error getting recent reviews:', error);
      throw error;
    }
  }

  /**
   * Get reviews for seller's products
   */
  static async getSellerReviews(
    sellerId: string,
    options: {
      page?: number;
      limit?: number;
      status?: string;
    } = {}
  ): Promise<ReviewListResponse> {
    try {
      const { page = 1, limit = 10, status } = options;

      // Get all product IDs for this seller
      const sellerProducts = await Product.find({ sellerId }).select('_id');
      const productIds = sellerProducts.map((p: any) => p._id);

      if (productIds.length === 0) {
        return {
          reviews: [],
          total: 0,
          page,
          limit,
          totalPages: 0,
          averageRating: 0
        };
      }

      // Build query
      const query: any = { productId: { $in: productIds } };
      if (status) {
        query.status = status;
      }

      // Get reviews with pagination
      const reviews = await Review.find(query)
        .populate('productId', 'name images primaryImage sellerName')
        .populate('userId', 'firstName lastName avatar')
        .populate('orderId', 'orderNumber')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Review.countDocuments(query);

      // Calculate average rating for seller's products
      const ratingStats = await Review.aggregate([
        { $match: { productId: { $in: productIds }, status: 'approved' } },
        { $group: { _id: null, averageRating: { $avg: '$rating' } } }
      ]);

      const averageRating = ratingStats.length > 0 
        ? Math.round(ratingStats[0].averageRating * 10) / 10 
        : 0;

      return {
        reviews,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        averageRating
      };
    } catch (error) {
      console.error('Error getting seller reviews:', error);
      throw error;
    }
  }

  /**
   * Get review analytics for admin dashboard
   */
  static async getReviewAnalytics(): Promise<{
    totalReviews: number;
    pendingReviews: number;
    approvedReviews: number;
    rejectedReviews: number;
    averageRating: number;
    recentReviews: number; // Last 30 days
  }> {
    try {
      const [
        totalReviews,
        pendingReviews,
        approvedReviews,
        rejectedReviews,
        recentReviews
      ] = await Promise.all([
        Review.countDocuments(),
        Review.countDocuments({ status: 'pending' }),
        Review.countDocuments({ status: 'approved' }),
        Review.countDocuments({ status: 'rejected' }),
        Review.countDocuments({
          status: 'approved',
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        })
      ]);

      // Calculate overall average rating
      const ratingStats = await Review.aggregate([
        { $match: { status: 'approved' } },
        { $group: { _id: null, averageRating: { $avg: '$rating' } } }
      ]);

      const averageRating = ratingStats.length > 0 
        ? Math.round(ratingStats[0].averageRating * 10) / 10 
        : 0;

      return {
        totalReviews,
        pendingReviews,
        approvedReviews,
        rejectedReviews,
        averageRating,
        recentReviews
      };
    } catch (error) {
      console.error('Error getting review analytics:', error);
      throw error;
    }
  }
}
