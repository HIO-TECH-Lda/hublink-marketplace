import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';

export interface AdminReview {
  _id: string;
  productId: {
    _id: string;
    name: string;
    primaryImage: string;
  };
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  orderId: {
    _id: string;
    orderNumber: string;
  };
  rating: number;
  title: string;
  content: string;
  images?: string[];
  isVerified: boolean;
  isHelpful: number;
  isNotHelpful: number;
  status: 'pending' | 'approved' | 'rejected';
  moderatorNotes?: string;
  moderatedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  moderatedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsResponse {
  reviews: AdminReview[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  averageRating: number;
}

export interface ReviewAnalytics {
  totalReviews: number;
  pendingReviews: number;
  approvedReviews: number;
  rejectedReviews: number;
  averageRating: number;
  recentReviews: number;
}

export const useAdminReviews = (params?: {
  status?: 'pending' | 'approved' | 'rejected' | 'all';
  page?: number;
  limit?: number;
}) => {
  const status = params?.status || 'pending';
  const endpoint = status === 'pending' 
    ? '/reviews/admin/pending'
    : `/reviews/product/all`;

  return useQuery({
    queryKey: ['admin', 'reviews', params],
    queryFn: async () => {
      const response = await apiClient.get(endpoint, { 
        params: status === 'pending' ? { page: params?.page, limit: params?.limit } : params
      });
      return response.data.data as ReviewsResponse;
    },
  });
};

export const useReviewAnalytics = () => {
  return useQuery({
    queryKey: ['admin', 'reviews', 'analytics'],
    queryFn: async () => {
      const response = await apiClient.get('/reviews/admin/analytics');
      return response.data.data as ReviewAnalytics;
    },
  });
};

export const useModerateReview = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      reviewId, 
      status, 
      notes 
    }: { 
      reviewId: string; 
      status: 'approved' | 'rejected'; 
      notes?: string;
    }) => {
      const response = await apiClient.patch(`/reviews/${reviewId}/moderate`, {
        status,
        notes,
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
      toast({
        title: `Review ${variables.status}`,
        description: `The review has been ${variables.status} successfully.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to moderate review',
        variant: 'destructive',
      });
    },
  });
};
