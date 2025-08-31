import Stripe from 'stripe';
import Payment, { IPayment } from '../models/Payment';
import Order from '../models/Order';
import { IOrder } from '../models/Order';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-08-27.basil'
});

export interface CreatePaymentIntentRequest {
  orderId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  userId: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}

export interface RefundRequest {
  paymentId: string;
  amount: number;
  reason: string;
}

export class PaymentService {
  /**
   * Create a payment intent for an order
   */
  static async createPaymentIntent(data: CreatePaymentIntentRequest): Promise<PaymentIntentResponse> {
    try {
      // Validate order exists and belongs to user
      const order = await Order.findById(data.orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      if (order.userId.toString() !== data.userId) {
        throw new Error('Order does not belong to user');
      }

      // Check if payment already exists
      const existingPayment = await Payment.findOne({ orderId: data.orderId });
      if (existingPayment) {
        throw new Error('Payment already exists for this order');
      }

      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(data.amount * 100), // Convert to cents
        currency: data.currency.toLowerCase(),
        payment_method_types: ['card'],
        metadata: {
          orderId: data.orderId,
          userId: data.userId
        }
      });

      // Create payment record
      const payment = new Payment({
        orderId: data.orderId,
        userId: data.userId,
        amount: data.amount,
        currency: data.currency,
        method: 'stripe',
        gateway: 'stripe',
        status: 'pending',
        gatewayTransactionId: paymentIntent.id,
        gatewayResponse: paymentIntent
      });

      await payment.save();

      return {
        clientSecret: paymentIntent.client_secret!,
        paymentIntentId: paymentIntent.id,
        amount: data.amount,
        currency: data.currency
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  /**
   * Confirm a payment after successful payment intent
   */
  static async confirmPayment(paymentIntentId: string): Promise<IPayment> {
    try {
      // Retrieve payment intent from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== 'succeeded') {
        throw new Error(`Payment intent status is ${paymentIntent.status}, expected succeeded`);
      }

      // Find payment record
      const payment = await Payment.findOne({ gatewayTransactionId: paymentIntentId });
      if (!payment) {
        throw new Error('Payment record not found');
      }

      // Update payment status
      await payment.markAsCompleted(paymentIntentId);

      // Update order status to confirmed
      const order = await Order.findById(payment.orderId);
      if (order) {
        await order.confirmOrder();
      }

      return payment;
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }

  /**
   * Process refund for a payment
   */
  static async processRefund(data: RefundRequest): Promise<IPayment> {
    try {
      const payment = await Payment.findById(data.paymentId);
      if (!payment) {
        throw new Error('Payment not found');
      }

      if (!payment.canRefund) {
        throw new Error('Payment cannot be refunded');
      }

      if (data.amount > payment.amount) {
        throw new Error('Refund amount cannot exceed payment amount');
      }

      // Process refund through Stripe if it's a Stripe payment
      if (payment.gateway === 'stripe' && payment.gatewayTransactionId) {
        const refund = await stripe.refunds.create({
          payment_intent: payment.gatewayTransactionId,
          amount: Math.round(data.amount * 100), // Convert to cents
          reason: 'requested_by_customer'
        });

        // Update payment with refund information
        payment.gatewayResponse = { ...payment.gatewayResponse, refund };
      }

      // Process refund
      await payment.processRefund(data.amount, data.reason);

      return payment;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }

  /**
   * Handle Stripe webhook events
   */
  static async handleStripeWebhook(event: Stripe.Event): Promise<void> {
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
          break;
        
        case 'payment_intent.payment_failed':
          await this.handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
          break;
        
        case 'charge.refunded':
          await this.handleChargeRefunded(event.data.object as Stripe.Charge);
          break;
        
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error('Error handling Stripe webhook:', error);
      throw error;
    }
  }

  /**
   * Handle successful payment intent
   */
  private static async handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    try {
      const payment = await Payment.findOne({ gatewayTransactionId: paymentIntent.id });
      if (payment) {
        await payment.markAsCompleted(paymentIntent.id);
        
        // Update order status
        const order = await Order.findById(payment.orderId);
        if (order) {
          await order.confirmOrder();
        }
      }
    } catch (error) {
      console.error('Error handling payment intent succeeded:', error);
      throw error;
    }
  }

  /**
   * Handle failed payment intent
   */
  private static async handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    try {
      const payment = await Payment.findOne({ gatewayTransactionId: paymentIntent.id });
      if (payment) {
        await payment.markAsFailed(paymentIntent.last_payment_error);
      }
    } catch (error) {
      console.error('Error handling payment intent failed:', error);
      throw error;
    }
  }

