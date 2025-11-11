import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Order } from '@/types/api';

export const useUserOrders = (
  params?: { limit?: number; page?: number },
  options?: Pick<UseQueryOptions<Order[]>, 'enabled'>,
) => {
  return useQuery({
    queryKey: ['orders', 'user', params],
    queryFn: async () => {
      const response = await apiClient.get('/orders/my-orders', {
        params,
      });
      return response.data.data.orders as Order[];
    },
    enabled: options?.enabled ?? true,
  });
};

export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const response = await apiClient.get(`/orders/${orderId}`);
      return response.data.data.order as Order;
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

export const useOrderTracking = (orderId: string) => {
  return useQuery({
    queryKey: ['order-tracking', orderId],
    queryFn: async () => {
      const response = await apiClient.get(`/orders/${orderId}/tracking`);
      return response.data.data;
    },
    enabled: !!orderId,
  });
};

// Seller - my orders (orders containing seller's products)
export const useSellerOrders = () => {
  return useQuery({
    queryKey: ['orders', 'seller', 'my'],
    queryFn: async () => {
      const response = await apiClient.get('/orders/seller/my-orders');
      return response.data.data.orders as Order[];
    },
  });
};
