import crypto from 'crypto';
import Affiliate, { IAffiliate } from '../models/Affiliate';
import AffiliateClick from '../models/AffiliateClick';
import AffiliateConversion from '../models/AffiliateConversion';

export class AffiliateService {
  static async trackCode(code: string, reqMeta: {
    userId?: string;
    sessionId?: string;
    ip?: string;
    userAgent?: string;
    referer?: string;
    landingUrl?: string;
    utm?: Record<string, string | undefined>;
  }) {
    const normalizedCode = code.trim().toUpperCase();
    const affiliate = await Affiliate.findOne({ code: normalizedCode, status: 'active' });

    if (!affiliate) {
      return { tracked: false };
    }

    const ipHash = reqMeta.ip
      ? crypto.createHash('sha256').update(reqMeta.ip).digest('hex')
      : undefined;

    await AffiliateClick.create({
      affiliateId: affiliate._id,
      code: affiliate.code,
      sessionId: reqMeta.sessionId,
      buyerId: reqMeta.userId,
      ipHash,
      userAgent: reqMeta.userAgent,
      referer: reqMeta.referer,
      landingUrl: reqMeta.landingUrl,
      utm: {
        source: reqMeta.utm?.source,
        medium: reqMeta.utm?.medium,
        campaign: reqMeta.utm?.campaign,
        content: reqMeta.utm?.content,
        term: reqMeta.utm?.term,
      },
    });

    return {
      tracked: true,
      affiliateId: affiliate._id,
      code: affiliate.code,
      cookieWindowDays: affiliate.cookieWindowDays,
    };
  }

  static async getMyAffiliate(userId: string): Promise<IAffiliate | null> {
    return Affiliate.findOne({ userId }).populate('userId', 'firstName lastName email');
  }

  static async getMyDashboard(userId: string) {
    const affiliate = await Affiliate.findOne({ userId });
    if (!affiliate) {
      return null;
    }

    const [clicks, conversions, statusStats] = await Promise.all([
      AffiliateClick.countDocuments({ affiliateId: affiliate._id }),
      AffiliateConversion.countDocuments({ affiliateId: affiliate._id }),
      AffiliateConversion.aggregate([
        { $match: { affiliateId: affiliate._id } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            amount: { $sum: '$commissionAmount' },
          },
        },
      ]),
    ]);

    const map: Record<string, { count: number; amount: number }> = {};
    statusStats.forEach((row: any) => {
      map[row._id] = { count: row.count, amount: row.amount };
    });

    return {
      affiliate,
      summary: {
        clicks,
        conversions,
        pendingCommission: map.pending?.amount || 0,
        approvedCommission: map.approved?.amount || 0,
        paidCommission: map.paid?.amount || 0,
        rejectedCommission: map.rejected?.amount || 0,
      },
    };
  }

  static async getMyConversions(userId: string, page = 1, limit = 10, status?: string) {
    const affiliate = await Affiliate.findOne({ userId });
    if (!affiliate) {
      return null;
    }

    const query: any = { affiliateId: affiliate._id };
    if (status) query.status = status;

    const total = await AffiliateConversion.countDocuments(query);
    const items = await AffiliateConversion.find(query)
      .populate('orderId', 'orderNumber total createdAt')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      conversions: items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}

