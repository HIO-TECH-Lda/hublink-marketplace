import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { User, Product, Order } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

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

export const useAdminProductStats = () => {
  return useQuery({
    queryKey: ['admin', 'products', 'stats'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/products/stats');
      return response.data.data as {
        total: number;
        active: number;
        pending: number;
        rejected: number;
        averageRating: number;
      };
    },
  });
};

export const useAdminProducts = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  categoryId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  return useQuery({
    queryKey: ['admin', 'products', params],
    queryFn: async () => {
      const response = await apiClient.get('/admin/products', { params });
      return response.data.data as {
        products: Product[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    },
  });
};

export const useAdminProduct = (productId: string) => {
  return useQuery({
    queryKey: ['admin', 'product', productId],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/products/${productId}`);
      return response.data.data as Product;
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'product', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'products', 'stats'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, data }: { productId: string; data: FormData | Partial<Product> }) => {
      // If FormData, use multipart/form-data, otherwise use JSON
      const config = data instanceof FormData 
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : {};
      const response = await apiClient.put(`/admin/products/${productId}`, data, config);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'product', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'products', 'stats'] });
    },
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData | any) => {
      // If FormData, use multipart/form-data, otherwise use JSON
      const config = data instanceof FormData 
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : {};
      const response = await apiClient.post('/admin/products', data, config);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'products', 'stats'] });
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
      queryClient.invalidateQueries({ queryKey: ['admin', 'products', 'stats'] });
    },
  });
};

// ============================================
// Admin Orders Management
// ============================================

export const useAdminOrderStats = () => {
  return useQuery({
    queryKey: ['admin', 'orders', 'stats'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/orders/stats');
      return response.data.data as {
        total: number;
        pending: number;
        totalRevenue: number;
        delivered: number;
        cancelled: number;
      };
    },
  });
};

export const useAdminOrders = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  return useQuery({
    queryKey: ['admin', 'orders', params],
    queryFn: async () => {
      const response = await apiClient.get('/admin/orders', { params });
      return response.data.data as {
        orders: Order[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    },
  });
};

export const useAdminOrder = (orderId: string) => {
  return useQuery({
    queryKey: ['admin', 'order', orderId],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/orders/${orderId}`);
      return response.data.data as Order;
    },
    enabled: !!orderId,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      status,
      trackingNumber,
      cancelReason,
      refundAmount,
    }: {
      orderId: string;
      status: string;
      trackingNumber?: string;
      cancelReason?: string;
      refundAmount?: number;
    }) => {
      const response = await apiClient.patch(`/admin/orders/${orderId}/status`, {
        status,
        trackingNumber,
        cancelReason,
        refundAmount,
      });
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'order', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders', 'stats'] });
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      data,
    }: {
      orderId: string;
      data: {
        status?: string;
        paymentStatus?: string;
        clientInfo?: {
          firstName?: string;
          lastName?: string;
          email?: string;
          phone?: string;
        };
        shippingAddress?: {
          address?: string;
          city?: string;
          state?: string;
          zipCode?: string;
        };
        notes?: string;
        trackingNumber?: string;
      };
    }) => {
      const response = await apiClient.put(`/admin/orders/${orderId}`, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'order', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders', 'stats'] });
    },
  });
};

// ============================================
// Admin Refunds Management
// ============================================

export const useAdminRefundStats = () => {
  return useQuery({
    queryKey: ['admin', 'refunds', 'stats'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/refunds/stats');
      return response.data.data as {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
        totalValue: number;
      };
    },
  });
};

export const useAdminRefunds = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  return useQuery({
    queryKey: ['admin', 'refunds', params],
    queryFn: async () => {
      const response = await apiClient.get('/admin/refunds', { params });
      return response.data.data as {
        refunds: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    },
  });
};

