import nodemailer from 'nodemailer';
import { createTransport } from 'nodemailer';
import { compile } from 'handlebars';
import { readFileSync } from 'fs';
import { join } from 'path';
import { IUser } from '../types';
import { IOrder, IPayment } from '../types';

// Email configuration interface
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

// Email content interface
interface EmailContent {
  to: string;
  subject: string;
  template: string;
  data: any;
  from?: string;
  fromName?: string;
}

// Email template data interfaces
interface OrderConfirmationData {
  orderNumber: string;
  customerName: string;
  orderDate: string;
  totalAmount: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: string;
  trackingNumber?: string;
}

interface PaymentConfirmationData {
  paymentId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  orderNumber: string;
  customerName: string;
  paymentDate: string;
}

interface PasswordResetData {
  userName: string;
  resetLink: string;
  expiryTime: string;
}

interface EmailVerificationData {
  userName: string;
  verificationLink: string;
  expiryTime: string;
}

interface ReviewRequestData {
  customerName: string;
  orderNumber: string;
  productName: string;
  reviewLink: string;
}

interface OrderStatusUpdateData {
  customerName: string;
  orderNumber: string;
  newStatus: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export class EmailService {
  private static transporter: nodemailer.Transporter | null = null;
  private static isInitialized = false;

  /**
   * Initialize email service
   */
  static async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const smtpHost = process.env.SMTP_HOST;
      const smtpPort = parseInt(process.env.SMTP_PORT || '587');
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;
      const smtpSecure = process.env.SMTP_SECURE === 'true';

      if (smtpHost && smtpUser && smtpPass) {
        // SMTP Configuration
        const config: EmailConfig = {
          host: smtpHost,
          port: smtpPort,
          secure: smtpSecure,
          auth: {
            user: smtpUser,
            pass: smtpPass
          }
        };

        this.transporter = createTransport(config);

        // Verify connection
        await this.transporter.verify();
        console.log('✅ Email service initialized with SMTP');
        this.isInitialized = true;
      } else {
        console.warn('⚠️ SMTP configuration not found. Email service will be disabled.');
        this.transporter = null;
      }
    } catch (error) {
      console.error('❌ Failed to initialize email service:', error);
      this.transporter = null;
    }
  }

  /**
   * Send email using template
   */
  static async sendEmail(content: EmailContent): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.transporter) {
      console.warn('⚠️ Email service not available. Skipping email send.');
      return;
    }

    try {
      // Get email template
      const template = await this.getEmailTemplate(content.template);
      
      // Compile template with data
      const compiledTemplate = compile(template);
      const html = compiledTemplate(content.data);

      // Prepare email options
      const mailOptions = {
        from: content.from || process.env.EMAIL_FROM || 'noreply@txova.com',
        to: content.to,
        subject: content.subject,
        html: html
      };

      // Send email
      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email sent successfully to ${content.to}: ${result.messageId}`);
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      throw new Error(`Failed to send email: ${error}`);
    }
  }

  /**
   * Get email template from file
   */
  private static async getEmailTemplate(templateName: string): Promise<string> {
    try {
      const templatePath = join(__dirname, '..', 'templates', 'emails', `${templateName}.hbs`);
      return readFileSync(templatePath, 'utf-8');
    } catch (error) {
      console.error(`❌ Template not found: ${templateName}`);
      // Return a simple fallback template
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>{{subject}}</title>
        </head>
        <body>
          <h1>{{title}}</h1>
          <p>{{message}}</p>
        </body>
        </html>
      `;
    }
  }

  /**
   * Send order confirmation email
   */
  static async sendOrderConfirmation(order: IOrder): Promise<void> {
    try {
      const orderData: OrderConfirmationData = {
        orderNumber: order.orderNumber,
        customerName: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
        orderDate: order.createdAt.toLocaleDateString(),
        totalAmount: order.total,
        items: order.items.map(item => ({
          name: (item.productId as any).name || 'Product',
          quantity: item.quantity,
          price: item.unitPrice
        })),
        shippingAddress: `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.country}`
      };

      await this.sendEmail({
        to: order.shippingAddress.email,
        subject: `Order Confirmation - #${order.orderNumber}`,
        template: 'order-confirmation',
        data: orderData
      });
    } catch (error) {
      console.error('❌ Failed to send order confirmation email:', error);
      throw error;
    }
  }

  /**
   * Send payment confirmation email
   */
  static async sendPaymentConfirmation(payment: IPayment): Promise<void> {
    try {
      const paymentData: PaymentConfirmationData = {
        paymentId: payment._id?.toString() || '',
        amount: payment.amount,
        currency: payment.currency,
        paymentMethod: payment.method,
        orderNumber: payment.orderId,
        customerName: 'Customer', // We'll need to get this from the order
        paymentDate: payment.createdAt?.toLocaleDateString() || new Date().toLocaleDateString()
      };

      await this.sendEmail({
        to: 'customer@example.com', // We'll need to get this from the order
        subject: `Payment Confirmation - #${payment._id?.toString().slice(-8) || 'PAYMENT'}`,
        template: 'payment-confirmation',
        data: paymentData
      });
    } catch (error) {
      console.error('❌ Failed to send payment confirmation email:', error);
      throw error;
    }
  }

  /**
   * Send order status update email
   */
  static async sendOrderStatusUpdate(order: IOrder, status: string): Promise<void> {
    try {
      const statusData: OrderStatusUpdateData = {
        customerName: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
        orderNumber: order.orderNumber,
        newStatus: status,
        trackingNumber: undefined,
        estimatedDelivery: order.estimatedDelivery?.toLocaleDateString()
      };

      await this.sendEmail({
        to: order.shippingAddress.email,
        subject: `Order Status Update - #${order.orderNumber}`,
        template: 'order-status-update',
        data: statusData
      });
    } catch (error) {
      console.error('❌ Failed to send order status update email:', error);
      throw error;
    }
  }

  /**
   * Send review request email
   */
  static async sendReviewRequest(order: IOrder): Promise<void> {
    try {
      const reviewData: ReviewRequestData = {
        customerName: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
        orderNumber: order.orderNumber,
        productName: order.items[0]?.productId?.name || 'Product',
        reviewLink: `${process.env.FRONTEND_URL}/review/${order._id}`
      };

      await this.sendEmail({
        to: order.shippingAddress.email,
        subject: `Review Your Recent Purchase - #${order.orderNumber}`,
        template: 'review-request',
        data: reviewData
      });
    } catch (error) {
      console.error('❌ Failed to send review request email:', error);
      throw error;
    }
  }

  /**
   * Send password reset email
   */
  static async sendPasswordReset(user: IUser, resetToken: string): Promise<void> {
    try {
      const resetData: PasswordResetData = {
        userName: user.firstName || user.email,
        resetLink: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`,
        expiryTime: '24 hours'
      };

      await this.sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        template: 'password-reset',
        data: resetData
      });
    } catch (error) {
      console.error('❌ Failed to send password reset email:', error);
      throw error;
    }
  }

  /**
   * Send email verification email
   */
  static async sendEmailVerification(user: IUser, verificationToken: string): Promise<void> {
    try {
      const verificationData: EmailVerificationData = {
        userName: user.firstName || user.email,
        verificationLink: `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`,
        expiryTime: '24 hours'
      };

      await this.sendEmail({
        to: user.email,
        subject: 'Verify Your Email Address',
        template: 'email-verification',
        data: verificationData
      });
    } catch (error) {
      console.error('❌ Failed to send email verification:', error);
      throw error;
    }
  }

  /**
   * Send welcome email
   */
  static async sendWelcomeEmail(user: IUser): Promise<void> {
    try {
      await this.sendEmail({
        to: user.email,
        subject: 'Welcome to Txova Marketplace!',
        template: 'welcome',
        data: {
          userName: user.firstName || user.email,
          loginLink: `${process.env.FRONTEND_URL}/login`
        }
      });
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      throw error;
    }
  }

  /**
   * Send newsletter email
   */
  static async sendNewsletterEmail(to: string, subject: string, content: string, subscriberName?: string): Promise<void> {
    try {
      await this.sendEmail({
        to,
        subject,
        template: 'newsletter',
        data: {
          subscriberName: subscriberName || 'there',
          content,
          unsubscribeLink: `${process.env.FRONTEND_URL}/unsubscribe?email=${encodeURIComponent(to)}`
        }
      });
    } catch (error) {
      console.error('❌ Failed to send newsletter email:', error);
      throw error;
    }
  }

  /**
   * Test email service
   */
  static async testEmailService(): Promise<boolean> {
    try {
      await this.initialize();
      
      if (!this.transporter) {
        return false;
      }

      await this.sendEmail({
        to: process.env.TEST_EMAIL || 'test@example.com',
        subject: 'Email Service Test',
        template: 'test',
        data: {
          message: 'This is a test email to verify the email service is working correctly.',
          timestamp: new Date().toISOString()
        }
      });

      return true;
    } catch (error) {
      console.error('❌ Email service test failed:', error);
      return false;
    }
  }
}
