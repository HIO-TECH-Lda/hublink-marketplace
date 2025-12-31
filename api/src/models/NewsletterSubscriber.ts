import mongoose, { Document, Schema } from 'mongoose';

export interface INewsletterSubscriber {
  _id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  status: 'active' | 'unsubscribed' | 'bounced' | 'pending';
  origin: 'popup' | 'footer' | 'signup' | 'admin' | 'import';
  tags: string[];
  preferences?: {
    categories?: string[];
    frequency?: 'daily' | 'weekly' | 'monthly';
    promotions?: boolean;
    productUpdates?: boolean;
    blogPosts?: boolean;
  };
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  };
  stats: {
    emailsSent: number;
    emailsOpened: number;
    emailsClicked: number;
    lastOpened?: Date;
    lastClicked?: Date;
  };
  unsubscribedAt?: Date;
  unsubscribedReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface INewsletterSubscriberDocument extends Omit<INewsletterSubscriber, '_id'>, Document {}

const newsletterSubscriberSchema = new Schema<INewsletterSubscriberDocument>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'unsubscribed', 'bounced', 'pending'],
    default: 'pending'
  },
  origin: {
    type: String,
    enum: ['popup', 'footer', 'signup', 'admin', 'import'],
    default: 'signup'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  preferences: {
    categories: [String],
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly']
    },
    promotions: { type: Boolean, default: true },
    productUpdates: { type: Boolean, default: true },
    blogPosts: { type: Boolean, default: true }
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    referrer: String,
    utmSource: String,
    utmMedium: String,
    utmCampaign: String
  },
  stats: {
    emailsSent: { type: Number, default: 0, min: 0 },
    emailsOpened: { type: Number, default: 0, min: 0 },
    emailsClicked: { type: Number, default: 0, min: 0 },
    lastOpened: Date,
    lastClicked: Date
  },
  unsubscribedAt: Date,
  unsubscribedReason: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
newsletterSubscriberSchema.index({ email: 1 }, { unique: true });
newsletterSubscriberSchema.index({ status: 1 });
newsletterSubscriberSchema.index({ origin: 1 });
newsletterSubscriberSchema.index({ tags: 1 });
newsletterSubscriberSchema.index({ createdAt: -1 });

// Virtual for full name
newsletterSubscriberSchema.virtual('fullName').get(function(this: INewsletterSubscriberDocument) {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.firstName || this.lastName || this.email;
});

// Static method to find by email
newsletterSubscriberSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

const NewsletterSubscriber = mongoose.model<INewsletterSubscriberDocument>('NewsletterSubscriber', newsletterSubscriberSchema);
export default NewsletterSubscriber;

