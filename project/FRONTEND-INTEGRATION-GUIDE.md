# Frontend Integration Guide
## Next.js App ↔ Vitrine Marketplace API

This guide provides step-by-step instructions to integrate your Next.js frontend with the Vitrine Marketplace API. The integration is organized into phases for easy progress tracking.

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Phase 1: Project Setup & Environment](#phase-1-project-setup--environment)
- [Phase 2: Authentication System](#phase-2-authentication-system)
- [Phase 3: Product Catalog & Categories](#phase-3-product-catalog--categories)
- [Phase 4: Shopping Cart & Wishlist](#phase-4-shopping-cart--wishlist)
- [Phase 5: Order Management](#phase-5-order-management)
- [Phase 6: Payment Integration](#phase-6-payment-integration)
- [Phase 7: Reviews & Ratings](#phase-7-reviews--ratings)
- [Phase 8: Advanced Features](#phase-8-advanced-features)
- [Affiliate Feature Guide](#affiliate-feature-guide)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Next.js 13+ with App Router
- TypeScript
- Tailwind CSS (recommended)
- Axios or Fetch API
- React Query or SWR (for data fetching)

---

## Phase 1: Project Setup & Environment

### 1.1 Install Dependencies

```bash
npm install axios @tanstack/react-query
npm install @types/node
```

### 1.2 Environment Configuration

Create `.env.local` in your Next.js project:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3002/api/v1
NEXT_PUBLIC_API_URL=http://localhost:3002

# Stripe Configuration (for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# App Configuration
NEXT_PUBLIC_APP_NAME=Vitrine Marketplace
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 1.3 API Client Setup

Create `lib/api-client.ts`:

```typescript
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002/api/v1';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 1.4 Type Definitions

Create `types/api.ts`:

```typescript
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

// Product Types
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  stock: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  status: 'draft' | 'active' | 'inactive';
  specifications?: Record<string, any>;
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
```

---

## Phase 2: Authentication System

### 2.1 Auth Context Setup

Create `contexts/AuthContext.tsx`:

```typescript
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types/api';
import apiClient from '@/lib/api-client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await apiClient.get('/auth/me');
      setUser(response.data.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      localStorage.removeItem('authToken');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data.data;
      
      localStorage.setItem('authToken', newToken);
      setToken(newToken);
      setUser(userData);
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      const { token: newToken, user: newUser } = response.data.data;
      
      localStorage.setItem('authToken', newToken);
      setToken(newToken);
      setUser(newUser);
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### 2.2 Auth Hooks

Create `hooks/useAuth.ts`:

```typescript
import { useAuth as useAuthContext } from '@/contexts/AuthContext';

export const useAuth = () => {
  return useAuthContext();
};

export const useRequireAuth = () => {
  const { user, loading } = useAuth();
  
  if (loading) return { loading: true };
  if (!user) {
    // Redirect to login or show login modal
    return { loading: false, requiresAuth: true };
  }
  
  return { loading: false, requiresAuth: false, user };
};
```

### 2.3 Login/Register Components

Create `components/auth/LoginForm.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      // Redirect or close modal
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
```

---

## Phase 3: Product Catalog & Categories

### 3.1 Product Hooks

Create `hooks/useProducts.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Product, PaginatedResponse } from '@/types/api';

export const useProducts = (filters?: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  status?: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
}) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const response = await apiClient.get('/products', { params: filters });
      return response.data as PaginatedResponse<Product>;
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await apiClient.get(`/products/${id}`);
      return response.data.data as Product;
    },
    enabled: !!id,
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const response = await apiClient.get('/products/featured');
      return response.data.data as Product[];
    },
  });
};

export const useBestSellers = () => {
  return useQuery({
    queryKey: ['products', 'best-sellers'],
    queryFn: async () => {
      const response = await apiClient.get('/products/best-sellers');
      return response.data.data as Product[];
    },
  });
};

export const useNewArrivals = () => {
  return useQuery({
    queryKey: ['products', 'new-arrivals'],
    queryFn: async () => {
      const response = await apiClient.get('/products/new-arrivals');
      return response.data.data as Product[];
    },
  });
};

export const useSearchProducts = (query: string) => {
  return useQuery({
    queryKey: ['products', 'search', query],
    queryFn: async () => {
      const response = await apiClient.get('/products/search', {
        params: { q: query }
      });
      return response.data.data as Product[];
    },
    enabled: !!query && query.length > 2,
  });
};
```

### 3.2 Category Hooks

Create `hooks/useCategories.ts`:

```typescript
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

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

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await apiClient.get('/categories');
      return response.data.data as Category[];
    },
  });
};

export const useCategoryProducts = (categoryId: string) => {
  return useQuery({
    queryKey: ['products', 'category', categoryId],
    queryFn: async () => {
      const response = await apiClient.get(`/products/category/${categoryId}`);
      return response.data.data as Product[];
    },
    enabled: !!categoryId,
  });
};
```

### 3.3 Product Components

Create `components/products/ProductCard.tsx`:

```typescript
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/api';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/products/${product._id}`}>
        <div className="relative">
          <Image
            src={product.images[0] || '/placeholder.jpg'}
            alt={product.name}
            width={300}
            height={200}
            className="w-full h-48 object-cover"
          />
          {discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
              -{discountPercentage}%
            </div>
          )}
          {product.isNewArrival && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-sm">
              New
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/products/${product._id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-blue-600">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Stock: {product.stock}
          </span>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## Phase 4: Shopping Cart & Wishlist

### 4.1 Cart Hooks

Create `hooks/useCart.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Cart, CartItem } from '@/types/api';

export const useCart = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await apiClient.get('/cart');
      return response.data.data as Cart;
    },
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      const response = await apiClient.post('/cart/add', { productId, quantity });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      const response = await apiClient.put('/cart/update', { productId, quantity });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await apiClient.delete('/cart/remove', {
        data: { productId }
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.delete('/cart/clear');
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};
```

### 4.2 Wishlist Hooks

Create `hooks/useWishlist.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Product } from '@/types/api';

export interface WishlistItem {
  _id: string;
  product: Product;
  addedAt: string;
  notes?: string;
}

export const useWishlist = () => {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const response = await apiClient.get('/wishlist');
      return response.data.data as WishlistItem[];
    },
  });
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await apiClient.post('/wishlist/add', { productId });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await apiClient.delete(`/wishlist/remove/${productId}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
};

export const useCheckWishlistStatus = (productId: string) => {
  return useQuery({
    queryKey: ['wishlist', 'check', productId],
    queryFn: async () => {
      const response = await apiClient.get(`/wishlist/check/${productId}`);
      return response.data.data.isInWishlist as boolean;
    },
    enabled: !!productId,
  });
};
```

### 4.3 Cart Component

Create `components/cart/CartSidebar.tsx`:

```typescript
'use client';

import { useCart, useUpdateCartItem, useRemoveFromCart } from '@/hooks/useCart';
import { useAddToWishlist } from '@/hooks/useWishlist';
import Image from 'next/image';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { data: cart, isLoading } = useCart();
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();
  const addToWishlist = useAddToWishlist();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart.mutate(productId);
    } else {
      updateCartItem.mutate({ productId, quantity: newQuantity });
    }
  };

  const handleMoveToWishlist = (productId: string) => {
    addToWishlist.mutate(productId);
    removeFromCart.mutate(productId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Shopping Cart</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto h-full">
          {isLoading ? (
            <div>Loading...</div>
          ) : cart?.items?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart?.items?.map((item) => (
                <div key={item._id} className="flex items-center space-x-4 border-b pb-4">
                  <Image
                    src={item.product.images[0] || '/placeholder.jpg'}
                    alt={item.product.name}
                    width={60}
                    height={60}
                    className="rounded"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-gray-600">${item.product.price}</p>
                    
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full border flex items-center justify-center"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full border flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => removeFromCart.mutate(item.product._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                    <button
                      onClick={() => handleMoveToWishlist(item.product._id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Save for later
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {cart && cart.items.length > 0 && (
          <div className="border-t p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Total: ${cart.totalPrice}</span>
            </div>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## Phase 5: Order Management

### 5.1 Order Hooks

Create `hooks/useOrders.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Order } from '@/types/api';

export const useUserOrders = () => {
  return useQuery({
    queryKey: ['orders', 'user'],
    queryFn: async () => {
      const response = await apiClient.get('/orders/my-orders');
      return response.data.data as Order[];
    },
  });
};

export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const response = await apiClient.get(`/orders/${orderId}`);
      return response.data.data as Order;
    },
    enabled: !!orderId,
  });
};

export const useCreateOrderFromCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderData: {
      shippingAddress: any;
      billingAddress: any;
      paymentMethod: string;
    }) => {
      const response = await apiClient.post('/orders/create-from-cart', orderData);
      return response.data.data as Order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await apiClient.post(`/orders/${orderId}/cancel`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
```

### 5.2 Order Components

Create `components/orders/OrderCard.tsx`:

```typescript
'use client';

import { Order } from '@/types/api';
import { useCancelOrder } from '@/hooks/useOrders';

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const cancelOrder = useCancelOrder();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCancelOrder = () => {
    if (confirm('Are you sure you want to cancel this order?')) {
      cancelOrder.mutate(order._id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">Order #{order.orderNumber}</h3>
          <p className="text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
          {order.orderStatus}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <p><span className="font-medium">Total:</span> ${order.totalAmount}</p>
        <p><span className="font-medium">Payment Status:</span> {order.paymentStatus}</p>
        <p><span className="font-medium">Items:</span> {order.items.length}</p>
      </div>
      
      <div className="flex space-x-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          View Details
        </button>
        {order.orderStatus === 'pending' && (
          <button
            onClick={handleCancelOrder}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
}
```

---

## Phase 6: Payment Integration

### 6.1 Payment Hooks

Create `hooks/usePayments.ts`:

```typescript
import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export const useCreatePaymentIntent = () => {
  return useMutation({
    mutationFn: async (paymentData: {
      amount: number;
      currency: string;
      orderId: string;
    }) => {
      const response = await apiClient.post('/payments/create-intent', paymentData);
      return response.data.data;
    },
  });
};

export const useConfirmPayment = () => {
  return useMutation({
    mutationFn: async (paymentData: {
      paymentIntentId: string;
      orderId: string;
    }) => {
      const response = await apiClient.post('/payments/confirm', paymentData);
      return response.data.data;
    },
  });
};

export const useCreateManualPayment = () => {
  return useMutation({
    mutationFn: async (paymentData: {
      orderId: string;
      paymentMethod: string;
      amount: number;
      reference?: string;
    }) => {
      const response = await apiClient.post('/payments/manual', paymentData);
      return response.data.data;
    },
  });
};
```

### 6.2 Stripe Integration

Create `components/payments/StripeCheckout.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCreatePaymentIntent, useConfirmPayment } from '@/hooks/usePayments';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeCheckoutProps {
  orderId: string;
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

function CheckoutForm({ orderId, amount, onSuccess, onError }: StripeCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  
  const createPaymentIntent = useCreatePaymentIntent();
  const confirmPayment = useConfirmPayment();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      onError('Stripe not loaded');
      return;
    }

    try {
      // Create payment intent
      const { clientSecret } = await createPaymentIntent.mutateAsync({
        amount: amount * 100, // Convert to cents
        currency: 'usd',
        orderId,
      });

      // Confirm payment
      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (error) {
        onError(error.message || 'Payment failed');
      } else {
        // Confirm payment on backend
        await confirmPayment.mutateAsync({
          paymentIntentId: clientSecret,
          orderId,
        });
        onSuccess();
      }
    } catch (error) {
      onError('Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border rounded-md p-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>
      
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Pay $${amount}`}
      </button>
    </form>
  );
}

export default function StripeCheckout({ orderId, amount, onSuccess, onError }: StripeCheckoutProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        orderId={orderId}
        amount={amount}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
}
```

---

## Phase 7: Reviews & Ratings

### 7.1 Review Hooks

Create `hooks/useReviews.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

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

export const useProductReviews = (productId: string) => {
  return useQuery({
    queryKey: ['reviews', 'product', productId],
    queryFn: async () => {
      const response = await apiClient.get(`/reviews/product/${productId}`);
      return response.data.data as Review[];
    },
    enabled: !!productId,
  });
};

export const useReviewStatistics = (productId: string) => {
  return useQuery({
    queryKey: ['reviews', 'statistics', productId],
    queryFn: async () => {
      const response = await apiClient.get(`/reviews/product/${productId}/statistics`);
      return response.data.data;
    },
    enabled: !!productId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (reviewData: {
      productId: string;
      orderId: string;
      rating: number;
      title: string;
      content: string;
    }) => {
      const response = await apiClient.post('/reviews', reviewData);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'product', data.product] });
    },
  });
};

export const useMarkReviewHelpful = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (reviewId: string) => {
      const response = await apiClient.post(`/reviews/${reviewId}/helpful`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};
```

### 7.2 Review Components

Create `components/reviews/ReviewForm.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useCreateReview } from '@/hooks/useReviews';

interface ReviewFormProps {
  productId: string;
  orderId: string;
  onSuccess: () => void;
}

export default function ReviewForm({ productId, orderId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  
  const createReview = useCreateReview();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createReview.mutateAsync({
        productId,
        orderId,
        rating,
        title,
        content,
      });
      onSuccess();
    } catch (error) {
      console.error('Failed to create review:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Rating</label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-2xl ${
                star <= rating ? 'text-yellow-400' : 'text-gray-300'
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Review Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-2">
          Review Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={4}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading || rating === 0}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
```

---

## Phase 8: Advanced Features

### 8.1 Email Integration

Create `hooks/useEmail.ts`:

```typescript
import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export const useSendEmail = () => {
  return useMutation({
    mutationFn: async (emailData: {
      to: string;
      subject: string;
      template: string;
      data: any;
    }) => {
      const response = await apiClient.post('/email/send', emailData);
      return response.data.data;
    },
  });
};

export const useSubscribeNewsletter = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await apiClient.post('/email/subscribe', { email });
      return response.data.data;
    },
  });
};
```

### 8.2 iMali Payment Integration

Create `hooks/useImali.ts`:

```typescript
import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export const useGenerateTransaction = () => {
  return useMutation({
    mutationFn: async (transactionData: {
      amount: number;
      orderId: string;
      customerPhone: string;
    }) => {
      const response = await apiClient.post('/imali/generate-transaction', transactionData);
      return response.data.data;
    },
  });
};

export const useCheckTransactionStatus = (transactionId: string) => {
  return useQuery({
    queryKey: ['imali', 'transaction', transactionId],
    queryFn: async () => {
      const response = await apiClient.get(`/imali/check-transaction/${transactionId}`);
      return response.data.data;
    },
    enabled: !!transactionId,
    refetchInterval: 5000, // Check every 5 seconds
  });
};
```

---

## Affiliate Feature Guide

Affiliate integration has a dedicated document:

- `project/AFFILIATE-FRONTEND-INTEGRATION.md`
- `project/AFFILIATE-CREATION-FRONTEND-INTEGRATION.md` (apply + admin create flows)

Use it together with this main guide:

- This file (`FRONTEND-INTEGRATION-GUIDE.md`) for app-wide patterns and shared setup
- `AFFILIATE-FRONTEND-INTEGRATION.md` for affiliate-specific routes, APIs, hooks, and rollout
- `AFFILIATE-CREATION-FRONTEND-INTEGRATION.md` for affiliate creation forms and payload contracts

---

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure your API has the correct CORS configuration
   - Add your frontend URL to `CORS_ORIGIN` in API environment

2. **Authentication Issues**
   - Check if JWT token is being sent correctly
   - Verify token expiration handling
   - Ensure proper error handling for 401 responses

3. **API Connection Issues**
   - Verify API base URL in environment variables
   - Check if API server is running
   - Test API endpoints with tools like Postman

4. **TypeScript Errors**
   - Ensure all types are properly imported
   - Check API response structure matches types
   - Update types if API responses change

### Testing Your Integration

1. **Test Authentication Flow**
   ```bash
   # Test login
   curl -X POST http://localhost:3002/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password"}'
   ```

2. **Test Product Fetching**
   ```bash
   # Test products endpoint
   curl http://localhost:3002/api/v1/products
   ```

3. **Test Cart Operations**
   ```bash
   # Test cart (requires authentication)
   curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3002/api/v1/cart
   ```

### Performance Optimization

1. **Implement Caching**
   - Use React Query's caching features
   - Implement proper cache invalidation
   - Use stale-while-revalidate patterns

2. **Optimize API Calls**
   - Batch related requests
   - Use pagination for large datasets
   - Implement request debouncing for search

3. **Error Handling**
   - Implement global error boundaries
   - Add retry logic for failed requests
   - Provide user-friendly error messages

---

## Next Steps

1. **Complete Phase 1-2** for basic authentication
2. **Implement Phase 3** for product catalog
3. **Add Phase 4** for cart functionality
4. **Integrate Phase 5-6** for orders and payments
5. **Add Phase 7** for reviews
6. **Implement Phase 8** for advanced features

Each phase builds upon the previous ones, so complete them in order for the best results.

---

## Support

For issues or questions:
1. Check the API documentation
2. Review the troubleshooting section
3. Test API endpoints directly
4. Check browser network tab for request/response details
