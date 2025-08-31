import mongoose, { Document, Schema } from 'mongoose';
import { IWishlist, IWishlistItem } from '../types';

export interface IWishlistDocument extends Omit<IWishlist, '_id'>, Document {}

const wishlistItemSchema = new Schema<IWishlistItem>({
  productId: {
    type: Schema.Types.ObjectId as any,
    ref: 'Product',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, {
  _id: false
});

const wishlistSchema = new Schema<IWishlistDocument>({
  userId: {
    type: Schema.Types.ObjectId as any,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [wishlistItemSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
wishlistSchema.index({ userId: 1 });
wishlistSchema.index({ 'items.productId': 1 });
wishlistSchema.index({ createdAt: -1 });

// Virtual for item count
wishlistSchema.virtual('itemCount').get(function(this: any) {
  return this.items.length;
});

// Pre-save middleware to update the updatedAt field
wishlistSchema.pre('save', function(this: any, next) {
  this.updatedAt = new Date();
  next();
});

// Static method to get or create wishlist for user
wishlistSchema.statics.getOrCreateWishlist = async function(this: any, userId: string) {
  let wishlist = await this.findOne({ userId });
  
  if (!wishlist) {
    wishlist = new this({ userId, items: [] });
    await wishlist.save();
  }
  
  return wishlist;
};

// Method to add item to wishlist
wishlistSchema.methods.addItem = async function(this: any, productId: string, notes?: string) {
  // Check if item already exists
  const existingItem = this.items.find((item: any) => 
    item.productId.toString() === productId
  );
  
  if (existingItem) {
    // Update notes if provided
    if (notes) {
      existingItem.notes = notes;
    }
    existingItem.addedAt = new Date();
  } else {
    // Add new item
    this.items.push({
      productId,
      addedAt: new Date(),
      notes
    });
  }
  
  this.updatedAt = new Date();
  return await this.save();
};

// Method to remove item from wishlist
wishlistSchema.methods.removeItem = async function(this: any, productId: string) {
  this.items = this.items.filter((item: any) => 
    item.productId.toString() !== productId
  );
  
  this.updatedAt = new Date();
  return await this.save();
};

// Method to check if item exists in wishlist
wishlistSchema.methods.hasItem = function(this: any, productId: string) {
  return this.items.some((item: any) => 
    item.productId.toString() === productId
  );
};

// Method to clear wishlist
wishlistSchema.methods.clearWishlist = async function(this: any) {
  this.items = [];
  this.updatedAt = new Date();
  return await this.save();
};

// Method to move item to cart (returns item data for cart)
wishlistSchema.methods.moveToCart = async function(this: any, productId: string) {
  const item = this.items.find((item: any) => 
    item.productId.toString() === productId
  );
  
  if (!item) {
    throw new Error('Item not found in wishlist');
  }
  
  // Remove from wishlist
  await this.removeItem(productId);
  
  return item;
};

export const Wishlist = mongoose.model<IWishlistDocument>('Wishlist', wishlistSchema);
