import mongoose from 'mongoose';
import Review from '../models/Review';
import { connectDB, disconnectDB } from '../config/database';

describe('Review Model Tests', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  beforeEach(async () => {
    await Review.deleteMany({});
  });

  describe('Review Schema Validation', () => {
    it('should create a valid review', async () => {
      const validReview = new Review({
        userId: new mongoose.Types.ObjectId(),
        productId: new mongoose.Types.ObjectId(),
        rating: 5,
        title: 'Great Product',
        comment: 'This is an excellent product!',
        helpful: 0,
        status: 'pending'
      });

      const savedReview = await validReview.save();
      expect(savedReview._id).toBeDefined();
      expect(savedReview.rating).toBe(5);
      expect(savedReview.title).toBe('Great Product');
      expect(savedReview.comment).toBe('This is an excellent product!');
      expect(savedReview.status).toBe('pending');
    });

    it('should require userId', async () => {
      const reviewWithoutUserId = new Review({
        productId: new mongoose.Types.ObjectId(),
        rating: 5,
        title: 'Great Product',
        comment: 'This is an excellent product!'
      });

      let err: any;
      try {
        await reviewWithoutUserId.save();
      } catch (error) {
        err = error;
      }
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors.userId).toBeDefined();
    });

    it('should require productId', async () => {
      const reviewWithoutProductId = new Review({
        userId: new mongoose.Types.ObjectId(),
        rating: 5,
        title: 'Great Product',
        comment: 'This is an excellent product!'
      });

      let err: any;
      try {
        await reviewWithoutProductId.save();
      } catch (error) {
        err = error;
      }
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors.productId).toBeDefined();
    });

    it('should require rating', async () => {
      const reviewWithoutRating = new Review({
        userId: new mongoose.Types.ObjectId(),
        productId: new mongoose.Types.ObjectId(),
        title: 'Great Product',
        comment: 'This is an excellent product!'
      });

      let err: any;
      try {
        await reviewWithoutRating.save();
      } catch (error) {
        err = error;
      }
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors.rating).toBeDefined();
    });

    it('should require title', async () => {
      const reviewWithoutTitle = new Review({
        userId: new mongoose.Types.ObjectId(),
        productId: new mongoose.Types.ObjectId(),
        rating: 5,
        comment: 'This is an excellent product!'
      });

      let err: any;
      try {
        await reviewWithoutTitle.save();
      } catch (error) {
        err = error;
      }
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors.title).toBeDefined();
    });

    it('should require comment', async () => {
      const reviewWithoutComment = new Review({
        userId: new mongoose.Types.ObjectId(),
        productId: new mongoose.Types.ObjectId(),
        rating: 5,
        title: 'Great Product'
      });

      let err: any;
      try {
        await reviewWithoutComment.save();
      } catch (error) {
        err = error;
      }
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors.comment).toBeDefined();
    });

    it('should validate rating range (1-5)', async () => {
      const reviewWithInvalidRating = new Review({
        userId: new mongoose.Types.ObjectId(),
        productId: new mongoose.Types.ObjectId(),
        rating: 6, // Invalid rating
        title: 'Great Product',
        comment: 'This is an excellent product!'
      });

      let err: any;
      try {
        await reviewWithInvalidRating.save();
      } catch (error) {
        err = error;
      }
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors.rating).toBeDefined();
    });

    it('should validate rating minimum value', async () => {
      const reviewWithInvalidRating = new Review({
        userId: new mongoose.Types.ObjectId(),
        productId: new mongoose.Types.ObjectId(),
        rating: 0, // Invalid rating
        title: 'Great Product',
        comment: 'This is an excellent product!'
      });

      let err: any;
      try {
        await reviewWithInvalidRating.save();
      } catch (error) {
        err = error;
      }
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors.rating).toBeDefined();
    });

    it('should validate status enum values', async () => {
      const reviewWithInvalidStatus = new Review({
        userId: new mongoose.Types.ObjectId(),
        productId: new mongoose.Types.ObjectId(),
        rating: 5,
        title: 'Great Product',
        comment: 'This is an excellent product!',
        status: 'invalid_status'
      });

      let err: any;
      try {
        await reviewWithInvalidStatus.save();
      } catch (error) {
        err = error;
      }
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors.status).toBeDefined();
    });

    it('should set default values correctly', async () => {
      const reviewWithDefaults = new Review({
        userId: new mongoose.Types.ObjectId(),
        productId: new mongoose.Types.ObjectId(),
        rating: 5,
        title: 'Great Product',
        comment: 'This is an excellent product!'
      });

      const savedReview = await reviewWithDefaults.save();
      expect(savedReview.helpful).toBe(0);
      expect(savedReview.status).toBe('pending');
      expect(savedReview.createdAt).toBeDefined();
      expect(savedReview.updatedAt).toBeDefined();
    });

    it('should validate title length', async () => {
      const longTitle = 'a'.repeat(201); // Exceeds 200 character limit
      const reviewWithLongTitle = new Review({
        userId: new mongoose.Types.ObjectId(),
        productId: new mongoose.Types.ObjectId(),
        rating: 5,
        title: longTitle,
        comment: 'This is an excellent product!'
      });

      let err: any;
      try {
        await reviewWithLongTitle.save();
      } catch (error) {
        err = error;
      }
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors.title).toBeDefined();
    });

    it('should validate comment length', async () => {
      const longComment = 'a'.repeat(1001); // Exceeds 1000 character limit
      const reviewWithLongComment = new Review({
        userId: new mongoose.Types.ObjectId(),
        productId: new mongoose.Types.ObjectId(),
        rating: 5,
        title: 'Great Product',
        comment: longComment
      });

      let err: any;
      try {
        await reviewWithLongComment.save();
      } catch (error) {
        err = error;
      }
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors.comment).toBeDefined();
    });
  });

  describe('Review Model Methods', () => {
    let testReview: any;
    let userId: mongoose.Types.ObjectId;
    let productId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      userId = new mongoose.Types.ObjectId();
      productId = new mongoose.Types.ObjectId();
      
      testReview = new Review({
        userId,
        productId,
        rating: 5,
        title: 'Great Product',
        comment: 'This is an excellent product!',
        helpful: 0,
        status: 'pending'
      });
      await testReview.save();
    });

    it('should update helpful count', async () => {
      const originalHelpful = testReview.helpful;
      testReview.helpful += 1;
      await testReview.save();

      expect(testReview.helpful).toBe(originalHelpful + 1);
    });

    it('should update status', async () => {
      testReview.status = 'approved';
      await testReview.save();

      expect(testReview.status).toBe('approved');
    });

    it('should update moderation note', async () => {
      const moderationNote = 'Review approved by admin';
      testReview.moderationNote = moderationNote;
      await testReview.save();

      expect(testReview.moderationNote).toBe(moderationNote);
    });

    it('should update timestamps on save', async () => {
      const originalUpdatedAt = testReview.updatedAt;
      
      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10));
      
      testReview.title = 'Updated Title';
      await testReview.save();

      expect(testReview.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('Review Model Queries', () => {
    let userId: mongoose.Types.ObjectId;
    let productId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      userId = new mongoose.Types.ObjectId();
      productId = new mongoose.Types.ObjectId();

      // Create multiple test reviews
      const reviews = [
        {
          userId,
          productId,
          rating: 5,
          title: 'Great Product',
          comment: 'Excellent!',
          status: 'approved'
        },
        {
          userId,
          productId,
          rating: 4,
          title: 'Good Product',
          comment: 'Very good!',
          status: 'approved'
        },
        {
          userId,
          productId,
          rating: 3,
          title: 'Average Product',
          comment: 'Okay',
          status: 'pending'
        }
      ];

      await Review.insertMany(reviews);
    });

    it('should find reviews by product ID', async () => {
      const reviews = await Review.find({ productId });
      expect(reviews).toHaveLength(3);
    });

    it('should find reviews by user ID', async () => {
      const reviews = await Review.find({ userId });
      expect(reviews).toHaveLength(3);
    });

    it('should find reviews by status', async () => {
      const approvedReviews = await Review.find({ status: 'approved' });
      const pendingReviews = await Review.find({ status: 'pending' });

      expect(approvedReviews).toHaveLength(2);
      expect(pendingReviews).toHaveLength(1);
    });

    it('should find reviews by rating range', async () => {
      const highRatedReviews = await Review.find({ rating: { $gte: 4 } });
      const lowRatedReviews = await Review.find({ rating: { $lte: 3 } });

      expect(highRatedReviews).toHaveLength(2);
      expect(lowRatedReviews).toHaveLength(1);
    });

    it('should sort reviews by creation date', async () => {
      const reviews = await Review.find().sort({ createdAt: -1 });
      expect(reviews[0].createdAt.getTime()).toBeGreaterThanOrEqual(reviews[1].createdAt.getTime());
    });

    it('should sort reviews by helpful count', async () => {
      // Update helpful counts
      const reviews = await Review.find();
      reviews[0].helpful = 5;
      reviews[1].helpful = 10;
      reviews[2].helpful = 2;
      await Promise.all(reviews.map(review => review.save()));

      const sortedReviews = await Review.find().sort({ helpful: -1 });
      expect(sortedReviews[0].helpful).toBe(10);
      expect(sortedReviews[1].helpful).toBe(5);
      expect(sortedReviews[2].helpful).toBe(2);
    });

    it('should limit number of reviews', async () => {
      const limitedReviews = await Review.find().limit(2);
      expect(limitedReviews).toHaveLength(2);
    });

    it('should skip reviews for pagination', async () => {
      const skippedReviews = await Review.find().skip(1).limit(2);
      expect(skippedReviews).toHaveLength(2);
    });
  });

  describe('Review Model Aggregation', () => {
    let productId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      productId = new mongoose.Types.ObjectId();

      // Create reviews with different ratings
      const reviews = [
        { userId: new mongoose.Types.ObjectId(), productId, rating: 5, title: 'Great', comment: 'Excellent!', status: 'approved' },
        { userId: new mongoose.Types.ObjectId(), productId, rating: 4, title: 'Good', comment: 'Very good!', status: 'approved' },
        { userId: new mongoose.Types.ObjectId(), productId, rating: 3, title: 'Average', comment: 'Okay', status: 'approved' },
        { userId: new mongoose.Types.ObjectId(), productId, rating: 2, title: 'Poor', comment: 'Not good', status: 'approved' },
        { userId: new mongoose.Types.ObjectId(), productId, rating: 1, title: 'Terrible', comment: 'Bad', status: 'approved' }
      ];

      await Review.insertMany(reviews);
    });

    it('should calculate average rating', async () => {
      const result = await Review.aggregate([
        { $match: { productId: productId } },
        { $group: { _id: null, averageRating: { $avg: '$rating' } } }
      ]);

      expect(result[0].averageRating).toBe(3);
    });

    it('should count total reviews', async () => {
      const result = await Review.aggregate([
        { $match: { productId: productId } },
        { $group: { _id: null, totalReviews: { $sum: 1 } } }
      ]);

      expect(result[0].totalReviews).toBe(5);
    });

    it('should calculate rating distribution', async () => {
      const result = await Review.aggregate([
        { $match: { productId: productId } },
        { $group: { _id: '$rating', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]);

      expect(result).toHaveLength(5);
      expect(result[0]._id).toBe(1);
      expect(result[4]._id).toBe(5);
    });

    it('should calculate statistics by status', async () => {
      // Add some pending reviews
      await Review.create({
        userId: new mongoose.Types.ObjectId(),
        productId,
        rating: 4,
        title: 'Pending Review',
        comment: 'Pending',
        status: 'pending'
      });

      const result = await Review.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);

      const approvedCount = result.find(r => r._id === 'approved')?.count || 0;
      const pendingCount = result.find(r => r._id === 'pending')?.count || 0;

      expect(approvedCount).toBe(5);
      expect(pendingCount).toBe(1);
    });
  });

  describe('Review Model Indexes', () => {
    it('should have compound index on userId and productId', async () => {
      const indexes = await Review.collection.getIndexes();
      const compoundIndex = Object.values(indexes).find(
        (index: any) => index.key && index.key.userId && index.key.productId
      );
      expect(compoundIndex).toBeDefined();
    });

    it('should have index on productId', async () => {
      const indexes = await Review.collection.getIndexes();
      const productIndex = Object.values(indexes).find(
        (index: any) => index.key && index.key.productId && !index.key.userId
      );
      expect(productIndex).toBeDefined();
    });

    it('should have index on status', async () => {
      const indexes = await Review.collection.getIndexes();
      const statusIndex = Object.values(indexes).find(
        (index: any) => index.key && index.key.status
      );
      expect(statusIndex).toBeDefined();
    });

    it('should have index on createdAt', async () => {
      const indexes = await Review.collection.getIndexes();
      const createdAtIndex = Object.values(indexes).find(
        (index: any) => index.key && index.key.createdAt
      );
      expect(createdAtIndex).toBeDefined();
    });
  });
});
