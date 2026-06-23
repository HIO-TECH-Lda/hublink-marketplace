import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { affiliateApi } from '@/services/affiliateApi';

export const useTrackAffiliateCode = () => {
  return useMutation({
    mutationFn: (code: string) => affiliateApi.trackByCode(code),
  });
};

export const useResolveAffiliateCode = () => {
  return useMutation({
    mutationFn: (code: string) => affiliateApi.resolveCode(code),
  });
};

export const useMyAffiliateProfile = () => {
  return useQuery({
    queryKey: ['affiliate', 'me'],
    queryFn: () => affiliateApi.getMyAffiliate(),
  });
};

export const useApplyAffiliateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      code?: string;
      paymentMethod?: 'bank_transfer' | 'mpesa' | 'emola' | 'other';
      paymentDetails?: Record<string, unknown>;
    }) => affiliateApi.applyAffiliate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliate', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['affiliate', 'me', 'dashboard'] });
    },
  });
};

export const useMyAffiliateDashboard = () => {
  return useQuery({
    queryKey: ['affiliate', 'me', 'dashboard'],
    queryFn: () => affiliateApi.getMyDashboard(),
  });
};

export const useMyAffiliateConversions = (params?: { page?: number; limit?: number; status?: string }) => {
  return useQuery({
    queryKey: ['affiliate', 'me', 'conversions', params],
    queryFn: () => affiliateApi.getMyConversions(params),
  });
};

export const useAdminAffiliates = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['admin', 'affiliates', params],
    queryFn: () => affiliateApi.getAdminAffiliates(params),
  });
};

export const useCreateAffiliateByAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      userId?: string;
      user?: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        password: string;
        role?: 'buyer' | 'seller' | 'admin' | 'support' | 'affiliate';
      };
      code?: string;
      status?: 'pending' | 'active' | 'blocked';
      commissionType?: 'percentage' | 'fixed';
      commissionValue?: number;
      cookieWindowDays?: number;
      minPayoutAmount?: number;
      paymentMethod?: 'bank_transfer' | 'mpesa' | 'emola' | 'other';
      paymentDetails?: Record<string, unknown>;
    }) => affiliateApi.createAffiliateByAdmin(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'affiliates'] });
    },
  });
};

export const useUpdateAffiliateStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ affiliateId, status }: { affiliateId: string; status: 'pending' | 'active' | 'blocked' }) =>
      affiliateApi.updateAffiliateStatus(affiliateId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'affiliates'] });
    },
  });
};

export const useAdminAffiliateConversions = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  affiliate?: string;
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: ['admin', 'affiliates', 'conversions', params],
    queryFn: () => affiliateApi.getAdminConversions(params),
  });
};

export const useApproveAffiliateConversion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversionId: string) => affiliateApi.approveConversion(conversionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'affiliates', 'conversions'] });
    },
  });
};

export const useRejectAffiliateConversion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversionId, reason }: { conversionId: string; reason: string }) =>
      affiliateApi.rejectConversion(conversionId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'affiliates', 'conversions'] });
    },
  });
};