export const useAdminRefund = (refundId: string) => {
  return useQuery({
    queryKey: ['admin', 'refund', refundId],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/refunds/${refundId}`);
      return response.data.data;
    },
    enabled: !!refundId,
  });
};

export const useApproveRefund = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (refundId: string) => {
      const response = await apiClient.patch(`/admin/refunds/${refundId}/approve`);
      return response.data.data;
    },
    onSuccess: (_, refundId) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'refunds'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'refund', refundId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'refunds', 'stats'] });
    },
  });
};

export const useRejectRefund = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ refundId, rejectionReason }: { refundId: string; rejectionReason: string }) => {
      const response = await apiClient.patch(`/admin/refunds/${refundId}/reject`, {
        rejectionReason,
      });
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'refunds'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'refund', variables.refundId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'refunds', 'stats'] });
    },
  });
};

// ============================================
// Admin Sellers Management
// ============================================

export interface SellerStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  totalSales: number;
  averageRating: number;
}

export interface Seller {
  id: string;
  company: {
    name: string;
    description?: string;
    address?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    productTypes?: string;
    experience?: string;
  };
  contact: {
    name: string;
    firstName?: string;
    lastName?: string;
    email: string;
    phone: string;
  };
  productCount?: number;
  totalSales?: number;
  averageRating?: number;
  totalReviews?: number;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface SellerProduct {
  id: string;
  name: string;
  primaryImage: string;
  price: number;
  stock: number;
  averageRating: number;
  totalReviews: number;
  status: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt: string;
}

export interface SellerDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'seller';
  status: 'active' | 'inactive' | 'suspended';
  company: {
    name: string;
    description?: string;
    address?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    productTypes?: string;
    experience?: string;
  };
  contact: {
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  statistics: {
    productCount: number;
    averageRating: number;
    totalReviews: number;
    totalViews: number;
    totalPurchases: number;
    totalOrders: number;
    totalSales: number;
    totalQuantitySold: number;
  };
  products?: SellerProduct[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateSellerRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  storeName?: string;
  businessName?: string;
  storeDescription?: string;
  businessDescription?: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  productTypes?: string;
  businessType?: string;
  experience?: string;
  status?: 'active' | 'inactive' | 'suspended';
  password?: string;
}

export const useAdminSellerStats = () => {
  return useQuery({
    queryKey: ['admin', 'sellers', 'stats'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/sellers/stats');
      return response.data.data as SellerStats;
    },
  });
};

export const useAdminSellers = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  return useQuery({
    queryKey: ['admin', 'sellers', params],
    queryFn: async () => {
      const response = await apiClient.get('/admin/sellers', { params });
      return response.data.data as {
        sellers: Seller[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    },
  });
};

export const useAdminSeller = (sellerId: string) => {
  return useQuery({
    queryKey: ['admin', 'seller', sellerId],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/sellers/${sellerId}`);
      return response.data.data as SellerDetails;
    },
    enabled: !!sellerId,
  });
};

