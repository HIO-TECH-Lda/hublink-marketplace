import Order from '../models/Order';
import Payment from '../models/Payment';
import User from '../models/User';
import mongoose, { Types } from 'mongoose';

export interface OrderListFilters {
  search?: string;
  status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface OrderStats {
  total: number;
  pending: number;
  totalRevenue: number;
  delivered: number;
  cancelled: number;
}

export class AdminOrderService {
  // Get order statistics
  static async getOrderStats(): Promise<OrderStats> {
    try {
      const stats = await Order.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            totalRevenue: { $sum: '$total' },
            pending: {
              $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
            },
            delivered: {
              $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
            },
            cancelled: {
              $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
            }
          }
        }
      ]);

      return stats[0] || {
        total: 0,
        pending: 0,
        totalRevenue: 0,
        delivered: 0,
        cancelled: 0
      };
    } catch (error) {
      throw new Error(
        `Failed to get order statistics: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Get all orders with filters and pagination
  static async getOrders(filters: OrderListFilters = {}): Promise<{
    orders: any[];
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

      // Search filter (order number, client name, client email)
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

        if (userIds.length > 0) {
          query.$or = [
            { orderNumber: { $regex: search, $options: 'i' } },
            { userId: { $in: userIds } }
          ];
        } else {
          // If no users found, only search by order number
          query.orderNumber = { $regex: search, $options: 'i' };
        }
      }

      // Calculate pagination
      const skip = (page - 1) * limit;
      const sort: any = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

      // Get total count
      const total = await Order.countDocuments(query);

      // Get orders with populated user data
      const orders = await Order.find(query)
        .populate('userId', 'firstName lastName email')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();

      // Format orders for frontend
      const formattedOrders = orders.map((order: any) => ({
        id: order._id.toString(),
        orderNumber: order.orderNumber,
        client: {
          id: order.userId?._id?.toString(),
          name: order.userId ? `${order.userId.firstName} ${order.userId.lastName}` : 'N/A',
          email: order.userId?.email || 'N/A'
        },
        total: order.total,
        status: order.status,
        date: order.createdAt,
        itemCount: order.items?.length || 0,
        paymentStatus: order.payment?.status || 'pending',
        currency: order.currency || 'MZM'
      }));

      return {
        orders: formattedOrders,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(
        `Failed to get orders: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Get order by ID with full details
  static async getOrderById(orderId: string): Promise<any> {
    try {
      const order = await Order.findById(orderId)
        .populate('userId', 'firstName lastName email phone')
        .populate('cancelledBy', 'firstName lastName')
        .lean();

      if (!order) {
        throw new Error('Order not found');
      }

      // Get payment details
      const payment = await Payment.findOne({ orderId: new Types.ObjectId(orderId) }).lean();

      // Format order for frontend
      return {
        ...order,
        id: order._id.toString(),
        client: {
          id: order.userId?._id?.toString(),
          name: order.userId ? `${order.userId.firstName} ${order.userId.lastName}` : 'N/A',
          email: order.userId?.email || 'N/A',
          phone: order.userId?.phone || 'N/A'
        },
        payment: {
          ...order.payment,
          ...payment,
          id: payment?._id?.toString()
        },
        items: order.items.map((item: any) => ({
          ...item,
          productId: item.productId?.toString(),
          sellerId: item.sellerId?.toString()
        }))
      };
    } catch (error) {
      throw new Error(
        `Failed to get order: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

