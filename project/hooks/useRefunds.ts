import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Refund {
  _id: string;
  orderId: string | {
    _id: string;
    orderNumber: string;
    createdAt: string;
    total?: number;
  };
  sellerId: string | {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
  buyerId: string | {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
  productId: string | {
    _id: string;
    name: string;
    primaryImage?: string;
  };
  productName: string;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  description: string;
  images?: string[];
  requestedAt: string;
  processedAt?: string;
  processedBy?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RefundStatistics {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  totalValue: number;
}

// Seller hooks
export const useRefundStatistics = () => {
  const { isAuthenticated, user } = useAuth();
  
  return useQuery({
    queryKey: ['refunds', 'statistics'],
    queryFn: async () => {
      const response = await apiClient.get('/refunds/statistics');
      return response.data.data as RefundStatistics;
    },
    enabled: isAuthenticated && user?.role === 'seller',
  });
};

export const useSellerRefunds = (filters?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) => {
  const { isAuthenticated, user } = useAuth();
  
  return useQuery({
    queryKey: ['refunds', 'seller', filters],
    queryFn: async () => {
      const response = await apiClient.get('/refunds', { params: filters });
      return {
        refunds: response.data.data.refunds as Refund[],
        pagination: response.data.data.pagination,
      };
    },
    enabled: isAuthenticated && user?.role === 'seller',
  });
};

export const useRefund = (refundId: string) => {
  const { isAuthenticated, user } = useAuth();
  
  return useQuery({
    queryKey: ['refund', refundId],
    queryFn: async () => {
      const response = await apiClient.get(`/refunds/${refundId}`);
      return response.data.data.refund as Refund;
    },
    enabled: isAuthenticated && user?.role === 'seller' && !!refundId,
  });
};

export const useApproveRefund = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (refundId: string) => {
      const response = await apiClient.patch(`/refunds/${refundId}/approve`);
      return response.data.data.refund as Refund;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['refunds'] });
      toast({
        title: 'Reembolso aprovado',
        description: 'O reembolso foi aprovado com sucesso.',
      });
    },
    onError: (error: any) => {
      const apiError = error?.response?.data?.error || error?.response?.data?.message || 'Erro ao aprovar reembolso';
      toast({
        title: 'Erro ao aprovar reembolso',
        description: apiError,
        variant: 'destructive',
      });
    },
  });
};

export const useRejectRefund = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ refundId, rejectionReason }: { refundId: string; rejectionReason: string }) => {
      const response = await apiClient.patch(`/refunds/${refundId}/reject`, { rejectionReason });
      return response.data.data.refund as Refund;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['refunds'] });
      toast({
        title: 'Reembolso rejeitado',
        description: 'O reembolso foi rejeitado com sucesso.',
      });
    },
    onError: (error: any) => {
      const apiError = error?.response?.data?.error || error?.response?.data?.message || 'Erro ao rejeitar reembolso';
      toast({
        title: 'Erro ao rejeitar reembolso',
        description: apiError,
        variant: 'destructive',
      });
    },
  });
};

// Buyer hooks
export const useCreateRefundRequest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (refundData: {
      orderId: string;
      productId: string;
      reason: string;
      description: string;
      images?: string[];
      orderItemId?: string;
    }) => {
      const response = await apiClient.post('/refunds/request', refundData);
      return response.data.data.refund as Refund;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['refunds', 'my-refunds'] });
      queryClient.invalidateQueries({ queryKey: ['order'] });
      toast({
        title: 'Solicitação de reembolso criada',
        description: 'Sua solicitação de reembolso foi enviada com sucesso.',
      });
    },
    onError: (error: any) => {
      const apiError = error?.response?.data?.error || error?.response?.data?.message || 'Erro ao criar solicitação de reembolso';
      toast({
        title: 'Erro ao criar solicitação',
        description: apiError,
        variant: 'destructive',
      });
    },
  });
};

export const useBuyerRefunds = (filters?: {
  page?: number;
  limit?: number;
  status?: string;
}) => {
  const { isAuthenticated, user } = useAuth();
  
  return useQuery({
    queryKey: ['refunds', 'my-refunds', filters],
    queryFn: async () => {
      const response = await apiClient.get('/refunds/my-refunds', { params: filters });
      return {
        refunds: response.data.data.refunds as Refund[],
        pagination: response.data.data.pagination,
      };
    },
    enabled: isAuthenticated && user?.role === 'buyer',
  });
};

export const useBuyerRefund = (refundId: string) => {
  const { isAuthenticated, user } = useAuth();
  
  return useQuery({
    queryKey: ['refund', 'my-refund', refundId],
    queryFn: async () => {
      const response = await apiClient.get(`/refunds/my-refunds/${refundId}`);
      return response.data.data.refund as Refund;
    },
    enabled: isAuthenticated && user?.role === 'buyer' && !!refundId,
  });
};

