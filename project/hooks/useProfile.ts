import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (profileData: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      billingAddress?: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        isDefault: boolean;
      };
      shippingAddress?: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        isDefault: boolean;
      };
      preferences?: {
        language: string;
        currency: string;
        notifications: {
          email: boolean;
          sms: boolean;
          push: boolean;
        };
      };
      sellerProfile?: {
        storeName: string;
        storeDescription: string;
        address: string;
        city: string;
        province: string;
        postalCode: string;
        productTypes: string;
        experience?: string;
      };
    }) => {
      const response = await apiClient.put('/auth/me', profileData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
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
