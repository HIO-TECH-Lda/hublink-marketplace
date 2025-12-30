import mongoose, { Document, Schema, Types } from 'mongoose';

export interface INewsletterCampaign {
  _id?: string;
  name: string;
  subject: string;
  type: 'newsletter' | 'promotional' | 'announcement' | 'welcome';
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';
  content: {
    html: string;
    plainText?: string;
  };
  segmentation?: {
    subscriberStatus?: 'all' | 'active' | 'new';
    tags?: string[];
    preferences?: {
      categories?: string[];
      frequency?: string[];
    };
  };
  scheduledAt?: Date;
  timezone?: string;
  sentAt?: Date;
  createdBy?: Types.ObjectId;
  stats: {
    totalSubscribers: number;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
    deliveryRate: number;
    openRate: number;
    clickRate: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface INewsletterCampaignDocument extends Omit<INewsletterCampaign, '_id'>, Document {}

const newsletterCampaignSchema = new Schema<INewsletterCampaignDocument>({
  name: {
    type: String,
    required: [true, 'Campaign name is required'],
    trim: true,
    maxlength: [200, 'Campaign name cannot exceed 200 characters']
  },
  subject: {
    type: String,
    required: [true, 'Email subject is required'],
    trim: true,
    maxlength: [200, 'Email subject cannot exceed 200 characters']
  },
  type: {
    type: String,
    enum: ['newsletter', 'promotional', 'announcement', 'welcome'],
    default: 'newsletter'
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'sending', 'sent', 'cancelled'],
    default: 'draft'
  },
  content: {
    html: {
      type: String,
      required: [true, 'HTML content is required']
    },
    plainText: {
      type: String
    }
  },
  segmentation: {
    subscriberStatus: {
      type: String,
      enum: ['all', 'active', 'new'],
      default: 'all'
    },
    tags: [String],
    preferences: {
      categories: [String],
      frequency: [String]
    }
  },
  scheduledAt: Date,
  timezone: {
    type: String,
    default: 'Africa/Maputo'
  },
  sentAt: Date,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  stats: {
    totalSubscribers: { type: Number, default: 0, min: 0 },
    sent: { type: Number, default: 0, min: 0 },
    delivered: { type: Number, default: 0, min: 0 },
    opened: { type: Number, default: 0, min: 0 },
    clicked: { type: Number, default: 0, min: 0 },
    bounced: { type: Number, default: 0, min: 0 },
    unsubscribed: { type: Number, default: 0, min: 0 },
    deliveryRate: { type: Number, default: 0, min: 0, max: 100 },
    openRate: { type: Number, default: 0, min: 0, max: 100 },
    clickRate: { type: Number, default: 0, min: 0, max: 100 }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
newsletterCampaignSchema.index({ status: 1, scheduledAt: 1 });
newsletterCampaignSchema.index({ type: 1 });
newsletterCampaignSchema.index({ createdAt: -1 });
newsletterCampaignSchema.index({ sentAt: -1 });

// Pre-save middleware to calculate rates
newsletterCampaignSchema.pre('save', function(next) {
  if (this.stats.sent > 0) {
    this.stats.deliveryRate = (this.stats.delivered / this.stats.sent) * 100;
    this.stats.openRate = (this.stats.opened / this.stats.delivered) * 100;
    this.stats.clickRate = (this.stats.clicked / this.stats.delivered) * 100;
  }
  next();
});

const NewsletterCampaign = mongoose.model<INewsletterCampaignDocument>('NewsletterCampaign', newsletterCampaignSchema);
export default NewsletterCampaign;

