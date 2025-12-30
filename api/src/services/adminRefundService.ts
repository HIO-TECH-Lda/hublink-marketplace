import Refund from '../models/Refund';
import Order from '../models/Order';
import User from '../models/User';
import mongoose, { Types } from 'mongoose';

export interface RefundListFilters {
  search?: string;
  status?: 'pending' | 'approved' | 'rejected';
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface RefundStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  totalValue: number;
}

export class AdminRefundService {
  // Get refund statistics
  static async getRefundStats(): Promise<RefundStats> {
    try {
      const stats = await Refund.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            totalValue: { $sum: '$amount' },
            pending: {
              $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
            },
            approved: {
              $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
            },
            rejected: {
              $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
            }
          }
        }
      ]);

      return stats[0] || {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        totalValue: 0
      };
    } catch (error) {
      throw new Error(
        `Failed to get refund statistics: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Get all refunds with filters and pagination
  static async getRefunds(filters: RefundListFilters = {}): Promise<{
    refunds: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const {
        search,
        status,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = filters;

      // Build query
      const query: any = {};

      // Status filter
      if (status) {
        query.status = status;
      }

      // Search filter (refund ID, order number, client name, client email)
      if (search) {
        // First, try to find users matching the search
        const users = await User.find({
          $or: [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        }).select('_id').limit(100).lean();

        const userIds = users.map((u: any) => u._id);

        // Find orders matching search
        const orders = await Order.find({
          orderNumber: { $regex: search, $options: 'i' }
        }).select('_id').limit(100).lean();

        const orderIds = orders.map((o: any) => o._id);

        // Try to parse as ObjectId for refund ID search
        let refundIdQuery: any = null;
        if (mongoose.Types.ObjectId.isValid(search)) {
          refundIdQuery = { _id: new Types.ObjectId(search) };
        }

        query.$or = [
          refundIdQuery,
          { buyerId: { $in: userIds } },
          { orderId: { $in: orderIds } }
        ].filter(Boolean);
      }

      // Calculate pagination
      const skip = (page - 1) * limit;
      const sort: any = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

      // Get total count
      const total = await Refund.countDocuments(query);

      // Get refunds with populated data
      const refunds = await Refund.find(query)
        .populate('buyerId', 'firstName lastName email')
        .populate('sellerId', 'firstName lastName email sellerProfile')
        .populate('orderId', 'orderNumber createdAt')
        .populate('productId', 'name primaryImage')
        .populate('processedBy', 'firstName lastName')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();

      // Format refunds for frontend
      const formattedRefunds = refunds.map((refund: any) => {
        const buyer = refund.buyerId as any;
        const seller = refund.sellerId as any;
        const order = refund.orderId as any;
        const product = refund.productId as any;

        return {
          id: refund._id.toString(),
          refundNumber: `re_${refund._id.toString().slice(-6)}`,
          order: {
            id: order?._id?.toString(),
            orderNumber: order?.orderNumber || 'N/A',
            date: order?.createdAt || refund.createdAt
          },
          client: {
            id: buyer?._id?.toString() || buyer?.toString(),
            name: buyer ? `${buyer.firstName || ''} ${buyer.lastName || ''}`.trim() : 'N/A',
            email: buyer?.email || 'N/A'
          },
          seller: {
            id: seller?._id?.toString() || seller?.toString(),
            name: seller?.sellerProfile?.storeName || 
                  (seller ? `${seller.firstName || ''} ${seller.lastName || ''}`.trim() : 'N/A')
          },
          product: {
            id: product?._id?.toString() || product?.toString(),
            name: refund.productName || product?.name || 'N/A',
            image: product?.primaryImage || refund.productImage
          },
          amount: refund.amount,
          currency: refund.currency || 'MZM',
          status: refund.status,
          reason: refund.reason,
          description: refund.description,
          images: refund.images || [],
          requestedAt: refund.requestedAt || refund.createdAt,
          processedAt: refund.processedAt,
          processedBy: refund.processedBy ? {
            id: (refund.processedBy as any)?._id?.toString(),
            name: `${(refund.processedBy as any).firstName} ${(refund.processedBy as any).lastName}`
          } : null,
          rejectionReason: refund.rejectionReason,
          createdAt: refund.createdAt,
          updatedAt: refund.updatedAt
        };
      });

      return {
        refunds: formattedRefunds,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(
        `Failed to get refunds: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Get refund by ID with full details
  static async getRefundById(refundId: string): Promise<any> {
    try {
      const refund = await Refund.findById(refundId)
        .populate('buyerId', 'firstName lastName email phone')
        .populate('sellerId', 'firstName lastName email sellerProfile')
        .populate('orderId')
        .populate('productId', 'name primaryImage description')
        .populate('processedBy', 'firstName lastName')
        .lean();

      if (!refund) {
        throw new Error('Refund not found');
      }

      // Get order details
      const order = refund.orderId as any;

      // Format refund for frontend
      const buyer = refund.buyerId as any;
      const seller = refund.sellerId as any;
      const product = refund.productId as any;

      return {
        ...refund,
        id: refund._id.toString(),
        refundNumber: `re_${refund._id.toString().slice(-6)}`,
        client: {
          id: buyer?._id?.toString() || buyer?.toString(),
          name: buyer ? `${buyer.firstName || ''} ${buyer.lastName || ''}`.trim() : 'N/A',
          email: buyer?.email || 'N/A',
          phone: buyer?.phone || 'N/A'
        },
        seller: {
          id: seller?._id?.toString() || seller?.toString(),
          name: seller?.sellerProfile?.storeName || 
                (seller ? `${seller.firstName || ''} ${seller.lastName || ''}`.trim() : 'N/A'),
          email: seller?.email || 'N/A'
        },
        product: {
          id: product?._id?.toString() || product?.toString(),
          name: refund.productName || product?.name || 'N/A',
          image: product?.primaryImage,
          description: product?.description
        },
        order: {
          id: order?._id?.toString(),
          orderNumber: order?.orderNumber,
          total: order?.total,
          status: order?.status,
          createdAt: order?.createdAt
        },
        processedBy: refund.processedBy ? {
          id: (refund.processedBy as any)?._id?.toString(),
          name: `${(refund.processedBy as any).firstName} ${(refund.processedBy as any).lastName}`
        } : null
      };
    } catch (error) {
      throw new Error(
        `Failed to get refund: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Approve refund
  static async approveRefund(refundId: string, processedBy: string): Promise<any> {
    try {
      const refund = await Refund.findById(refundId);

      if (!refund) {
        throw new Error('Refund not found');
      }

      if (refund.status !== 'pending') {
        throw new Error(`Refund is already ${refund.status}`);
      }

      refund.status = 'approved';
      refund.processedAt = new Date();
      refund.processedBy = processedBy;

      await refund.save();

      // Return updated refund with populated data
      return await this.getRefundById(refundId);
    } catch (error) {
      throw new Error(
        `Failed to approve refund: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Reject refund
  static async rejectRefund(
    refundId: string,
    processedBy: string,
    rejectionReason: string
  ): Promise<any> {
    try {
      const refund = await Refund.findById(refundId);

      if (!refund) {
        throw new Error('Refund not found');
      }

      if (refund.status !== 'pending') {
        throw new Error(`Refund is already ${refund.status}`);
      }

      refund.status = 'rejected';
      refund.processedAt = new Date();
      refund.processedBy = processedBy;
      refund.rejectionReason = rejectionReason;

      await refund.save();

      // Return updated refund with populated data
      return await this.getRefundById(refundId);
    } catch (error) {
      throw new Error(
        `Failed to reject refund: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

