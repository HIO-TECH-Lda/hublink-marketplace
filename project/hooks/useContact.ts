import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  orderNumber?: string;
}

export const useSubmitContactForm = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await apiClient.post('/contact', data);
      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: 'Mensagem enviada!',
        description: data.message || 'Responderemos em até 24 horas.',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Não foi possível enviar a mensagem. Tente novamente.';
      toast({
        title: 'Erro ao enviar',
        description: message,
        variant: 'destructive',
      });
    },
  });
};
