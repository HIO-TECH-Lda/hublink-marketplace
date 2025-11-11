import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import { Review } from '@/types/api';

export interface ProductReviewsResponse {
  reviews: Review[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  averageRating: number;
}

export const useProductReviews = (
  productId: string,
  params?: {
    page?: number;
    limit?: number;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  },
) => {
  return useQuery({
    queryKey: ['reviews', 'product', productId, params],
    queryFn: async () => {
      const response = await apiClient.get(`/reviews/product/${productId}`, {
        params,
      });
      return response.data.data as ProductReviewsResponse;
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
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (reviewData: {
      productId: string;
      orderId: string;
      rating: number;
      title: string;
      content: string;
      images?: string[];
    }) => {
      const response = await apiClient.post('/reviews', reviewData);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      toast({
        title: 'Avaliação enviada',
        description: 'Sua avaliação foi enviada para revisão.',
      });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'product', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'statistics', variables.productId] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || error?.message || 'Não foi possível enviar a avaliação.';
      toast({
        title: 'Erro ao enviar avaliação',
        description: message,
        variant: 'destructive',
      });
      throw error;
    },
  });
};

export const useMarkReviewHelpful = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ reviewId, isHelpful }: { reviewId: string; isHelpful: boolean }) => {
      const response = await apiClient.post(`/reviews/${reviewId}/helpful`, { isHelpful });
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'product'] });
      toast({
        title: 'Feedback registrado',
        description: variables.isHelpful
          ? 'Obrigado por marcar esta avaliação como útil.'
          : 'Seu feedback foi registrado.',
      });
    },
  });
};

export const useSellerReviews = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  productId?: string;
}) => {
  return useQuery({
    queryKey: ['reviews', 'seller', params],
    queryFn: async () => {
      const response = await apiClient.get('/reviews/seller/my-reviews', { params });
      return response.data.data as {
        reviews: Review[];
        pagination?: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      };
    },
  });
};
