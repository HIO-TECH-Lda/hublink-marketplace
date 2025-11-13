import mongoose, { Document, Schema } from 'mongoose';
import { ISellerFinance } from '../types';

export interface ISellerFinanceDocument extends Omit<ISellerFinance, '_id'>, Document {}

const financeAttachmentSchema = new Schema({
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  publicId: { type: String },
  fileSize: { type: Number, required: true, min: 0 },
  mimeType: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
}, { _id: true, timestamps: false });

const recurringConfigSchema = new Schema({
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: true
  },
  endDate: { type: Date },
  nextDueDate: { type: Date }
}, { _id: false });

const sellerFinanceSchema = new Schema<ISellerFinanceDocument>({
  sellerId: {
    type: Schema.Types.ObjectId as any,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true,
    index: true
  },
  source: {
    type: String,
    enum: ['marketplace', 'manual', 'other'],
    required: true,
    index: true
  },
  orderId: {
    type: Schema.Types.ObjectId as any,
    ref: 'Order',
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'MZN',
    uppercase: true
  },
  category: {
    type: String,
    index: true
  },
  vendor: {
    type: String
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'mpesa', 'bank_transfer', 'emola', 'other'],
    required: true
  },
  attachments: [financeAttachmentSchema],
  customerName: {
    type: String
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringConfig: {
    type: recurringConfigSchema
  },
  deletedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
sellerFinanceSchema.index({ sellerId: 1, date: -1 });
sellerFinanceSchema.index({ sellerId: 1, type: 1, date: -1 });
sellerFinanceSchema.index({ sellerId: 1, category: 1 });
sellerFinanceSchema.index({ orderId: 1 });
sellerFinanceSchema.index({ deletedAt: 1 });

const SellerFinance = mongoose.model<ISellerFinanceDocument>('SellerFinance', sellerFinanceSchema);
export default SellerFinance;

