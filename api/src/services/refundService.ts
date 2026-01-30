import mongoose from 'mongoose';
import Refund, { IRefundDocument } from '../models/Refund';
import Order from '../models/Order';
import { IRefund } from '../types';
import { uploadBase64Image } from '../utils/cloudinary';
import Messages from '../utils/messages';

export class RefundService {
  // Get refund statistics for seller
  static async getSellerRefundStatistics(sellerId: string): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    totalValue: number;
  }> {
    try {
      const stats = await Refund.aggregate([
        { $match: { sellerId: new mongoose.Types.ObjectId(sellerId) } },
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
      // Fallback if aggregation fails
      const refunds = await Refund.find({ sellerId });
      return {
        total: refunds.length,
        pending: refunds.filter(r => r.status === 'pending').length,
        approved: refunds.filter(r => r.status === 'approved').length,
        rejected: refunds.filter(r => r.status === 'rejected').length,
        totalValue: refunds.reduce((sum, r) => sum + r.amount, 0)
      };
    }
  }

  // Get seller refunds
  static async getSellerRefunds(
    sellerId: string,
    options: {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
    } = {}
  ): Promise<{
    refunds: IRefundDocument[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }> {
    try {
      const { page = 1, limit = 10, status, search } = options;

      const query: any = { sellerId };
      if (status) query.status = status;
      if (search) {
        query.$or = [
          { productName: { $regex: search, $options: 'i' } },
          { reason: { $regex: search, $options: 'i' } }
        ];
      }

      const total = await Refund.countDocuments(query);
      const pages = Math.ceil(total / limit);

      const refunds = await Refund.find(query)
        .populate('buyerId', 'firstName lastName email')
        .populate('orderId', 'orderNumber createdAt')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      return { refunds, pagination: { page, limit, total, pages } };
    } catch (error) {
      throw new Error(
        `Failed to get refunds: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Get refund by ID (seller)
  static async getRefundById(
    refundId: string,
    sellerId?: string
  ): Promise<IRefundDocument | null> {
    try {
      const query: any = { _id: refundId };
      if (sellerId) query.sellerId = sellerId;

      return await Refund.findOne(query)
        .populate('buyerId', 'firstName lastName email')
        .populate('orderId', 'orderNumber createdAt total')
        .populate('productId', 'name primaryImage');
    } catch (error) {
      throw new Error(
        `Failed to get refund: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Approve refund
  static async approveRefund(
    refundId: string,
    sellerId: string,
    processedBy: string
  ): Promise<IRefundDocument> {
    try {
      const refund = await Refund.findOne({ _id: refundId, sellerId });
      if (!refund) {
        throw new Error(Messages.REFUND.NOT_FOUND);
      }

      if (refund.status !== 'pending') {
        throw new Error(Messages.REFUND.NOT_PENDING);
      }

      refund.status = 'approved';
      refund.processedAt = new Date();
      refund.processedBy = processedBy;
      await refund.save();

      // Update order item status if needed
      // This could trigger payment refund processing

      return refund;
    } catch (error) {
      throw error;
    }
  }

  // Reject refund
  static async rejectRefund(
    refundId: string,
    sellerId: string,
    processedBy: string,
    rejectionReason: string
  ): Promise<IRefundDocument> {
    try {
      const refund = await Refund.findOne({ _id: refundId, sellerId });
      if (!refund) {
        throw new Error(Messages.REFUND.NOT_FOUND);
      }

      if (refund.status !== 'pending') {
        throw new Error(Messages.REFUND.NOT_PENDING);
      }

      refund.status = 'rejected';
      refund.processedAt = new Date();
      refund.processedBy = processedBy;
      refund.rejectionReason = rejectionReason;
      await refund.save();

      return refund;
    } catch (error) {
      throw error;
    }
  }

  // Create refund request (buyer)
  static async createRefundRequest(
    buyerId: string,
    data: {
      orderId: string;
      orderItemId?: string;
      productId: string;
      reason: string;
      description: string;
      images?: string[];
    }
  ): Promise<IRefundDocument> {
    try {
      // Verify order belongs to buyer
      const order = await Order.findById(data.orderId);
      if (!order) {
        throw new Error(Messages.ORDER.NOT_FOUND);
      }

      if (order.userId.toString() !== buyerId) {
        throw new Error(Messages.REFUND.ORDER_NOT_BELONG);
      }

      // Find the product in order items
      const orderItem = order.items.find(
        (item: any) => item.productId.toString() === data.productId
      );

      if (!orderItem) {
        throw new Error(Messages.REFUND.PRODUCT_NOT_IN_ORDER);
      }

      // Check if refund already exists for this order item
      const existingRefund = await Refund.findOne({
        orderId: data.orderId,
        buyerId,
        productId: data.productId,
        status: { $in: ['pending', 'approved'] }
      });

      if (existingRefund) {
        throw new Error(Messages.REFUND.REQUEST_EXISTS);
      }

      // Upload images to Cloudinary
      const uploadedImages: string[] = [];
      if (data.images && data.images.length > 0) {
        for (const image of data.images) {
          const uploaded = await uploadBase64Image(image, 'refunds');
          uploadedImages.push(uploaded.url);
        }
      }

      // Create refund
      const refund = new Refund({
        orderId: data.orderId,
        orderItemId: data.orderItemId,
        sellerId: orderItem.sellerId,
        buyerId,
        productId: data.productId,
        productName: orderItem.productName,
        amount: orderItem.totalPrice,
        currency: order.currency || 'MZM',
        status: 'pending',
        reason: data.reason,
        description: data.description,
        images: uploadedImages,
        requestedAt: new Date()
      });

      await refund.save();
      return refund;
    } catch (error) {
      throw error;
    }
  }

  // Get buyer refunds
  static async getBuyerRefunds(
    buyerId: string,
    options: {
      page?: number;
      limit?: number;
      status?: string;
    } = {}
  ): Promise<{
    refunds: IRefundDocument[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }> {
    try {
      const { page = 1, limit = 10, status } = options;

      const query: any = { buyerId };
      if (status) query.status = status;

      const total = await Refund.countDocuments(query);
      const pages = Math.ceil(total / limit);

      const refunds = await Refund.find(query)
        .populate('sellerId', 'firstName lastName')
        .populate('orderId', 'orderNumber createdAt')
        .populate('productId', 'name primaryImage')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      return { refunds, pagination: { page, limit, total, pages } };
    } catch (error) {
      throw new Error(
        `Failed to get buyer refunds: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Get refund by ID (buyer or seller)
  static async getRefundByIdForBuyer(
    refundId: string,
    buyerId: string
  ): Promise<IRefundDocument | null> {
    try {
      return await Refund.findOne({ _id: refundId, buyerId })
        .populate('sellerId', 'firstName lastName email')
        .populate('orderId', 'orderNumber createdAt total')
        .populate('productId', 'name primaryImage');
    } catch (error) {
      throw new Error(
        `Failed to get refund: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Get all refunds (admin)
  static async getAllRefunds(
    options: {
      page?: number;
      limit?: number;
      status?: string;
      sellerId?: string;
      buyerId?: string;
      search?: string;
    } = {}
  ): Promise<{
    refunds: IRefundDocument[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }> {
    try {
      const { page = 1, limit = 10, status, sellerId, buyerId, search } = options;

      const query: any = {};
      if (status) query.status = status;
      if (sellerId) query.sellerId = sellerId;
      if (buyerId) query.buyerId = buyerId;
      if (search) {
        query.$or = [
          { productName: { $regex: search, $options: 'i' } },
          { reason: { $regex: search, $options: 'i' } }
        ];
      }

      const total = await Refund.countDocuments(query);
      const pages = Math.ceil(total / limit);

      const refunds = await Refund.find(query)
        .populate('sellerId', 'firstName lastName email')
        .populate('buyerId', 'firstName lastName email')
        .populate('orderId', 'orderNumber createdAt total')
        .populate('productId', 'name primaryImage')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      return { refunds, pagination: { page, limit, total, pages } };
    } catch (error) {
      throw new Error(
        `Failed to get all refunds: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Get all refund statistics (admin)
  static async getAllRefundStatistics(): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    totalValue: number;
  }> {
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
      // Fallback if aggregation fails
      const refunds = await Refund.find({});
      return {
        total: refunds.length,
        pending: refunds.filter(r => r.status === 'pending').length,
        approved: refunds.filter(r => r.status === 'approved').length,
        rejected: refunds.filter(r => r.status === 'rejected').length,
        totalValue: refunds.reduce((sum, r) => sum + r.amount, 0)
      };
    }
  }

  // Approve refund (admin - can approve any refund)
  static async approveRefundByAdmin(
    refundId: string,
    processedBy: string
  ): Promise<IRefundDocument> {
    try {
      const refund = await Refund.findById(refundId);
      if (!refund) {
        throw new Error(Messages.REFUND.NOT_FOUND);
      }

      if (refund.status !== 'pending') {
        throw new Error(Messages.REFUND.NOT_PENDING);
      }

      refund.status = 'approved';
      refund.processedAt = new Date();
      refund.processedBy = processedBy;
      await refund.save();

      return refund;
    } catch (error) {
      throw error;
    }
  }

  // Reject refund (admin - can reject any refund)
  static async rejectRefundByAdmin(
    refundId: string,
    processedBy: string,
    rejectionReason: string
  ): Promise<IRefundDocument> {
    try {
      const refund = await Refund.findById(refundId);
      if (!refund) {
        throw new Error(Messages.REFUND.NOT_FOUND);
      }

      if (refund.status !== 'pending') {
        throw new Error(Messages.REFUND.NOT_PENDING);
      }

      refund.status = 'rejected';
      refund.processedAt = new Date();
      refund.processedBy = processedBy;
      refund.rejectionReason = rejectionReason;
      await refund.save();

      return refund;
    } catch (error) {
      throw error;
    }
  }
}

