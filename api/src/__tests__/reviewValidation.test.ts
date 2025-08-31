import { createReviewSchema, updateReviewSchema, moderateReviewSchema } from '../utils/validation';
import { validateRequest } from '../utils/validation';

describe('Review Validation Tests', () => {
  describe('createReviewSchema', () => {
    it('should validate correct review data', () => {
      const validData = {
        productId: '507f1f77bcf86cd799439011',
        orderId: '507f1f77bcf86cd799439012',
        rating: 5,
        title: 'Great Product',
        content: 'This is an excellent product!'
      };

      const result = createReviewSchema.validate(validData);
      expect(result.error).toBeUndefined();
      expect(result.value).toEqual(validData);
    });

    it('should require productId', () => {
      const invalidData = {
        orderId: '507f1f77bcf86cd799439012',
        rating: 5,
        title: 'Great Product',
        content: 'This is an excellent product!'
      };

      const result = createReviewSchema.validate(invalidData);
      expect(result.error).toBeDefined();
      expect(result.error?.details[0].path).toContain('productId');
    });

    it('should require rating', () => {
      const invalidData = {
        productId: '507f1f77bcf86cd799439011',
        orderId: '507f1f77bcf86cd799439012',
        title: 'Great Product',
        content: 'This is an excellent product!'
      };

      const result = createReviewSchema.validate(invalidData);
      expect(result.error).toBeDefined();
      expect(result.error?.details[0].path).toContain('rating');
    });

    it('should require title', () => {
      const invalidData = {
        productId: '507f1f77bcf86cd799439011',
        orderId: '507f1f77bcf86cd799439012',
        rating: 5,
        content: 'This is an excellent product!'
      };

      const result = createReviewSchema.validate(invalidData);
      expect(result.error).toBeDefined();
      expect(result.error?.details[0].path).toContain('title');
    });

    it('should require content', () => {
      const invalidData = {
        productId: '507f1f77bcf86cd799439011',
        orderId: '507f1f77bcf86cd799439012',
        rating: 5,
        title: 'Great Product'
      };

      const result = createReviewSchema.validate(invalidData);
      expect(result.error).toBeDefined();
      expect(result.error?.details[0].path).toContain('content');
    });

    it('should validate rating range (1-5)', () => {
      const invalidData = {
        productId: '507f1f77bcf86cd799439011',
        orderId: '507f1f77bcf86cd799439012',
        rating: 6,
        title: 'Great Product',
        content: 'This is an excellent product!'
      };

      const result = createReviewSchema.validate(invalidData);
      expect(result.error).toBeDefined();
      expect(result.error?.details[0].path).toContain('rating');
    });

    it('should validate rating minimum value', () => {
      const invalidData = {
        productId: '507f1f77bcf86cd799439011',
        orderId: '507f1f77bcf86cd799439012',
        rating: 0,
        title: 'Great Product',
        content: 'This is an excellent product!'
      };

      const result = createReviewSchema.validate(invalidData);
      expect(result.error).toBeDefined();
      expect(result.error?.details[0].path).toContain('rating');
    });

    it('should validate title length', () => {
      const longTitle = 'a'.repeat(101); // Exceeds 100 character limit
      const invalidData = {
        productId: '507f1f77bcf86cd799439011',
        orderId: '507f1f77bcf86cd799439012',
        rating: 5,
        title: longTitle,
        content: 'This is an excellent product!'
      };

      const result = createReviewSchema.validate(invalidData);
      expect(result.error).toBeDefined();
      expect(result.error?.details[0].path).toContain('title');
    });

    it('should validate content length', () => {
      const longContent = 'a'.repeat(1001); // Exceeds 1000 character limit
      const invalidData = {
        productId: '507f1f77bcf86cd799439011',
        orderId: '507f1f77bcf86cd799439012',
        rating: 5,
        title: 'Great Product',
        content: longContent
      };

      const result = createReviewSchema.validate(invalidData);
      expect(result.error).toBeDefined();
      expect(result.error?.details[0].path).toContain('content');
    });

    it('should validate productId format', () => {
      const invalidData = {
        productId: 'invalid-id',
        rating: 5,
        title: 'Great Product',
        comment: 'This is an excellent product!'
      };

      const result = createReviewSchema.validate(invalidData);
      expect(result.error).toBeDefined();
      expect(result.error?.details[0].path).toContain('productId');
    });

    it('should allow optional fields', () => {
      const validData = {
        productId: '507f1f77bcf86cd799439011',
        rating: 5,
        title: 'Great Product',
        comment: 'This is an excellent product!',
        helpful: 0,
        status: 'pending'
      };

      const result = createReviewSchema.validate(validData);
      expect(result.error).toBeUndefined();
    });
  });

  describe('updateReviewSchema', () => {
    it('should validate correct update data', () => {
      const validData = {
        rating: 4,
        title: 'Updated Title',
        comment: 'Updated comment'
      };

      const result = updateReviewSchema.validate(validData);
      expect(result.error).toBeUndefined();
      expect(result.value).toEqual(validData);
    });

    it('should allow partial updates', () => {
      const partialData = {
        rating: 4
      };

      const result = updateReviewSchema.validate(partialData);
      expect(result.error).toBeUndefined();
    });

    it('should validate rating range when provided', () => {
      const invalidData = {
        rating: 6
      };

      const result = updateReviewSchema.validate(invalidData);
      expect(result.error).toBeDefined();
      expect(result.error?.details[0].path).toContain('rating');
    });

    it('should validate title length when provided', () => {
      const longTitle = 'a'.repeat(201);
      const invalidData = {
        title: longTitle
      };

      const result = updateReviewSchema.validate(invalidData);
      expect(result.error).toBeDefined();
      expect(result.error?.details[0].path).toContain('title');
    });

    it('should validate comment length when provided', () => {
      const longComment = 'a'.repeat(1001);
      const invalidData = {
        comment: longComment
      };

      const result = updateReviewSchema.validate(invalidData);
      expect(result.error).toBeDefined();
      expect(result.error?.details[0].path).toContain('comment');
    });

    it('should allow empty object', () => {
      const emptyData = {};

      const result = updateReviewSchema.validate(emptyData);
      expect(result.error).toBeUndefined();
    });
  });

  describe('moderateReviewSchema', () => {
    it('should validate correct moderation data', () => {
      const validData = {
        status: 'approved',
        moderationNote: 'Review approved by admin'
      };

      const result = moderateReviewSchema.validate(validData);
      expect(result.error).toBeUndefined();
      expect(result.value).toEqual(validData);
    });

    it('should require status', () => {
      const invalidData = {
        moderationNote: 'Review approved by admin'
      };

      const result = moderateReviewSchema.validate(invalidData);
      expect(result.error).toBeDefined();
      expect(result.error?.details[0].path).toContain('status');
    });

    it('should validate status enum values', () => {
      const invalidData = {
        status: 'invalid_status',
        moderationNote: 'Review approved by admin'
      };

      const result = moderateReviewSchema.validate(invalidData);
      expect(result.error).toBeDefined();
      expect(result.error?.details[0].path).toContain('status');
    });

    it('should accept all valid status values', () => {
      const validStatuses = ['pending', 'approved', 'rejected'];
      
      validStatuses.forEach(status => {
        const validData = {
          status,
          moderationNote: 'Review processed'
        };

        const result = moderateReviewSchema.validate(validData);
        expect(result.error).toBeUndefined();
      });
    });

    it('should validate moderation note length', () => {
      const longNote = 'a'.repeat(501); // Exceeds 500 character limit
      const invalidData = {
        status: 'approved',
        moderationNote: longNote
      };

      const result = moderateReviewSchema.validate(invalidData);
      expect(result.error).toBeDefined();
      expect(result.error?.details[0].path).toContain('moderationNote');
    });

    it('should allow optional moderation note', () => {
      const validData = {
        status: 'approved'
      };

      const result = moderateReviewSchema.validate(validData);
      expect(result.error).toBeUndefined();
    });
  });

  describe('validateRequest middleware', () => {
    let mockReq: any;
    let mockRes: any;
    let mockNext: any;

    beforeEach(() => {
      mockReq = {
        body: {},
        params: {},
        query: {}
      };
      mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      mockNext = jest.fn();
    });

    it('should call next() for valid data', () => {
      const schema = {
        validate: jest.fn().mockReturnValue({ error: undefined, value: {} })
      };

      const middleware = validateRequest(schema);
      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid data', () => {
      const validationError = {
        details: [{ message: 'Validation error', path: ['field'] }]
      };
      const schema = {
        validate: jest.fn().mockReturnValue({ error: validationError, value: {} })
      };

      const middleware = validateRequest(schema);
      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation error',
        errors: validationError.details
      });
    });

    it('should handle validation with custom error messages', () => {
      const validationError = {
        details: [
          { message: 'Rating must be between 1 and 5', path: ['rating'] },
          { message: 'Title is required', path: ['title'] }
        ]
      };
      const schema = {
        validate: jest.fn().mockReturnValue({ error: validationError, value: {} })
      };

      const middleware = validateRequest(schema);
      middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Rating must be between 1 and 5',
        errors: validationError.details
      });
    });
  });

  describe('Review Data Sanitization', () => {
    it('should trim whitespace from title and comment', () => {
      const dataWithWhitespace = {
        productId: '507f1f77bcf86cd799439011',
        rating: 5,
        title: '  Great Product  ',
        comment: '  This is an excellent product!  '
      };

      const result = createReviewSchema.validate(dataWithWhitespace);
      expect(result.error).toBeUndefined();
      expect(result.value.title).toBe('Great Product');
      expect(result.value.comment).toBe('This is an excellent product!');
    });

    it('should handle empty strings after trimming', () => {
      const dataWithEmptyStrings = {
        productId: '507f1f77bcf86cd799439011',
        rating: 5,
        title: '   ',
        comment: '   '
      };

      const result = createReviewSchema.validate(dataWithEmptyStrings);
      expect(result.error).toBeDefined();
    });
  });

  describe('Review Data Type Validation', () => {
    it('should validate rating as number', () => {
      const invalidData = {
        productId: '507f1f77bcf86cd799439011',
        rating: '5', // String instead of number
        title: 'Great Product',
        comment: 'This is an excellent product!'
      };

      const result = createReviewSchema.validate(invalidData);
      expect(result.error).toBeDefined();
    });

    it('should validate title and comment as strings', () => {
      const invalidData = {
        productId: '507f1f77bcf86cd799439011',
        rating: 5,
        title: 123, // Number instead of string
        comment: 456 // Number instead of string
      };

      const result = createReviewSchema.validate(invalidData);
      expect(result.error).toBeDefined();
    });

    it('should validate productId as string', () => {
      const invalidData = {
        productId: 123, // Number instead of string
        rating: 5,
        title: 'Great Product',
        comment: 'This is an excellent product!'
      };

      const result = createReviewSchema.validate(invalidData);
      expect(result.error).toBeDefined();
    });
  });

  describe('Review Schema Edge Cases', () => {
    it('should handle null values', () => {
      const nullData = {
        productId: null,
        rating: null,
        title: null,
        comment: null
      };

      const result = createReviewSchema.validate(nullData);
      expect(result.error).toBeDefined();
    });

    it('should handle undefined values', () => {
      const undefinedData = {
        productId: undefined,
        rating: undefined,
        title: undefined,
        comment: undefined
      };

      const result = createReviewSchema.validate(undefinedData);
      expect(result.error).toBeDefined();
    });

    it('should handle very long valid strings', () => {
      const longTitle = 'a'.repeat(200); // Exactly at the limit
      const longComment = 'a'.repeat(1000); // Exactly at the limit
      
      const validData = {
        productId: '507f1f77bcf86cd799439011',
        rating: 5,
        title: longTitle,
        comment: longComment
      };

      const result = createReviewSchema.validate(validData);
      expect(result.error).toBeUndefined();
    });

    it('should handle boundary rating values', () => {
      const boundaryData = {
        productId: '507f1f77bcf86cd799439011',
        rating: 1, // Minimum valid rating
        title: 'Great Product',
        comment: 'This is an excellent product!'
      };

      const result = createReviewSchema.validate(boundaryData);
      expect(result.error).toBeUndefined();
    });
  });
});
