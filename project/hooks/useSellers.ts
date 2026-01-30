import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export interface PublicSeller {
  id: string;
  businessName: string;
  logo?: string;
  coverImage?: string;
  description: string;
  rating: number;
  totalReviews: number;
  totalSales: number;
  totalProducts?: number;
  location: string;
  isVerified: boolean;
  isFeatured: boolean;
  memberSince: string;
  contactEmail?: string;
  phone?: string;
  website?: string;
  policies?: {
    returns?: string;
    shipping?: string;
    warranty?: string;
  };
  statistics?: {
    avgResponseTime?: string;
    responseRate?: number;
    avgShippingTime?: string;
    successfulOrders?: number;
  };
  recentProducts?: any[];
}

export interface SellersResponse {
  sellers: PublicSeller[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const useSellers = (params?: {
  search?: string;
  category?: string;
  minRating?: number;
  location?: string;
  verified?: boolean;
  featured?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  return useQuery({
    queryKey: ['sellers', params],
    queryFn: async () => {
      const response = await apiClient.get('/sellers', { params });
      return response.data.data as SellersResponse;
    },
  });
};

export const useTopSellers = (limit: number = 10) => {
  return useQuery({
    queryKey: ['sellers', 'top', limit],
    queryFn: async () => {
      const response = await apiClient.get('/sellers/top', {
        params: { limit }
      });
      return response.data.data as PublicSeller[];
    },
  });
};

export const useFeaturedSellers = (limit: number = 6) => {
  return useQuery({
    queryKey: ['sellers', 'featured', limit],
    queryFn: async () => {
      const response = await apiClient.get('/sellers/featured', {
        params: { limit }
      });
      return response.data.data as PublicSeller[];
    },
  });
};

export const useSellerProfile = (sellerId: string) => {
  return useQuery({
    queryKey: ['seller', sellerId],
    queryFn: async () => {
      const response = await apiClient.get(`/sellers/${sellerId}`);
      return response.data.data as PublicSeller;
    },
    enabled: !!sellerId,
  });
};

export const useSellerProducts = (sellerId: string, params?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  return useQuery({
    queryKey: ['seller', sellerId, 'products', params],
    queryFn: async () => {
      const response = await apiClient.get(`/sellers/${sellerId}/products`, { params });
      return response.data.data;
    },
    enabled: !!sellerId,
  });
};
