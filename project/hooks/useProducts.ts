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
      return response.data.data.products as Product[];
    },
  });
};

export const useBestSellers = () => {
  return useQuery({
    queryKey: ['products', 'best-sellers'],
    queryFn: async () => {
      const response = await apiClient.get('/products/best-sellers');
      return response.data.data.products as Product[];
    },
  });
};

export const useNewArrivals = () => {
  return useQuery({
    queryKey: ['products', 'new-arrivals'],
    queryFn: async () => {
      const response = await apiClient.get('/products/new-arrivals');
      return response.data.data.products as Product[];
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
      return response.data.data.products as Product[];
    },
    enabled: !!query && query.length > 2,
  });
};
