import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Product, WishlistItem } from '@/types/api';
import { useAuth } from '@/contexts/AuthContext';

export const useWishlist = () => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const response = await apiClient.get('/wishlist');
      // API returns { data: { items: [{ productId: Product, addedAt, _id }] } }
      const items = response.data.data?.items || [];
      // Normalize to { _id, product, addedAt }
      const normalized: WishlistItem[] = items.map((it: any) => ({
        _id: it._id || it.productId?._id,
        product: it.productId,
        addedAt: it.addedAt || it.updatedAt || it.createdAt,
      }));
      return normalized;
    },
    enabled: isAuthenticated, // Only fetch when user is authenticated
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
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['wishlist', 'check', productId],
    queryFn: async () => {
      const response = await apiClient.get(`/wishlist/check/${productId}`);
      return response.data.data.isInWishlist as boolean;
    },
    enabled: !!productId && isAuthenticated, // Only fetch when user is authenticated and productId exists
  });
};
