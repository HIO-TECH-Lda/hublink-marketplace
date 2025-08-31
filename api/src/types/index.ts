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

// Cart Types
export interface ICartItem {
  productId: string;
  productName: string;
  productImage: string;
  productSlug: string;
  sellerId: string;
  sellerName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  variantId?: string;
  variantName?: string;
  variantValue?: string;
  variantPrice?: number;
  isAvailable: boolean;
  stockAvailable: number;
  addedAt: Date;
}

export interface ICart {
  _id?: string;
  userId: string;
  items: ICartItem[];
  totalItems: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Order Types
export interface IOrderItem {
  productId: string;
  productName: string;
  productImage: string;
  productSlug: string;
  sellerId: string;
  sellerName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  variantId?: string;
  variantName?: string;
  variantValue?: string;
  variantPrice?: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  trackingNumber?: string;
  shippedAt?: Date;
  deliveredAt?: Date;
}

export interface IOrderAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault: boolean;
}

export interface IOrderPayment {
  method: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer' | 'cash_on_delivery';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  amount: number;
  currency: string;
  paidAt?: Date;
  refundedAt?: Date;
  refundAmount?: number;
  paymentDetails?: {
    cardLast4?: string;
    cardBrand?: string;
    paypalEmail?: string;
  };
}

export interface IOrder {
  _id?: string;
  orderNumber: string;
  userId: string;
  items: IOrderItem[];
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  shippingAddress: IOrderAddress;
  billingAddress: IOrderAddress;
  payment: IOrderPayment;
  notes?: string;
  estimatedDelivery?: Date;
  confirmedAt?: Date;
  processedAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  cancelledBy?: string;
  cancelReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Payment Types
export interface IPayment {
  _id?: string;
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  method: 'stripe' | 'paypal' | 'bank_transfer' | 'cash_on_delivery' | 'm_pesa' | 'e_mola';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  gateway: 'stripe' | 'paypal' | 'manual' | 'm_pesa' | 'e_mola';
  gatewayTransactionId?: string;
  gatewayResponse?: any;
  refundAmount?: number;
  refundReason?: string;
  refundedAt?: Date;
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
  content: string;
  images?: string[];
  isVerified: boolean;
  isHelpful: number;
  isNotHelpful: number;
  status: 'pending' | 'approved' | 'rejected';
  moderatorNotes?: string;
  moderatedBy?: string;
  moderatedAt?: Date;
  helpfulnessRatio?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Wishlist Types
export interface IWishlistItem {
  productId: string;
  addedAt: Date;
  notes?: string;
}

export interface IWishlist {
  _id?: string;
  userId: string;
  items: IWishlistItem[];
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
  body: any;
  params: any;
  query: any;
}
