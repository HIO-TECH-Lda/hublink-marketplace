import Affiliate from '../models/Affiliate';
import AffiliateConversion from '../models/AffiliateConversion';

export class AdminAffiliateService {
  static async getAffiliates(filters: {
    page?: number;
    limit?: number;
    status?: 'pending' | 'active' | 'blocked';
    search?: string;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const query: any = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.search) {
      query.code = { $regex: filters.search, $options: 'i' };
    }

    const total = await Affiliate.countDocuments(query);
    const affiliates = await Affiliate.find(query)
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      affiliates,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  static async updateAffiliateStatus(affiliateId: string, status: 'pending' | 'active' | 'blocked') {
    const affiliate = await Affiliate.findByIdAndUpdate(affiliateId, { status }, { new: true });
    return affiliate;
  }

  static async getConversions(filters: {
    page?: number;
    limit?: number;
    status?: 'pending' | 'approved' | 'rejected' | 'paid';
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const query: any = {};

    if (filters.status) query.status = filters.status;

    const total = await AffiliateConversion.countDocuments(query);
    const conversions = await AffiliateConversion.find(query)
      .populate('affiliateId')
      .populate('orderId', 'orderNumber total createdAt')
      .populate('buyerId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      conversions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  static async approveConversion(conversionId: string) {
    return AffiliateConversion.findByIdAndUpdate(
      conversionId,
      { status: 'approved', approvedAt: new Date(), rejectedAt: null, rejectReason: null },
      { new: true }
    );
  }

  static async rejectConversion(conversionId: string, reason?: string) {
    return AffiliateConversion.findByIdAndUpdate(
      conversionId,
      { status: 'rejected', rejectedAt: new Date(), rejectReason: reason || 'Rejected by admin' },
      { new: true }
    );
  }
}

