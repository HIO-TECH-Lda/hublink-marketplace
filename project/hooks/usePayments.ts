import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { PaymentIntent, ManualPaymentData } from '@/types/api';

export const useCreatePaymentIntent = () => {
  return useMutation({
    mutationFn: async (paymentData: {
      amount: number;
      currency: string;
      orderId: string;
    }) => {
      const response = await apiClient.post('/payments/create-intent', paymentData);
      return response.data.data as PaymentIntent;
    },
  });
};

export const useConfirmPayment = () => {
  return useMutation({
    mutationFn: async (paymentData: {
      paymentIntentId: string;
      orderId: string;
    }) => {
      const response = await apiClient.post('/payments/confirm', paymentData);
      return response.data.data;
    },
  });
};

export const useCreateManualPayment = () => {
  return useMutation({
    mutationFn: async (paymentData: ManualPaymentData) => {
      const response = await apiClient.post('/payments/manual', paymentData);
      return response.data.data;
    },
  });
};
