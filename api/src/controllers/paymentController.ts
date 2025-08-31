import { Request, Response } from 'express';
import Stripe from 'stripe';
import { PaymentService } from '../services/paymentService';
import { createPaymentIntentSchema, confirmPaymentSchema, refundPaymentSchema, createManualPaymentSchema } from '../utils/validation';

export class PaymentController {
  /**
   * Create payment intent for Stripe payment
   */
  static async createPaymentIntent(req: Request, res: Response) {
    try {
      const { orderId, amount, currency, paymentMethod } = req.body;
      const userId = (req as any).user.id;

      const paymentIntent = await PaymentService.createPaymentIntent({
        orderId,
        amount,
        currency,
        paymentMethod,
        userId
      });

      return res.status(201).json({
        success: true,
        message: 'Payment intent created successfully',
        data: paymentIntent
      });
    } catch (error: any) {
      console.error('Create payment intent error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to create payment intent'
      });
    }
  }

  /**
   * Confirm payment after successful payment intent
   */
  static async confirmPayment(req: Request, res: Response) {
    try {
      const { paymentIntentId } = req.body;

      const payment = await PaymentService.confirmPayment(paymentIntentId);

      return res.json({
        success: true,
        message: 'Payment confirmed successfully',
        data: payment
      });
    } catch (error: any) {
      console.error('Confirm payment error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to confirm payment'
      });
    }
  }

  /**
   * Process refund for a payment
   */
  static async processRefund(req: Request, res: Response) {
    try {
      const { paymentId, amount, reason } = req.body;

      const payment = await PaymentService.processRefund({
        paymentId,
        amount,
        reason
      });

      return res.json({
        success: true,
        message: 'Refund processed successfully',
        data: payment
      });
    } catch (error: any) {
      console.error('Process refund error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to process refund'
      });
    }
  }

  /**
   * Handle Stripe webhook events
   */
  static async handleStripeWebhook(req: Request, res: Response) {
    try {
      const sig = req.headers['stripe-signature'] as string;
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!endpointSecret) {
        console.error('Stripe webhook secret not configured');
        return res.status(500).json({
          success: false,
          message: 'Webhook secret not configured'
        });
      }

      let event: Stripe.Event;

      try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
          apiVersion: '2025-08-27.basil'
        });
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).json({
          success: false,
          message: 'Webhook signature verification failed'
        });
      }

      // Handle the event
      await PaymentService.handleStripeWebhook(event);

      return res.json({
        success: true,
        message: 'Webhook processed successfully'
      });
    } catch (error: any) {
      console.error('Webhook error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to process webhook'
      });
    }
  }

  /**
   * Get payment by ID
   */
  static async getPaymentById(req: Request, res: Response) {
    try {
      const { paymentId } = req.params;
      const userId = (req as any).user.id;

      const payment = await PaymentService.getPaymentById(paymentId);

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }

      // Check if user owns the payment or is admin
      if (payment.userId.toString() !== userId && (req as any).user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      return res.json({
        success: true,
        message: 'Payment retrieved successfully',
        data: payment
      });
    } catch (error: any) {
      console.error('Get payment by ID error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve payment'
      });
    }
  }

  /**
   * Get payments by user ID
   */
  static async getPaymentsByUserId(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      const payments = await PaymentService.getPaymentsByUserId(userId);

      return res.json({
        success: true,
        message: 'Payments retrieved successfully',
        data: payments
      });
    } catch (error: any) {
      console.error('Get payments by user ID error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve payments'
      });
    }
  }

  /**
   * Get payment by order ID
   */
  static async getPaymentByOrderId(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const userId = (req as any).user.id;

      const payment = await PaymentService.getPaymentByOrderId(orderId);

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }

      // Check if user owns the payment or is admin
      if (payment.userId.toString() !== userId && (req as any).user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      return res.json({
        success: true,
        message: 'Payment retrieved successfully',
        data: payment
      });
    } catch (error: any) {
      console.error('Get payment by order ID error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve payment'
      });
    }
  }

  /**
   * Get payments by status (admin only)
   */
  static async getPaymentsByStatus(req: Request, res: Response) {
    try {
      const { status } = req.params;

      // Check if user is admin
      if ((req as any).user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin only.'
        });
      }

      const payments = await PaymentService.getPaymentsByStatus(status);

      return res.json({
        success: true,
        message: 'Payments retrieved successfully',
        data: payments
      });
    } catch (error: any) {
      console.error('Get payments by status error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve payments'
      });
    }
  }

  /**
   * Create manual payment (cash on delivery, bank transfer)
   */
  static async createManualPayment(req: Request, res: Response) {
    try {
      const { orderId, amount, currency, method } = req.body;
      const userId = (req as any).user.id;

      const payment = await PaymentService.createManualPayment({
        orderId,
        userId,
        amount,
        currency,
        method
      });

      return res.status(201).json({
        success: true,
        message: 'Manual payment created successfully',
        data: payment
      });
    } catch (error: any) {
      console.error('Create manual payment error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to create manual payment'
      });
    }
  }

  /**
   * Mark manual payment as completed (admin/seller only)
   */
  static async markManualPaymentCompleted(req: Request, res: Response) {
    try {
      const { paymentId } = req.params;

      // Check if user is admin or seller
      if (!['admin', 'seller'].includes((req as any).user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin or seller only.'
        });
      }

      const payment = await PaymentService.markManualPaymentCompleted(paymentId);

      return res.json({
        success: true,
        message: 'Manual payment marked as completed',
        data: payment
      });
    } catch (error: any) {
      console.error('Mark manual payment completed error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to mark payment as completed'
      });
    }
  }

  /**
   * Get payment statistics (admin only)
   */
  static async getPaymentStatistics(req: Request, res: Response) {
    try {
      // Check if user is admin
      if ((req as any).user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin only.'
        });
      }

      // Get payment statistics
      const pendingPayments = await PaymentService.getPaymentsByStatus('pending');
      const completedPayments = await PaymentService.getPaymentsByStatus('completed');
      const failedPayments = await PaymentService.getPaymentsByStatus('failed');
      const refundedPayments = await PaymentService.getPaymentsByStatus('refunded');

      const statistics = {
        total: pendingPayments.length + completedPayments.length + failedPayments.length + refundedPayments.length,
        pending: pendingPayments.length,
        completed: completedPayments.length,
        failed: failedPayments.length,
        refunded: refundedPayments.length,
        successRate: completedPayments.length / (completedPayments.length + failedPayments.length) * 100
      };

      return res.json({
        success: true,
        message: 'Payment statistics retrieved successfully',
        data: statistics
      });
    } catch (error: any) {
      console.error('Get payment statistics error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve payment statistics'
      });
    }
  }
}
