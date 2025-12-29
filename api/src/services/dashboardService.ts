import User from '../models/User';
import Order from '../models/Order';
import Product from '../models/Product';
import Review from '../models/Review';
import Payment from '../models/Payment';
import Refund from '../models/Refund';
import Ticket from '../models/Ticket';
import Category from '../models/Category';

export interface DashboardStats {
  users: {
    total: number;
    changePercent: number;
    buyers: number;
    sellers: number;
    admins: number;
  };
  orders: {
    total: number;
    pending: number;
    confirmed: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    recent: number; // Last 7 days
  };
  revenue: {
    total: number;
    changePercent: number;
    thisMonth: number;
  };
  products: {
    total: number;
    activeSellers: number;
    lowStock: number; // Stock < 10
    outOfStock: number;
  };
  blogPosts: {
    total: number;
    published: number;
  };
  reviews: {
    averageRating: number;
    total: number;
    pending: number; // Awaiting moderation
  };
  refunds: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  tickets: {
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
    urgent: number;
  };
  categories: {
    total: number;
  };
  payments: {
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  };
  recentActivity: any[];
}

export class DashboardService {
  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Get user stats
      const [totalUsers, thisMonthUsers, buyers, sellers, admins] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ createdAt: { $gte: thisMonth } }),
        User.countDocuments({ role: 'buyer' }),
        User.countDocuments({ role: 'seller' }),
        User.countDocuments({ role: 'admin' })
      ]);

      const lastMonthUserCount = totalUsers - thisMonthUsers;
      const userChangePercent = lastMonthUserCount > 0
        ? ((thisMonthUsers - lastMonthUserCount) / lastMonthUserCount) * 100
        : thisMonthUsers > 0 ? 100 : 0;

      // Get order stats
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const orderStats = await Order.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
            confirmed: { $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] } },
            processing: { $sum: { $cond: [{ $eq: ['$status', 'processing'] }, 1, 0] } },
            shipped: { $sum: { $cond: [{ $eq: ['$status', 'shipped'] }, 1, 0] } },
            delivered: { $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] } },
            cancelled: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } }
          }
        }
      ]);

      const orderData = orderStats[0] || {
        total: 0,
        pending: 0,
        confirmed: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0
      };

      const recentOrders = await Order.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
      });

      // Get revenue stats
      const [totalRevenueResult, lastMonthRevenueResult, thisMonthRevenueResult] = await Promise.all([
        Payment.aggregate([
          { $match: { status: 'completed' } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),
        Payment.aggregate([
          {
            $match: {
              status: 'completed',
              createdAt: { $gte: lastMonth, $lt: thisMonth }
            }
          },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),
        Payment.aggregate([
          {
            $match: {
              status: 'completed',
              createdAt: { $gte: thisMonth }
            }
          },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ])
      ]);

      const totalRevenue = totalRevenueResult[0]?.total || 0;
      const lastMonthRevenue = lastMonthRevenueResult[0]?.total || 0;
      const thisMonthRevenue = thisMonthRevenueResult[0]?.total || 0;
      const revenueChangePercent = lastMonthRevenue > 0
        ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : thisMonthRevenue > 0 ? 100 : 0;

      // Get product stats
      const [totalProducts, activeSellers, lowStockProducts, outOfStockProducts] = await Promise.all([
        Product.countDocuments(),
        User.countDocuments({ role: 'seller', status: 'active' }),
        Product.countDocuments({ stock: { $gt: 0, $lt: 10 } }),
        Product.countDocuments({ stock: 0 })
      ]);

      // Get review stats
      const [reviewStats, pendingReviews] = await Promise.all([
        Review.aggregate([
          { $match: { status: 'approved' } },
          {
            $group: {
              _id: null,
              averageRating: { $avg: '$rating' },
              total: { $sum: 1 }
            }
          }
        ]),
        Review.countDocuments({ status: 'pending' })
      ]);

      const averageRating = reviewStats[0]?.averageRating || 0;
      const totalReviews = reviewStats[0]?.total || 0;

      // Get refund stats
      const refundStats = await Refund.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
            approved: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
            rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } }
          }
        }
      ]);

      const refundData = refundStats[0] || {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0
      };

      // Get ticket stats
      const ticketStats = await Ticket.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            open: { $sum: { $cond: [{ $eq: ['$status', 'open'] }, 1, 0] } },
            inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
            resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
            urgent: { $sum: { $cond: [{ $eq: ['$priority', 'urgent'] }, 1, 0] } }
          }
        }
      ]);

      const ticketData = ticketStats[0] || {
        total: 0,
        open: 0,
        inProgress: 0,
        resolved: 0,
        urgent: 0
      };

      // Get category count
      const totalCategories = await Category.countDocuments({ isActive: true });

      // Get payment stats
      const paymentStats = await Payment.aggregate([
        {
          $group: {
            _id: null,
            pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
            processing: { $sum: { $cond: [{ $eq: ['$status', 'processing'] }, 1, 0] } },
            completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
            failed: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } }
          }
        }
      ]);

      const paymentData = paymentStats[0] || {
        pending: 0,
        processing: 0,
        completed: 0,
        failed: 0
      };

      return {
        users: {
          total: totalUsers,
          changePercent: Math.round(userChangePercent * 100) / 100,
          buyers,
          sellers,
          admins
        },
        orders: {
          total: orderData.total,
          pending: orderData.pending,
          confirmed: orderData.confirmed,
          processing: orderData.processing,
          shipped: orderData.shipped,
          delivered: orderData.delivered,
          cancelled: orderData.cancelled,
          recent: recentOrders
        },
        revenue: {
          total: totalRevenue,
          changePercent: Math.round(revenueChangePercent * 100) / 100,
          thisMonth: thisMonthRevenue
        },
        products: {
          total: totalProducts,
          activeSellers: activeSellers,
          lowStock: lowStockProducts,
          outOfStock: outOfStockProducts
        },
        blogPosts: {
          total: 0,
          published: 0
        },
        reviews: {
          averageRating: Math.round(averageRating * 10) / 10,
          total: totalReviews,
          pending: pendingReviews
        },
        refunds: {
          total: refundData.total,
          pending: refundData.pending,
          approved: refundData.approved,
          rejected: refundData.rejected
        },
        tickets: {
          total: ticketData.total,
          open: ticketData.open,
          inProgress: ticketData.inProgress,
          resolved: ticketData.resolved,
          urgent: ticketData.urgent
        },
        categories: {
          total: totalCategories
        },
        payments: {
          pending: paymentData.pending,
          processing: paymentData.processing,
          completed: paymentData.completed,
          failed: paymentData.failed
        },
        recentActivity: []
      };
    } catch (error) {
      throw new Error(
        `Failed to get dashboard stats: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

