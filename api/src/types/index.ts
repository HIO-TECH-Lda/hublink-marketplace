// User Types
export interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: 'buyer' | 'seller' | 'admin' | 'support';
  status: 'active' | 'inactive' | 'suspended';
  emailVerified: boolean;
  phoneVerified: boolean;
  avatar?: string;
  billingAddress?: IAddress;
  shippingAddress?: IAddress;
  preferences?: IUserPreferences;
  sellerId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface IUserPreferences {
  language: string;
  currency: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

// Seller Types
export interface ISeller {
  _id?: string;
  userId: string;
  businessName: string;
  businessDescription: string;
  contactInfo: {
    email: string;
    phone: string;
    website?: string;
  };
  address: IAddress;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  commissionRate: number;
  totalSales: number;
  rating: number;
  reviewCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Product Types
export interface IProductImage {
  url: string;
  alt?: string;
  isPrimary?: boolean;
  order?: number;
}

export interface IProductVariant {
  name: string;
  value: string;
  price: number;
  stock: number;
  sku?: string;
}

export interface IProductSpecification {
  name: string;
  value: string;
}

export interface IProductDimensions {
  length?: number;
  width?: number;
  height?: number;
}

export interface IProductLocation {
  city?: string;
  state?: string;
  country?: string;
}

export interface IProduct {
  _id?: string;
  name: string;
  description: string;
  shortDescription?: string;
  sellerId: string;
  sellerName: string;
  categoryId: string;
  subcategoryId?: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  discountStartDate?: Date;
  discountEndDate?: Date;
  stock: number;
  sku?: string;
  barcode?: string;
  images?: IProductImage[];
  primaryImage: string;
  variants?: IProductVariant[];
  specifications?: IProductSpecification[];
  weight?: number;
  dimensions?: IProductDimensions;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  slug?: string;
  status: 'draft' | 'active' | 'inactive' | 'archived';
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  shippingWeight?: number;
  shippingClass?: 'light' | 'standard' | 'heavy' | 'fragile';
  returnPolicy?: string;
  warranty?: string;
  viewCount?: number;
  purchaseCount?: number;
  averageRating?: number;
  totalReviews?: number;
  location?: IProductLocation;
  isLocalPickup?: boolean;
  isDelivery?: boolean;
  tags?: string[];
  labels?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Category Types
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

// Order Types
export interface IOrder {
  _id?: string;
  orderNumber: string;
  userId: string;
  sellerId: string;
  items: IOrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'm-pesa' | 'e-mola' | 'stripe' | 'cash';
  shippingAddress: IAddress;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

// Payment Types
export interface IPayment {
  _id?: string;
  orderId: string;
  userId: string;
  amount: number;
  method: 'm-pesa' | 'e-mola' | 'stripe' | 'cash';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  externalId?: string;
  transactionId?: string;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

// Review Types
export interface IReview {
  _id?: string;
  productId: string;
  userId: string;
  orderId: string;
  rating: number;
  title: string;
  comment: string;
  isVerified: boolean;
  status: 'pending' | 'approved' | 'rejected';
  moderatedBy?: string;
  moderatedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Ticket Types
export interface ITicket {
  _id?: string;
  title: string;
  description: string;
  category: 'technical_issue' | 'payment_problem' | 'order_issue' | 'return_request' | 'account_issue';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_for_user' | 'resolved' | 'closed';
  userId: string;
  userType: 'buyer' | 'seller' | 'admin';
  assignedTo?: string;
  orderId?: string;
  messages: ITicketMessage[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITicketMessage {
  userId: string;
  userType: 'buyer' | 'seller' | 'admin' | 'support';
  message: string;
  isInternal: boolean;
  attachments?: string[];
  createdAt?: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  sellerId?: string;
  iat?: number;
  exp?: number;
}

// Request with User
export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}
