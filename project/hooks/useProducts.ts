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
      return response.data.data as { products: Product[]; pagination: any };
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await apiClient.get(`/products/${id}`);
      return response.data.data.product as Product;
    },
    enabled: !!id,
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const response = await apiClient.get('/products/featured');
      return response.data.data.products as Product[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - featured products don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useBestSellers = () => {
  return useQuery({
    queryKey: ['products', 'best-sellers'],
    queryFn: async () => {
      const response = await apiClient.get('/products/best-sellers');
      return response.data.data.products as Product[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useNewArrivals = () => {
  return useQuery({
    queryKey: ['products', 'new-arrivals'],
    queryFn: async () => {
      const response = await apiClient.get('/products/new-arrivals');
      return response.data.data.products as Product[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - new arrivals may change more frequently
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useSearchProducts = (query: string) => {
  return useQuery({
    queryKey: ['products', 'search', query],
    queryFn: async () => {
      const response = await apiClient.get('/products/search', {
        params: { q: query }
      });
      return response.data.data.products as Product[];
    },
    enabled: !!query && query.length > 2,
  });
};

// Create product
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

// List products for the authenticated seller
export const useMyProducts = () => {
  return useQuery({
    queryKey: ['products', 'my'],
    queryFn: async () => {
      const response = await apiClient.get('/products/seller/my-products');
      return response.data.data.products as Product[];
    },
  });
};

// Delete product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await apiClient.delete(`/products/${productId}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', 'my'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// Update product status (e.g., active/inactive)
export const useUpdateProductStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, status }: { productId: string; status: string }) => {
      const response = await apiClient.patch(`/products/${productId}/status`, { status });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', 'my'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// Update product stock
export const useUpdateProductStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, stock }: { productId: string; stock: number }) => {
      const response = await apiClient.patch(`/products/${productId}/stock`, { stock });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', 'my'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// Update product details
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, data }: { productId: string; data: any }) => {
      const response = await apiClient.put(`/products/${productId}`, data);
      return response.data.data as Product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', 'my'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};