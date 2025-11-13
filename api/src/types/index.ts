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
  sellerProfile?: ISellerProfile;
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

// Seller profile information stored on User when role is 'seller'
export interface ISellerProfile {
  storeName: string;
  storeDescription: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  productTypes: string;
  experience?: string;
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
  publicId?: string;
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
  method: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer' | 'cash_on_delivery' | 'mpesa' | 'emola' | 'imali';
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
    imaliLinkId?: string;
    mPesaPhoneNumber?: string;
    eMolaPhoneNumber?: string;
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
  method: 'stripe' | 'paypal' | 'bank_transfer' | 'cash_on_delivery' | 'mpesa' | 'emola' | 'imali';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  gateway: 'stripe' | 'paypal' | 'manual' | 'mpesa' | 'emola' | 'imali';
  gatewayTransactionId?: string;
  gatewayResponse?: any;
  refundAmount?: number;
  refundReason?: string;
  refundedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Payout Types
export interface IPayout {
  _id?: string;
  sellerId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  method: 'mpesa' | 'bank_transfer' | 'emola';
  periodStart: Date;
  periodEnd: Date;
  orderIds: string[];
  commissionRate?: number;
  commissionAmount?: number;
  netAmount: number;
  processedAt?: Date;
  failureReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Refund Types
export interface IRefund {
  _id?: string;
  orderId: string;
  orderItemId?: string;
  sellerId: string;
  buyerId: string;
  productId: string;
  productName: string;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  description: string;
  images?: string[];
  requestedAt?: Date;
  processedAt?: Date;
  processedBy?: string;
  rejectionReason?: string;
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
export type TicketCategory = 
  | 'technical_issue' 
  | 'payment_problem' 
  | 'order_issue' 
  | 'return_request' 
  | 'account_issue' 
  | 'product_issue' 
  | 'shipping_problem' 
  | 'general_inquiry' 
  | 'feature_request' 
  | 'bug_report';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TicketStatus = 
  | 'open' 
  | 'in_progress' 
  | 'waiting_for_user' 
  | 'waiting_for_third_party' 
  | 'resolved' 
  | 'closed';

export interface ITicketAttachment {
  _id?: string;
  ticketId: string;
  messageId?: string;
  fileName: string;
  fileUrl: string;
  publicId?: string;
  fileSize: number;
  mimeType: string;
  uploadedAt?: Date;
}

export interface ITicketMessage {
  _id?: string;
  ticketId: string;
  userId: string;
  userType: 'buyer' | 'seller' | 'admin' | 'support';
  message: string;
  isInternal: boolean;
  attachments?: ITicketAttachment[];
  createdAt?: Date;
}

export interface ITicket {
  _id?: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  userId: string;
  userType: 'buyer' | 'seller' | 'admin';
  assignedTo?: string;
  orderId?: string;
  productId?: string;
  tags: string[];
  attachments: ITicketAttachment[];
  messages: ITicketMessage[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Finance Types
export type FinanceType = 'income' | 'expense';
export type FinanceSource = 'marketplace' | 'manual' | 'other';
export type PaymentMethod = 'cash' | 'mpesa' | 'bank_transfer' | 'emola' | 'other';
export type RecurringFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type ReportType = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

export interface IFinanceAttachment {
  _id?: string;
  fileName: string;
  fileUrl: string;
  publicId?: string;
  fileSize: number;
  mimeType: string;
  uploadedAt?: Date;
}

export interface IRecurringConfig {
  frequency: RecurringFrequency;
  endDate?: Date;
  nextDueDate?: Date;
}

export interface ISellerFinance {
  _id?: string;
  sellerId: string;
  type: FinanceType;
  source: FinanceSource;
  orderId?: string;
  amount: number;
  currency: string;
  category?: string;
  vendor?: string;
  description: string;
  date: Date;
  paymentMethod: PaymentMethod;
  attachments: IFinanceAttachment[];
  customerName?: string;
  isRecurring: boolean;
  recurringConfig?: IRecurringConfig;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface IExpenseCategory {
  _id?: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
  isDefault: boolean;
  sellerId?: string;
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
