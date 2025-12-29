# Admin Pages Integration Guide

This document provides a comprehensive overview of how authentication, API integration, and authorization work across the application, and how to integrate admin pages following the same patterns.

## 📋 Table of Contents

1. [Authentication System](#authentication-system)
2. [API Integration Patterns](#api-integration-patterns)
3. [Authorization & Role-Based Access Control](#authorization--role-based-access-control)
4. [Current Implementation Patterns](#current-implementation-patterns)
5. [Admin Integration Requirements](#admin-integration-requirements)
6. [Step-by-Step Integration Guide](#step-by-step-integration-guide)

---

## 🔐 Authentication System

### Core Components

#### 1. **AuthContext** (`contexts/AuthContext.tsx`)
- **Purpose**: Global authentication state management
- **Features**:
  - JWT token management (access + refresh tokens)
  - User profile state
  - Login, register, logout functions
  - Automatic token refresh
  - Role checking via `hasRole()` method

**Key Methods**:
```typescript
- login(email, password): Promise<void>
- register(userData): Promise<void>
- logout(): void
- refreshAuthToken(): Promise<boolean>
- hasRole(role: string | string[]): boolean
```

**State**:
```typescript
- user: User | null
- token: string | null
- refreshToken: string | null
- isAuthenticated: boolean
- loading: boolean
```

#### 2. **API Client** (`lib/api-client.ts`)
- **Purpose**: Axios instance with automatic token injection
- **Features**:
  - Request interceptor: Automatically adds `Authorization: Bearer <token>` header
  - Response interceptor: Handles 401 errors and token refresh
  - Automatic redirect to login on auth failure
  - Base URL configuration via `NEXT_PUBLIC_API_BASE_URL`

**Token Flow**:
1. Token stored in `localStorage` as `authToken` and `refreshToken`
2. Request interceptor reads token and adds to headers
3. On 401 response, attempts token refresh
4. If refresh fails, clears tokens and redirects to `/entrar`

#### 3. **Auth Hooks** (`hooks/useAuth.ts`)
- **`useAuth()`**: Access to auth context
- **`useRequireAuth()`**: Check if user is authenticated
- **`useRequireRole(roles)`**: Check if user has specific role(s)
- **`useRedirectIfAuthenticated(redirectTo)`**: Redirect if already logged in
- **`useRedirectIfNotAuthenticated(redirectTo)`**: Redirect if not logged in
- **`useRedirectIfNotRole(roles, redirectTo)`**: Redirect if doesn't have role

---

## 🌐 API Integration Patterns

### React Query Setup

The application uses **@tanstack/react-query** for data fetching and caching.

#### Pattern Structure

```typescript
// hooks/useProducts.ts (example)
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

// Query Hook (GET)
export const useProducts = (filters?: {...}) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const response = await apiClient.get('/products', { params: filters });
      return response.data.data as { products: Product[]; pagination: any };
    },
  });
};

// Mutation Hook (POST/PUT/DELETE)
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post('/products', data);
      return response.data.data as Product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
```

### Available Hooks

**Products** (`hooks/useProducts.ts`):
- `useProducts(filters)` - List products
- `useProduct(id)` - Get single product
- `useFeaturedProducts()` - Featured products
- `useBestSellers()` - Best sellers
- `useNewArrivals()` - New arrivals
- `useSearchProducts(query)` - Search products
- `useMyProducts()` - Seller's products
- `useCreateProduct()` - Create product
- `useUpdateProduct()` - Update product
- `useDeleteProduct()` - Delete product
- `useUpdateProductStatus()` - Update status
- `useUpdateProductStock()` - Update stock

**Orders** (`hooks/useOrders.ts`):
- `useUserOrders(params)` - Buyer's orders
- `useOrder(orderId)` - Get single order
- `useSellerOrders()` - Seller's orders
- `useCreateOrderFromCart()` - Create order
- `useCancelOrder()` - Cancel order
- `useOrderTracking(orderId)` - Track order

**Other Hooks**:
- `useCategories()` - Categories
- `useCart()` - Shopping cart
- `useWishlist()` - Wishlist
- `useReviews()` - Reviews
- `useTickets()` - Support tickets
- `useRefunds()` - Refunds
- `usePayouts()` - Payouts
- `useSellerFinances()` - Seller finances
- `useProfile()` - User profile

### API Response Structure

All API responses follow this structure:
```typescript
{
  success: boolean;
  data: T; // The actual data
  message?: string;
}
```

For paginated responses:
```typescript
{
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

## 🛡️ Authorization & Role-Based Access Control

### User Roles

Defined in `types/api.ts`:
```typescript
role: 'buyer' | 'seller' | 'admin' | 'support'
```

### Protection Patterns

#### 1. **Layout-Level Protection** (Recommended for route groups)

**Seller Layout** (`app/(seller)/layout.tsx`):
```typescript
export default function SellerGroupLayout({ children }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated || user?.role !== 'seller') {
    return <AccessDeniedScreen />;
  }

  return <>{children}</>;
}
```

**Buyer Layout** (`app/(buyer)/layout.tsx`):
```typescript
export default function BuyerLayout({ children }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated || !user) {
    return <AccessDeniedScreen />;
  }

  return <>{children}</>;
}
```

#### 2. **Page-Level Protection**

**Pattern 1: Inline Check**
```typescript
export default function ProtectedPage() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated || user?.role !== 'seller') {
    return <AccessDeniedScreen />;
  }

  // Page content
}
```

**Pattern 2: Using Hooks**
```typescript
export default function ProtectedPage() {
  useRedirectIfNotRole('admin', '/');
  
  // Page content (only renders if user has admin role)
}
```

#### 3. **Component-Level Protection**

**Using ProtectedRoute Component**:
```typescript
<ProtectedRoute allowedRoles={['admin']} redirectTo="/">
  <AdminContent />
</ProtectedRoute>
```

**Using RoleGuard Component**:
```typescript
<RoleGuard allowedRoles={['admin', 'support']}>
  <AdminOnlyContent />
</RoleGuard>
```

---

## 📁 Current Implementation Patterns

### Seller Pages Pattern

**Structure**:
```
app/(seller)/
  ├── layout.tsx          # Layout with seller role check
  └── vendedor/
      ├── painel/         # Dashboard
      ├── produtos/       # Products management
      ├── pedidos/        # Orders
      ├── financas/       # Finances
      └── ...
```

**Example** (`app/(seller)/vendedor/produtos/page.tsx`):
```typescript
export default function SellerProductsPage() {
  const { isAuthenticated, user } = useAuth();
  const { data: products } = useMyProducts(); // API hook

  if (!isAuthenticated || user?.role !== 'seller') {
    return <AccessDeniedScreen />;
  }

  // Use products data from API
  return <ProductsList products={products} />;
}
```

### Buyer Pages Pattern

**Structure**:
```
app/(buyer)/
  ├── layout.tsx          # Layout with auth check
  └── painel/             # Dashboard
  └── historico-pedidos/ # Order history
  └── ...
```

**Example** (`app/(buyer)/historico-pedidos/page.tsx`):
```typescript
export default function OrderHistoryPage() {
  const { data: orders, isLoading } = useUserOrders(); // API hook
  
  // Auth check handled by layout
  return <OrdersList orders={orders} loading={isLoading} />;
}
```

---

## 🎯 Admin Integration Requirements

### Current State

**Admin pages exist but are NOT integrated**:
- ✅ Pages created in `app/(admin)/admin/`
- ✅ AdminLayout component exists
- ❌ No authentication check
- ❌ No API integration (using mock data)
- ❌ No role-based protection

### What Needs to Be Done

1. **Create Admin Layout with Protection**
   - Create `app/(admin)/layout.tsx` with admin role check
   - Similar to seller/buyer layouts

2. **Create Admin API Hooks**
   - `hooks/useAdmin.ts` - Admin-specific queries
   - Admin endpoints: `/admin/users`, `/admin/products`, `/admin/orders`, etc.

3. **Update Admin Pages**
   - Replace mock data with API calls
   - Add loading states
   - Add error handling
   - Use React Query hooks

4. **Update AdminLayout Component**
   - Integrate with AuthContext
   - Show user info
   - Add logout functionality

---

## 📝 Step-by-Step Integration Guide

### Step 1: Create Admin Layout with Protection

**File**: `app/(admin)/layout.tsx`

```typescript
'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-gray-6">Verificando autenticação...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-9 mb-4">Acesso Negado</h1>
          <p className="text-gray-6 mb-8">Você precisa ser um administrador para acessar esta página.</p>
          <Link href="/entrar">
            <Button className="bg-primary hover:bg-primary-hard text-white">Fazer Login</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return <>{children}</>;
}
```

### Step 2: Create Admin API Hooks

**File**: `hooks/useAdmin.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { User, Product, Order } from '@/types/api';

// Admin Users
export const useAdminUsers = (params?: { page?: number; limit?: number; role?: string }) => {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: async () => {
      const response = await apiClient.get('/admin/users', { params });
      return response.data.data as { users: User[]; pagination: any };
    },
  });
};

