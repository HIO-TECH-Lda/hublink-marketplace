// User Types
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'buyer' | 'seller' | 'admin' | 'support' | 'affiliate';
  status: 'active' | 'inactive' | 'suspended';
  emailVerified: boolean;
  phoneVerified: boolean;
  avatar?: string;
  profileImage?: string;
  sellerId?: string;
  billingAddress?: {
    street?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    zipCode?: string;
    country?: string;
    isDefault?: boolean;
  };
  shippingAddress?: {
    street?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    zipCode?: string;
    country?: string;
    isDefault?: boolean;
  };
  preferences?: {
    notifications?: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
    };
    language?: string;
    currency?: string;
  };
  sellerProfile?: {
    storeName?: string;
    storeDescription?: string;
    address?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    productTypes?: string;
    experience?: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
  fullName: string;
  id: string;
}

// Product Image Types
export interface ProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

// Product Types
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: ProductImage[] | string[];
  primaryImage?: string;
  category: string;
  categoryId?: { _id: string; name: string; slug: string };
  stock: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  status: 'draft' | 'active' | 'inactive';
  specifications?: Record<string, any>;
  // Rating fields
  rating?: number;
  averageRating?: number;
  reviews?: number;
  totalReviews?: number;
  // Seller fields
  sellerId?: string | { _id: string; firstName: string; lastName: string; fullName: string };
  sellerName?: string;
  sellerLogo?: string;
  // Additional fields
  brand?: string;
  tags?: string[];
  sku?: string;
  weight?: string;
  color?: string;
  stockStatus?: string;
  type?: string;
  inStock?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Cart Types
export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

// Order Types
export interface OrderItem {
  _id: string;
  productId?: {
    _id: string;
    name: string;
    primaryImage?: string;
    price: number;
  };
  product?: {
    _id: string;
    name: string;
    primaryImage?: string;
    price: number;
  };
  productName?: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  price?: number;
  sellerName?: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  address: string;
  city: string;
  country: string;
  state: string;
  zipCode: string;
  email: string;
  phone: string;
}

export interface Payment {
  method: string;
  status: 'pending' | 'paid' | 'completed' | 'failed' | 'refunded';
  amount: number;
  currency: string;
  transactionId?: string;
}

export interface RefundParticipant {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  fullName?: string;
  id?: string;
}

export interface RefundProduct {
  _id: string;
  name: string;
  primaryImage?: string;
  productImage?: string;
  calculatedDiscountPercentage?: number;
  inStock?: boolean;
  hasActiveDiscount?: boolean;
  id?: string;
}

export interface Refund {
  _id: string;
  orderId: string | { _id: string; orderNumber?: string; createdAt?: string; total?: number };
  orderItemId?: string | { _id: string };
  sellerId?: string | RefundParticipant;
  buyerId?: string | RefundParticipant;
  productId: string | RefundProduct;
  productName: string;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  description: string;
  images?: string[];
  requestedAt: string;
  processedAt?: string;
  processedBy?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReturnRequest {
  _id: string;
  orderId: string;
  items: string[];
  reason: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
}

export interface Order {
  _id: string;
  id?: string;
  orderNumber: string;
  user: string | {
    _id: string;
    firstName: string;
    lastName: string;
    fullName: string;
  };
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  payment: Payment;
  paymentMethod?: string;
  paymentStatus?: 'pending' | 'paid' | 'completed' | 'failed' | 'refunded';
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  orderStatus?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  total?: number;
  subtotal: number;
  shipping: number;
  shippingCost?: number;
  tax: number;
  taxAmount?: number;
  discount: number;
  notes?: string;
  currency: string;
  returnRequest?: ReturnRequest;
  refunds?: Refund[];
  itemCount?: number;
  isPending?: boolean;
  isConfirmed?: boolean;
  isProcessing?: boolean;
  isShipped?: boolean;
  isDelivered?: boolean;
  isCancelled?: boolean;
  isRefunded?: boolean;
  canCancel?: boolean;
  canRefund?: boolean;
  createdAt: string;
  updatedAt: string;
  date?: string;
}

// Category Types
export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: string;
  children?: Category[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Review Types
export interface Review {
  _id: string;
  productId: string | { _id: string; name: string };
  orderId: string | { _id: string; orderNumber?: string };
  userId:
    | string
    | {
        _id: string;
        firstName: string;
        lastName: string;
        fullName?: string;
        avatar?: string;
      };
  rating: number;
  title: string;
  content: string;
  images?: string[];
  isVerified?: boolean;
  helpfulVotes?: number;
  notHelpfulVotes?: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

// Wishlist Types
export interface WishlistItem {
  _id: string;
  product: Product;
  addedAt: string;
  notes?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Auth Types
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword?: string;
  role?: 'buyer' | 'seller';
  sellerProfile?: {
    storeName: string;
    storeDescription: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    productTypes: string;
    experience?: string;
  };
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

// Payment Types
export interface PaymentIntent {
  clientSecret: string;
  amount: number;
  currency: string;
}

export interface ManualPaymentData {
  orderId: string;
  paymentMethod: string;
  amount: number;
  reference?: string;
}
