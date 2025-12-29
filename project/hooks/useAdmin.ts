import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { User, Product, Order } from '@/types/api';

// ============================================
// Admin Dashboard
// ============================================

export interface AdminDashboardData {
  users: {
    total: number;
    changePercent: number;
    buyers: number;
    sellers: number;
    admins: number;
  };
  orders: {
    total: number;
    pending: number;
    confirmed: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    recent: number;
  };
  revenue: {
    total: number;
    changePercent: number;
    thisMonth: number;
  };
  products: {
    total: number;
    activeSellers: number;
    lowStock: number;
    outOfStock: number;
  };
  blogPosts: {
    total: number;
    published: number;
  };
  reviews: {
    averageRating: number;
    total: number;
    pending: number;
  };
  refunds: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  tickets: {
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
    urgent: number;
  };
  categories: {
    total: number;
  };
  payments: {
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  };
  recentActivity: any[];
}

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/dashboard');
      return response.data.data as AdminDashboardData;
    },
  });
};

// ============================================
// Admin Users Management
// ============================================

export const useAdminUserStats = () => {
  return useQuery({
    queryKey: ['admin', 'users', 'stats'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/users/stats');
      return response.data.data as {
        total: number;
        vendors: number;
        clients: number;
        active: number;
      };
    },
  });
};

export const useAdminUsers = (params?: {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: async () => {
      const response = await apiClient.get('/admin/users', { params });
      return response.data.data as {
        users: User[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    },
  });
};

export const useAdminUser = (userId: string) => {
  return useQuery({
    queryKey: ['admin', 'user', userId],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/users/${userId}`);
      return response.data.data as User;
    },
    enabled: !!userId,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: Partial<User> }) => {
      const response = await apiClient.put(`/admin/users/${userId}`, data);
      return response.data.data as User;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'user', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'stats'] });
    },
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: 'active' | 'inactive' | 'suspended' }) => {
      const response = await apiClient.patch(`/admin/users/${userId}/status`, { status });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'stats'] });
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      password: string;
      role?: string;
      status?: string;
    }) => {
      const response = await apiClient.post('/admin/users', data);
      return response.data.data as User;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'stats'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiClient.delete(`/admin/users/${userId}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'stats'] });
    },
  });
};

// ============================================
// Admin Products Management
// ============================================

export const useAdminProducts = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['admin', 'products', params],
    queryFn: async () => {
      const response = await apiClient.get('/admin/products', { params });
      return response.data.data as { products: Product[]; pagination: any };
    },
  });
};

export const useAdminProduct = (productId: string) => {
  return useQuery({
    queryKey: ['admin', 'product', productId],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/products/${productId}`);
      return response.data.data.product as Product;
    },
    enabled: !!productId,
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
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await apiClient.delete(`/admin/products/${productId}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// ============================================
// Admin Orders Management
// ============================================

export const useAdminOrders = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['admin', 'orders', params],
    queryFn: async () => {
      const response = await apiClient.get('/admin/orders', { params });
      return response.data.data as { orders: Order[]; pagination: any };
    },
  });
};

export const useAdminOrder = (orderId: string) => {
  return useQuery({
    queryKey: ['admin', 'order', orderId],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/orders/${orderId}`);
      return response.data.data.order as Order;
    },
    enabled: !!orderId,
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, data }: { orderId: string; data: Partial<Order> }) => {
      const response = await apiClient.put(`/admin/orders/${orderId}`, data);
      return response.data.data.order as Order;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'order', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

// ============================================
// Admin Sellers Management
// ============================================

export interface Seller {
  _id: string;
  userId: string | User;
  businessName: string;
  businessDescription: string;
  logo?: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export const useAdminSellers = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['admin', 'sellers', params],
    queryFn: async () => {
      const response = await apiClient.get('/admin/sellers', { params });
      return response.data.data as { sellers: Seller[]; pagination: any };
    },
  });
};

export const useAdminSeller = (sellerId: string) => {
  return useQuery({
    queryKey: ['admin', 'seller', sellerId],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/sellers/${sellerId}`);
      return response.data.data.seller as Seller;
    },
    enabled: !!sellerId,
  });
};

export const useUpdateSellerStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sellerId, status }: { sellerId: string; status: string }) => {
      const response = await apiClient.patch(`/admin/sellers/${sellerId}/status`, { status });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'sellers'] });
    },
  });
};

// ============================================
// Admin Categories Management
// ============================================

import { Category } from '@/types/api';

export const useAdminCategories = () => {
  return useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/categories');
      return response.data.data.categories as Category[];
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Category>) => {
      const response = await apiClient.post('/admin/categories', data);
      return response.data.data.category as Category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ categoryId, data }: { categoryId: string; data: Partial<Category> }) => {
      const response = await apiClient.put(`/admin/categories/${categoryId}`, data);
      return response.data.data.category as Category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryId: string) => {
      const response = await apiClient.delete(`/admin/categories/${categoryId}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

// ============================================
// Admin Tickets Management
// ============================================

import { Ticket } from '@/hooks/useTickets';

export const useAdminTickets = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
}) => {
  return useQuery({
    queryKey: ['admin', 'tickets', params],
    queryFn: async () => {
      const response = await apiClient.get('/admin/tickets', { params });
      return response.data.data as { tickets: Ticket[]; pagination: any };
    },
  });
};

export const useAdminTicket = (ticketId: string) => {
  return useQuery({
    queryKey: ['admin', 'ticket', ticketId],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/tickets/${ticketId}`);
      return response.data.data.ticket as Ticket;
    },
    enabled: !!ticketId,
  });
};

export const useUpdateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ticketId, data }: { ticketId: string; data: Partial<Ticket> }) => {
      const response = await apiClient.put(`/admin/tickets/${ticketId}`, data);
      return response.data.data.ticket as Ticket;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tickets'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'ticket', variables.ticketId] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};

// ============================================
// Admin Refunds Management
// ============================================

import { Refund } from '@/types/api';

export const useAdminRefunds = (params?: {
  page?: number;
  limit?: number;
  status?: string;
}) => {
  return useQuery({
    queryKey: ['admin', 'refunds', params],
    queryFn: async () => {
      const response = await apiClient.get('/admin/refunds', { params });
      return response.data.data as { refunds: Refund[]; pagination: any };
    },
  });
};

export const useProcessRefund = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ refundId, action, rejectionReason }: {
      refundId: string;
      action: 'approve' | 'reject';
      rejectionReason?: string;
    }) => {
      const response = await apiClient.put(`/admin/refunds/${refundId}`, {
        action,
        rejectionReason,
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'refunds'] });
      queryClient.invalidateQueries({ queryKey: ['refunds'] });
    },
  });
};

