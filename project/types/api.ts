// User Types
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'buyer' | 'seller' | 'admin' | 'support';
  status: 'active' | 'inactive' | 'suspended';
  emailVerified: boolean;
  phoneVerified: boolean;
  avatar?: string;
  sellerId?: string;
  preferences: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    language: string;
    currency: string;
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
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  amount: number;
  currency: string;
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
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
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
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  product: string;
  order: string;
  rating: number;
  title: string;
  content: string;
  isVerified: boolean;
  isHelpful: number;
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
  password: string;
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
