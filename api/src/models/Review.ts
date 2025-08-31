import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  rating: number; // 1-5 stars
  title: string;
  content: string;
  images?: string[];
  isVerified: boolean; // Purchased the product
  isHelpful: number;
  isNotHelpful: number;
  status: 'pending' | 'approved' | 'rejected';
  moderatorNotes?: string;
  moderatedBy?: mongoose.Types.ObjectId;
  moderatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required'],
    index: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: [true, 'Order ID is required'],
    index: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  title: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Review content is required'],
    trim: true,
    minlength: [10, 'Content must be at least 10 characters'],
    maxlength: [1000, 'Content cannot exceed 1000 characters']
  },
  images: [{
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Image URL must be a valid HTTP/HTTPS URL'
    }
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  isHelpful: {
    type: Number,
    default: 0,
    min: 0
  },
  isNotHelpful: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'approved', 'rejected'],
      message: 'Status must be pending, approved, or rejected'
    },
    default: 'pending',
    index: true
  },
  moderatorNotes: {
    type: String,
    maxlength: [500, 'Moderator notes cannot exceed 500 characters']
  },
  moderatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  moderatedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
reviewSchema.index({ productId: 1, status: 1 });
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true }); // One review per user per product
reviewSchema.index({ orderId: 1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ rating: 1 });

// Virtual for helpfulness ratio
reviewSchema.virtual('helpfulnessRatio').get(function() {
  const total = this.isHelpful + this.isNotHelpful;
  return total > 0 ? (this.isHelpful / total) * 100 : 0;
});

// Pre-save middleware to verify purchase
reviewSchema.pre('save', async function(next) {
  try {
    if (this.isNew || this.isModified('orderId')) {
      // Verify that the user has purchased this product
      const Order = mongoose.model('Order');
      const order = await Order.findById(this.orderId);
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      if (order.userId.toString() !== this.userId.toString()) {
        throw new Error('Order does not belong to user');
      }
      
      // Check if order contains the product
      const hasProduct = order.items.some((item: any) => 
        item.productId.toString() === this.productId.toString()
      );
      
      if (!hasProduct) {
        throw new Error('Order does not contain this product');
      }
      
      // Mark as verified if order is completed
      if (['delivered', 'completed'].includes(order.status)) {
        this.isVerified = true;
      }
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Post-save middleware to update product rating
reviewSchema.post('save', async function() {
  try {
    if (this.status === 'approved') {
      const Product = mongoose.model('Product');
      const Review = mongoose.model('Review');
      
      // Calculate new average rating and total reviews
      const stats = await Review.aggregate([
        {
          $match: {
            productId: this.productId,
            status: 'approved'
          }
        },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 }
          }
        }
      ]);
      
      if (stats.length > 0) {
        await Product.findByIdAndUpdate(this.productId, {
          averageRating: Math.round(stats[0].averageRating * 10) / 10, // Round to 1 decimal
          totalReviews: stats[0].totalReviews
        });
      }
    }
  } catch (error) {
    console.error('Error updating product rating:', error);
  }
});

// Static methods
reviewSchema.statics.findByProductId = function(this: any, productId: string, options: {
  page?: number;
  limit?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} = {}) {
  const { page = 1, limit = 10, status = 'approved', sortBy = 'createdAt', sortOrder = 'desc' } = options;
  
  const query: any = { productId, status };
  const sort: any = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
  
  return this.find(query)
    .populate('userId', 'firstName lastName email avatar')
    .populate('moderatedBy', 'firstName lastName')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);
};

reviewSchema.statics.getProductStatistics = function(this: any, productId: string) {
  return this.aggregate([
    {
      $match: {
        productId: new mongoose.Types.ObjectId(productId),
        status: 'approved'
      }
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    },
    {
      $addFields: {
        averageRating: { $round: ['$averageRating', 1] }
      }
    }
  ]);
};

reviewSchema.statics.findPendingReviews = function(this: any, options: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} = {}) {
  const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
  
  const sort: any = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
  
  return this.find({ status: 'pending' })
    .populate('userId', 'firstName lastName email')
    .populate('productId', 'name images')
    .populate('orderId', 'orderNumber')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);
};

// Instance methods
reviewSchema.methods.markAsHelpful = async function(userId: string) {
  // Check if user has already voted
  const Vote = mongoose.model('ReviewVote');
  const existingVote = await Vote.findOne({
    reviewId: this._id,
    userId: userId
  });
  
  if (existingVote) {
    if (existingVote.isHelpful) {
      // Remove helpful vote
      this.isHelpful = Math.max(0, this.isHelpful - 1);
      await Vote.findByIdAndDelete(existingVote._id);
    } else {
      // Change from not helpful to helpful
      this.isNotHelpful = Math.max(0, this.isNotHelpful - 1);
      this.isHelpful += 1;
      existingVote.isHelpful = true;
      await existingVote.save();
    }
  } else {
    // Add new helpful vote
    this.isHelpful += 1;
    await Vote.create({
      reviewId: this._id,
      userId: userId,
      isHelpful: true
    });
  }
  
  return this.save();
};

reviewSchema.methods.markAsNotHelpful = async function(userId: string) {
  // Check if user has already voted
  const Vote = mongoose.model('ReviewVote');
  const existingVote = await Vote.findOne({
    reviewId: this._id,
    userId: userId
  });
  
  if (existingVote) {
    if (!existingVote.isHelpful) {
      // Remove not helpful vote
      this.isNotHelpful = Math.max(0, this.isNotHelpful - 1);
      await Vote.findByIdAndDelete(existingVote._id);
    } else {
      // Change from helpful to not helpful
      this.isHelpful = Math.max(0, this.isHelpful - 1);
      this.isNotHelpful += 1;
      existingVote.isHelpful = false;
      await existingVote.save();
    }
  } else {
    // Add new not helpful vote
    this.isNotHelpful += 1;
    await Vote.create({
      reviewId: this._id,
      userId: userId,
      isHelpful: false
    });
  }
  
  return this.save();
};

reviewSchema.methods.moderate = async function(status: 'approved' | 'rejected', moderatorId: string, notes?: string) {
  this.status = status;
  this.moderatedBy = new mongoose.Types.ObjectId(moderatorId);
  this.moderatedAt = new Date();
  if (notes) {
    this.moderatorNotes = notes;
  }
  
  return this.save();
};

const Review = mongoose.model<IReview>('Review', reviewSchema);

export default Review;
