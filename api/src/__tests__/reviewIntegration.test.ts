import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';
import Review from '../models/Review';
import User from '../models/User';
import Product from '../models/Product';
import { connectDB, disconnectDB } from '../config/database';
import jwt from 'jsonwebtoken';

describe('Review System Integration Tests', () => {
  let testUser: any;
  let testProduct: any;
  let testReview: any;
  let authToken: string;
  let adminToken: string;

  beforeAll(async () => {
    await connectDB();
    
    // Create test user
    testUser = await User.create({
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      phone: '+258123456789',
      role: 'buyer'
    });

    // Create test product
    testProduct = await Product.create({
      name: 'Test Product',
      description: 'A test product for reviews',
      price: 99.99,
      category: new mongoose.Types.ObjectId(),
      stock: 100
    });

    // Generate auth tokens
    authToken = jwt.sign(
      { userId: testUser._id, role: testUser.role },
      process.env.JWT_SECRET || 'test-secret'
    );

    adminToken = jwt.sign(
      { userId: 'admin123', role: 'admin' },
      process.env.JWT_SECRET || 'test-secret'
    );
  });

  afterAll(async () => {
    await disconnectDB();
  });

  beforeEach(async () => {
    await Review.deleteMany({});
  });

  describe('Review Creation Flow', () => {
    it('should create a review and verify it in database', async () => {
      const reviewData = {
        productId: testProduct._id.toString(),
        orderId: 'order123',
        rating: 5,
        title: 'Great Product',
        content: 'This is an excellent product!'
      };

      // Create review via API
      const response = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${authToken}`)
        .send(reviewData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.rating).toBe(reviewData.rating);
      expect(response.body.data.title).toBe(reviewData.title);
      expect(response.body.data.content).toBe(reviewData.content);
      expect(response.body.data.status).toBe('pending');

      // Verify review exists in database
      const savedReview = await Review.findById(response.body.data._id);
      expect(savedReview).toBeDefined();
      expect(savedReview?.userId.toString()).toBe(testUser._id.toString());
      expect(savedReview?.productId.toString()).toBe(testProduct._id.toString());
      expect(savedReview?.rating).toBe(reviewData.rating);
    });

    it('should prevent duplicate reviews from same user for same product', async () => {
      const reviewData = {
        productId: testProduct._id.toString(),
        orderId: 'order123',
        rating: 5,
        title: 'Great Product',
        content: 'This is an excellent product!'
      };

      // Create first review
      await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${authToken}`)
        .send(reviewData)
        .expect(201);

      // Attempt to create duplicate review
      const response = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${authToken}`)
        .send(reviewData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already reviewed');
    });
  });

  describe('Review Retrieval Flow', () => {
    beforeEach(async () => {
      // Create test reviews
      testReview = await Review.create({
        userId: testUser._id,
        productId: testProduct._id,
        orderId: new mongoose.Types.ObjectId(),
        rating: 5,
        title: 'Great Product',
        content: 'This is an excellent product!',
        status: 'approved'
      });
    });

    it('should retrieve reviews for a product with populated user data', async () => {
      const response = await request(app)
        .get(`/api/reviews/product/${testProduct._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0]._id).toBe(testReview._id.toString());
      expect(response.body.data[0].user).toBeDefined();
      expect(response.body.data[0].user.email).toBe(testUser.email);
    });

    it('should return review statistics', async () => {
      // Create additional reviews for statistics
      await Review.create([
        {
          userId: new mongoose.Types.ObjectId(),
          productId: testProduct._id,
          orderId: new mongoose.Types.ObjectId(),
          rating: 4,
          title: 'Good Product',
          content: 'Very good!',
          status: 'approved'
        },
        {
          userId: new mongoose.Types.ObjectId(),
          productId: testProduct._id,
          orderId: new mongoose.Types.ObjectId(),
          rating: 3,
          title: 'Average Product',
          content: 'Okay',
          status: 'approved'
        }
      ]);

      const response = await request(app)
        .get(`/api/reviews/product/${testProduct._id}/statistics`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.totalReviews).toBe(3);
      expect(response.body.data.averageRating).toBe(4);
    });

    it('should retrieve user reviews', async () => {
      const response = await request(app)
        .get('/api/reviews/user/reviews')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0]._id).toBe(testReview._id.toString());
    });
  });

  describe('Review Update Flow', () => {
    beforeEach(async () => {
      testReview = await Review.create({
        userId: testUser._id,
        productId: testProduct._id,
        orderId: new mongoose.Types.ObjectId(),
        rating: 5,
        title: 'Great Product',
        content: 'This is an excellent product!',
        status: 'approved'
      });
    });

    it('should update review and verify changes in database', async () => {
      const updateData = {
        rating: 4,
        title: 'Updated Title',
        content: 'Updated comment'
      };

      const response = await request(app)
        .put(`/api/reviews/${testReview._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.rating).toBe(updateData.rating);
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.content).toBe(updateData.content);

      // Verify changes in database
      const updatedReview = await Review.findById(testReview._id);
      expect(updatedReview?.rating).toBe(updateData.rating);
      expect(updatedReview?.title).toBe(updateData.title);
             expect(updatedReview?.content).toBe(updateData.content);
    });

    it('should prevent unauthorized users from updating reviews', async () => {
      const otherUserToken = jwt.sign(
        { userId: 'otheruser', role: 'buyer' },
        process.env.JWT_SECRET || 'test-secret'
      );

      const updateData = {
        rating: 4,
        title: 'Updated Title',
        content: 'Updated comment'
      };

      const response = await request(app)
        .put(`/api/reviews/${testReview._id}`)
        .set('Authorization', `Bearer ${otherUserToken}`)
        .send(updateData)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Review Deletion Flow', () => {
    beforeEach(async () => {
      testReview = await Review.create({
        userId: testUser._id,
        productId: testProduct._id,
        orderId: new mongoose.Types.ObjectId(),
        rating: 5,
        title: 'Great Product',
        content: 'This is an excellent product!',
        status: 'approved'
      });
    });

    it('should delete review and verify removal from database', async () => {
      const response = await request(app)
        .delete(`/api/reviews/${testReview._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify review is removed from database
      const deletedReview = await Review.findById(testReview._id);
      expect(deletedReview).toBeNull();
    });

    it('should prevent unauthorized users from deleting reviews', async () => {
      const otherUserToken = jwt.sign(
        { userId: 'otheruser', role: 'buyer' },
        process.env.JWT_SECRET || 'test-secret'
      );

      const response = await request(app)
        .delete(`/api/reviews/${testReview._id}`)
        .set('Authorization', `Bearer ${otherUserToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);

      // Verify review still exists in database
      const existingReview = await Review.findById(testReview._id);
      expect(existingReview).toBeDefined();
    });
  });

  describe('Review Moderation Flow', () => {
    beforeEach(async () => {
      testReview = await Review.create({
        userId: testUser._id,
        productId: testProduct._id,
        orderId: new mongoose.Types.ObjectId(),
        rating: 5,
        title: 'Great Product',
        content: 'This is an excellent product!',
        status: 'pending'
      });
    });

    it('should allow admin to moderate review', async () => {
      const moderateData = {
        status: 'approved',
        notes: 'Review approved by admin'
      };

      const response = await request(app)
        .patch(`/api/reviews/${testReview._id}/moderate`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(moderateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe(moderateData.status);
      expect(response.body.data.moderatorNotes).toBe(moderateData.notes);

      // Verify changes in database
      const moderatedReview = await Review.findById(testReview._id);
      expect(moderatedReview?.status).toBe(moderateData.status);
             expect(moderatedReview?.moderatorNotes).toBe(moderateData.notes);
    });

    it('should prevent non-admin users from moderating reviews', async () => {
      const moderateData = {
        status: 'approved',
        notes: 'Review approved by admin'
      };

      const response = await request(app)
        .patch(`/api/reviews/${testReview._id}/moderate`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(moderateData)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should retrieve pending reviews for admin', async () => {
      // Create additional pending review
      await Review.create({
        userId: new mongoose.Types.ObjectId(),
        productId: testProduct._id,
        orderId: new mongoose.Types.ObjectId(),
        rating: 4,
        title: 'Another Pending Review',
        content: 'Pending review',
        status: 'pending'
      });

      const response = await request(app)
        .get('/api/reviews/admin/pending')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.every((review: any) => review.status === 'pending')).toBe(true);
    });
  });

  describe('Review Helpful Marking Flow', () => {
    beforeEach(async () => {
      testReview = await Review.create({
        userId: testUser._id,
        productId: testProduct._id,
        orderId: new mongoose.Types.ObjectId(),
        rating: 5,
        title: 'Great Product',
        content: 'This is an excellent product!',
        status: 'approved',
        isHelpful: 0
      });
    });

    it('should increment helpful count', async () => {
      const response = await request(app)
        .post(`/api/reviews/${testReview._id}/helpful`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.isHelpful).toBe(1);

      // Verify change in database
      const updatedReview = await Review.findById(testReview._id);
             expect(updatedReview?.isHelpful).toBe(1);
    });

    it('should increment helpful count multiple times', async () => {
      // Mark as helpful multiple times
      await request(app)
        .post(`/api/reviews/${testReview._id}/helpful`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      await request(app)
        .post(`/api/reviews/${testReview._id}/helpful`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const response = await request(app)
        .post(`/api/reviews/${testReview._id}/helpful`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.isHelpful).toBe(3);
    });
  });

  describe('Review Analytics Flow', () => {
    beforeEach(async () => {
      // Create reviews with different statuses
      await Review.create([
        {
          userId: testUser._id,
          productId: testProduct._id,
          orderId: new mongoose.Types.ObjectId(),
          rating: 5,
          title: 'Great Product',
          content: 'Excellent!',
          status: 'approved'
        },
        {
          userId: new mongoose.Types.ObjectId(),
          productId: testProduct._id,
          orderId: new mongoose.Types.ObjectId(),
          rating: 4,
          title: 'Good Product',
          content: 'Very good!',
          status: 'approved'
        },
        {
          userId: new mongoose.Types.ObjectId(),
          productId: testProduct._id,
          orderId: new mongoose.Types.ObjectId(),
          rating: 3,
          title: 'Average Product',
          content: 'Okay',
          status: 'pending'
        },
        {
          userId: new mongoose.Types.ObjectId(),
          productId: testProduct._id,
          orderId: new mongoose.Types.ObjectId(),
          rating: 2,
          title: 'Poor Product',
          content: 'Not good',
          status: 'rejected'
        }
      ]);
    });

    it('should return comprehensive review analytics', async () => {
      const response = await request(app)
        .get('/api/reviews/admin/analytics')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.totalReviews).toBe(4);
      expect(response.body.data.approvedReviews).toBe(2);
      expect(response.body.data.pendingReviews).toBe(1);
      expect(response.body.data.rejectedReviews).toBe(1);
      expect(response.body.data.averageRating).toBe(3.5);
    });
  });

  describe('Recent Reviews Flow', () => {
    beforeEach(async () => {
      // Create reviews with different timestamps
      await Review.create([
        {
          userId: testUser._id,
          productId: testProduct._id,
          orderId: new mongoose.Types.ObjectId(),
          rating: 5,
          title: 'Recent Review 1',
          content: 'Most recent',
          status: 'approved',
          createdAt: new Date()
        },
        {
          userId: new mongoose.Types.ObjectId(),
          productId: testProduct._id,
          orderId: new mongoose.Types.ObjectId(),
          rating: 4,
          title: 'Recent Review 2',
          content: 'Second most recent',
          status: 'approved',
          createdAt: new Date(Date.now() - 1000)
        },
        {
          userId: new mongoose.Types.ObjectId(),
          productId: testProduct._id,
          orderId: new mongoose.Types.ObjectId(),
          rating: 3,
          title: 'Recent Review 3',
          content: 'Third most recent',
          status: 'approved',
          createdAt: new Date(Date.now() - 2000)
        }
      ]);
    });

    it('should return recent reviews in correct order', async () => {
      const response = await request(app)
        .get('/api/reviews/recent/reviews')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(3);
      expect(response.body.data[0].title).toBe('Recent Review 1');
      expect(response.body.data[1].title).toBe('Recent Review 2');
      expect(response.body.data[2].title).toBe('Recent Review 3');
    });
  });

  describe('Review Request Flow', () => {
    it('should send review request successfully', async () => {
      const requestData = {
        orderId: 'order123',
        customerEmail: 'customer@example.com'
      };

      const response = await request(app)
        .post('/api/reviews/send-request')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(requestData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Review request sent');
    });

    it('should prevent non-admin/seller users from sending review requests', async () => {
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

  describe('Error Handling and Edge Cases', () => {
    it('should handle non-existent review ID gracefully', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/reviews/${nonExistentId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Review not found');
    });

    it('should handle invalid review ID format', async () => {
      const response = await request(app)
        .get('/api/reviews/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should handle database connection errors gracefully', async () => {
      // This test would require mocking database connection failure
      // For now, we'll test that the API handles malformed requests
      const response = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should handle concurrent review creation', async () => {
      const reviewData = {
        productId: testProduct._id.toString(),
        orderId: 'order123',
        rating: 5,
        title: 'Concurrent Review',
        content: 'Testing concurrent creation'
      };

      // Create multiple reviews simultaneously
      const promises = Array(3).fill(null).map(() =>
        request(app)
          .post('/api/reviews')
          .set('Authorization', `Bearer ${authToken}`)
          .send(reviewData)
      );

      const responses = await Promise.all(promises);

      // Only one should succeed, others should fail due to duplicate constraint
      const successfulResponses = responses.filter(r => r.status === 201);
      const failedResponses = responses.filter(r => r.status === 400);

      expect(successfulResponses).toHaveLength(1);
      expect(failedResponses).toHaveLength(2);
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle large number of reviews efficiently', async () => {
      // Create many reviews
      const reviews = Array(100).fill(null).map((_, index) => ({
        userId: new mongoose.Types.ObjectId(),
        productId: testProduct._id,
        orderId: new mongoose.Types.ObjectId(),
        rating: Math.floor(Math.random() * 5) + 1,
        title: `Review ${index}`,
        content: `Comment ${index}`,
        status: 'approved'
      }));

      await Review.insertMany(reviews);

      // Test retrieval performance
      const startTime = Date.now();
      const response = await request(app)
        .get(`/api/reviews/product/${testProduct._id}`)
        .expect(200);

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(100);
      expect(responseTime).toBeLessThan(1000); // Should respond within 1 second
    });

    it('should handle pagination correctly', async () => {
      // Create many reviews
      const reviews = Array(50).fill(null).map((_, index) => ({
        userId: new mongoose.Types.ObjectId(),
        productId: testProduct._id,
        orderId: new mongoose.Types.ObjectId(),
        rating: Math.floor(Math.random() * 5) + 1,
        title: `Review ${index}`,
        content: `Comment ${index}`,
        status: 'approved'
      }));

      await Review.insertMany(reviews);

      // Test pagination
      const response = await request(app)
        .get(`/api/reviews/product/${testProduct._id}?page=1&limit=10`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(10);
    });
  });
});
