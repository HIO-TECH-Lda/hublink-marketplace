import { ReviewService } from '../services/reviewService';
import Review from '../models/Review';
import User from '../models/User';
import Product from '../models/Product';
import { connectDB, disconnectDB } from '../config/database';

// Mock the models
jest.mock('../models/Review');
jest.mock('../models/User');
jest.mock('../models/Product');

const mockReview = Review as jest.Mocked<typeof Review>;
const mockUser = User as jest.Mocked<typeof User>;
const mockProduct = Product as jest.Mocked<typeof Product>;

describe('Review Service Tests', () => {
  let reviewService: ReviewService;
  let testUser: any;
  let testProduct: any;
  let testReview: any;

  beforeAll(async () => {
    await connectDB();
    reviewService = new ReviewService();

    testUser = {
      _id: 'user123',
      email: 'test@example.com',
      role: 'customer'
    };

    testProduct = {
      _id: 'product123',
      name: 'Test Product',
      price: 99.99
    };

    testReview = {
      _id: 'review123',
      userId: testUser._id,
      productId: testProduct._id,
      rating: 5,
      title: 'Great Product',
      comment: 'This is an excellent product!',
      helpful: 0,
      status: 'approved',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  });

  afterAll(async () => {
    await disconnectDB();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createReview', () => {
    it('should create a review successfully', async () => {
      const reviewData = {
        userId: testUser._id,
        productId: testProduct._id,
        rating: 5,
        title: 'Great Product',
        comment: 'This is an excellent product!'
      };

      mockUser.findById.mockResolvedValue(testUser);
      mockProduct.findById.mockResolvedValue(testProduct);
      mockReview.create.mockResolvedValue(testReview);

      const result = await reviewService.createReview(reviewData);

      expect(result.success).toBe(true);
      expect(result.data).toMatchObject(reviewData);
    });

    it('should return error for non-existent user', async () => {
      const reviewData = {
        userId: 'nonexistent',
        productId: testProduct._id,
        rating: 5,
        title: 'Great Product',
        comment: 'This is an excellent product!'
      };

      mockUser.findById.mockResolvedValue(null);

      const result = await reviewService.createReview(reviewData);

      expect(result.success).toBe(false);
      expect(result.message).toContain('User not found');
    });

    it('should return error for non-existent product', async () => {
      const reviewData = {
        userId: testUser._id,
        productId: 'nonexistent',
        rating: 5,
        title: 'Great Product',
        comment: 'This is an excellent product!'
      };

      mockUser.findById.mockResolvedValue(testUser);
      mockProduct.findById.mockResolvedValue(null);

      const result = await reviewService.createReview(reviewData);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Product not found');
    });

    it('should return error for invalid rating', async () => {
      const reviewData = {
        userId: testUser._id,
        productId: testProduct._id,
        rating: 6, // Invalid rating
        title: 'Great Product',
        comment: 'This is an excellent product!'
      };

      const result = await reviewService.createReview(reviewData);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Rating must be between 1 and 5');
    });
  });

  describe('getProductReviews', () => {
    it('should return reviews for a product', async () => {
      const reviews = [testReview];
      mockProduct.findById.mockResolvedValue(testProduct);
      mockReview.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(reviews)
        })
      });

      const result = await reviewService.getProductReviews(testProduct._id);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
    });

    it('should return error for non-existent product', async () => {
      mockProduct.findById.mockResolvedValue(null);

      const result = await reviewService.getProductReviews('nonexistent');

      expect(result.success).toBe(false);
      expect(result.message).toContain('Product not found');
    });
  });

  describe('getReviewStatistics', () => {
    it('should return review statistics', async () => {
      const statistics = {
        totalReviews: 10,
        averageRating: 4.5,
        ratingDistribution: {
          1: 1, 2: 1, 3: 2, 4: 3, 5: 3
        }
      };

      mockProduct.findById.mockResolvedValue(testProduct);
      mockReview.aggregate.mockResolvedValue([
        {
          _id: null,
          totalReviews: statistics.totalReviews,
          averageRating: statistics.averageRating,
          ratingDistribution: statistics.ratingDistribution
        }
      ]);

      const result = await reviewService.getReviewStatistics(testProduct._id);

      expect(result.success).toBe(true);
      expect(result.data).toMatchObject(statistics);
    });
  });

  describe('getReviewById', () => {
    it('should return a specific review', async () => {
      mockReview.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(testReview)
      });

      const result = await reviewService.getReviewById(testReview._id);

      expect(result.success).toBe(true);
      expect(result.data._id).toBe(testReview._id);
    });

    it('should return error for non-existent review', async () => {
      mockReview.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      const result = await reviewService.getReviewById('nonexistent');

      expect(result.success).toBe(false);
      expect(result.message).toContain('Review not found');
    });
  });

  describe('updateReview', () => {
    it('should update review successfully', async () => {
      const updateData = {
        rating: 4,
        title: 'Updated Title',
        comment: 'Updated comment'
      };

      const updatedReview = { ...testReview, ...updateData };
      mockReview.findById.mockResolvedValue(testReview);
      mockReview.findByIdAndUpdate.mockResolvedValue(updatedReview);

      const result = await reviewService.updateReview(testReview._id, testUser._id, updateData);

      expect(result.success).toBe(true);
      expect(result.data).toMatchObject(updateData);
    });

    it('should return error when user is not the review owner', async () => {
      const updateData = {
        rating: 4,
        title: 'Updated Title',
        comment: 'Updated comment'
      };

      const otherUserReview = { ...testReview, userId: 'otheruser' };
      mockReview.findById.mockResolvedValue(otherUserReview);

      const result = await reviewService.updateReview(testReview._id, testUser._id, updateData);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Not authorized');
    });

    it('should return error for non-existent review', async () => {
      const updateData = {
        rating: 4,
        title: 'Updated Title',
        comment: 'Updated comment'
      };

      mockReview.findById.mockResolvedValue(null);

      const result = await reviewService.updateReview('nonexistent', testUser._id, updateData);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Review not found');
    });
  });

  describe('deleteReview', () => {
    it('should delete review successfully', async () => {
      mockReview.findById.mockResolvedValue(testReview);
      mockReview.findByIdAndDelete.mockResolvedValue(testReview);

      const result = await reviewService.deleteReview(testReview._id, testUser._id);

      expect(result.success).toBe(true);
    });

    it('should return error when user is not the review owner', async () => {
      const otherUserReview = { ...testReview, userId: 'otheruser' };
      mockReview.findById.mockResolvedValue(otherUserReview);

      const result = await reviewService.deleteReview(testReview._id, testUser._id);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Not authorized');
    });
  });

  describe('markReviewHelpful', () => {
    it('should mark review as helpful successfully', async () => {
      const updatedReview = { ...testReview, helpful: testReview.helpful + 1 };
      mockReview.findById.mockResolvedValue(testReview);
      mockReview.findByIdAndUpdate.mockResolvedValue(updatedReview);

      const result = await reviewService.markReviewHelpful(testReview._id);

      expect(result.success).toBe(true);
      expect(result.data.helpful).toBe(updatedReview.helpful);
    });

    it('should return error for non-existent review', async () => {
      mockReview.findById.mockResolvedValue(null);

      const result = await reviewService.markReviewHelpful('nonexistent');

      expect(result.success).toBe(false);
      expect(result.message).toContain('Review not found');
    });
  });

  describe('moderateReview', () => {
    it('should moderate review successfully', async () => {
      const moderateData = {
        status: 'approved',
        moderationNote: 'Review approved'
      };

      const moderatedReview = { ...testReview, ...moderateData };
      mockReview.findById.mockResolvedValue(testReview);
      mockReview.findByIdAndUpdate.mockResolvedValue(moderatedReview);

      const result = await reviewService.moderateReview(testReview._id, moderateData);

      expect(result.success).toBe(true);
      expect(result.data.status).toBe(moderateData.status);
    });

    it('should return error for non-existent review', async () => {
      const moderateData = {
        status: 'approved',
        moderationNote: 'Review approved'
      };

      mockReview.findById.mockResolvedValue(null);

      const result = await reviewService.moderateReview('nonexistent', moderateData);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Review not found');
    });

    it('should return error for invalid status', async () => {
      const moderateData = {
        status: 'invalid',
        moderationNote: 'Review approved'
      };

      const result = await reviewService.moderateReview(testReview._id, moderateData);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Invalid status');
    });
  });

  describe('getPendingReviews', () => {
    it('should return pending reviews', async () => {
      const pendingReviews = [testReview];
      mockReview.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(pendingReviews)
        })
      });

      const result = await reviewService.getPendingReviews();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
    });
  });

  describe('getReviewAnalytics', () => {
    it('should return review analytics', async () => {
      const analytics = {
        totalReviews: 100,
        averageRating: 4.2,
        pendingReviews: 5,
        approvedReviews: 90,
        rejectedReviews: 5
      };

      mockReview.aggregate.mockResolvedValue([
        {
          _id: null,
          totalReviews: analytics.totalReviews,
          averageRating: analytics.averageRating,
          pendingReviews: analytics.pendingReviews,
          approvedReviews: analytics.approvedReviews,
          rejectedReviews: analytics.rejectedReviews
        }
      ]);

      const result = await reviewService.getReviewAnalytics();

      expect(result.success).toBe(true);
      expect(result.data).toMatchObject(analytics);
    });
  });

  describe('getUserReviews', () => {
    it('should return user reviews', async () => {
      const userReviews = [testReview];
      mockReview.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(userReviews)
        })
      });

      const result = await reviewService.getUserReviews(testUser._id);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
    });
  });

  describe('getRecentReviews', () => {
    it('should return recent reviews', async () => {
      const recentReviews = [testReview];
      mockReview.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue(recentReviews)
          })
        })
      });

      const result = await reviewService.getRecentReviews();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
    });
  });

  describe('sendReviewRequest', () => {
    it('should send review request successfully', async () => {
      const requestData = {
        orderId: 'order123',
        customerEmail: 'customer@example.com'
      };

      const result = await reviewService.sendReviewRequest(requestData);

      expect(result.success).toBe(true);
      expect(result.message).toContain('Review request sent');
    });

    it('should return error for invalid email', async () => {
      const requestData = {
        orderId: 'order123',
        customerEmail: 'invalid-email'
      };

      const result = await reviewService.sendReviewRequest(requestData);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Invalid email');
    });
  });

  describe('validateReviewData', () => {
    it('should validate correct review data', () => {
      const reviewData = {
        rating: 5,
        title: 'Great Product',
        comment: 'This is an excellent product!'
      };

      const result = reviewService.validateReviewData(reviewData);

      expect(result.isValid).toBe(true);
    });

    it('should return error for invalid rating', () => {
      const reviewData = {
        rating: 6,
        title: 'Great Product',
        comment: 'This is an excellent product!'
      };

      const result = reviewService.validateReviewData(reviewData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Rating must be between 1 and 5');
    });

    it('should return error for empty title', () => {
      const reviewData = {
        rating: 5,
        title: '',
        comment: 'This is an excellent product!'
      };

      const result = reviewService.validateReviewData(reviewData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Title is required');
    });

    it('should return error for empty comment', () => {
      const reviewData = {
        rating: 5,
        title: 'Great Product',
        comment: ''
      };

      const result = reviewService.validateReviewData(reviewData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Comment is required');
    });
  });
});
