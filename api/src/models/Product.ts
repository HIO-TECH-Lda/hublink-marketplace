import mongoose, { Document, Schema } from 'mongoose';
import { IProduct } from '../types';

export interface IProductDocument extends Omit<IProduct, '_id'>, Document {
  // Virtual properties
  averageRating: number;
  totalReviews: number;
  isInStock: boolean;
  discountedPrice: number;
  discountPercentage: number;
  
  // Instance methods
  incrementViewCount(): Promise<IProductDocument>;
  incrementPurchaseCount(quantity?: number): Promise<IProductDocument>;
}

// Product image schema
const productImageSchema = new Schema({
  url: {
    type: String,
    required: [true, 'Image URL is required']
  },
  alt: {
    type: String,
    default: 'Product image'
  },
  isPrimary: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
}, { _id: false });

// Product variant schema
const productVariantSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Variant name is required']
  },
  value: {
    type: String,
    required: [true, 'Variant value is required']
  },
  price: {
    type: Number,
    required: [true, 'Variant price is required'],
    min: [0, 'Price cannot be negative']
  },
  stock: {
    type: Number,
    required: [true, 'Variant stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  }
}, { _id: false });

// Product specification schema
const productSpecificationSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Specification name is required']
  },
  value: {
    type: String,
    required: [true, 'Specification value is required']
  }
}, { _id: false });

const productSchema = new Schema<IProductDocument>({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Product description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [500, 'Short description cannot exceed 500 characters']
  },

  // Seller Information
  sellerId: {
    type: Schema.Types.ObjectId as any,
    ref: 'User',
    required: [true, 'Seller ID is required']
  },
  sellerName: {
    type: String,
    required: [true, 'Seller name is required']
  },

  // Category and Brand
  categoryId: {
    type: Schema.Types.ObjectId as any,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  subcategoryId: {
    type: Schema.Types.ObjectId as any,
    ref: 'Category'
  },
  brand: {
    type: String,
    trim: true
  },

  // Pricing
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  discountPercentage: {
    type: Number,
    min: [0, 'Discount percentage cannot be negative'],
    max: [100, 'Discount percentage cannot exceed 100%'],
    default: 0
  },
  discountStartDate: {
    type: Date
  },
  discountEndDate: {
    type: Date
  },

  // Inventory
  stock: {
    type: Number,
    required: [true, 'Product stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  barcode: {
    type: String,
    trim: true
  },

  // Images and Media
  images: [productImageSchema],
  primaryImage: {
    type: String,
    required: [true, 'Primary image is required']
  },

  // Product Details
  variants: [productVariantSchema],
  specifications: [productSpecificationSchema],
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative']
  },
  dimensions: {
    length: { type: Number, min: 0 },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 }
  },

  // SEO and Marketing
  metaTitle: {
    type: String,
    maxlength: [60, 'Meta title cannot exceed 60 characters']
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description cannot exceed 160 characters']
  },
  keywords: [{
    type: String,
    trim: true
  }],
  slug: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },

  // Status and Visibility
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive', 'archived'],
    default: 'draft'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  isNewArrival: {
    type: Boolean,
    default: false
  },

  // Shipping and Returns
  shippingWeight: {
    type: Number,
    min: [0, 'Shipping weight cannot be negative']
  },
  shippingClass: {
    type: String,
    enum: ['light', 'standard', 'heavy', 'fragile'],
    default: 'standard'
  },
  returnPolicy: {
    type: String,
    maxlength: [500, 'Return policy cannot exceed 500 characters']
  },
  warranty: {
    type: String,
    maxlength: [200, 'Warranty cannot exceed 200 characters']
  },

  // Analytics and Performance
  viewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  purchaseCount: {
    type: Number,
    default: 0,
    min: 0
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0,
    min: 0
  },

  // Location and Availability
  location: {
    city: String,
    state: String,
    country: {
      type: String,
      default: 'Mozambique'
    }
  },
  isLocalPickup: {
    type: Boolean,
    default: false
  },
  isDelivery: {
    type: Boolean,
    default: true
  },

  // Tags and Labels
  tags: [{
    type: String,
    trim: true
  }],
  labels: [{
    type: String,
    enum: ['organic', 'eco-friendly', 'handmade', 'local', 'premium', 'budget'],
    trim: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function(this: IProductDocument) {
  if (this.discountPercentage > 0 && this.discountPercentage <= 100) {
    return this.price * (1 - this.discountPercentage / 100);
  }
  return this.price;
});

// Virtual for discount percentage calculation
productSchema.virtual('calculatedDiscountPercentage').get(function(this: IProductDocument) {
  if (this.originalPrice && this.originalPrice > this.price) {
    return ((this.originalPrice - this.price) / this.originalPrice) * 100;
  }
  return this.discountPercentage;
});

// Virtual for stock status
productSchema.virtual('isInStock').get(function(this: IProductDocument) {
  return this.stock > 0;
});

// Virtual for active discount
productSchema.virtual('hasActiveDiscount').get(function(this: IProductDocument) {
  const now = new Date();
  return this.discountPercentage > 0 && 
         (!this.discountStartDate || this.discountStartDate <= now) &&
         (!this.discountEndDate || this.discountEndDate >= now);
});

// Indexes for performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ sellerId: 1 });
productSchema.index({ categoryId: 1 });
productSchema.index({ status: 1 });
productSchema.index({ price: 1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isBestSeller: 1 });
productSchema.index({ isNewArrival: 1 });
productSchema.index({ slug: 1 }, { unique: true, sparse: true });
productSchema.index({ sku: 1 }, { unique: true, sparse: true });

// Compound indexes
productSchema.index({ categoryId: 1, status: 1 });
productSchema.index({ sellerId: 1, status: 1 });
productSchema.index({ price: 1, status: 1 });

// Pre-save middleware
productSchema.pre('save', function(this: IProductDocument, next) {
  // Set primary image if not set
  if (this.images && this.images.length > 0 && !this.primaryImage) {
    const primaryImage = this.images.find((img: any) => img.isPrimary) || this.images[0];
    this.primaryImage = primaryImage.url;
  }

  // Generate slug if not provided
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  next();
});

// Static method to find active products
productSchema.statics.findActive = function() {
  return this.find({ status: 'active' });
};

// Static method to find featured products
productSchema.statics.findFeatured = function() {
  return this.find({ status: 'active', isFeatured: true });
};

// Static method to find best sellers
productSchema.statics.findBestSellers = function() {
  return this.find({ status: 'active', isBestSeller: true });
};

// Static method to find new arrivals
productSchema.statics.findNewArrivals = function() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return this.find({
    status: 'active',
    createdAt: { $gte: thirtyDaysAgo }
  }).sort({ createdAt: -1 });
};

// Instance method to increment view count
productSchema.methods.incrementViewCount = function(this: IProductDocument) {
  this.viewCount = (this.viewCount || 0) + 1;
  return this.save();
};

// Instance method to increment purchase count
productSchema.methods.incrementPurchaseCount = function(this: IProductDocument, quantity = 1) {
  this.purchaseCount = (this.purchaseCount || 0) + quantity;
  this.stock = Math.max(0, this.stock - quantity);
  return this.save();
};

const Product = mongoose.model<IProductDocument>('Product', productSchema);
export default Product;
