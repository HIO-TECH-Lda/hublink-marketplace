import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';

export interface NewsletterSubscribeData {
  email: string;
  name?: string;
  source?: 'popup' | 'footer' | 'checkout';
}

export interface NewsletterUnsubscribeData {
  email: string;
  reason?: string;
}

export const useNewsletterSubscribe = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: NewsletterSubscribeData) => {
      const response = await apiClient.post('/newsletter/subscribe', data);
      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: data.data?.alreadySubscribed ? '✅ Já inscrito!' : '✅ Inscrição realizada!',
        description: data.message,
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Não foi possível realizar a inscrição.';
      toast({
        title: 'Erro na inscrição',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

export const useNewsletterUnsubscribe = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: NewsletterUnsubscribeData) => {
      const response = await apiClient.post('/newsletter/unsubscribe', data);
      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: 'Inscrição cancelada',
        description: data.message,
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Não foi possível cancelar a inscrição.';
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

export const useNewsletterStatus = (email: string) => {
  return useQuery({
    queryKey: ['newsletter', 'status', email],
    queryFn: async () => {
      const response = await apiClient.get(`/newsletter/status/${email}`);
      return response.data.data as {
        subscribed: boolean;
        verified: boolean;
        subscribedAt?: string;
        status: string;
      };
    },
    enabled: !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  });
};