  /**
   * Handle charge refunded
   */
  private static async handleChargeRefunded(charge: Stripe.Charge): Promise<void> {
    try {
      const payment = await Payment.findOne({ gatewayTransactionId: charge.payment_intent as string });
      if (payment) {
        // Update payment with refund information
        payment.gatewayResponse = { ...payment.gatewayResponse, refund: charge };
        await payment.save();
      }
    } catch (error) {
      console.error('Error handling charge refunded:', error);
      throw error;
    }
  }

  /**
   * Get payment by ID
   */
  static async getPaymentById(paymentId: string): Promise<IPayment | null> {
    try {
      return await Payment.findById(paymentId)
        .populate('orderId')
        .populate('userId');
    } catch (error) {
      console.error('Error getting payment by ID:', error);
      throw error;
    }
  }

  /**
   * Get payments by user ID
   */
  static async getPaymentsByUserId(userId: string): Promise<IPayment[]> {
    try {
      return await Payment.find({ userId }).populate('orderId').sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting payments by user ID:', error);
      throw error;
    }
  }

  /**
   * Get payments by order ID
   */
  static async getPaymentByOrderId(orderId: string): Promise<IPayment | null> {
    try {
      return await Payment.findOne({ orderId }).populate('orderId').populate('userId');
    } catch (error) {
      console.error('Error getting payment by order ID:', error);
      throw error;
    }
  }

  /**
   * Get payments by status
   */
  static async getPaymentsByStatus(status: string): Promise<IPayment[]> {
    try {
      return await Payment.find({ status }).populate('orderId').populate('userId').sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting payments by status:', error);
      throw error;
    }
  }

