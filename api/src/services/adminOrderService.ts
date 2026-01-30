import Order from '../models/Order';
import Payment from '../models/Payment';
import User from '../models/User';
import { OrderService } from './orderService';
import mongoose, { Types } from 'mongoose';
import Messages from '../utils/messages';

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
      throw new Error(error instanceof Error ? error.message : Messages.ADMIN_ORDER.STATS_FAILED);
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
      const formattedOrders = orders.map((order: any) => {
        const user = order.userId as any;
        return {
          id: order._id.toString(),
          orderNumber: order.orderNumber,
          client: {
            id: user?._id?.toString() || user?.toString(),
            name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A' : 'N/A',
            email: user?.email || 'N/A'
          },
          total: order.total,
          status: order.status,
          date: order.createdAt,
          itemCount: order.items?.length || 0,
          paymentStatus: order.payment?.status || 'pending',
          currency: order.currency || 'MZM'
        };
      });

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
        throw new Error(Messages.ORDER.NOT_FOUND);
      }

      // Get payment details
      const payment = await Payment.findOne({ orderId: new Types.ObjectId(orderId) }).lean();

      // Format order for frontend
      const user = order.userId as any;
      
      // Build timeline/activity
      const timeline = [];
      if (order.createdAt) {
        timeline.push({
          type: 'order_created',
          label: 'Pedido Criado',
          date: order.createdAt,
          color: 'green'
        });
      }
      if (order.confirmedAt) {
        timeline.push({
          type: 'order_confirmed',
          label: 'Pedido Confirmado',
          date: order.confirmedAt,
          color: 'blue'
        });
      }
      if (order.processedAt) {
        timeline.push({
          type: 'order_processed',
          label: 'Pedido Processado',
          date: order.processedAt,
          color: 'blue'
        });
      }
      if (order.shippedAt) {
        timeline.push({
          type: 'order_shipped',
          label: 'Pedido Enviado',
          date: order.shippedAt,
          color: 'blue'
        });
      }
      if (order.deliveredAt) {
        timeline.push({
          type: 'order_delivered',
          label: 'Pedido Entregue',
          date: order.deliveredAt,
          color: 'green'
        });
      }
      if (order.cancelledAt) {
        timeline.push({
          type: 'order_cancelled',
          label: 'Pedido Cancelado',
          date: order.cancelledAt,
          color: 'red'
        });
      }
      
      // Sort timeline by date
      timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      return {
        ...order,
        id: order._id.toString(),
        client: {
          id: user?._id?.toString() || user?.toString(),
          name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A' : 'N/A',
          email: user?.email || 'N/A',
          phone: user?.phone || 'N/A'
        },
        payment: {
          ...order.payment,
          ...payment,
          id: payment?._id?.toString(),
          methodLabel: this.getPaymentMethodLabel(order.payment?.method),
          statusLabel: this.getPaymentStatusLabel(order.payment?.status || payment?.status)
        },
        items: order.items.map((item: any) => ({
          ...item,
          productId: item.productId?.toString(),
          sellerId: item.sellerId?.toString()
        })),
        timeline: timeline,
        summary: {
          itemCount: order.items?.length || 0,
          subtotal: order.subtotal,
          tax: order.tax,
          shipping: order.shipping,
          discount: order.discount,
          total: order.total
        }
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : Messages.ADMIN_ORDER.FETCH_FAILED);
    }
  }

  // Update order details
  static async updateOrder(
    orderId: string,
    updateData: {
      status?: string;
      paymentStatus?: string;
      shippingAddress?: {
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
        address?: string;
        city?: string;
        state?: string;
        country?: string;
        zipCode?: string;
      };
      clientInfo?: {
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
      };
      notes?: string;
      trackingNumber?: string;
    }
  ): Promise<any> {
    try {
      const order = await Order.findById(orderId);

      if (!order) {
        throw new Error(Messages.ORDER.NOT_FOUND);
      }

      // Update order status if provided
      if (updateData.status && updateData.status !== order.status) {
        await OrderService.updateOrderStatus(orderId, updateData.status, {
          trackingNumber: updateData.trackingNumber
        });
        // Reload order after status update
        await order.save();
      }

      // Update payment status if provided
      if (updateData.paymentStatus && order.payment) {
        order.payment.status = updateData.paymentStatus as any;
        if (updateData.paymentStatus === 'completed' && !order.payment.paidAt) {
          order.payment.paidAt = new Date();
        }
      }

      // Update shipping address if provided
      if (updateData.shippingAddress) {
        Object.assign(order.shippingAddress, updateData.shippingAddress);
      }

      // Update client info in shipping address if provided
      if (updateData.clientInfo) {
        if (updateData.clientInfo.firstName) {
          order.shippingAddress.firstName = updateData.clientInfo.firstName;
        }
        if (updateData.clientInfo.lastName) {
          order.shippingAddress.lastName = updateData.clientInfo.lastName;
        }
        if (updateData.clientInfo.email) {
          order.shippingAddress.email = updateData.clientInfo.email;
        }
        if (updateData.clientInfo.phone) {
          order.shippingAddress.phone = updateData.clientInfo.phone;
        }
      }

      // Update notes if provided
      if (updateData.notes !== undefined) {
        order.notes = updateData.notes;
      }

      await order.save();

      // Return updated order with populated data
      return await this.getOrderById(orderId);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : Messages.ADMIN_ORDER.UPDATE_FAILED);
    }
  }

  // Helper: Get payment method label
  private static getPaymentMethodLabel(method?: string): string {
    const labels: Record<string, string> = {
      credit_card: 'Cartão de Crédito',
      debit_card: 'Cartão de Débito',
      paypal: 'PayPal',
      bank_transfer: 'Transferência Bancária',
      cash_on_delivery: 'Pagamento na Entrega',
      mpesa: 'M-Pesa',
      emola: 'E-Mola',
      imali: 'iMali'
    };
    return labels[method || ''] || method || 'N/A';
  }

  // Helper: Get payment status label
  private static getPaymentStatusLabel(status?: string): string {
    const labels: Record<string, string> = {
      pending: 'Pendente',
      processing: 'Processando',
      completed: 'Pago',
      failed: 'Falhou',
      refunded: 'Reembolsado'
    };
    return labels[status || ''] || status || 'Pendente';
  }
}

