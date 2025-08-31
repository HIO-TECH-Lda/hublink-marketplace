import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  orderId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  method: 'stripe' | 'paypal' | 'bank_transfer' | 'cash_on_delivery';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  gateway: 'stripe' | 'paypal' | 'manual';
  gatewayTransactionId?: string;
  gatewayResponse?: any;
  refundAmount?: number;
  refundReason?: string;
  refundedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Virtual properties
  isPending: boolean;
  isProcessing: boolean;
  isCompleted: boolean;
  isFailed: boolean;
  isRefunded: boolean;
  canRefund: boolean;
  
  // Instance methods
  markAsProcessing(): Promise<IPayment>;
  markAsCompleted(gatewayTransactionId?: string): Promise<IPayment>;
  markAsFailed(error?: any): Promise<IPayment>;
  processRefund(amount: number, reason?: string): Promise<IPayment>;
}

export interface IPaymentModel extends mongoose.Model<IPayment> {
  findByOrderId(orderId: string): Promise<IPayment | null>;
  findByUserId(userId: string): Promise<IPayment[]>;
  findByStatus(status: string): Promise<IPayment[]>;
}

const paymentSchema = new Schema<IPayment>({
  orderId: {
    type: Schema.Types.ObjectId as any,
    ref: 'Order',
    required: [true, 'Order ID is required']
  },
  userId: {
    type: Schema.Types.ObjectId as any,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    default: 'USD',
    uppercase: true,
    trim: true
  },
  method: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: {
      values: ['stripe', 'paypal', 'bank_transfer', 'cash_on_delivery', 'm_pesa', 'e_mola'],
      message: 'Invalid payment method'
    }
  },
  status: {
    type: String,
    required: [true, 'Payment status is required'],
    enum: {
      values: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      message: 'Invalid payment status'
    },
    default: 'pending'
  },
  gateway: {
    type: String,
    required: [true, 'Payment gateway is required'],
    enum: {
      values: ['stripe', 'paypal', 'manual', 'm_pesa', 'e_mola'],
      message: 'Invalid payment gateway'
    }
  },
  gatewayTransactionId: {
    type: String,
    trim: true,
    sparse: true
  },
  gatewayResponse: {
    type: Schema.Types.Mixed
  },
  refundAmount: {
    type: Number,
    min: [0, 'Refund amount cannot be negative']
  },
  refundReason: {
    type: String,
    maxlength: [500, 'Refund reason cannot exceed 500 characters']
  },
  refundedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Virtual properties
paymentSchema.virtual('isPending').get(function(this: IPayment): boolean {
  return this.status === 'pending';
});

paymentSchema.virtual('isProcessing').get(function(this: IPayment): boolean {
  return this.status === 'processing';
});

paymentSchema.virtual('isCompleted').get(function(this: IPayment): boolean {
  return this.status === 'completed';
});

paymentSchema.virtual('isFailed').get(function(this: IPayment): boolean {
  return this.status === 'failed';
});

paymentSchema.virtual('isRefunded').get(function(this: IPayment): boolean {
  return this.status === 'refunded';
});

paymentSchema.virtual('canRefund').get(function(this: IPayment): boolean {
  return this.status === 'completed' && !this.isRefunded;
});

// Indexes
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ userId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

// Pre-save middleware
paymentSchema.pre('save', function(this: IPayment, next) {
  try {
    // Set refundedAt when status changes to refunded
    if (this.isModified('status') && this.status === 'refunded' && !this.refundedAt) {
      this.refundedAt = new Date();
    }
    
    next();
  } catch (error) {
    console.error('Error in Payment pre-save middleware:', error);
    next(error as Error);
  }
});

// Static methods
paymentSchema.statics.findByOrderId = function(orderId: string) {
  try {
    return this.findOne({ orderId }).populate('orderId').populate('userId');
  } catch (error) {
    console.error('Error in findByOrderId:', error);
    throw error;
  }
};

paymentSchema.statics.findByUserId = function(userId: string) {
  try {
    return this.find({ userId }).populate('orderId').sort({ createdAt: -1 });
  } catch (error) {
    console.error('Error in findByUserId:', error);
    throw error;
  }
};

paymentSchema.statics.findByStatus = function(status: string) {
  try {
    return this.find({ status }).populate('orderId').populate('userId').sort({ createdAt: -1 });
  } catch (error) {
    console.error('Error in findByStatus:', error);
    throw error;
  }
};

// Instance methods
paymentSchema.methods.markAsProcessing = function(this: IPayment) {
  try {
    this.status = 'processing';
    return this.save();
  } catch (error) {
    console.error('Error in markAsProcessing:', error);
    throw error;
  }
};

paymentSchema.methods.markAsCompleted = function(this: IPayment, gatewayTransactionId?: string) {
  try {
    this.status = 'completed';
    if (gatewayTransactionId) {
      this.gatewayTransactionId = gatewayTransactionId;
    }
    return this.save();
  } catch (error) {
    console.error('Error in markAsCompleted:', error);
    throw error;
  }
};

paymentSchema.methods.markAsFailed = function(this: IPayment, error?: any) {
  try {
    this.status = 'failed';
    if (error) {
      this.gatewayResponse = error;
    }
    return this.save();
  } catch (error) {
    console.error('Error in markAsFailed:', error);
    throw error;
  }
};

paymentSchema.methods.processRefund = function(this: IPayment, amount: number, reason?: string) {
  try {
    if (!this.canRefund) {
      throw new Error('Payment cannot be refunded');
    }
    
    if (amount > this.amount) {
      throw new Error('Refund amount cannot exceed payment amount');
    }
    
    this.status = 'refunded';
    this.refundAmount = amount;
    this.refundReason = reason;
    this.refundedAt = new Date();
    
    return this.save();
  } catch (error) {
    console.error('Error in processRefund:', error);
    throw error;
  }
};

export default mongoose.model<IPayment, IPaymentModel>('Payment', paymentSchema);
