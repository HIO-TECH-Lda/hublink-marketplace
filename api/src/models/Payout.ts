import mongoose, { Document, Schema } from 'mongoose';
import { IPayout } from '../types';

export interface IPayoutDocument extends Omit<IPayout, '_id'>, Document {}

const payoutSchema = new Schema<IPayoutDocument>({
  sellerId: {
    type: Schema.Types.ObjectId as any,
    ref: 'User',
    required: true,
    index: true
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
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
    index: true
  },
  method: {
    type: String,
    enum: ['mpesa', 'bank_transfer', 'emola'],
    required: true
  },
  periodStart: {
    type: Date,
    required: true
  },
  periodEnd: {
    type: Date,
    required: true
  },
  orderIds: [{
    type: Schema.Types.ObjectId as any,
    ref: 'Order'
  }],
  commissionRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  commissionAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  netAmount: {
    type: Number,
    required: true,
    min: 0
  },
  processedAt: {
    type: Date
  },
  failureReason: {
    type: String
  }
}, {
  timestamps: true
});

payoutSchema.index({ sellerId: 1, createdAt: -1 });
payoutSchema.index({ status: 1, createdAt: -1 });

const Payout = mongoose.model<IPayoutDocument>('Payout', payoutSchema);
export default Payout;

