import mongoose, { Document, Schema } from 'mongoose';

export interface IAffiliateClick extends Document {
  affiliateId: mongoose.Types.ObjectId;
  code: string;
  sessionId?: string;
  buyerId?: mongoose.Types.ObjectId;
  ipHash?: string;
  userAgent?: string;
  referer?: string;
  landingUrl?: string;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
    term?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const affiliateClickSchema = new Schema<IAffiliateClick>(
  {
    affiliateId: {
      type: Schema.Types.ObjectId as any,
      ref: 'Affiliate',
      required: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    sessionId: {
      type: String,
      required: false,
      index: true,
    },
    buyerId: {
      type: Schema.Types.ObjectId as any,
      ref: 'User',
      required: false,
      index: true,
    },
    ipHash: { type: String, required: false },
    userAgent: { type: String, required: false },
    referer: { type: String, required: false },
    landingUrl: { type: String, required: false },
    utm: {
      source: { type: String, required: false },
      medium: { type: String, required: false },
      campaign: { type: String, required: false },
      content: { type: String, required: false },
      term: { type: String, required: false },
    },
  },
  {
    timestamps: true,
  }
);

affiliateClickSchema.index({ affiliateId: 1, createdAt: -1 });
affiliateClickSchema.index({ code: 1, createdAt: -1 });

export default mongoose.model<IAffiliateClick>('AffiliateClick', affiliateClickSchema);

