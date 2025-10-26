import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Review } from '@/types/api';

export const useProductReviews = (productId: string) => {
  return useQuery({
    queryKey: ['reviews', 'product', productId],
    queryFn: async () => {
      const response = await apiClient.get(`/reviews/product/${productId}`);
      return response.data.data as Review[];
    },
    enabled: !!productId,
  });
};

export const useReviewStatistics = (productId: string) => {
  return useQuery({
    queryKey: ['reviews', 'statistics', productId],
    queryFn: async () => {
      const response = await apiClient.get(`/reviews/product/${productId}/statistics`);
      return response.data.data;
    },
    enabled: !!productId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (reviewData: {
      productId: string;
      orderId: string;
      rating: number;
      title: string;
      content: string;
    }) => {
      const response = await apiClient.post('/reviews', reviewData);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'product', data.product] });
    },
  });
};

export const useMarkReviewHelpful = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (reviewId: string) => {
      const response = await apiClient.post(`/reviews/${reviewId}/helpful`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};
