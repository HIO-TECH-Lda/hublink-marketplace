import mongoose, { Document, Schema } from 'mongoose';

export interface IAffiliate extends Document {
  userId: mongoose.Types.ObjectId;
  code: string;
  status: 'pending' | 'active' | 'blocked';
  commissionType: 'percentage' | 'fixed';
  commissionValue: number;
  cookieWindowDays: number;
  minPayoutAmount: number;
  paymentMethod?: 'bank_transfer' | 'mpesa' | 'emola' | 'other';
  paymentDetails?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const affiliateSchema = new Schema<IAffiliate>(
  {
    userId: {
      type: Schema.Types.ObjectId as any,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'blocked'],
      default: 'pending',
      index: true,
    },
    commissionType: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage',
    },
    commissionValue: {
      type: Number,
      default: 5,
      min: 0,
    },
    cookieWindowDays: {
      type: Number,
      default: 30,
      min: 1,
      max: 365,
    },
    minPayoutAmount: {
      type: Number,
      default: 1000,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['bank_transfer', 'mpesa', 'emola', 'other'],
      required: false,
    },
    paymentDetails: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

affiliateSchema.index({ code: 1, status: 1 });

export default mongoose.model<IAffiliate>('Affiliate', affiliateSchema);

