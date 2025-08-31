import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory {
  _id?: string;
  name: string;
  description?: string;
  slug: string;
  parentId?: string;
  level: number;
  path: string[];
  image?: string;
  icon?: string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICategoryDocument extends Omit<ICategory, '_id'>, Document {
  // Virtual properties
  fullPath: string;
  productCount: number;
  hasChildren: boolean;
  
  // Instance methods
  getAncestors(): Promise<ICategoryDocument[]>;
  getDescendants(): Promise<ICategoryDocument[]>;
}

// Static methods interface
export interface ICategoryModel extends mongoose.Model<ICategoryDocument> {
  findRoots(): Promise<ICategoryDocument[]>;
  findChildren(parentId: string): Promise<ICategoryDocument[]>;
  findFeatured(): Promise<ICategoryDocument[]>;
  buildTree(): Promise<any[]>;
}

const categorySchema = new Schema<ICategoryDocument>({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [100, 'Category name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Category description cannot exceed 500 characters']
  },
  slug: {
    type: String,
    required: [true, 'Category slug is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  parentId: {
    type: Schema.Types.ObjectId as any,
    ref: 'Category',
    default: null
  },
  level: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  path: [{
    type: Schema.Types.ObjectId as any,
    ref: 'Category'
  }],
  image: {
    type: String
  },
  icon: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  metaTitle: {
    type: String,
    maxlength: [60, 'Meta title cannot exceed 60 characters']
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description cannot exceed 160 characters']
  },
  keywords: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full path
categorySchema.virtual('fullPath').get(function() {
  return this.path.map((id: any) => id.name).join(' > ') + ' > ' + this.name;
});

// Virtual for product count (will be populated)
categorySchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'categoryId',
  count: true
});

// Virtual for checking if category has children
categorySchema.virtual('hasChildren', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentId',
  count: true
});

// Indexes for performance
categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ parentId: 1 });
categorySchema.index({ level: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ isFeatured: 1 });
categorySchema.index({ sortOrder: 1 });
categorySchema.index({ name: 'text', description: 'text' });

// Compound indexes
categorySchema.index({ parentId: 1, isActive: 1 });
categorySchema.index({ level: 1, isActive: 1 });

// Pre-save middleware
categorySchema.pre('save', async function(next) {
  // Generate slug if not provided
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // Set level based on parent
  if (this.parentId) {
    const parent = await mongoose.model('Category').findById(this.parentId);
    if (parent) {
      this.level = parent.level + 1;
      this.path = [...parent.path, parent._id];
    }
  } else {
    this.level = 0;
    this.path = [];
  }

  next();
});

// Static method to find root categories
categorySchema.statics.findRoots = function() {
  return this.find({ parentId: null, isActive: true }).sort({ sortOrder: 1 });
};

// Static method to find children of a category
categorySchema.statics.findChildren = function(parentId: string) {
  return this.find({ parentId, isActive: true }).sort({ sortOrder: 1 });
};

// Static method to find featured categories
categorySchema.statics.findFeatured = function() {
  return this.find({ isActive: true, isFeatured: true }).sort({ sortOrder: 1 });
};

// Static method to build category tree
categorySchema.statics.buildTree = async function() {
  const categories = await this.find({ isActive: true }).sort({ sortOrder: 1 });
  
  const buildTreeRecursive = (parentId: string | null) => {
    return categories
      .filter((cat: any) => (parentId === null && !cat.parentId) || cat.parentId?.toString() === parentId)
      .map((cat: any) => ({
        ...cat.toObject(),
        children: buildTreeRecursive(cat._id.toString())
      }));
  };

  return buildTreeRecursive(null);
};

// Instance method to get all descendants
categorySchema.methods.getDescendants = async function(this: ICategoryDocument) {
  const descendants = [];
  const children = await mongoose.model('Category').find({ parentId: this._id, isActive: true });
  
  for (const child of children) {
    descendants.push(child);
    const childDescendants = await child.getDescendants();
    descendants.push(...childDescendants);
  }
  
  return descendants;
};

// Instance method to get all ancestors
categorySchema.methods.getAncestors = async function(this: ICategoryDocument) {
  const ancestors = [];
  let current = this;
  
  while (current.parentId) {
    const parent = await mongoose.model('Category').findById(current.parentId);
    if (parent) {
      ancestors.unshift(parent);
      current = parent;
    } else {
      break;
    }
  }
  
  return ancestors;
};



const Category = mongoose.model<ICategoryDocument, ICategoryModel>('Category', categorySchema);
export default Category;
