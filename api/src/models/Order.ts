import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
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
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  trackingNumber?: string;
  shippedAt?: Date;
  deliveredAt?: Date;
}

export interface IOrderAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault: boolean;
}

export interface IOrderPayment {
  method: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer' | 'cash_on_delivery';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  amount: number;
  currency: string;
  paidAt?: Date;
  refundedAt?: Date;
  refundAmount?: number;
  paymentDetails?: {
    cardLast4?: string;
    cardBrand?: string;
    paypalEmail?: string;
  };
}

export interface IOrder extends Document {
  orderNumber: string;
  userId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  shippingAddress: IOrderAddress;
  billingAddress: IOrderAddress;
  payment: IOrderPayment;
  notes?: string;
  estimatedDelivery?: Date;
  confirmedAt?: Date;
  processedAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  cancelledBy?: mongoose.Types.ObjectId;
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Virtuals
  itemCount: number;
  isPending: boolean;
  isConfirmed: boolean;
  isProcessing: boolean;
  isShipped: boolean;
  isDelivered: boolean;
  isCancelled: boolean;
  isRefunded: boolean;
  canCancel: boolean;
  canRefund: boolean;
  
  // Methods
  confirmOrder(): Promise<void>;
  processOrder(): Promise<void>;
  shipOrder(trackingNumber: string): Promise<void>;
  deliverOrder(): Promise<void>;
  cancelOrder(cancelledBy: string, reason: string): Promise<void>;
  refundOrder(refundAmount: number): Promise<void>;
  updateItemStatus(productId: string, status: string, variantId?: string): Promise<void>;
  calculateTotals(): Promise<void>;
  generateOrderNumber(): Promise<void>;
}

const orderItemSchema = new Schema<IOrderItem>({
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
    min: 1
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
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  trackingNumber: {
    type: String,
    required: false
  },
  shippedAt: {
    type: Date,
    required: false
  },
  deliveredAt: {
    type: Date,
    required: false
  }
});

const orderAddressSchema = new Schema<IOrderAddress>({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  isDefault: {
    type: Boolean,
    default: false
  }
});

const orderPaymentSchema = new Schema<IOrderPayment>({
  method: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    required: false
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  paidAt: {
    type: Date,
    required: false
  },
  refundedAt: {
    type: Date,
    required: false
  },
  refundAmount: {
    type: Number,
    required: false,
    min: 0
  },
  paymentDetails: {
    cardLast4: String,
    cardBrand: String,
    paypalEmail: String
  }
});

