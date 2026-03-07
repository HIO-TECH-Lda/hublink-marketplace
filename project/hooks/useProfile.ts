import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { refreshUser } = useAuth();

  return useMutation({
    mutationFn: async (profileData: FormData | {
      firstName?: string;
      lastName?: string;
      phone?: string;
      avatar?: File;
      billingAddress?: { street: string; city: string; state: string; postalCode: string; country: string; isDefault: boolean };
      shippingAddress?: { street: string; city: string; state: string; postalCode: string; country: string; isDefault: boolean };
      preferences?: { language: string; currency: string; notifications: { email: boolean; sms: boolean; push: boolean } };
      sellerProfile?: { storeName: string; storeDescription: string; address: string; city: string; province: string; postalCode: string; productTypes: string; experience?: string };
    }) => {
      const config = profileData instanceof FormData ? {} : {};
      const response = await apiClient.put('/auth/me', profileData, config);
      return response.data.data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      await refreshUser();
      toast({
        title: 'Perfil atualizado',
        description: 'Suas informações foram atualizadas com sucesso.',
      });
    },
    onError: (error: any) => {
      const apiError = error?.response?.data?.error || error?.response?.data?.message || 'Erro ao atualizar perfil';
      toast({
        title: 'Erro ao atualizar perfil',
        description: apiError,
        variant: 'destructive',
      });
    },
  });
};

export const useChangePassword = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (passwordData: {
      currentPassword: string;
      newPassword: string;
      confirmNewPassword: string;
    }) => {
      const response = await apiClient.put('/auth/change-password', passwordData);
      return response.data.data;
    },
    onSuccess: () => {
      toast({
        title: 'Senha alterada',
        description: 'Sua senha foi alterada com sucesso.',
      });
    },
    onError: (error: any) => {
      const apiError = error?.response?.data?.error || error?.response?.data?.message || 'Erro ao alterar senha';
      toast({
        title: 'Erro ao alterar senha',
        description: apiError,
        variant: 'destructive',
      });
    },
  });
};
