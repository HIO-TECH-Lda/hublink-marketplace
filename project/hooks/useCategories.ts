import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Category, Product } from '@/types/api';

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
