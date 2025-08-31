import request from 'supertest';
import { app } from '../app';
import Review from '../models/Review';
import User from '../models/User';
import Product from '../models/Product';
import { connectDB, disconnectDB } from '../config/database';
import jwt from 'jsonwebtoken';

// Mock the Review model
jest.mock('../models/Review');
jest.mock('../models/User');
jest.mock('../models/Product');

const mockReview = Review as jest.Mocked<typeof Review>;
const mockUser = User as jest.Mocked<typeof User>;
const mockProduct = Product as jest.Mocked<typeof Product>;

describe('Review Controller Tests', () => {
  let testUser: any;
  let testProduct: any;
  let testReview: any;
  let authToken: string;

  beforeAll(async () => {
    await connectDB();
    
    // Create test user
    testUser = {
      _id: 'user123',
      email: 'test@example.com',
      role: 'customer'
    };

    // Create test product
    testProduct = {
      _id: 'product123',
      name: 'Test Product',
      price: 99.99
    };

    // Create test review
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

    // Generate auth token
    authToken = jwt.sign(
      { userId: testUser._id, role: testUser.role },
      process.env.JWT_SECRET || 'test-secret'
    );
  });

  afterAll(async () => {
    await disconnectDB();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/reviews - Create Review', () => {
    it('should create a new review successfully', async () => {
      const reviewData = {
        productId: testProduct._id,
        rating: 5,
        title: 'Great Product',
        comment: 'This is an excellent product!'
      };

      mockReview.create.mockResolvedValue(testReview);
      mockUser.findById.mockResolvedValue(testUser);
      mockProduct.findById.mockResolvedValue(testProduct);

      const response = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${authToken}`)
        .send(reviewData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        rating: reviewData.rating,
        title: reviewData.title,
        comment: reviewData.comment
      });
    });

    it('should return 400 for invalid review data', async () => {
      const invalidData = {
        productId: testProduct._id,
        rating: 6, // Invalid rating (should be 1-5)
        title: '', // Empty title
        comment: 'Test comment'
      };

      const response = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 401 without authentication', async () => {
      const reviewData = {
        productId: testProduct._id,
        rating: 5,
        title: 'Great Product',
        comment: 'This is an excellent product!'
      };

      await request(app)
        .post('/api/reviews')
        .send(reviewData)
        .expect(401);
    });

    it('should return 404 for non-existent product', async () => {
      const reviewData = {
        productId: 'nonexistent',
        rating: 5,
        title: 'Great Product',
        comment: 'This is an excellent product!'
      };

      mockProduct.findById.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${authToken}`)
        .send(reviewData)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/reviews/product/:productId - Get Product Reviews', () => {
    it('should return reviews for a product', async () => {
      const reviews = [testReview];
      mockReview.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(reviews)
        })
      });

      const response = await request(app)
        .get(`/api/reviews/product/${testProduct._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
    });

    it('should return empty array for product with no reviews', async () => {
      mockReview.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue([])
        })
      });

      const response = await request(app)
        .get(`/api/reviews/product/${testProduct._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
    });

    it('should return 404 for non-existent product', async () => {
      mockProduct.findById.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/reviews/product/nonexistent')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/reviews/product/:productId/statistics - Get Review Statistics', () => {
    it('should return review statistics for a product', async () => {
      const statistics = {
        totalReviews: 10,
        averageRating: 4.5,
        ratingDistribution: {
          1: 1, 2: 1, 3: 2, 4: 3, 5: 3
        }
      };

      mockReview.aggregate.mockResolvedValue([
        {
          _id: null,
          totalReviews: statistics.totalReviews,
          averageRating: statistics.averageRating,
          ratingDistribution: statistics.ratingDistribution
        }
      ]);

      const response = await request(app)
        .get(`/api/reviews/product/${testProduct._id}/statistics`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject(statistics);
    });
  });

  describe('GET /api/reviews/:reviewId - Get Review by ID', () => {
    it('should return a specific review', async () => {
      mockReview.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(testReview)
      });

      const response = await request(app)
        .get(`/api/reviews/${testReview._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(testReview._id);
    });

    it('should return 404 for non-existent review', async () => {
      mockReview.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      const response = await request(app)
        .get('/api/reviews/nonexistent')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/reviews/:reviewId - Update Review', () => {
    it('should update review successfully', async () => {
      const updateData = {
        rating: 4,
        title: 'Updated Title',
        comment: 'Updated comment'
      };

      const updatedReview = { ...testReview, ...updateData };
      mockReview.findById.mockResolvedValue(testReview);
      mockReview.findByIdAndUpdate.mockResolvedValue(updatedReview);

      const response = await request(app)
        .put(`/api/reviews/${testReview._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject(updateData);
    });

    it('should return 403 when user is not the review owner', async () => {
      const otherUserReview = { ...testReview, userId: 'otheruser' };
      mockReview.findById.mockResolvedValue(otherUserReview);

      const updateData = {
        rating: 4,
        title: 'Updated Title',
        comment: 'Updated comment'
      };

      const response = await request(app)
        .put(`/api/reviews/${testReview._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should return 404 for non-existent review', async () => {
      mockReview.findById.mockResolvedValue(null);

      const updateData = {
        rating: 4,
        title: 'Updated Title',
        comment: 'Updated comment'
      };

      const response = await request(app)
        .put('/api/reviews/nonexistent')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/reviews/:reviewId - Delete Review', () => {
    it('should delete review successfully', async () => {
      mockReview.findById.mockResolvedValue(testReview);
      mockReview.findByIdAndDelete.mockResolvedValue(testReview);

      const response = await request(app)
        .delete(`/api/reviews/${testReview._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should return 403 when user is not the review owner', async () => {
      const otherUserReview = { ...testReview, userId: 'otheruser' };
      mockReview.findById.mockResolvedValue(otherUserReview);

      const response = await request(app)
        .delete(`/api/reviews/${testReview._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/reviews/:reviewId/helpful - Mark Review Helpful', () => {
    it('should mark review as helpful successfully', async () => {
      const updatedReview = { ...testReview, helpful: testReview.helpful + 1 };
      mockReview.findById.mockResolvedValue(testReview);
      mockReview.findByIdAndUpdate.mockResolvedValue(updatedReview);

      const response = await request(app)
        .post(`/api/reviews/${testReview._id}/helpful`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.helpful).toBe(updatedReview.helpful);
    });

    it('should return 404 for non-existent review', async () => {
      mockReview.findById.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/reviews/nonexistent/helpful')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/reviews/:reviewId/moderate - Moderate Review', () => {
    let adminToken: string;

    beforeAll(() => {
      adminToken = jwt.sign(
        { userId: 'admin123', role: 'admin' },
        process.env.JWT_SECRET || 'test-secret'
      );
    });

    it('should moderate review successfully', async () => {
      const moderateData = {
        status: 'approved',
        moderationNote: 'Review approved'
      };

      const moderatedReview = { ...testReview, ...moderateData };
      mockReview.findById.mockResolvedValue(testReview);
      mockReview.findByIdAndUpdate.mockResolvedValue(moderatedReview);

      const response = await request(app)
        .patch(`/api/reviews/${testReview._id}/moderate`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(moderateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe(moderateData.status);
    });

    it('should return 403 for non-admin user', async () => {
      const moderateData = {
        status: 'approved',
        moderationNote: 'Review approved'
      };

      const response = await request(app)
        .patch(`/api/reviews/${testReview._id}/moderate`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(moderateData)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/reviews/admin/pending - Get Pending Reviews', () => {
    let adminToken: string;

    beforeAll(() => {
      adminToken = jwt.sign(
        { userId: 'admin123', role: 'admin' },
        process.env.JWT_SECRET || 'test-secret'
      );
    });

    it('should return pending reviews for admin', async () => {
      const pendingReviews = [testReview];
      mockReview.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(pendingReviews)
        })
      });

      const response = await request(app)
        .get('/api/reviews/admin/pending')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
    });

    it('should return 403 for non-admin user', async () => {
      const response = await request(app)
        .get('/api/reviews/admin/pending')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/reviews/admin/analytics - Get Review Analytics', () => {
    let adminToken: string;

    beforeAll(() => {
      adminToken = jwt.sign(
        { userId: 'admin123', role: 'admin' },
        process.env.JWT_SECRET || 'test-secret'
      );
    });

    it('should return review analytics for admin', async () => {
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

      const response = await request(app)
        .get('/api/reviews/admin/analytics')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject(analytics);
    });
  });

  describe('GET /api/reviews/user/reviews - Get User Reviews', () => {
    it('should return user reviews', async () => {
      const userReviews = [testReview];
      mockReview.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(userReviews)
        })
      });

      const response = await request(app)
        .get('/api/reviews/user/reviews')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
    });

    it('should return 401 without authentication', async () => {
      await request(app)
        .get('/api/reviews/user/reviews')
        .expect(401);
    });
  });

  describe('GET /api/reviews/recent/reviews - Get Recent Reviews', () => {
    it('should return recent reviews', async () => {
      const recentReviews = [testReview];
      mockReview.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue(recentReviews)
          })
        })
      });

      const response = await request(app)
        .get('/api/reviews/recent/reviews')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
    });
  });

  describe('POST /api/reviews/send-request - Send Review Request', () => {
    let sellerToken: string;

    beforeAll(() => {
      sellerToken = jwt.sign(
        { userId: 'seller123', role: 'seller' },
        process.env.JWT_SECRET || 'test-secret'
      );
    });

    it('should send review request successfully', async () => {
      const requestData = {
        orderId: 'order123',
        customerEmail: 'customer@example.com'
      };

      const response = await request(app)
        .post('/api/reviews/send-request')
        .set('Authorization', `Bearer ${sellerToken}`)
        .send(requestData)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should return 403 for non-seller user', async () => {
      const requestData = {
        orderId: 'order123',
        customerEmail: 'customer@example.com'
      };

      const response = await request(app)
        .post('/api/reviews/send-request')
        .set('Authorization', `Bearer ${authToken}`)
        .send(requestData)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });
});
