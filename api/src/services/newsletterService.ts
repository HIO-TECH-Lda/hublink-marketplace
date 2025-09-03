import Newsletter, { INewsletter } from '../models/Newsletter';
import { EmailService } from './emailService';
import { ApiError } from '../utils/ApiError';
import crypto from 'crypto';

export class NewsletterService {
  /**
   * Subscribe a new user to the newsletter
   */
  static async subscribe(data: {
    email: string;
    firstName?: string;
    lastName?: string;
    preferences?: {
      categories?: string[];
      frequency?: 'daily' | 'weekly' | 'monthly';
      promotions?: boolean;
      productUpdates?: boolean;
      blogPosts?: boolean;
    };
    metadata?: {
      source?: string;
      ipAddress?: string;
      userAgent?: string;
      referrer?: string;
    };
  }): Promise<INewsletter> {
    try {
      // Check if email already exists
      const existingSubscriber = await Newsletter.findByEmail(data.email);
      
      if (existingSubscriber) {
        if (existingSubscriber.isActive) {
          throw new ApiError(400, 'Email is already subscribed to the newsletter');
        } else {
          // Reactivate existing subscription
          existingSubscriber.isActive = true;
          existingSubscriber.unsubscribedAt = undefined;
          await existingSubscriber.save();
          return existingSubscriber;
        }
      }

      // Create verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Create new subscriber
      const subscriber = new Newsletter({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        preferences: data.preferences || {
          frequency: 'weekly',
          promotions: true,
          productUpdates: true,
          blogPosts: true
        },
        metadata: data.metadata || {
          source: 'website'
        },
        verificationToken,
        verificationExpires
      });

      await subscriber.save();

      // Send verification email
      await this.sendVerificationEmail(subscriber);

      return subscriber;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Failed to subscribe to newsletter');
    }
  }

  /**
   * Verify email subscription
   */
  static async verifyEmail(token: string): Promise<INewsletter> {
    try {
      const subscriber = await Newsletter.findOne({
        verificationToken: token,
        verificationExpires: { $gt: new Date() }
      });

      if (!subscriber) {
        throw new ApiError(400, 'Invalid or expired verification token');
      }

      subscriber.isVerified = true;
      subscriber.verificationToken = undefined;
      subscriber.verificationExpires = undefined;
      await subscriber.save();

      return subscriber;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Failed to verify email');
    }
  }

  /**
   * Unsubscribe from newsletter
   */
  static async unsubscribe(email: string): Promise<void> {
    try {
      const subscriber = await Newsletter.findByEmail(email);
      
      if (!subscriber) {
        throw new ApiError(404, 'Subscriber not found');
      }

      subscriber.isActive = false;
      subscriber.unsubscribedAt = new Date();
      await subscriber.save();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Failed to unsubscribe');
    }
  }

  /**
   * Update subscriber preferences
   */
  static async updatePreferences(email: string, preferences: any): Promise<INewsletter> {
    try {
      const subscriber = await Newsletter.findByEmail(email);
      
      if (!subscriber) {
        throw new ApiError(404, 'Subscriber not found');
      }

      subscriber.preferences = { ...subscriber.preferences, ...preferences };
      await subscriber.save();

      return subscriber;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Failed to update preferences');
    }
  }

  /**
   * Get active subscribers
   */
  static async getActiveSubscribers(options: {
    page?: number;
    limit?: number;
    preferences?: any;
  } = {}): Promise<{ subscribers: INewsletter[]; total: number }> {
    try {
      const { page = 1, limit = 10, preferences } = options;
      const skip = (page - 1) * limit;

      let query: any = { isActive: true, isVerified: true };
      
      if (preferences) {
        query.preferences = { $elemMatch: preferences };
      }

      const subscribers = await Newsletter.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ subscribedAt: -1 });

      const total = await Newsletter.countDocuments(query);

