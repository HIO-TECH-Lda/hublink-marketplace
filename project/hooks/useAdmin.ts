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
    mutationFn: async (data: CreateCategoryRequest) => {
      const response = await apiClient.post('/admin/categories', data);
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
    mutationFn: async ({ categoryId, data }: { categoryId: string; data: Partial<CreateCategoryRequest> }) => {
      const response = await apiClient.put(`/admin/categories/${categoryId}`, data);
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


