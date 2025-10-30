import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Cart, CartItem } from '@/types/api';
import { useAuth } from '@/contexts/AuthContext';

export const useCart = () => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await apiClient.get('/cart');
      return response.data.data as Cart;
    },
    enabled: isAuthenticated, // Only fetch when user is authenticated
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      const response = await apiClient.post('/cart/add', { productId, quantity });
      return response.data.data.cart;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      const response = await apiClient.put('/cart/update', { productId, quantity });
      return response.data.data.cart;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await apiClient.delete('/cart/remove', {
        data: { productId }
      });
      return response.data.data.cart;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.delete('/cart/clear');
      return response.data.data.cart;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};
