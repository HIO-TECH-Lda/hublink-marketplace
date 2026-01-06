import mongoose, { Document, Schema } from 'mongoose';

export interface INewsletter extends Document {
  email: string;
  firstName?: string;
  lastName?: string;
  preferences?: {
    categories?: string[];
    frequency?: 'daily' | 'weekly' | 'monthly';
    promotions?: boolean;
    productUpdates?: boolean;
    blogPosts?: boolean;
  };
  metadata?: {
    source?: string;
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
  };
  verificationToken?: string;
  verificationExpires?: Date;
  isVerified: boolean;
  isActive: boolean;
  subscribedAt: Date;
  unsubscribedAt?: Date;
  lastEmailSent?: Date;
  emailCount: number;
}

const newsletterSchema = new Schema<INewsletter>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  firstName: String,
  lastName: String,
  preferences: {
    categories: [String],
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly']
    },
    promotions: Boolean,
    productUpdates: Boolean,
    blogPosts: Boolean
  },
  metadata: {
    source: String,
    ipAddress: String,
    userAgent: String,
    referrer: String
  },
  verificationToken: String,
  verificationExpires: Date,
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  subscribedAt: { type: Date, default: Date.now },
  unsubscribedAt: Date,
  lastEmailSent: Date,
  emailCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

interface INewsletterModel extends mongoose.Model<INewsletter> {
  findByEmail(email: string): Promise<INewsletter | null>;
  getSubscriptionStats(): Promise<any[]>;
}

newsletterSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

newsletterSchema.statics.getSubscriptionStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        active: { $sum: { $cond: ['$isActive', 1, 0] } },
        verified: { $sum: { $cond: ['$isVerified', 1, 0] } }
      }
    }
  ]);
};

const Newsletter = mongoose.model<INewsletter, INewsletterModel>('Newsletter', newsletterSchema);
export default Newsletter;

