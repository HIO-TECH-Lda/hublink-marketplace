import mongoose, { Document, Schema } from 'mongoose';
import { IRefund } from '../types';

export interface IRefundDocument extends Omit<IRefund, '_id'>, Document {}

const refundSchema = new Schema<IRefundDocument>({
  orderId: {
    type: Schema.Types.ObjectId as any,
    ref: 'Order',
    required: true,
    index: true
  },
  orderItemId: {
    type: String
  },
  sellerId: {
    type: Schema.Types.ObjectId as any,
    ref: 'User',
    required: true,
    index: true
  },
  buyerId: {
    type: Schema.Types.ObjectId as any,
    ref: 'User',
    required: true
  },
  productId: {
    type: Schema.Types.ObjectId as any,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'MZM',
    uppercase: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    index: true
  },
  reason: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  requestedAt: {
    type: Date,
    default: Date.now
  },
  processedAt: {
    type: Date
  },
  processedBy: {
    type: Schema.Types.ObjectId as any,
    ref: 'User'
  },
  rejectionReason: {
    type: String
  }
}, {
  timestamps: true
});

refundSchema.index({ sellerId: 1, status: 1, createdAt: -1 });
refundSchema.index({ buyerId: 1, createdAt: -1 });
refundSchema.index({ orderId: 1 });

const Refund = mongoose.model<IRefundDocument>('Refund', refundSchema);
export default Refund;

