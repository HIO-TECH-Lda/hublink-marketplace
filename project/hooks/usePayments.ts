import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import type {
  Payment,
  PaymentIntent,
  PaymentStatus,
  ManualPaymentData,
  ProcessPaymentRequest,
  ProcessPaymentResponse,
  ProcessRefundRequest,
} from '@/types/api';

// ─── Buyer hooks ────────────────────────────────────────────────────────────

export const useProcessPayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: ProcessPaymentRequest) => {
      const response = await apiClient.post('/payments/process', data);
      return response.data.data as ProcessPaymentResponse;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] });
      qc.invalidateQueries({ queryKey: ['payments'] });
    },
  });
};

export const useCreatePaymentIntent = () => {
  return useMutation({
    mutationFn: async (data: { orderId: string; amount: number; currency?: string; paymentMethod?: string }) => {
      const response = await apiClient.post('/payments/create-intent', data);
      return response.data.data as PaymentIntent;
    },
  });
};

export const useConfirmPayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { paymentIntentId: string }) => {
      const response = await apiClient.post('/payments/confirm', data);
      return response.data.data as Payment;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] });
      qc.invalidateQueries({ queryKey: ['payments'] });
    },
  });
};

export const useCreateManualPayment = () => {
  return useMutation({
    mutationFn: async (data: ManualPaymentData) => {
      const response = await apiClient.post('/payments/manual', data);
      return response.data.data as Payment;
    },
  });
};

export const usePayment = (paymentId: string) => {
  return useQuery({
    queryKey: ['payments', paymentId],
    queryFn: async () => {
      const response = await apiClient.get(`/payments/${paymentId}`);
      return response.data.data as Payment;
    },
    enabled: !!paymentId,
  });
};

export const usePaymentByOrder = (orderId: string) => {
  return useQuery({
    queryKey: ['payments', 'order', orderId],
    queryFn: async () => {
      const response = await apiClient.get(`/payments/order/${orderId}`);
      return response.data.data as Payment;
    },
    enabled: !!orderId,
  });
};

export const useUserPayments = () => {
  return useQuery({
    queryKey: ['payments', 'user'],
    queryFn: async () => {
      const response = await apiClient.get('/payments/user/payments');
      return response.data.data as Payment[];
    },
  });
};

// ─── Admin / Seller hooks ───────────────────────────────────────────────────

export const useCompleteManualPayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (paymentId: string) => {
      const response = await apiClient.patch(`/payments/manual/${paymentId}/complete`);
      return response.data.data as Payment;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payments'] });
      qc.invalidateQueries({ queryKey: ['orders'] });
      qc.invalidateQueries({ queryKey: ['admin', 'payments'] });
    },
  });
};

export const useProcessRefund = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: ProcessRefundRequest) => {
      const response = await apiClient.post('/payments/refund', data);
      return response.data.data as Payment;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payments'] });
      qc.invalidateQueries({ queryKey: ['orders'] });
      qc.invalidateQueries({ queryKey: ['admin', 'payments'] });
    },
  });
};

export const usePaymentsByStatus = (status: PaymentStatus) => {
  return useQuery({
    queryKey: ['payments', 'status', status],
    queryFn: async () => {
      const response = await apiClient.get(`/payments/status/${status}`);
      return response.data.data as Payment[];
    },
    enabled: !!status,
  });
};

export const usePaymentStatistics = () => {
  return useQuery({
    queryKey: ['payments', 'statistics'],
    queryFn: async () => {
      const response = await apiClient.get('/payments/statistics/overview');
      return response.data.data;
    },
  });
};

export const usePaymentAnalytics = (period: '7d' | '30d' | '90d' | '1y' = '30d') => {
  return useQuery({
    queryKey: ['payments', 'analytics', period],
    queryFn: async () => {
      const response = await apiClient.get('/payments/analytics', { params: { period } });
      return response.data.data;
    },
  });
};

export const usePaymentPerformance = () => {
  return useQuery({
    queryKey: ['payments', 'performance'],
    queryFn: async () => {
      const response = await apiClient.get('/payments/performance');
      return response.data.data;
    },
  });
};
