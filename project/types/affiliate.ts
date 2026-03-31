export type AffiliateStatus = 'pending' | 'active' | 'blocked';

export type AffiliateCommissionType = 'percentage' | 'fixed';

export type AffiliateConversionStatus = 'pending' | 'approved' | 'rejected' | 'paid';
export type AffiliatePaymentMethod = 'bank_transfer' | 'mpesa' | 'emola' | 'other';

export interface AffiliateUserRef {
  _id: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
}

export interface Affiliate {
  _id: string;
  userId: string | AffiliateUserRef;
  code: string;
  status: AffiliateStatus;
  commissionType: AffiliateCommissionType;
  commissionValue: number;
  cookieWindowDays: number;
  minPayoutAmount: number;
  paymentMethod?: AffiliatePaymentMethod;
  paymentDetails?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApplyAffiliatePayload {
  code?: string;
  paymentMethod?: AffiliatePaymentMethod;
  paymentDetails?: Record<string, unknown>;
}

export interface CreateAffiliateByAdminPayload {
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
  status?: AffiliateStatus;
  commissionType?: AffiliateCommissionType;
  commissionValue?: number;
  cookieWindowDays?: number;
  minPayoutAmount?: number;
  paymentMethod?: AffiliatePaymentMethod;
  paymentDetails?: Record<string, unknown>;
}

export interface AffiliateTrackingData {
  tracked: boolean;
  affiliateId?: string;
  code?: string;
  cookieWindowDays?: number;
}

export interface AffiliateConversion {
  _id: string;
  affiliateId: string;
  orderId: string | { _id: string; orderNumber?: string };
  orderNumber?: string;
  orderTotal?: number;
  orderSubtotal?: number;
  commissionAmount: number;
  currency?: string;
  status: AffiliateConversionStatus;
  rejectReason?: string;
  attributedAt?: string;
  createdAt?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface AffiliateDashboardSummary {
  clicks: number;
  uniqueClicks?: number;
  conversions: number;
  conversionRate?: number;
  pendingCommission: number;
  approvedCommission: number;
  paidCommission: number;
  rejectedCommission: number;
}

export interface AffiliateDashboardData {
  affiliate: Affiliate;
  summary: AffiliateDashboardSummary;
  recentConversions?: AffiliateConversion[];
  recentClicks?: Array<Record<string, unknown>>;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AffiliateListResponse {
  affiliates: Affiliate[];
  pagination: Pagination;
}

export interface AffiliateConversionsResponse {
  conversions: AffiliateConversion[];
  pagination: Pagination;
}