const orderSchema = new Schema<IOrder>({
  orderNumber: {
    type: String,
    required: false
  },
  userId: {
    type: Schema.Types.ObjectId as any,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    required: true,
    min: 0
  },
  shipping: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  shippingAddress: {
    type: orderAddressSchema,
    required: true
  },
  billingAddress: {
    type: orderAddressSchema,
    required: true
  },
  payment: {
    type: orderPaymentSchema,
    required: true
  },
  notes: {
    type: String,
    required: false
  },
  estimatedDelivery: {
    type: Date,
    required: false
  },
  confirmedAt: {
    type: Date,
    required: false
  },
  processedAt: {
    type: Date,
    required: false
  },
  shippedAt: {
    type: Date,
    required: false
  },
  deliveredAt: {
    type: Date,
    required: false
  },
  cancelledAt: {
    type: Date,
    required: false
  },
  cancelledBy: {
    type: Schema.Types.ObjectId as any,
    ref: 'User',
    required: false
  },
  cancelReason: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

// Virtuals
orderSchema.virtual('itemCount').get(function(this: IOrder): number {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

orderSchema.virtual('isPending').get(function(this: IOrder): boolean {
  return this.status === 'pending';
});

orderSchema.virtual('isConfirmed').get(function(this: IOrder): boolean {
  return this.status === 'confirmed';
});

orderSchema.virtual('isProcessing').get(function(this: IOrder): boolean {
  return this.status === 'processing';
});

orderSchema.virtual('isShipped').get(function(this: IOrder): boolean {
  return this.status === 'shipped';
});

orderSchema.virtual('isDelivered').get(function(this: IOrder): boolean {
  return this.status === 'delivered';
});

orderSchema.virtual('isCancelled').get(function(this: IOrder): boolean {
  return this.status === 'cancelled';
});

orderSchema.virtual('isRefunded').get(function(this: IOrder): boolean {
  return this.status === 'refunded';
});

orderSchema.virtual('canCancel').get(function(this: IOrder): boolean {
  return ['pending', 'confirmed', 'processing'].includes(this.status);
});

orderSchema.virtual('canRefund').get(function(this: IOrder): boolean {
  return ['delivered', 'shipped'].includes(this.status) && this.payment.status === 'completed';
});

// Methods
orderSchema.methods.confirmOrder = async function(this: IOrder): Promise<void> {
  if (this.status !== 'pending') {
    throw new Error('Order can only be confirmed when pending');
  }
  
  this.status = 'confirmed';
  this.confirmedAt = new Date();
  await this.save();
};

orderSchema.methods.processOrder = async function(this: IOrder): Promise<void> {
  if (this.status !== 'confirmed') {
    throw new Error('Order can only be processed when confirmed');
  }
  
  this.status = 'processing';
  this.processedAt = new Date();
  await this.save();
};

orderSchema.methods.shipOrder = async function(this: IOrder, trackingNumber: string): Promise<void> {
  if (this.status !== 'processing') {
    throw new Error('Order can only be shipped when processing');
  }
  
  this.status = 'shipped';
  this.shippedAt = new Date();
  this.items.forEach(item => {
    item.status = 'shipped';
    item.trackingNumber = trackingNumber;
    item.shippedAt = new Date();
  });
  await this.save();
};

orderSchema.methods.deliverOrder = async function(this: IOrder): Promise<void> {
  if (this.status !== 'shipped') {
    throw new Error('Order can only be delivered when shipped');
  }
  
  this.status = 'delivered';
  this.deliveredAt = new Date();
  this.items.forEach(item => {
    item.status = 'delivered';
    item.deliveredAt = new Date();
  });
  await this.save();
};

orderSchema.methods.cancelOrder = async function(this: IOrder, cancelledBy: string, reason: string): Promise<void> {
  if (!this.canCancel) {
    throw new Error('Order cannot be cancelled in current status');
  }
  
  this.status = 'cancelled';
  this.cancelledAt = new Date();
  this.cancelledBy = new mongoose.Types.ObjectId(cancelledBy);
  this.cancelReason = reason;
  this.items.forEach(item => {
    item.status = 'cancelled';
  });
  await this.save();
};

orderSchema.methods.refundOrder = async function(this: IOrder, refundAmount: number): Promise<void> {
  if (!this.canRefund) {
    throw new Error('Order cannot be refunded in current status');
  }
  
  this.status = 'refunded';
  this.payment.status = 'refunded';
  this.payment.refundedAt = new Date();
  this.payment.refundAmount = refundAmount;
  this.items.forEach(item => {
    item.status = 'refunded';
  });
  await this.save();
};

orderSchema.methods.updateItemStatus = async function(this: IOrder, productId: string, status: string, variantId?: string): Promise<void> {
  const item = this.items.find(item => 
    item.productId.toString() === productId && 
    (!variantId || item.variantId === variantId)
  );
  
  if (!item) {
    throw new Error('Item not found in order');
  }
  
  item.status = status as any;
  
  if (status === 'shipped') {
    item.shippedAt = new Date();
  } else if (status === 'delivered') {
    item.deliveredAt = new Date();
  }
  
  await this.save();
};

orderSchema.methods.calculateTotals = async function(this: IOrder): Promise<void> {
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

orderSchema.methods.generateOrderNumber = async function(this: IOrder): Promise<void> {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  // Get count of orders for today
  const Order = mongoose.model('Order');
  const todayStart = new Date(year, date.getMonth(), date.getDate());
  const todayEnd = new Date(year, date.getMonth(), date.getDate() + 1);
  
  const orderCount = await Order.countDocuments({
    createdAt: { $gte: todayStart, $lt: todayEnd }
  });
  
  const sequence = String(orderCount + 1).padStart(4, '0');
  this.orderNumber = `ORD-${year}${month}${day}-${sequence}`;
};

// Pre-save middleware
orderSchema.pre('save', async function(this: IOrder, next) {
  if (this.isNew && !this.orderNumber) {
    await this.generateOrderNumber();
  }
  next();
});

// Indexes
orderSchema.index({ userId: 1 });
// orderNumber unique constraint is already defined in schema
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'payment.transactionId': 1 });

export default mongoose.model<IOrder>('Order', orderSchema);
