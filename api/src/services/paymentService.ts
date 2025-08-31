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
}
