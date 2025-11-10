import Payout, { IPayoutDocument } from '../models/Payout';
import Order from '../models/Order';
import { IPayout } from '../types';

const COMMISSION_RATE = 0.1; // 10% commission

export class PayoutService {
  // Get seller balance summary
  static async getSellerBalance(sellerId: string): Promise<{
    available: number;
    pending: number;
    totalEarned: number;
  }> {
    try {
      // Get all orders with seller's items
      const orders = await Order.find({ 'items.sellerId': sellerId });

      let available = 0;
      let pending = 0;
      let totalEarned = 0;

      for (const order of orders) {
        // Filter items for this seller
        const sellerItems = order.items.filter(
          (item: any) => item.sellerId?.toString() === sellerId
        );

        if (sellerItems.length === 0) continue;

        // Calculate seller's portion of order
        const sellerTotal = sellerItems.reduce(
          (sum: number, item: any) => sum + item.totalPrice,
          0
        );

        // Apply commission
        const commission = sellerTotal * COMMISSION_RATE;
        const netAmount = sellerTotal - commission;

        totalEarned += netAmount;

        // Available: delivered orders with completed payment
        if (
          order.status === 'delivered' &&
          order.payment.status === 'completed'
        ) {
          // Check if already paid out
          const existingPayout = await Payout.findOne({
            sellerId,
            orderIds: order._id,
            status: { $in: ['completed', 'processing'] }
          });

          if (!existingPayout) {
            available += netAmount;
          }
        }

        // Pending: processing/shipped orders or pending payments
        if (
          ['processing', 'shipped', 'confirmed'].includes(order.status) ||
          order.payment.status === 'processing'
        ) {
          pending += netAmount;
        }
      }

      return { available, pending, totalEarned };
    } catch (error) {
      throw new Error(
        `Failed to get seller balance: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Get payout history
  static async getPayoutHistory(
    sellerId: string,
    options: {
      page?: number;
      limit?: number;
      status?: string;
    } = {}
  ): Promise<{
    payouts: IPayoutDocument[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }> {
    try {
      const { page = 1, limit = 10, status } = options;

      const query: any = { sellerId };
      if (status) query.status = status;

      const total = await Payout.countDocuments(query);
      const pages = Math.ceil(total / limit);

      const payouts = await Payout.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('orderIds', 'orderNumber total');

      return { payouts, pagination: { page, limit, total, pages } };
    } catch (error) {
      throw new Error(
        `Failed to get payout history: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Request payout
  static async requestPayout(
    sellerId: string,
    data: {
      amount: number;
      method: 'mpesa' | 'bank_transfer' | 'emola';
    }
  ): Promise<IPayoutDocument> {
    try {
      const balance = await this.getSellerBalance(sellerId);

      if (data.amount > balance.available) {
        throw new Error('Insufficient available balance');
      }

      if (data.amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      // Find orders that contribute to available balance
      const orders = await Order.find({
        'items.sellerId': sellerId,
        status: 'delivered',
        'payment.status': 'completed'
      });

      const orderIds: string[] = [];
      let collectedAmount = 0;
      const periodStart = new Date();
      const periodEnd = new Date();

      for (const order of orders) {
        if (collectedAmount >= data.amount) break;

        const sellerItems = order.items.filter(
          (item: any) => item.sellerId?.toString() === sellerId
        );
        if (sellerItems.length === 0) continue;

        const sellerTotal = sellerItems.reduce(
          (sum: number, item: any) => sum + item.totalPrice,
          0
        );
        const commission = sellerTotal * COMMISSION_RATE;
        const netAmount = sellerTotal - commission;

        // Check if already in a payout
        const existingPayout = await Payout.findOne({
          sellerId,
          orderIds: order._id,
          status: { $in: ['completed', 'processing', 'pending'] }
        });

        if (!existingPayout) {
          orderIds.push(order._id.toString());
          collectedAmount += netAmount;

          if (order.createdAt && order.createdAt < periodStart) {
            periodStart.setTime(order.createdAt.getTime());
          }
        }
      }

      if (collectedAmount < data.amount) {
        throw new Error('Not enough available orders to fulfill payout request');
      }

      // Commission already deducted in balance calculation, so netAmount = amount
      const payout = new Payout({
        sellerId,
        amount: data.amount,
        currency: 'MZM',
        status: 'pending',
        method: data.method,
        periodStart,
        periodEnd,
        orderIds,
        commissionRate: COMMISSION_RATE * 100,
        commissionAmount: 0, // Already deducted from orders
        netAmount: data.amount
      });

      await payout.save();
      return payout;
    } catch (error) {
      throw error;
    }
  }

  // Get payout by ID
  static async getPayoutById(
    payoutId: string,
    sellerId?: string
  ): Promise<IPayoutDocument | null> {
    try {
      const query: any = { _id: payoutId };
      if (sellerId) query.sellerId = sellerId;

      return await Payout.findOne(query).populate('orderIds', 'orderNumber total');
    } catch (error) {
      throw new Error(
        `Failed to get payout: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