      return { subscribers, total };
    } catch (error) {
      throw new ApiError(500, 'Failed to get subscribers');
    }
  }

  /**
   * Get subscribers by preferences
   */
  static async getSubscribersByPreferences(preferences: any): Promise<INewsletter[]> {
    try {
      return await Newsletter.find({
        isActive: true,
        isVerified: true,
        preferences: { $elemMatch: preferences }
      });
    } catch (error) {
      throw new ApiError(500, 'Failed to get subscribers by preferences');
    }
  }

  /**
   * Get subscription statistics
   */
  static async getSubscriptionStats(): Promise<any> {
    try {
      const stats = await Newsletter.getSubscriptionStats();
      return stats;
    } catch (error) {
      throw new ApiError(500, 'Failed to get subscription statistics');
    }
  }

  /**
   * Send verification email
   */
  static async sendVerificationEmail(subscriber: INewsletter): Promise<void> {
    try {
      const verificationLink = `${process.env.FRONTEND_URL}/verify-newsletter?token=${subscriber.verificationToken}`;
      
      await EmailService.sendEmail({
        to: subscriber.email,
        subject: 'Verify Your Newsletter Subscription',
        template: 'newsletter-verification',
        data: {
          subscriberName: subscriber.firstName || subscriber.email,
          verificationLink,
          expiryTime: '24 hours'
        }
      });
    } catch (error) {
      console.error('Failed to send verification email:', error);
      throw new ApiError(500, 'Failed to send verification email');
    }
  }

  /**
   * Send newsletter email
   */
  static async sendNewsletterEmail(subscriber: INewsletter, emailData: {
    subject: string;
    template: string;
    data: any;
  }): Promise<void> {
    try {
      await EmailService.sendNewsletterEmail(
        subscriber.email,
        emailData.subject,
        emailData.template,
        subscriber.firstName
      );

      // Update subscriber stats
      subscriber.lastEmailSent = new Date();
      subscriber.emailCount += 1;
      await subscriber.save();
    } catch (error) {
      console.error('Error in sendNewsletterEmail:', error);
      throw new ApiError(500, 'Failed to send newsletter email');
    }
  }

  /**
   * Bulk send newsletter
   */
  static async bulkSendNewsletter(emailData: {
    subject: string;
    template: string;
    data: any;
    preferences?: any;
  }): Promise<{ success: number; failed: number }> {
    try {
      let subscribers: INewsletter[];

      if (emailData.preferences) {
        subscribers = await this.getSubscribersByPreferences(emailData.preferences);
      } else {
        const result = await this.getActiveSubscribers({ page: 1, limit: 1000 });
        subscribers = result.subscribers;
      }

      let success = 0;
      let failed = 0;

      for (const subscriber of subscribers) {
        try {
          await this.sendNewsletterEmail(subscriber, emailData);
          success++;
        } catch (error) {
          console.error(`Failed to send newsletter to ${subscriber.email}:`, error);
          failed++;
        }
      }

      return { success, failed };
    } catch (error) {
      throw new ApiError(500, 'Failed to send bulk newsletter');
    }
  }

  /**
   * Resend verification email
   */
  static async resendVerification(email: string): Promise<void> {
    try {
      const subscriber = await Newsletter.findByEmail(email);
      
      if (!subscriber) {
        throw new ApiError(404, 'Subscriber not found');
      }

      if (subscriber.isVerified) {
        throw new ApiError(400, 'Email is already verified');
      }

      // Generate new verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      subscriber.verificationToken = verificationToken;
      subscriber.verificationExpires = verificationExpires;
      await subscriber.save();

      await this.sendVerificationEmail(subscriber);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Failed to resend verification email');
    }
  }

  /**
   * Delete subscriber
   */
  static async deleteSubscriber(email: string): Promise<void> {
    try {
      const subscriber = await Newsletter.findByEmail(email);
      
      if (!subscriber) {
        throw new ApiError(404, 'Subscriber not found');
      }

      await Newsletter.findByIdAndDelete(subscriber._id);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Failed to delete subscriber');
    }
  }

  /**
   * Get subscriber by email
   */
  static async getSubscriber(email: string): Promise<INewsletter | null> {
    try {
      return await Newsletter.findByEmail(email);
    } catch (error) {
      throw new ApiError(500, 'Failed to get subscriber');
    }
  }
}