  /**
   * Create manual payment (for cash on delivery, bank transfer, etc.)
   */
  static async createManualPayment(data: {
    orderId: string;
    userId: string;
    amount: number;
    currency: string;
    method: 'bank_transfer' | 'cash_on_delivery' | 'm_pesa' | 'e_mola';
  }): Promise<IPayment> {
    try {
      // Validate order exists and belongs to user
      const order = await Order.findById(data.orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      if (order.userId.toString() !== data.userId) {
        throw new Error('Order does not belong to user');
      }

      // Check if payment already exists
      const existingPayment = await Payment.findOne({ orderId: data.orderId });
      if (existingPayment) {
        throw new Error('Payment already exists for this order');
      }

      // Create manual payment record
      const payment = new Payment({
        orderId: data.orderId,
        userId: data.userId,
        amount: data.amount,
        currency: data.currency,
        method: data.method,
        gateway: 'manual',
        status: 'pending'
      });

      await payment.save();
      return payment;
    } catch (error) {
      console.error('Error creating manual payment:', error);
      throw error;
    }
  }

  /**
   * Mark manual payment as completed
   */
  static async markManualPaymentCompleted(paymentId: string): Promise<IPayment> {
    try {
      const payment = await Payment.findById(paymentId);
      if (!payment) {
        throw new Error('Payment not found');
      }

      if (payment.gateway !== 'manual') {
        throw new Error('Payment is not a manual payment');
      }

      await payment.markAsCompleted();

      // Update order status
      const order = await Order.findById(payment.orderId);
      if (order) {
        await order.confirmOrder();
      }

      return payment;
    } catch (error) {
      console.error('Error marking manual payment completed:', error);
      throw error;
    }
  }

  /**
   * Get comprehensive payment statistics
   */
  static async getPaymentStatistics(): Promise<{
    total: number;
    pending: number;
    processing: number;
    completed: number;
    failed: number;
    refunded: number;
    successRate: number;
    totalRevenue: number;
    averagePaymentAmount: number;
    paymentMethodDistribution: Record<string, number>;
    gatewayDistribution: Record<string, number>;
    recentPayments: number; // Last 30 days
  }> {
    try {
      // Get all payments with aggregation for better performance
      const stats = await Payment.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            totalRevenue: { $sum: '$amount' },
            averagePaymentAmount: { $avg: '$amount' },
            pending: {
              $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
            },
            processing: {
              $sum: { $cond: [{ $eq: ['$status', 'processing'] }, 1, 0] }
            },
            completed: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
            },
            failed: {
              $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
            },
            refunded: {
              $sum: { $cond: [{ $eq: ['$status', 'refunded'] }, 1, 0] }
            }
          }
        }
      ]);

      // Get payment method distribution
      const methodStats = await Payment.aggregate([
        {
          $group: {
            _id: '$method',
            count: { $sum: 1 }
          }
        }
      ]);

      // Get gateway distribution
      const gatewayStats = await Payment.aggregate([
        {
          $group: {
            _id: '$gateway',
            count: { $sum: 1 }
          }
        }
      ]);

      // Get recent payments (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentPayments = await Payment.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
      });

      const baseStats = stats[0] || {
        total: 0,
        totalRevenue: 0,
        averagePaymentAmount: 0,
        pending: 0,
        processing: 0,
        completed: 0,
        failed: 0,
        refunded: 0
      };

      // Calculate success rate
      const successRate = baseStats.completed + baseStats.failed > 0 
        ? (baseStats.completed / (baseStats.completed + baseStats.failed)) * 100 
        : 0;

      // Convert method stats to object
      const paymentMethodDistribution: Record<string, number> = {};
      methodStats.forEach(stat => {
        paymentMethodDistribution[stat._id] = stat.count;
      });

      // Convert gateway stats to object
      const gatewayDistribution: Record<string, number> = {};
      gatewayStats.forEach(stat => {
        gatewayDistribution[stat._id] = stat.count;
      });

      return {
        total: baseStats.total,
        pending: baseStats.pending,
        processing: baseStats.processing,
        completed: baseStats.completed,
        failed: baseStats.failed,
        refunded: baseStats.refunded,
        successRate: Math.round(successRate * 100) / 100, // Round to 2 decimal places
        totalRevenue: Math.round(baseStats.totalRevenue * 100) / 100,
        averagePaymentAmount: Math.round(baseStats.averagePaymentAmount * 100) / 100,
        paymentMethodDistribution,
        gatewayDistribution,
        recentPayments
      };
    } catch (error) {
      console.error('Error getting payment statistics:', error);
      throw error;
    }
  }

  /**
   * Get detailed payment analytics for a specific date range
   */
  static async getPaymentAnalytics(startDate: Date, endDate: Date): Promise<{
    totalPayments: number;
    totalRevenue: number;
    averagePaymentAmount: number;
    successRate: number;
    dailyPayments: Array<{ date: string; count: number; revenue: number }>;
    paymentMethodBreakdown: Array<{ method: string; count: number; revenue: number; percentage: number }>;
    gatewayBreakdown: Array<{ gateway: string; count: number; revenue: number; percentage: number }>;
    statusBreakdown: Array<{ status: string; count: number; percentage: number }>;
    topPaymentAmounts: Array<{ amount: number; count: number }>;
  }> {
    try {
      // Get daily payment data
      const dailyPayments = await Payment.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            count: { $sum: 1 },
            revenue: { $sum: '$amount' }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      // Get payment method breakdown
      const paymentMethodBreakdown = await Payment.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: '$method',
            count: { $sum: 1 },
            revenue: { $sum: '$amount' }
          }
        },
        {
          $addFields: {
            method: '$_id'
          }
        },
        { $unset: '_id' }
      ]);

      // Get gateway breakdown
      const gatewayBreakdown = await Payment.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: '$gateway',
            count: { $sum: 1 },
            revenue: { $sum: '$amount' }
          }
        },
        {
          $addFields: {
            gateway: '$_id'
          }
        },
        { $unset: '_id' }
      ]);

      // Get status breakdown
      const statusBreakdown = await Payment.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        },
        {
          $addFields: {
            status: '$_id'
          }
        },
        { $unset: '_id' }
      ]);

      // Get top payment amounts
      const topPaymentAmounts = await Payment.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: '$amount',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
        {
          $addFields: {
            amount: '$_id'
          }
        },
        { $unset: '_id' }
      ]);

      // Calculate totals
      const totalPayments = dailyPayments.reduce((sum, day) => sum + day.count, 0);
      const totalRevenue = dailyPayments.reduce((sum, day) => sum + day.revenue, 0);
      const averagePaymentAmount = totalPayments > 0 ? totalRevenue / totalPayments : 0;

      // Calculate success rate
      const completedPayments = statusBreakdown.find(s => s.status === 'completed')?.count || 0;
      const failedPayments = statusBreakdown.find(s => s.status === 'failed')?.count || 0;
      const successRate = completedPayments + failedPayments > 0 
        ? (completedPayments / (completedPayments + failedPayments)) * 100 
        : 0;

      // Calculate percentages for breakdowns
      const addPercentage = (items: any[], total: number) => {
        return items.map(item => ({
          ...item,
          percentage: total > 0 ? Math.round((item.count / total) * 100 * 100) / 100 : 0
        }));
      };

      return {
        totalPayments,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        averagePaymentAmount: Math.round(averagePaymentAmount * 100) / 100,
        successRate: Math.round(successRate * 100) / 100,
        dailyPayments: dailyPayments.map(day => ({
          date: day._id,
          count: day.count,
          revenue: Math.round(day.revenue * 100) / 100
        })),
        paymentMethodBreakdown: addPercentage(paymentMethodBreakdown, totalPayments),
        gatewayBreakdown: addPercentage(gatewayBreakdown, totalPayments),
        statusBreakdown: addPercentage(statusBreakdown, totalPayments),
        topPaymentAmounts: topPaymentAmounts.map(item => ({
          amount: Math.round(item.amount * 100) / 100,
          count: item.count
        }))
      };
    } catch (error) {
      console.error('Error getting payment analytics:', error);
      throw error;
    }
  }

  /**
   * Get payment performance monitoring data
   */
  static async getPaymentPerformance(): Promise<{
    systemHealth: {
      status: 'healthy' | 'warning' | 'critical';
      message: string;
      lastCheck: Date;
    };
    recentActivity: {
      lastHour: number;
      last24Hours: number;
      last7Days: number;
    };
    errorRate: {
      lastHour: number;
      last24Hours: number;
      last7Days: number;
    };
    averageProcessingTime: number; // in milliseconds
    pendingPayments: number;
    failedPayments: number;
    gatewayStatus: {
      stripe: 'operational' | 'degraded' | 'down';
      manual: 'operational' | 'degraded' | 'down';
    };
    alerts: Array<{
      type: 'warning' | 'error' | 'info';
      message: string;
      timestamp: Date;
    }>;
  }> {
    try {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Get recent activity counts
      const lastHourPayments = await Payment.countDocuments({
        createdAt: { $gte: oneHourAgo }
      });

      const last24HoursPayments = await Payment.countDocuments({
        createdAt: { $gte: oneDayAgo }
      });

      const last7DaysPayments = await Payment.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
      });

      // Get error rates
      const lastHourFailed = await Payment.countDocuments({
        status: 'failed',
        createdAt: { $gte: oneHourAgo }
      });

      const last24HoursFailed = await Payment.countDocuments({
        status: 'failed',
        createdAt: { $gte: oneDayAgo }
      });

      const last7DaysFailed = await Payment.countDocuments({
        status: 'failed',
        createdAt: { $gte: sevenDaysAgo }
      });

      // Calculate error rates
      const errorRate1Hour = lastHourPayments > 0 ? (lastHourFailed / lastHourPayments) * 100 : 0;
      const errorRate24Hours = last24HoursPayments > 0 ? (last24HoursFailed / last24HoursPayments) * 100 : 0;
      const errorRate7Days = last7DaysPayments > 0 ? (last7DaysFailed / last7DaysPayments) * 100 : 0;

      // Get pending and failed payments
      const pendingPayments = await Payment.countDocuments({ status: 'pending' });
      const failedPayments = await Payment.countDocuments({ status: 'failed' });

      // Determine system health
      let systemStatus: 'healthy' | 'warning' | 'critical' = 'healthy';
      let systemMessage = 'Payment system is operating normally';

      if (errorRate1Hour > 10) {
        systemStatus = 'critical';
        systemMessage = 'High error rate detected in the last hour';
      } else if (errorRate24Hours > 5) {
        systemStatus = 'warning';
        systemMessage = 'Elevated error rate detected in the last 24 hours';
      } else if (pendingPayments > 100) {
        systemStatus = 'warning';
        systemMessage = 'High number of pending payments detected';
      }

      // Generate alerts
      const alerts: Array<{ type: 'warning' | 'error' | 'info'; message: string; timestamp: Date }> = [];

      if (errorRate1Hour > 10) {
        alerts.push({
          type: 'error',
          message: `Critical: ${errorRate1Hour.toFixed(2)}% payment failure rate in the last hour`,
          timestamp: now
        });
      }

      if (errorRate24Hours > 5) {
        alerts.push({
          type: 'warning',
          message: `Warning: ${errorRate24Hours.toFixed(2)}% payment failure rate in the last 24 hours`,
          timestamp: now
        });
      }

      if (pendingPayments > 50) {
        alerts.push({
          type: 'warning',
          message: `Warning: ${pendingPayments} payments are currently pending`,
          timestamp: now
        });
      }

      if (lastHourPayments === 0) {
        alerts.push({
          type: 'info',
          message: 'No payment activity in the last hour',
          timestamp: now
        });
      }

      // Estimate average processing time (this would be more accurate with actual timing data)
      const averageProcessingTime = 2000; // 2 seconds estimate

      return {
        systemHealth: {
          status: systemStatus,
          message: systemMessage,
          lastCheck: now
        },
        recentActivity: {
          lastHour: lastHourPayments,
          last24Hours: last24HoursPayments,
          last7Days: last7DaysPayments
        },
        errorRate: {
          lastHour: Math.round(errorRate1Hour * 100) / 100,
          last24Hours: Math.round(errorRate24Hours * 100) / 100,
          last7Days: Math.round(errorRate7Days * 100) / 100
        },
        averageProcessingTime,
        pendingPayments,
        failedPayments,
        gatewayStatus: {
          stripe: 'operational', // This would be determined by actual gateway health checks
          manual: 'operational'
        },
        alerts
      };
    } catch (error) {
      console.error('Error getting payment performance:', error);
      throw error;
    }
  }
}
