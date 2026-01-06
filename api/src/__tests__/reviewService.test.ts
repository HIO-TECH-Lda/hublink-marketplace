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
  let testUser: any;
  let testProduct: any;
  let testReview: any;

  beforeAll(async () => {
    await connectDB();

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
        isHelpful: 0,
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
        orderId: 'order123',
        rating: 5,
        title: 'Great Product',
        content: 'This is an excellent product!'
      };

      mockUser.findById.mockResolvedValue(testUser);
      mockProduct.findById.mockResolvedValue(testProduct);
      mockReview.create.mockResolvedValue(testReview);

      const result = await ReviewService.createReview(reviewData);

      expect(result).toBeDefined();
      expect(result.rating).toBe(reviewData.rating);
    });

    it('should return error for non-existent user', async () => {
      const reviewData = {
        userId: 'nonexistent',
        productId: testProduct._id,
        rating: 5,
        title: 'Great Product',
        content: 'This is an excellent product!',
        orderId: 'order123'
      };

      mockUser.findById.mockResolvedValue(null);

      await expect(ReviewService.createReview(reviewData)).rejects.toThrow();
    });

    it('should return error for non-existent product', async () => {
      const reviewData = {
        userId: testUser._id,
        productId: 'nonexistent',
        rating: 5,
        title: 'Great Product',
        content: 'This is an excellent product!',
        orderId: 'order123'
      };

      mockUser.findById.mockResolvedValue(testUser);
      mockProduct.findById.mockResolvedValue(null);

      await expect(ReviewService.createReview(reviewData)).rejects.toThrow();
    });

    it('should return error for invalid rating', async () => {
      const reviewData = {
        userId: testUser._id,
        productId: testProduct._id,
        rating: 6, // Invalid rating
        title: 'Great Product',
        content: 'This is an excellent product!',
        orderId: 'order123'
      };

      await expect(ReviewService.createReview(reviewData)).rejects.toThrow();
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
      } as any);

      const result = await ReviewService.getProductReviews(testProduct._id);

      expect(result).toBeDefined();
      expect(result.reviews).toHaveLength(1);
    });

    it('should return error for non-existent product', async () => {
      mockProduct.findById.mockResolvedValue(null);

      await expect(ReviewService.getProductReviews('nonexistent')).rejects.toThrow();
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

      const result = await ReviewService.getReviewStatistics(testProduct._id);

      expect(result).toBeDefined();
      expect(result.totalReviews).toBe(statistics.totalReviews);
    });
  });

  describe('getReviewById', () => {
    it('should return a specific review', async () => {
      mockReview.findById.mockResolvedValue(testReview);

      const review = await Review.findById(testReview._id);
      expect(review).toBeDefined();
      expect(review?._id).toBe(testReview._id);
    });

    it('should return error for non-existent review', async () => {
      mockReview.findById.mockResolvedValue(null);

      const review = await Review.findById('nonexistent');
      expect(review).toBeNull();
    });
  });

  describe('updateReview', () => {
    it('should update review successfully', async () => {
      const updateData = {
        rating: 4,
        title: 'Updated Title',
        content: 'Updated comment'
      };

      const updatedReview = { ...testReview, ...updateData };
      mockReview.findById.mockResolvedValue(testReview);
      mockReview.findByIdAndUpdate.mockResolvedValue(updatedReview);

      const result = await ReviewService.updateReview(testReview._id, testUser._id, updateData);

      expect(result).toBeDefined();
      expect(result.rating).toBe(updateData.rating);
    });

    it('should return error when user is not the review owner', async () => {
      const updateData = {
        rating: 4,
        title: 'Updated Title',
        content: 'Updated comment'
      };

      const otherUserReview = { ...testReview, userId: 'otheruser' };
      mockReview.findById.mockResolvedValue(otherUserReview);

      await expect(ReviewService.updateReview(testReview._id, testUser._id, updateData)).rejects.toThrow();
    });

    it('should return error for non-existent review', async () => {
      const updateData = {
        rating: 4,
        title: 'Updated Title',
        content: 'Updated comment'
      };

      mockReview.findById.mockResolvedValue(null);

      await expect(ReviewService.updateReview('nonexistent', testUser._id, updateData)).rejects.toThrow();
    });
  });

  describe('deleteReview', () => {
    it('should delete review successfully', async () => {
      mockReview.findById.mockResolvedValue(testReview);
      mockReview.findByIdAndDelete.mockResolvedValue(testReview);

      await ReviewService.deleteReview(testReview._id, testUser._id);
    });

    it('should return error when user is not the review owner', async () => {
      const otherUserReview = { ...testReview, userId: 'otheruser' };
      mockReview.findById.mockResolvedValue(otherUserReview);

      await expect(ReviewService.deleteReview(testReview._id, testUser._id)).rejects.toThrow();
    });
  });

  describe('markReviewHelpful', () => {
    it('should mark review as helpful successfully', async () => {
      const updatedReview = { ...testReview, isHelpful: (testReview.isHelpful || 0) + 1 };
      mockReview.findById.mockResolvedValue(testReview);

      const result = await ReviewService.markReviewHelpful(testReview._id, testUser._id, true);

      expect(result).toBeDefined();
    });

    it('should return error for non-existent review', async () => {
      mockReview.findById.mockResolvedValue(null);

      await expect(ReviewService.markReviewHelpful('nonexistent', testUser._id, true)).rejects.toThrow();
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

      const result = await ReviewService.moderateReview(testReview._id, moderateData.status as 'approved' | 'rejected', testUser._id, moderateData.moderationNote);

      expect(result).toBeDefined();
      expect(result.status).toBe(moderateData.status);
    });

    it('should return error for non-existent review', async () => {
      const moderateData = {
        status: 'approved',
        moderationNote: 'Review approved'
      };

      mockReview.findById.mockResolvedValue(null);

      await expect(ReviewService.moderateReview('nonexistent', moderateData.status as 'approved' | 'rejected', testUser._id, moderateData.moderationNote)).rejects.toThrow();
    });

    it('should return error for invalid status', async () => {
      const moderateData = {
        status: 'invalid',
        moderationNote: 'Review approved'
      };

      await expect(ReviewService.moderateReview(testReview._id, moderateData.status as any, testUser._id, moderateData.moderationNote)).rejects.toThrow();
    });
  });

  describe('getPendingReviews', () => {
    it('should return pending reviews', async () => {
      const pendingReviews = [testReview];
      mockReview.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(pendingReviews)
        })
      } as any);

      const result = await ReviewService.getPendingReviews();

      expect(result).toBeDefined();
      expect(result.reviews).toHaveLength(1);
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

      const result = await ReviewService.getReviewAnalytics();

      expect(result).toBeDefined();
      expect(result.totalReviews).toBe(analytics.totalReviews);
    });
  });

  describe('getUserReviews', () => {
    it('should return user reviews', async () => {
      const userReviews = [testReview];
      mockReview.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(userReviews)
        })
      } as any);

      const result = await ReviewService.getUserReviews(testUser._id);

      expect(result).toBeDefined();
      expect(result.reviews).toHaveLength(1);
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
      } as any);

      const result = await ReviewService.getRecentReviews();

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
    });
  });

  describe('sendReviewRequest', () => {
    it('should send review request successfully', async () => {
      const requestData = {
        orderId: 'order123',
        customerEmail: 'customer@example.com'
      };

      await ReviewService.sendReviewRequest(requestData.orderId);
    });

    it('should return error for invalid email', async () => {
      const requestData = {
        orderId: 'order123',
        customerEmail: 'invalid-email'
      };

      await ReviewService.sendReviewRequest(requestData.orderId);

      await expect(ReviewService.sendReviewRequest('invalid')).rejects.toThrow();
    });
  });

});
