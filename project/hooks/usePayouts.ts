import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Balance {
  available: number;
  pending: number;
  totalEarned: number;
}

export interface Payout {
  _id: string;
  sellerId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  method: 'mpesa' | 'bank_transfer' | 'emola';
  periodStart: string;
  periodEnd: string;
  orderIds: string[];
  commissionRate: number;
  commissionAmount: number;
  netAmount: number;
  processedAt?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

export const usePayoutBalance = () => {
  const { isAuthenticated, user } = useAuth();
  
  return useQuery({
    queryKey: ['payouts', 'balance'],
    queryFn: async () => {
      const response = await apiClient.get('/payouts/balance');
      return response.data.data as Balance;
    },
    enabled: isAuthenticated && user?.role === 'seller',
  });
};

export const usePayoutHistory = (filters?: {
  page?: number;
  limit?: number;
  status?: string;
}) => {
  const { isAuthenticated, user } = useAuth();
  
  return useQuery({
    queryKey: ['payouts', 'history', filters],
    queryFn: async () => {
      const response = await apiClient.get('/payouts/history', { params: filters });
      return {
        payouts: response.data.data.payouts as Payout[],
        pagination: response.data.data.pagination,
      };
    },
    enabled: isAuthenticated && user?.role === 'seller',
  });
};

export const usePayout = (payoutId: string) => {
  const { isAuthenticated, user } = useAuth();
  
  return useQuery({
    queryKey: ['payout', payoutId],
    queryFn: async () => {
      const response = await apiClient.get(`/payouts/${payoutId}`);
      return response.data.data.payout as Payout;
    },
    enabled: isAuthenticated && user?.role === 'seller' && !!payoutId,
  });
};

export const useRequestPayout = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (payoutData: {
      amount: number;
      method: 'mpesa' | 'bank_transfer' | 'emola';
    }) => {
      const response = await apiClient.post('/payouts/request', payoutData);
      return response.data.data.payout as Payout;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payouts'] });
      toast({
        title: 'Repasse solicitado',
        description: 'Sua solicitação de repasse foi enviada com sucesso.',
      });
    },
    onError: (error: any) => {
      const apiError = error?.response?.data?.error || error?.response?.data?.message || 'Erro ao solicitar repasse';
      toast({
        title: 'Erro ao solicitar repasse',
        description: apiError,
        variant: 'destructive',
      });
    },
  });
};

