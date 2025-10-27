// User Types
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'seller' | 'admin';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
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
  product: Product;
  quantity: number;
  price: number;
}

export interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  address: string;
  country: string;
  state: string;
  zipCode: string;
  email: string;
  phone: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  shippingCost: number;
  taxAmount: number;
  createdAt: string;
  updatedAt: string;
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
