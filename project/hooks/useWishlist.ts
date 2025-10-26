import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Product, WishlistItem } from '@/types/api';

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
