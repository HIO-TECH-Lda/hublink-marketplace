import mongoose, { Document, Schema } from 'mongoose';
import { ITicket, ITicketMessage, ITicketAttachment } from '../types';

export interface ITicketDocument extends Omit<ITicket, '_id'>, Document {}
export interface ITicketMessageDocument extends Omit<ITicketMessage, '_id'>, Document {}
export interface ITicketAttachmentDocument extends Omit<ITicketAttachment, '_id'>, Document {}

const ticketAttachmentSchema = new Schema<ITicketAttachmentDocument>({
  ticketId: {
    type: Schema.Types.ObjectId as any,
    ref: 'Ticket',
    required: true,
    index: true
  },
  messageId: {
    type: Schema.Types.ObjectId as any,
    ref: 'TicketMessage',
    index: true
  },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  publicId: { type: String },
  fileSize: { type: Number, required: true, min: 0 },
  mimeType: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
}, { _id: true, timestamps: false });

const ticketMessageSchema = new Schema<ITicketMessageDocument>({
  ticketId: {
    type: Schema.Types.ObjectId as any,
    ref: 'Ticket',
    required: true,
    index: true
  },
  userId: {
    type: Schema.Types.ObjectId as any,
    ref: 'User',
    required: true
  },
  userType: {
    type: String,
    enum: ['buyer', 'seller', 'admin', 'support'],
    required: true
  },
  message: {
    type: String,
    required: true,
    maxlength: 5000
  },
  isInternal: {
    type: Boolean,
    default: false
  },
  attachments: [ticketAttachmentSchema],
  createdAt: { type: Date, default: Date.now }
}, { _id: true, timestamps: false });

const ticketSchema = new Schema<ITicketDocument>({
  title: {
    type: String,
    required: true,
    maxlength: 200,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 5000,
    trim: true
  },
  category: {
    type: String,
    enum: [
      'technical_issue',
      'payment_problem',
      'order_issue',
      'return_request',
      'account_issue',
      'product_issue',
      'shipping_problem',
      'general_inquiry',
      'feature_request',
      'bug_report'
    ],
    required: true,
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    required: true,
    default: 'medium',
    index: true
  },
  status: {
    type: String,
    enum: [
      'open',
      'in_progress',
      'waiting_for_user',
      'waiting_for_third_party',
      'resolved',
      'closed'
    ],
    default: 'open',
    index: true
  },
  userId: {
    type: Schema.Types.ObjectId as any,
    ref: 'User',
    required: true,
    index: true
  },
  userType: {
    type: String,
    enum: ['buyer', 'seller', 'admin'],
    required: true
  },
  assignedTo: {
    type: Schema.Types.ObjectId as any,
    ref: 'User',
    index: true
  },
  orderId: {
    type: Schema.Types.ObjectId as any,
    ref: 'Order',
    index: true
  },
  productId: {
    type: Schema.Types.ObjectId as any,
    ref: 'Product',
    index: true
  },
  tags: [{
    type: String,
    maxlength: 50,
    trim: true
  }],
  attachments: [ticketAttachmentSchema],
  messages: [ticketMessageSchema]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
ticketSchema.index({ userId: 1, createdAt: -1 });
ticketSchema.index({ status: 1, priority: -1 });
ticketSchema.index({ assignedTo: 1, status: 1 });
ticketSchema.index({ category: 1, status: 1 });
ticketSchema.index({ title: 'text', description: 'text' });

const Ticket = mongoose.model<ITicketDocument>('Ticket', ticketSchema);
export default Ticket;