export const useCreateSeller = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateSellerRequest) => {
      const response = await apiClient.post('/admin/sellers', data);
      return response.data.data as SellerDetails;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'sellers'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'sellers', 'stats'] });
      toast({
        title: 'Vendedor criado',
        description: 'O vendedor foi criado com sucesso.',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Falha ao criar vendedor';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateSeller = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ sellerId, data }: { sellerId: string; data: Partial<CreateSellerRequest> }) => {
      const response = await apiClient.put(`/admin/sellers/${sellerId}`, data);
      return response.data.data as SellerDetails;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'sellers'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'seller', variables.sellerId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'sellers', 'stats'] });
      toast({
        title: 'Vendedor atualizado',
        description: 'As alterações foram salvas com sucesso.',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Falha ao atualizar vendedor';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateSellerStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ sellerId, status }: { sellerId: string; status: 'active' | 'inactive' | 'suspended' }) => {
      const response = await apiClient.patch(`/admin/sellers/${sellerId}/status`, { status });
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'sellers'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'seller', variables.sellerId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'sellers', 'stats'] });
      toast({
        title: 'Status atualizado',
        description: 'O status do vendedor foi atualizado com sucesso.',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Falha ao atualizar status do vendedor';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

// ============================================
// Admin Categories Management
// ============================================

export interface CategoryStats {
  total: number;
  active: number;
  inactive: number;
  totalProducts: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  image?: string;
  icon?: string;
  isActive: boolean;
  isFeatured: boolean;
  productCount: number;
  parent: {
    id: string;
    name: string;
    slug: string;
  } | null;
  level: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryProduct {
  id: string;
  name: string;
  primaryImage: string;
  price: number;
  stock: number;
  averageRating: number;
  totalReviews: number;
  status: string;
  seller: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export interface CategoryDetails extends Category {
  childrenCount: number;
  parentId?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  products?: CategoryProduct[];
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  slug?: string;
  parentId?: string;
  image?: string;
  icon?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  sortOrder?: number;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

export const useAdminCategoryStats = () => {
  return useQuery({
    queryKey: ['admin', 'categories', 'stats'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/categories/stats');
      return response.data.data as CategoryStats;
    },
  });
};

export const useAdminCategories = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  return useQuery({
    queryKey: ['admin', 'categories', params],
    queryFn: async () => {
      const response = await apiClient.get('/admin/categories', { params });
      return response.data.data as {
        categories: Category[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    },
  });
};

export const useAdminCategory = (categoryId: string) => {
  return useQuery({
    queryKey: ['admin', 'category', categoryId],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/categories/${categoryId}`);
      return response.data.data as CategoryDetails;
    },
    enabled: !!categoryId,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: FormData | CreateCategoryRequest) => {
      const config = data instanceof FormData ? {} : {};
      const response = await apiClient.post('/admin/categories', data, config);
      return response.data.data as CategoryDetails;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: 'Categoria criada',
        description: 'A categoria foi criada com sucesso.',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Falha ao criar categoria';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ categoryId, data }: { categoryId: string; data: FormData | Partial<CreateCategoryRequest> }) => {
      const config = data instanceof FormData ? {} : {};
      const response = await apiClient.put(`/admin/categories/${categoryId}`, data, config);
      return response.data.data as CategoryDetails;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'category', variables.categoryId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: 'Categoria atualizada',
        description: 'As alterações foram salvas com sucesso.',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Falha ao atualizar categoria';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateCategoryStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ categoryId, isActive }: { categoryId: string; isActive: boolean }) => {
      const response = await apiClient.patch(`/admin/categories/${categoryId}/status`, { isActive });
      return response.data.data as CategoryDetails;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'category', variables.categoryId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: 'Status atualizado',
        description: 'O status da categoria foi atualizado com sucesso.',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Falha ao atualizar status da categoria';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (categoryId: string) => {
      const response = await apiClient.delete(`/admin/categories/${categoryId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: 'Categoria excluída',
        description: 'A categoria foi excluída com sucesso.',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Falha ao excluir categoria';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

// ============================================
// Admin Tickets Management
// ============================================
// Ticket hooks are defined at the end of the file

// ============================================
// Admin Blog Management
// ============================================

export interface BlogStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
  totalViews: number;
  totalCategories: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  image?: string;
  author: {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  isFeatured: boolean;
  stats: {
    views: number;
    likes: number;
    shares: number;
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogPostRequest {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  image?: string;
  authorId: string;
  authorName: string;
  category: string;
  tags?: string[];
  status?: 'draft' | 'published' | 'archived';
  isFeatured?: boolean;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

export const useAdminBlogStats = () => {
  return useQuery({
    queryKey: ['admin', 'blog', 'stats'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/blog/stats');
      return response.data.data as BlogStats;
    },
  });
};

export const useAdminBlogPosts = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  authorId?: string;
  isFeatured?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  return useQuery({
    queryKey: ['admin', 'blog', params],
    queryFn: async () => {
      const response = await apiClient.get('/admin/blog', { params });
      return response.data.data as {
        posts: BlogPost[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    },
  });
};

export const useAdminBlogPost = (postId: string) => {
  return useQuery({
    queryKey: ['admin', 'blog', 'post', postId],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/blog/${postId}`);
      return response.data.data as BlogPost;
    },
    enabled: !!postId,
  });
};

export const useAdminBlogCategories = () => {
  return useQuery({
    queryKey: ['admin', 'blog', 'categories'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/blog/categories');
      return response.data.data as string[];
    },
  });
};

export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateBlogPostRequest | FormData) => {
      const response = await apiClient.post('/admin/blog', data);
      return response.data.data as BlogPost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'blog'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'blog', 'stats'] });
      toast({
        title: 'Post criado',
        description: 'O post foi criado com sucesso.',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Falha ao criar post';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ postId, data }: { postId: string; data: Partial<CreateBlogPostRequest> | FormData }) => {
      const response = await apiClient.put(`/admin/blog/${postId}`, data);
      return response.data.data as BlogPost;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'blog'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'blog', 'post', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'blog', 'stats'] });
      toast({
        title: 'Post atualizado',
        description: 'As alterações foram salvas com sucesso.',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Falha ao atualizar post';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateBlogPostStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ postId, status }: { postId: string; status: 'draft' | 'published' | 'archived' }) => {
      const response = await apiClient.patch(`/admin/blog/${postId}/status`, { status });
      return response.data.data as BlogPost;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'blog'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'blog', 'post', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'blog', 'stats'] });
      toast({
        title: 'Status atualizado',
        description: 'O status do post foi atualizado com sucesso.',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Falha ao atualizar status do post';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (postId: string) => {
      const response = await apiClient.delete(`/admin/blog/${postId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'blog'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'blog', 'stats'] });
      toast({
        title: 'Post excluído',
        description: 'O post foi excluído com sucesso.',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Falha ao excluir post';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

export const useToggleBlogPostFeatured = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ postId, isFeatured }: { postId: string; isFeatured: boolean }) => {
      const response = await apiClient.patch(`/admin/blog/${postId}/featured`, { isFeatured });
      return response.data.data as BlogPost;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'blog'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'blog', 'post', variables.postId] });
      toast({
        title: variables.isFeatured ? 'Post marcado como destaque' : 'Post removido dos destaques',
        description: variables.isFeatured 
          ? 'O post agora aparecerá na lista de destaques.' 
          : 'O post foi removido da lista de destaques.',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Falha ao atualizar status de destaque';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

// ============================================
// Admin Newsletter Management
// ============================================

export interface NewsletterStats {
  totalSubscribers: number;
  activeSubscribers: number;
  unsubscribed: number;
  bounced: number;
  campaignsSent: number;
  campaignsScheduled: number;
  campaignsDraft: number;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  status: 'active' | 'unsubscribed' | 'bounced' | 'pending';
  origin: 'popup' | 'footer' | 'signup' | 'admin' | 'import';
  tags: string[];
  engagement?: {
    emailsSent: number;
    emailsOpened: number;
    emailsClicked: number;
    openRate: string;
    clickRate: string;
  };
  preferences?: {
    categories?: string[];
    frequency?: 'daily' | 'weekly' | 'monthly';
    promotions?: boolean;
    productUpdates?: boolean;
    blogPosts?: boolean;
  };
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
  };
  stats?: {
    emailsSent: number;
    emailsOpened: number;
    emailsClicked: number;
    lastOpened?: string;
    lastClicked?: string;
    openRate: string;
    clickRate: string;
  };
  registeredAt: string;
  unsubscribedAt?: string;
  unsubscribedReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterCampaign {
  id: string;
  name: string;
  subject: string;
  type: 'newsletter' | 'promotional' | 'announcement' | 'welcome';
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';
  content?: {
    html: string;
    plainText?: string;
  };
  segmentation?: {
    subscriberStatus?: 'all' | 'active' | 'new';
    tags?: string[];
    preferences?: {
      categories?: string[];
      frequency?: string[];
    };
  };
  subscribers?: number;
  performance?: {
    openRate: number;
    clickRate: number;
  };
  scheduledAt?: string;
  timezone?: string;
  sentAt?: string;
  createdBy?: {
    id: string;
    name: string;
  };
  stats?: {
    totalSubscribers: number;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
    deliveryRate: number;
    openRate: number;
    clickRate: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriberRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  status?: 'active' | 'unsubscribed' | 'bounced' | 'pending';
  origin?: 'popup' | 'footer' | 'signup' | 'admin' | 'import';
  tags?: string[];
  preferences?: {
    categories?: string[];
    frequency?: 'daily' | 'weekly' | 'monthly';
    promotions?: boolean;
    productUpdates?: boolean;
    blogPosts?: boolean;
  };
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
  };
}

export interface CreateCampaignRequest {
  name: string;
  subject: string;
  type: 'newsletter' | 'promotional' | 'announcement' | 'welcome';
  status?: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';
  content: {
    html: string;
    plainText?: string;
  };
  segmentation?: {
    subscriberStatus?: 'all' | 'active' | 'new';
    tags?: string[];
    preferences?: {
      categories?: string[];
      frequency?: string[];
    };
  };
  scheduledAt?: string;
  timezone?: string;
}

export const useAdminNewsletterStats = () => {
  return useQuery({
    queryKey: ['admin', 'newsletter', 'stats'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/newsletter/stats');
      return response.data.data as NewsletterStats;
    },
  });
};

export const useAdminSubscribers = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  origin?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  return useQuery({
    queryKey: ['admin', 'newsletter', 'subscribers', params],
    queryFn: async () => {
      const response = await apiClient.get('/admin/newsletter/subscribers', { params });
      return response.data.data as {
        subscribers: NewsletterSubscriber[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      };
    },
  });
};

export const useAdminSubscriber = (subscriberId: string) => {
  return useQuery({
    queryKey: ['admin', 'newsletter', 'subscriber', subscriberId],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/newsletter/subscribers/${subscriberId}`);
      return response.data.data as NewsletterSubscriber;
    },
    enabled: !!subscriberId,
  });
};

export const useCreateSubscriber = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateSubscriberRequest) => {
      const response = await apiClient.post('/admin/newsletter/subscribers', data);
      return response.data.data as NewsletterSubscriber;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'newsletter', 'subscribers'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'newsletter', 'stats'] });
      toast({
        title: 'Assinante criado',
        description: 'O assinante foi adicionado com sucesso.',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Falha ao criar assinante';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateSubscriber = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ subscriberId, data }: { subscriberId: string; data: Partial<CreateSubscriberRequest> }) => {
      const response = await apiClient.put(`/admin/newsletter/subscribers/${subscriberId}`, data);
      return response.data.data as NewsletterSubscriber;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'newsletter', 'subscribers'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'newsletter', 'subscriber', variables.subscriberId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'newsletter', 'stats'] });
      toast({
        title: 'Assinante atualizado',
        description: 'As alterações foram salvas com sucesso.',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Falha ao atualizar assinante';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateSubscriberStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ subscriberId, status }: { subscriberId: string; status: 'active' | 'unsubscribed' | 'bounced' | 'pending' }) => {
      const response = await apiClient.patch(`/admin/newsletter/subscribers/${subscriberId}/status`, { status });
      return response.data.data as NewsletterSubscriber;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'newsletter', 'subscribers'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'newsletter', 'subscriber', variables.subscriberId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'newsletter', 'stats'] });
      toast({
        title: 'Status atualizado',
        description: 'O status do assinante foi atualizado com sucesso.',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Falha ao atualizar status do assinante';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteSubscriber = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (subscriberId: string) => {
      const response = await apiClient.delete(`/admin/newsletter/subscribers/${subscriberId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'newsletter', 'subscribers'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'newsletter', 'stats'] });
      toast({
        title: 'Assinante excluído',
        description: 'O assinante foi excluído com sucesso.',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Falha ao excluir assinante';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

export const useAdminCampaigns = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  return useQuery({
    queryKey: ['admin', 'newsletter', 'campaigns', params],
    queryFn: async () => {
      const response = await apiClient.get('/admin/newsletter/campaigns', { params });
      return response.data.data as {
        campaigns: NewsletterCampaign[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      };
    },
  });
};

export const useAdminCampaign = (campaignId: string) => {
  return useQuery({
    queryKey: ['admin', 'newsletter', 'campaign', campaignId],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/newsletter/campaigns/${campaignId}`);
      return response.data.data as NewsletterCampaign;
    },
    enabled: !!campaignId,
  });
};

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateCampaignRequest) => {
      const response = await apiClient.post('/admin/newsletter/campaigns', data);
      return response.data.data as NewsletterCampaign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'newsletter', 'campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'newsletter', 'stats'] });
      toast({
        title: 'Campanha criada',
        description: 'A campanha foi criada com sucesso.',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Falha ao criar campanha';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ campaignId, data }: { campaignId: string; data: Partial<CreateCampaignRequest> }) => {
      const response = await apiClient.put(`/admin/newsletter/campaigns/${campaignId}`, data);
      return response.data.data as NewsletterCampaign;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'newsletter', 'campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'newsletter', 'campaign', variables.campaignId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'newsletter', 'stats'] });
      toast({
        title: 'Campanha atualizada',
        description: 'As alterações foram salvas com sucesso.',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Falha ao atualizar campanha';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateCampaignStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ campaignId, status, scheduledAt }: { campaignId: string; status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled'; scheduledAt?: string }) => {
      const response = await apiClient.patch(`/admin/newsletter/campaigns/${campaignId}/status`, { status, scheduledAt });
      return response.data.data as NewsletterCampaign;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'newsletter', 'campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'newsletter', 'campaign', variables.campaignId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'newsletter', 'stats'] });
      toast({
        title: 'Status atualizado',
        description: 'O status da campanha foi atualizado com sucesso.',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Falha ao atualizar status da campanha';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (campaignId: string) => {
      const response = await apiClient.delete(`/admin/newsletter/campaigns/${campaignId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'newsletter', 'campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'newsletter', 'stats'] });
      toast({
        title: 'Campanha excluída',
        description: 'A campanha foi excluída com sucesso.',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Falha ao excluir campanha';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

// ============================================
// Admin Ticket Management
// ============================================

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  waitingForUser: number;
  waitingForThirdParty: number;
  resolved: number;
  closed: number;
  urgent: number;
  high: number;
  medium: number;
  low: number;
}

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

export type TicketStatus = 
  | 'open'
  | 'in_progress'
  | 'waiting_for_user'
  | 'waiting_for_third_party'
  | 'resolved'
  | 'closed';

export interface TicketAttachment {
  fileName: string;
  fileUrl: string;
  publicId?: string;
  fileSize: number;
  mimeType: string;
}

export interface TicketMessage {
  id: string;
  userId: string;
  userType: 'buyer' | 'seller' | 'admin' | 'support';
  message: string;
  isInternal: boolean;
  attachments: TicketAttachment[];
  createdAt: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: TicketStatus;
  createdBy: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    email?: string;
  };
  orderId?: {
    id: string;
    orderNumber: string;
    status?: string;
    totalAmount?: number;
  };
  productId?: {
    id: string;
    name: string;
    image?: string;
    slug?: string;
  };
  tags: string[];
  attachments?: TicketAttachment[];
  messageCount?: number;
  messages?: {
    public: TicketMessage[];
    internal: TicketMessage[];
    all: TicketMessage[];
  };
  stats?: {
    messageCount: number;
    timeOpen: number | null;
    lastUpdate: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateTicketRequest {
  title?: string;
  description?: string;
  category?: TicketCategory;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: TicketStatus;
  assignedTo?: string;
  tags?: string[];
}

export interface AddMessageRequest {
  message: string;
  isInternal?: boolean;
  attachments?: Array<{
    base64?: string;
    fileUrl?: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
  }>;
}

export const useAdminTicketStats = () => {
  return useQuery({
    queryKey: ['admin', 'tickets', 'stats'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/tickets/stats');
      return response.data.data as TicketStats;
    },
  });
};

export const useAdminTickets = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  priority?: string;
  category?: string;
  assignedTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  return useQuery({
    queryKey: ['admin', 'tickets', params],
    queryFn: async () => {
      const response = await apiClient.get('/admin/tickets', { params });
      return response.data.data as {
        tickets: Ticket[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      };
    },
  });
};

export const useAdminTicket = (ticketId: string) => {
  return useQuery({
    queryKey: ['admin', 'ticket', ticketId],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/tickets/${ticketId}`);
      return response.data.data as Ticket;
    },
    enabled: !!ticketId,
  });
};

export const useUpdateTicket = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ ticketId, data }: { ticketId: string; data: UpdateTicketRequest }) => {
      const response = await apiClient.put(`/admin/tickets/${ticketId}`, data);
      return response.data.data as Ticket;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tickets'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'ticket', variables.ticketId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'tickets', 'stats'] });
      toast({
        title: 'Ticket atualizado',
        description: 'As alterações foram salvas com sucesso.',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Falha ao atualizar ticket';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ ticketId, status }: { ticketId: string; status: TicketStatus }) => {
      const response = await apiClient.patch(`/admin/tickets/${ticketId}/status`, { status });
      return response.data.data as Ticket;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tickets'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'ticket', variables.ticketId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'tickets', 'stats'] });
      toast({
        title: 'Status atualizado',
        description: 'O status do ticket foi atualizado com sucesso.',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Falha ao atualizar status do ticket';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

export const useAssignTicket = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ ticketId, userId }: { ticketId: string; userId: string }) => {
      const response = await apiClient.patch(`/admin/tickets/${ticketId}/assign`, { userId });
      return response.data.data as Ticket;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tickets'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'ticket', variables.ticketId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'tickets', 'stats'] });
      toast({
        title: 'Ticket atribuído',
        description: 'O ticket foi atribuído com sucesso.',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Falha ao atribuir ticket';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

export const useAddTicketMessage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ ticketId, data }: { ticketId: string; data: AddMessageRequest }) => {
      const response = await apiClient.post(`/admin/tickets/${ticketId}/messages`, data);
      return response.data.data as Ticket;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'ticket', variables.ticketId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'tickets'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'tickets', 'stats'] });
      toast({
        title: 'Mensagem adicionada',
        description: 'A mensagem foi adicionada com sucesso.',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Falha ao adicionar mensagem';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteTicket = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (ticketId: string) => {
      const response = await apiClient.delete(`/admin/tickets/${ticketId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tickets'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'tickets', 'stats'] });
      toast({
        title: 'Ticket excluído',
        description: 'O ticket foi excluído com sucesso.',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Falha ao excluir ticket';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

// ============================================
// Admin Reports and Analytics
// ============================================

export interface ReportsData {
  period: {
    startDate: string;
    endDate: string;
    days: number;
  };
  metrics: {
    totalSales: {
      count: number;
      revenue: number;
    };
    orders: {
      count: number;
      avgItemsPerOrder: number;
    };
    customers: {
      new: number;
    };
    averageTicket: number;
  };
  salesByDay: Array<{
    date: string;
    sales: number;
    revenue: number;
  }>;
  topProducts: Array<{
    rank: number;
    productId: string;
    name: string;
    units: number;
    revenue: number;
    sales: number;
  }>;
  topSellers: Array<{
    rank: number;
    sellerId: string;
    name: string;
    products: number;
    revenue: number;
    sales: number;
  }>;
  performanceMetrics: {
    conversionRate: string;
    avgSessionTime: string;
    abandonmentRate: string;
    averageRating: string;
    avgDeliveryTime: string;
  };
}

export interface ExportSalesData {
  orderNumber: string;
  date: string;
  customer: string;
  email: string;
  total: number;
  status: string;
  items: number;
}

export interface ExportProductsData {
  productId: string;
  productName: string;
  unitsSold: number;
  revenue: number;
  salesCount: number;
}

export const useAdminReports = (params?: {
  period?: '7' | '30' | '90' | '365' | 'custom';
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: ['admin', 'reports', params],
    queryFn: async () => {
      const response = await apiClient.get('/admin/reports', { params });
      return response.data.data as ReportsData;
    },
  });
};

export const useExportSalesData = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ startDate, endDate }: { startDate: string; endDate: string }) => {
      const response = await apiClient.get('/admin/reports/export/sales', {
        params: { startDate, endDate }
      });
      return response.data.data as ExportSalesData[];
    },
    onSuccess: (data) => {
      // Convert to CSV and download
      const csv = convertToCSV(data, [
        'orderNumber',
        'date',
        'customer',
        'email',
        'total',
        'status',
        'items'
      ]);
      downloadCSV(csv, `sales-export-${new Date().toISOString().split('T')[0]}.csv`);
      toast({
        title: 'Exportação concluída',
        description: 'Os dados de vendas foram exportados com sucesso.',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Falha ao exportar dados de vendas';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

export const useExportProductsData = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ startDate, endDate }: { startDate: string; endDate: string }) => {
      const response = await apiClient.get('/admin/reports/export/products', {
        params: { startDate, endDate }
      });
      return response.data.data as ExportProductsData[];
    },
    onSuccess: (data) => {
      // Convert to CSV and download
      const csv = convertToCSV(data, [
        'productId',
        'productName',
        'unitsSold',
        'revenue',
        'salesCount'
      ]);
      downloadCSV(csv, `products-export-${new Date().toISOString().split('T')[0]}.csv`);
      toast({
        title: 'Exportação concluída',
        description: 'Os dados de produtos foram exportados com sucesso.',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Falha ao exportar dados de produtos';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

// Helper functions for CSV export
function convertToCSV(data: any[], headers: string[]): string {
  const csvHeaders = headers.join(',');
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header];
      // Escape commas and quotes in values
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',');
  });
  return [csvHeaders, ...csvRows].join('\n');
}

function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ============================================
// Admin Audit Logs
// ============================================

export interface AuditLog {
  id: string;
  user: {
    id?: string;
    name: string;
    email?: string;
    role?: string;
  };
  action: 'create' | 'read' | 'update' | 'delete';
  entity: {
    type: string;
    id: string;
    name?: string;
  };
  changes: Array<{
    field: string;
    oldValue: any;
    newValue: any;
  }>;
  metadata: {
    ipAddress?: string;
    userAgent?: string;
    method?: string;
    url?: string;
    statusCode?: number;
  };
  description?: string;
  createdAt: string;
}

export interface AuditLogStatistics {
  total: number;
  byAction: {
    create: number;
    read: number;
    update: number;
    delete: number;
  };
  byEntityType: Array<{
    entityType: string;
    count: number;
  }>;
  topUsers: Array<{
    userId: string;
    userName: string;
    activityCount: number;
  }>;
}

export const useAdminAuditLogs = (params?: {
  page?: number;
  limit?: number;
  userId?: string;
  entityType?: string;
  entityId?: string;
  action?: 'create' | 'read' | 'update' | 'delete';
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: ['admin', 'audit-logs', params],
    queryFn: async () => {
      const response = await apiClient.get('/admin/audit-logs', { params });
      return response.data.data as {
        logs: AuditLog[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      };
    },
  });
};

export const useAdminAuditLogStats = (params?: {
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: ['admin', 'audit-logs', 'statistics', params],
    queryFn: async () => {
      const response = await apiClient.get('/admin/audit-logs/statistics', { params });
      return response.data.data as AuditLogStatistics;
    },
  });
};


