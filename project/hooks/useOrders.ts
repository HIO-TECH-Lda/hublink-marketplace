import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Order } from '@/types/api';

export const useUserOrders = () => {
  return useQuery({
    queryKey: ['orders', 'user'],
    queryFn: async () => {
      const response = await apiClient.get('/orders/my-orders');
      return response.data.data as Order[];
    },
  });
};

export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const response = await apiClient.get(`/orders/${orderId}`);
      return response.data.data as Order;
    },
    enabled: !!orderId,
  });
};

export const useCreateOrderFromCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderData: {
      shippingAddress: any;
      billingAddress: any;
      payment: {
        method: string;
        paymentDetails?: any;
      };
      notes?: string;
    }) => {
      const response = await apiClient.post('/orders/create-from-cart', orderData);
      return response.data.data.order as Order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await apiClient.post(`/orders/${orderId}/cancel`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
