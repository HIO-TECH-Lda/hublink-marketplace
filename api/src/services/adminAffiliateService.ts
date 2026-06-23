import Affiliate from '../models/Affiliate';
import AffiliateConversion from '../models/AffiliateConversion';
import User from '../models/User';
import crypto from 'crypto';

export class AdminAffiliateService {
  private static async generateUniqueCode(seed?: string): Promise<string> {
    const base = (seed || 'AFF')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 6) || 'AFF';

    for (let i = 0; i < 10; i++) {
      const suffix = crypto.randomBytes(3).toString('hex').toUpperCase();
      const code = `${base}${suffix}`;
      const exists = await Affiliate.findOne({ code });
      if (!exists) return code;
    }

    throw new Error('Failed to generate unique affiliate code');
  }

  static async createAffiliate(payload: {
    userId?: string;
    user?: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      password: string;
      role?: 'buyer' | 'seller' | 'admin' | 'support';
      status?: 'active' | 'inactive' | 'suspended';
      emailVerified?: boolean;
      phoneVerified?: boolean;
    };
    code?: string;
    status?: 'pending' | 'active' | 'blocked';
    commissionType?: 'percentage' | 'fixed';
    commissionValue?: number;
    cookieWindowDays?: number;
    minPayoutAmount?: number;
    paymentMethod?: 'bank_transfer' | 'mpesa' | 'emola' | 'other';
    paymentDetails?: Record<string, any>;
  }) {
    let targetUserId = payload.userId;

    if (!targetUserId && payload.user) {
      const existingByEmailOrPhone = await User.findOne({
        $or: [{ email: payload.user.email.toLowerCase() }, { phone: payload.user.phone }],
      });

      if (existingByEmailOrPhone) {
        throw new Error('Email or phone already exists');
      }

      const newUser = await User.create({
        firstName: payload.user.firstName,
        lastName: payload.user.lastName,
        email: payload.user.email.toLowerCase(),
        phone: payload.user.phone,
        password: payload.user.password,
        role: payload.user.role || 'buyer',
        status: payload.user.status || 'active',
        emailVerified: payload.user.emailVerified ?? false,
        phoneVerified: payload.user.phoneVerified ?? false,
      });

      targetUserId = (newUser._id as any).toString();
    }

    if (!targetUserId) {
      throw new Error('userId or user payload is required');
    }

    const user = await User.findById(targetUserId);
    if (!user) {
      throw new Error('User not found');
    }

    const existing = await Affiliate.findOne({ userId: targetUserId });
    if (existing) {
      throw new Error('User already has an affiliate profile');
    }

    let code = payload.code?.trim().toUpperCase();
    if (code) {
      const taken = await Affiliate.findOne({ code });
      if (taken) throw new Error('Affiliate code already exists');
    } else {
      code = await this.generateUniqueCode(`AFF${String(targetUserId).slice(-4)}`);
    }

    const affiliate = await Affiliate.create({
      userId: targetUserId,
      code,
      status: payload.status || 'active',
      commissionType: payload.commissionType || 'percentage',
      commissionValue: payload.commissionValue ?? Number(process.env.AFFILIATE_DEFAULT_COMMISSION || 5),
      cookieWindowDays: payload.cookieWindowDays ?? Number(process.env.AFFILIATE_COOKIE_WINDOW_DAYS || 30),
      minPayoutAmount: payload.minPayoutAmount ?? Number(process.env.AFFILIATE_MIN_PAYOUT || 1000),
      paymentMethod: payload.paymentMethod,
      paymentDetails: payload.paymentDetails || {},
    });

    return affiliate;
  }

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

