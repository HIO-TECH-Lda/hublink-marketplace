import NewsletterSubscriber from '../models/NewsletterSubscriber';
import NewsletterCampaign from '../models/NewsletterCampaign';
import mongoose from 'mongoose';

export class AdminNewsletterService {
  // ==================== SUBSCRIBER METHODS ====================

  // Get newsletter statistics
  static async getNewsletterStats(): Promise<any> {
    try {
      const [
        totalSubscribers,
        activeSubscribers,
        campaignsSent,
        campaignsScheduled
      ] = await Promise.all([
        NewsletterSubscriber.countDocuments(),
        NewsletterSubscriber.countDocuments({ status: 'active' }),
        NewsletterCampaign.countDocuments({ status: 'sent' }),
        NewsletterCampaign.countDocuments({ status: 'scheduled' })
      ]);

      return {
        totalSubscribers,
        activeSubscribers,
        unsubscribed: await NewsletterSubscriber.countDocuments({ status: 'unsubscribed' }),
        bounced: await NewsletterSubscriber.countDocuments({ status: 'bounced' }),
        campaignsSent,
        campaignsScheduled,
        campaignsDraft: await NewsletterCampaign.countDocuments({ status: 'draft' })
      };
    } catch (error) {
      throw new Error(
        `Failed to get newsletter statistics: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Get all subscribers with filters
  static async getSubscribers(filters: {
    search?: string;
    status?: string;
    origin?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<any> {
    try {
      const {
        search,
        status,
        origin,
        page = 1,
        limit = 20,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = filters;

      const query: any = {};

      // Search filter
      if (search) {
        query.$or = [
          { email: { $regex: search, $options: 'i' } },
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } }
        ];
      }

      // Status filter
      if (status && status !== 'all') {
        query.status = status;
      }

      // Origin filter
      if (origin && origin !== 'all') {
        query.origin = origin;
      }

      const skip = (page - 1) * limit;
      const sort: any = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      const [subscribers, total] = await Promise.all([
        NewsletterSubscriber.find(query)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        NewsletterSubscriber.countDocuments(query)
      ]);

      return {
        subscribers: subscribers.map((sub: any) => ({
          id: sub._id.toString(),
          email: sub.email,
          firstName: sub.firstName || null,
          lastName: sub.lastName || null,
          fullName: sub.firstName && sub.lastName 
            ? `${sub.firstName} ${sub.lastName}` 
            : sub.firstName || sub.lastName || 'Nome não informado',
          status: sub.status,
          origin: sub.origin,
          tags: sub.tags || [],
          engagement: {
            emailsSent: sub.stats?.emailsSent || 0,
            emailsOpened: sub.stats?.emailsOpened || 0,
            emailsClicked: sub.stats?.emailsClicked || 0,
            openRate: sub.stats?.emailsSent > 0 
              ? ((sub.stats?.emailsOpened || 0) / sub.stats.emailsSent * 100).toFixed(1) 
              : '0.0',
            clickRate: sub.stats?.emailsSent > 0 
              ? ((sub.stats?.emailsClicked || 0) / sub.stats.emailsSent * 100).toFixed(1) 
              : '0.0'
          },
          registeredAt: sub.createdAt
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(
        `Failed to get subscribers: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Get subscriber by ID
  static async getSubscriberById(subscriberId: string): Promise<any> {
    try {
      const subscriber = await NewsletterSubscriber.findById(subscriberId).lean();

      if (!subscriber) {
        throw new Error('Subscriber not found');
      }

      return {
        id: subscriber._id.toString(),
        email: subscriber.email,
        firstName: subscriber.firstName || null,
        lastName: subscriber.lastName || null,
        fullName: subscriber.firstName && subscriber.lastName 
          ? `${subscriber.firstName} ${subscriber.lastName}` 
          : subscriber.firstName || subscriber.lastName || 'Nome não informado',
        status: subscriber.status,
        origin: subscriber.origin,
        tags: subscriber.tags || [],
        preferences: subscriber.preferences || {},
        metadata: subscriber.metadata || {},
        stats: {
          emailsSent: subscriber.stats?.emailsSent || 0,
          emailsOpened: subscriber.stats?.emailsOpened || 0,
          emailsClicked: subscriber.stats?.emailsClicked || 0,
          lastOpened: subscriber.stats?.lastOpened || null,
          lastClicked: subscriber.stats?.lastClicked || null,
          openRate: subscriber.stats?.emailsSent > 0 
            ? ((subscriber.stats?.emailsOpened || 0) / subscriber.stats.emailsSent * 100).toFixed(2) 
            : '0.00',
          clickRate: subscriber.stats?.emailsSent > 0 
            ? ((subscriber.stats?.emailsClicked || 0) / subscriber.stats.emailsSent * 100).toFixed(2) 
            : '0.00'
        },
        unsubscribedAt: subscriber.unsubscribedAt || null,
        unsubscribedReason: subscriber.unsubscribedReason || null,
        createdAt: subscriber.createdAt,
        updatedAt: subscriber.updatedAt
      };
    } catch (error) {
      throw new Error(
        `Failed to get subscriber: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Create subscriber
  static async createSubscriber(subscriberData: any): Promise<any> {
    try {
      // Check if email already exists
      const existing = await NewsletterSubscriber.findOne({ email: subscriberData.email.toLowerCase() });
      if (existing) {
        throw new Error('Email already subscribed');
      }

      const subscriber = new NewsletterSubscriber({
        ...subscriberData,
        email: subscriberData.email.toLowerCase(),
        status: subscriberData.status || 'active'
      });

      await subscriber.save();
      return await this.getSubscriberById(subscriber._id.toString());
    } catch (error) {
      throw new Error(
        `Failed to create subscriber: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Update subscriber
  static async updateSubscriber(subscriberId: string, updateData: any): Promise<any> {
    try {
      const subscriber = await NewsletterSubscriber.findById(subscriberId);

      if (!subscriber) {
        throw new Error('Subscriber not found');
      }

      // Handle email update
      if (updateData.email && updateData.email !== subscriber.email) {
        const existing = await NewsletterSubscriber.findOne({ email: updateData.email.toLowerCase() });
        if (existing) {
          throw new Error('Email already subscribed');
        }
        updateData.email = updateData.email.toLowerCase();
      }

      Object.keys(updateData).forEach(key => {
        if (key !== '_id' && key !== 'createdAt' && key !== 'updatedAt') {
          (subscriber as any)[key] = updateData[key];
        }
      });

      await subscriber.save();
      return await this.getSubscriberById(subscriberId);
    } catch (error) {
      throw new Error(
        `Failed to update subscriber: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Update subscriber status
  static async updateSubscriberStatus(subscriberId: string, status: string): Promise<any> {
    try {
      const subscriber = await NewsletterSubscriber.findById(subscriberId);

      if (!subscriber) {
        throw new Error('Subscriber not found');
      }

      subscriber.status = status as any;
      if (status === 'unsubscribed') {
        subscriber.unsubscribedAt = new Date();
      } else if (status === 'active') {
        subscriber.unsubscribedAt = undefined;
        subscriber.unsubscribedReason = undefined;
      }

      await subscriber.save();
      return await this.getSubscriberById(subscriberId);
    } catch (error) {
      throw new Error(
        `Failed to update subscriber status: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Delete subscriber
  static async deleteSubscriber(subscriberId: string): Promise<void> {
    try {
      const subscriber = await NewsletterSubscriber.findById(subscriberId);
      if (!subscriber) {
        throw new Error('Subscriber not found');
      }

      await NewsletterSubscriber.findByIdAndDelete(subscriberId);
    } catch (error) {
      throw new Error(
        `Failed to delete subscriber: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // ==================== CAMPAIGN METHODS ====================

  // Get all campaigns with filters
  static async getCampaigns(filters: {
    search?: string;
    type?: string;
    status?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<any> {
    try {
      const {
        search,
        type,
        status,
        page = 1,
        limit = 20,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = filters;

      const query: any = {};

      // Search filter
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { subject: { $regex: search, $options: 'i' } }
        ];
      }

      // Type filter
      if (type && type !== 'all') {
        query.type = type;
      }

      // Status filter
      if (status && status !== 'all') {
        query.status = status;
      }

      const skip = (page - 1) * limit;
      const sort: any = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      const [campaigns, total] = await Promise.all([
        NewsletterCampaign.find(query)
          .populate('createdBy', 'firstName lastName email')
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        NewsletterCampaign.countDocuments(query)
      ]);

      return {
        campaigns: campaigns.map((campaign: any) => ({
          id: campaign._id.toString(),
          name: campaign.name,
          subject: campaign.subject,
          type: campaign.type,
          status: campaign.status,
          subscribers: campaign.stats?.totalSubscribers || 0,
          performance: {
            openRate: campaign.stats?.openRate || 0,
            clickRate: campaign.stats?.clickRate || 0
          },
          sentAt: campaign.sentAt || null,
          scheduledAt: campaign.scheduledAt || null,
          createdAt: campaign.createdAt
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(
        `Failed to get campaigns: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Get campaign by ID
  static async getCampaignById(campaignId: string): Promise<any> {
    try {
      const campaign = await NewsletterCampaign.findById(campaignId)
        .populate('createdBy', 'firstName lastName email')
        .lean();

      if (!campaign) {
        throw new Error('Campaign not found');
      }

      return {
        id: campaign._id.toString(),
        name: campaign.name,
        subject: campaign.subject,
        type: campaign.type,
        status: campaign.status,
        content: campaign.content,
        segmentation: campaign.segmentation || {},
        scheduledAt: campaign.scheduledAt || null,
        timezone: campaign.timezone || 'Africa/Maputo',
        sentAt: campaign.sentAt || null,
        createdBy: campaign.createdBy ? {
          id: (campaign.createdBy as any)._id.toString(),
          name: `${(campaign.createdBy as any).firstName || ''} ${(campaign.createdBy as any).lastName || ''}`.trim() || (campaign.createdBy as any).email
        } : null,
        stats: {
          totalSubscribers: campaign.stats?.totalSubscribers || 0,
          sent: campaign.stats?.sent || 0,
          delivered: campaign.stats?.delivered || 0,
          opened: campaign.stats?.opened || 0,
          clicked: campaign.stats?.clicked || 0,
          bounced: campaign.stats?.bounced || 0,
          unsubscribed: campaign.stats?.unsubscribed || 0,
          deliveryRate: campaign.stats?.deliveryRate || 0,
          openRate: campaign.stats?.openRate || 0,
          clickRate: campaign.stats?.clickRate || 0
        },
        createdAt: campaign.createdAt,
        updatedAt: campaign.updatedAt
      };
    } catch (error) {
      throw new Error(
        `Failed to get campaign: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Create campaign
  static async createCampaign(campaignData: any, createdBy?: string): Promise<any> {
    try {
      // Calculate estimated subscribers based on segmentation
      const estimatedSubscribers = await this.estimateSubscribers(campaignData.segmentation || {});

      const campaign = new NewsletterCampaign({
        ...campaignData,
        createdBy: createdBy ? new mongoose.Types.ObjectId(createdBy) : undefined,
        stats: {
          totalSubscribers: estimatedSubscribers
        }
      });

      await campaign.save();
      return await this.getCampaignById(campaign._id.toString());
    } catch (error) {
      throw new Error(
        `Failed to create campaign: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Update campaign
  static async updateCampaign(campaignId: string, updateData: any): Promise<any> {
    try {
      const campaign = await NewsletterCampaign.findById(campaignId);

      if (!campaign) {
        throw new Error('Campaign not found');
      }

      // Recalculate estimated subscribers if segmentation changed
      if (updateData.segmentation) {
        const estimatedSubscribers = await this.estimateSubscribers(updateData.segmentation);
        updateData.stats = {
          ...campaign.stats,
          totalSubscribers: estimatedSubscribers
        };
      }

      Object.keys(updateData).forEach(key => {
        if (key !== '_id' && key !== 'createdAt' && key !== 'updatedAt') {
          (campaign as any)[key] = updateData[key];
        }
      });

      await campaign.save();
      return await this.getCampaignById(campaignId);
    } catch (error) {
      throw new Error(
        `Failed to update campaign: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Update campaign status
  static async updateCampaignStatus(campaignId: string, status: string, scheduledAt?: Date): Promise<any> {
    try {
      const campaign = await NewsletterCampaign.findById(campaignId);

      if (!campaign) {
        throw new Error('Campaign not found');
      }

      campaign.status = status as any;
      
      if (status === 'scheduled' && scheduledAt) {
        campaign.scheduledAt = scheduledAt;
      } else if (status === 'sent') {
        campaign.sentAt = new Date();
        campaign.scheduledAt = undefined;
      }

      await campaign.save();
      return await this.getCampaignById(campaignId);
    } catch (error) {
      throw new Error(
        `Failed to update campaign status: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Delete campaign
  static async deleteCampaign(campaignId: string): Promise<void> {
    try {
      const campaign = await NewsletterCampaign.findById(campaignId);
      if (!campaign) {
        throw new Error('Campaign not found');
      }

      // Only allow deletion of draft or cancelled campaigns
      if (campaign.status !== 'draft' && campaign.status !== 'cancelled') {
        throw new Error('Cannot delete campaign that is not in draft or cancelled status');
      }

      await NewsletterCampaign.findByIdAndDelete(campaignId);
    } catch (error) {
      throw new Error(
        `Failed to delete campaign: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Estimate subscribers based on segmentation
  private static async estimateSubscribers(segmentation: any): Promise<number> {
    try {
      const query: any = {};

      if (segmentation.subscriberStatus && segmentation.subscriberStatus !== 'all') {
        if (segmentation.subscriberStatus === 'active') {
          query.status = 'active';
        } else if (segmentation.subscriberStatus === 'new') {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          query.createdAt = { $gte: thirtyDaysAgo };
          query.status = 'active';
        }
      } else {
        query.status = 'active';
      }

      if (segmentation.tags && segmentation.tags.length > 0) {
        query.tags = { $in: segmentation.tags };
      }

      return await NewsletterSubscriber.countDocuments(query);
    } catch (error) {
      return 0;
    }
  }
}