export const useAdminUser = (userId: string) => {
  return useQuery({
    queryKey: ['admin', 'user', userId],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/users/${userId}`);
      return response.data.data.user as User;
    },
    enabled: !!userId,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: any }) => {
      const response = await apiClient.put(`/admin/users/${userId}`, data);
      return response.data.data.user as User;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
};

// Admin Products
export const useAdminProducts = (params?: { page?: number; limit?: number; status?: string }) => {
  return useQuery({
    queryKey: ['admin', 'products', params],
    queryFn: async () => {
      const response = await apiClient.get('/admin/products', { params });
      return response.data.data as { products: Product[]; pagination: any };
    },
  });
};

export const useUpdateProductStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productId, status }: { productId: string; status: string }) => {
      const response = await apiClient.patch(`/admin/products/${productId}/status`, { status });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
};

// Admin Orders
export const useAdminOrders = (params?: { page?: number; limit?: number; status?: string }) => {
  return useQuery({
    queryKey: ['admin', 'orders', params],
    queryFn: async () => {
      const response = await apiClient.get('/admin/orders', { params });
      return response.data.data as { orders: Order[]; pagination: any };
    },
  });
};

// Admin Dashboard Stats
export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/dashboard');
      return response.data.data;
    },
  });
};
```

### Step 3: Update AdminLayout Component

**File**: `components/layout/AdminLayout.tsx`

Add authentication integration:

```typescript
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth(); // Use AuthContext instead of MarketplaceContext
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout(); // Use AuthContext logout
    router.push('/');
  };

  // Uncomment and update user info section
  // Use user from AuthContext
}
```

### Step 4: Update Admin Pages

**Example**: `app/(admin)/admin/produtos/page.tsx`

Replace mock data with API:

```typescript
'use client';

import { useAdminProducts, useUpdateProductStatus } from '@/hooks/useAdmin';
import AdminLayout from '@/components/layout/AdminLayout';

export default function ProductManagementPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Replace mock data with API hook
  const { data, isLoading } = useAdminProducts({ 
    status: statusFilter !== 'all' ? statusFilter : undefined 
  });
  const updateStatus = useUpdateProductStatus();

  const products = data?.products || [];
  const pagination = data?.pagination;

  const handleUpdateStatus = async (productId: string, newStatus: string) => {
    try {
      await updateStatus.mutateAsync({ productId, status: newStatus });
      // Success handled by React Query cache invalidation
    } catch (error) {
      // Handle error
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <LoadingScreen />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Use products from API */}
      <ProductsTable products={products} onUpdateStatus={handleUpdateStatus} />
    </AdminLayout>
  );
}
```

### Step 5: Update Admin Dashboard

**File**: `app/(admin)/admin/page.tsx`

```typescript
'use client';

import { useAdminDashboard } from '@/hooks/useAdmin';
import AdminLayout from '@/components/layout/AdminLayout';

export default function AdminDashboard() {
  const { data: dashboard, isLoading } = useAdminDashboard();

  if (isLoading) {
    return (
      <AdminLayout>
        <LoadingScreen />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Use dashboard data from API */}
      <DashboardStats stats={dashboard?.stats} />
      <RecentActivity activities={dashboard?.recentActivity} />
    </AdminLayout>
  );
}
```

---

## 🔑 Key Points to Remember

1. **Always check authentication and role** at layout or page level
2. **Use React Query hooks** for all API calls
3. **Handle loading states** - show loading UI while fetching
4. **Handle errors** - use try/catch for mutations, error states for queries
5. **Invalidate queries** after mutations to refresh data
6. **Use TypeScript types** from `types/api.ts`
7. **Follow the same patterns** as seller/buyer pages for consistency

---

## 📚 API Endpoints Reference

Based on the API design, admin endpoints should follow this pattern:

```
GET    /admin/dashboard              # Dashboard stats
GET    /admin/users                   # List users
GET    /admin/users/:id               # Get user
PUT    /admin/users/:id               # Update user
GET    /admin/products                 # List all products
PATCH  /admin/products/:id/status     # Update product status
GET    /admin/orders                  # List all orders
GET    /admin/orders/:id               # Get order
PUT    /admin/orders/:id               # Update order
GET    /admin/sellers                  # List sellers
GET    /admin/sellers/:id              # Get seller
PUT    /admin/sellers/:id              # Update seller
GET    /admin/categories               # List categories
POST   /admin/categories               # Create category
PUT    /admin/categories/:id          # Update category
GET    /admin/tickets                  # List tickets
GET    /admin/tickets/:id              # Get ticket
PUT    /admin/tickets/:id              # Update ticket
GET    /admin/refunds                  # List refunds
PUT    /admin/refunds/:id              # Process refund
GET    /admin/reports                  # Generate reports
```

---

## ✅ Checklist for Each Admin Page

- [ ] Add authentication check (layout or page level)
- [ ] Create/use appropriate API hook
- [ ] Replace mock data with API data
- [ ] Add loading state handling
- [ ] Add error handling
- [ ] Use TypeScript types
- [ ] Invalidate queries after mutations
- [ ] Test with different user roles
- [ ] Test with unauthenticated users

---

This guide provides the foundation for integrating admin pages. Follow the same patterns used in seller and buyer pages for consistency and maintainability.

