import mongoose, { Document, Schema } from 'mongoose';

export interface IAffiliateConversion extends Document {
  affiliateId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  paymentId?: mongoose.Types.ObjectId;
  buyerId: mongoose.Types.ObjectId;
  sellerId?: mongoose.Types.ObjectId;
  currency: string;
  orderSubtotal: number;
  orderTotal: number;
  commissionBaseAmount: number;
  commissionType: 'percentage' | 'fixed';
  commissionValue: number;
  commissionAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  attributionModel: 'last_click';
  attributedAt: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  paidAt?: Date;
  rejectReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const affiliateConversionSchema = new Schema<IAffiliateConversion>(
  {
    affiliateId: {
      type: Schema.Types.ObjectId as any,
      ref: 'Affiliate',
      required: true,
      index: true,
    },
    orderId: {
      type: Schema.Types.ObjectId as any,
      ref: 'Order',
      required: true,
      index: true,
    },
    paymentId: {
      type: Schema.Types.ObjectId as any,
      ref: 'Payment',
      required: false,
    },
    buyerId: {
      type: Schema.Types.ObjectId as any,
      ref: 'User',
      required: true,
      index: true,
    },
    sellerId: {
      type: Schema.Types.ObjectId as any,
      ref: 'User',
      required: false,
      index: true,
    },
    currency: {
      type: String,
      default: 'MZM',
      required: true,
    },
    orderSubtotal: { type: Number, required: true, min: 0 },
    orderTotal: { type: Number, required: true, min: 0 },
    commissionBaseAmount: { type: Number, required: true, min: 0 },
    commissionType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
    },
    commissionValue: { type: Number, required: true, min: 0 },
    commissionAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'paid'],
      default: 'pending',
      index: true,
    },
    attributionModel: {
      type: String,
      enum: ['last_click'],
      default: 'last_click',
    },
    attributedAt: { type: Date, default: Date.now, required: true },
    approvedAt: { type: Date, required: false },
    rejectedAt: { type: Date, required: false },
    paidAt: { type: Date, required: false },
    rejectReason: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

affiliateConversionSchema.index({ affiliateId: 1, status: 1, createdAt: -1 });
affiliateConversionSchema.index({ orderId: 1, affiliateId: 1 }, { unique: true });

export default mongoose.model<IAffiliateConversion>('AffiliateConversion', affiliateConversionSchema);

