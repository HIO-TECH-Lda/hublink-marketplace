import apiClient from '@/lib/api-client';
import {
  Affiliate,
  ApplyAffiliatePayload,
  AffiliateConversionsResponse,
  AffiliateDashboardData,
  AffiliateListResponse,
  AffiliateTrackingData,
  ApiEnvelope,
  CreateAffiliateByAdminPayload,
} from '@/types/affiliate';

export const affiliateApi = {
  trackByCode: async (code: string) => {
    const response = await apiClient.get<ApiEnvelope<AffiliateTrackingData>>(`/affiliate/track/${code}`);
    return response.data.data;
  },

  resolveCode: async (code: string) => {
    const response = await apiClient.post<ApiEnvelope<Record<string, unknown>>>('/affiliate/resolve', { code });
    return response.data.data;
  },

  getMyAffiliate: async () => {
    const response = await apiClient.get<ApiEnvelope<{ affiliate: Affiliate | null }>>('/affiliate/me');
    return response.data.data;
  },

  applyAffiliate: async (payload: ApplyAffiliatePayload) => {
    const response = await apiClient.post<ApiEnvelope<{ affiliate: Affiliate }>>('/affiliate/apply', payload);
    return response.data.data;
  },

  getMyDashboard: async () => {
    const response = await apiClient.get<ApiEnvelope<AffiliateDashboardData | null>>('/affiliate/me/dashboard');
    return response.data.data;
  },

  getMyConversions: async (params?: { page?: number; limit?: number; status?: string }) => {
    const response = await apiClient.get<ApiEnvelope<AffiliateConversionsResponse | null>>('/affiliate/me/conversions', {
      params,
    });
    return response.data.data;
  },

  getAdminAffiliates: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) => {
    const response = await apiClient.get<ApiEnvelope<AffiliateListResponse>>('/admin/affiliates', { params });
    return response.data.data;
  },

  createAffiliateByAdmin: async (payload: CreateAffiliateByAdminPayload) => {
    const response = await apiClient.post<ApiEnvelope<{ affiliate: Affiliate }>>('/admin/affiliates', payload);
    return response.data.data;
  },

  updateAffiliateStatus: async (affiliateId: string, status: 'pending' | 'active' | 'blocked') => {
    const response = await apiClient.patch<ApiEnvelope<{ affiliate: Affiliate }>>(
      `/admin/affiliates/${affiliateId}/status`,
      { status }
    );
    return response.data.data;
  },

  getAdminConversions: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    affiliate?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await apiClient.get<ApiEnvelope<AffiliateConversionsResponse>>('/admin/affiliates/conversions', {
      params,
    });
    return response.data.data;
  },

  approveConversion: async (conversionId: string) => {
    const response = await apiClient.patch<ApiEnvelope<{ conversion: Record<string, unknown> }>>(
      `/admin/affiliates/conversions/${conversionId}/approve`
    );
    return response.data.data;
  },

  rejectConversion: async (conversionId: string, reason: string) => {
    const response = await apiClient.patch<ApiEnvelope<{ conversion: Record<string, unknown> }>>(
      `/admin/affiliates/conversions/${conversionId}/reject`,
      { reason }
    );
    return response.data.data;
  },
};

