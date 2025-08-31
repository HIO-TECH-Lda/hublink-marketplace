import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
  productId: mongoose.Types.ObjectId;
  productName: string;
  productImage: string;
  productSlug: string;
  sellerId: mongoose.Types.ObjectId;
  sellerName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  variantId?: string;
  variantName?: string;
  variantValue?: string;
  variantPrice?: number;
  isAvailable: boolean;
  stockAvailable: number;
  addedAt: Date;
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items: ICartItem[];
  totalItems: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Virtuals
  itemCount: number;
  isEmpty: boolean;
  hasItems: boolean;
  
  // Methods
  addItem(productId: string, quantity: number, variantId?: string): Promise<void>;
  removeItem(productId: string, variantId?: string): Promise<void>;
  updateQuantity(productId: string, quantity: number, variantId?: string): Promise<void>;
  clearCart(): Promise<void>;
  calculateTotals(): Promise<void>;
  getItem(productId: string, variantId?: string): ICartItem | undefined;
  hasItem(productId: string, variantId?: string): boolean;
}

const cartItemSchema = new Schema<ICartItem>({
  productId: {
    type: Schema.Types.ObjectId as any,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  productImage: {
    type: String,
    required: true
  },
  productSlug: {
    type: String,
    required: true
  },
  sellerId: {
    type: Schema.Types.ObjectId as any,
    ref: 'User',
    required: true
  },
  sellerName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  variantId: {
    type: String,
    required: false
  },
  variantName: {
    type: String,
    required: false
  },
  variantValue: {
    type: String,
    required: false
  },
  variantPrice: {
    type: Number,
    required: false,
    min: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  stockAvailable: {
    type: Number,
    default: 0
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new Schema<ICart>({
  userId: {
    type: Schema.Types.ObjectId as any,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  totalItems: {
    type: Number,
    default: 0
  },
  subtotal: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  shipping: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    }
  }
}, {
  timestamps: true
});

// Virtuals
cartSchema.virtual('itemCount').get(function(this: ICart): number {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

cartSchema.virtual('isEmpty').get(function(this: ICart): boolean {
  return this.items.length === 0;
});

cartSchema.virtual('hasItems').get(function(this: ICart): boolean {
  return this.items.length > 0;
});

// Methods
cartSchema.methods.addItem = async function(this: ICart, productId: string, quantity: number, variantId?: string): Promise<void> {
  const existingItem = this.getItem(productId, variantId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.totalPrice = existingItem.quantity * existingItem.unitPrice;
  } else {
    // Fetch product details
    const Product = mongoose.model('Product');
    const product = await Product.findById(productId);
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    const User = mongoose.model('User');
    const seller = await User.findById(product.sellerId);
    
    const item: ICartItem = {
      productId: new mongoose.Types.ObjectId(productId),
      productName: product.name,
      productImage: product.primaryImage || product.images[0]?.url || '',
      productSlug: product.slug,
      sellerId: product.sellerId,
      sellerName: seller ? `${seller.firstName} ${seller.lastName}` : 'Unknown Seller',
      quantity,
      unitPrice: variantId ? 
        (product.variants?.find(v => v._id.toString() === variantId)?.price || product.price) : 
        product.price,
      totalPrice: (variantId ? 
        (product.variants?.find(v => v._id.toString() === variantId)?.price || product.price) : 
        product.price) * quantity,
      variantId,
      variantName: variantId ? 
        product.variants?.find(v => v._id.toString() === variantId)?.name : 
        undefined,
      variantValue: variantId ? 
        product.variants?.find(v => v._id.toString() === variantId)?.value : 
        undefined,
      variantPrice: variantId ? 
        product.variants?.find(v => v._id.toString() === variantId)?.price : 
        undefined,
      isAvailable: product.status === 'active' && product.stock > 0,
      stockAvailable: product.stock,
      addedAt: new Date()
    };
    
    this.items.push(item);
  }
  
  await this.calculateTotals();
  await this.save();
};

cartSchema.methods.removeItem = async function(this: ICart, productId: string, variantId?: string): Promise<void> {
  this.items = this.items.filter(item => 
    item.productId.toString() !== productId || 
    (variantId && item.variantId !== variantId)
  );
  
  await this.calculateTotals();
  await this.save();
};

cartSchema.methods.updateQuantity = async function(this: ICart, productId: string, quantity: number, variantId?: string): Promise<void> {
  const item = this.getItem(productId, variantId);
  
  if (!item) {
    throw new Error('Item not found in cart');
  }
  
  if (quantity <= 0) {
    await this.removeItem(productId, variantId);
  } else {
    item.quantity = quantity;
    item.totalPrice = item.quantity * item.unitPrice;
    await this.calculateTotals();
    await this.save();
  }
};

cartSchema.methods.clearCart = async function(this: ICart): Promise<void> {
  this.items = [];
  await this.calculateTotals();
  await this.save();
};

cartSchema.methods.calculateTotals = async function(this: ICart): Promise<void> {
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
  this.subtotal = this.items.reduce((total, item) => total + item.totalPrice, 0);
  
  // Calculate tax (example: 10% tax rate)
  this.tax = this.subtotal * 0.1;
  
  // Calculate shipping (example: free shipping over $50, otherwise $5)
  this.shipping = this.subtotal >= 50 ? 0 : 5;
  
  // Calculate discount (placeholder for future discount logic)
  this.discount = 0;
  
  // Calculate total
  this.total = this.subtotal + this.tax + this.shipping - this.discount;
};

cartSchema.methods.getItem = function(this: ICart, productId: string, variantId?: string): ICartItem | undefined {
  return this.items.find(item => 
    item.productId.toString() === productId && 
    (!variantId || item.variantId === variantId)
  );
};

cartSchema.methods.hasItem = function(this: ICart, productId: string, variantId?: string): boolean {
  return this.getItem(productId, variantId) !== undefined;
};

// Indexes
cartSchema.index({ userId: 1 });
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<ICart>('Cart', cartSchema);
