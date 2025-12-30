import mongoose, { Document, Schema } from 'mongoose';

export interface IBlogPost {
  _id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  image?: string;
  authorId: string;
  authorName: string;
  category: string;
  tags?: string[];
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  isFeatured?: boolean;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  stats?: {
    views: number;
    likes: number;
    shares: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBlogPostDocument extends Omit<IBlogPost, '_id'>, Document {}

const blogPostSchema = new Schema<IBlogPostDocument>({
  title: {
    type: String,
    required: [true, 'Post title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: [true, 'Post slug is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  excerpt: {
    type: String,
    maxlength: [500, 'Excerpt cannot exceed 500 characters'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Post content is required']
  },
  image: {
    type: String
  },
  authorId: {
    type: Schema.Types.ObjectId as any,
    ref: 'User',
    required: [true, 'Author ID is required']
  },
  authorName: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
    index: true
  },
  publishedAt: {
    type: Date
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  seo: {
    title: {
      type: String,
      maxlength: [60, 'SEO title cannot exceed 60 characters']
    },
    description: {
      type: String,
      maxlength: [160, 'SEO description cannot exceed 160 characters']
    },
    keywords: [{
      type: String,
      trim: true
    }]
  },
  stats: {
    views: {
      type: Number,
      default: 0,
      min: 0
    },
    likes: {
      type: Number,
      default: 0,
      min: 0
    },
    shares: {
      type: Number,
      default: 0,
      min: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
blogPostSchema.index({ slug: 1 }, { unique: true });
blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ category: 1, status: 1 });
blogPostSchema.index({ isFeatured: 1, status: 1, publishedAt: -1 });
blogPostSchema.index({ authorId: 1 });
blogPostSchema.index({ tags: 1 });
blogPostSchema.index({ title: 'text', content: 'text', excerpt: 'text' });

// Pre-save middleware
blogPostSchema.pre('save', function(next) {
  try {
    // Generate slug if not provided
    if (!this.slug && this.title) {
      this.slug = this.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Set publishedAt when status changes to published
    if (this.status === 'published' && !this.publishedAt) {
      this.publishedAt = new Date();
    }

    next();
  } catch (error) {
    console.error('Error in BlogPost pre-save middleware:', error);
    next(error as Error);
  }
});

const BlogPost = mongoose.model<IBlogPostDocument>('BlogPost', blogPostSchema);
export default BlogPost;

