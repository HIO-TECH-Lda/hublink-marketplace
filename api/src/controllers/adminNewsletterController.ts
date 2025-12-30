import { Request, Response } from 'express';
import { AdminNewsletterService } from '../services/adminNewsletterService';

export class AdminNewsletterController {
  // ==================== STATISTICS ====================

  static async getNewsletterStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await AdminNewsletterService.getNewsletterStats();
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get newsletter statistics'
      });
    }
  }

  // ==================== SUBSCRIBER METHODS ====================

  static async getSubscribers(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        search: req.query.search as string | undefined,
        status: req.query.status as string | undefined,
        origin: req.query.origin as string | undefined,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        sortBy: req.query.sortBy as string | undefined,
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
      };

      const result = await AdminNewsletterService.getSubscribers(filters);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get subscribers'
      });
    }
  }

  static async getSubscriberById(req: Request, res: Response): Promise<void> {
    try {
      const { subscriberId } = req.params;
      const subscriber = await AdminNewsletterService.getSubscriberById(subscriberId);
      res.json({
        success: true,
        data: subscriber
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Subscriber not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get subscriber'
      });
    }
  }

  static async createSubscriber(req: Request, res: Response): Promise<void> {
    try {
      const subscriberData = req.body;
      const subscriber = await AdminNewsletterService.createSubscriber(subscriberData);
      res.status(201).json({
        success: true,
        message: 'Subscriber created successfully',
        data: subscriber
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('already subscribed') ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create subscriber'
      });
    }
  }

  static async updateSubscriber(req: Request, res: Response): Promise<void> {
    try {
      const { subscriberId } = req.params;
      const updateData = req.body;
      const subscriber = await AdminNewsletterService.updateSubscriber(subscriberId, updateData);
      res.json({
        success: true,
        message: 'Subscriber updated successfully',
        data: subscriber
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Subscriber not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update subscriber'
      });
    }
  }

  static async updateSubscriberStatus(req: Request, res: Response): Promise<void> {
    try {
      const { subscriberId } = req.params;
      const { status } = req.body;

      if (!status || !['active', 'unsubscribed', 'bounced', 'pending'].includes(status)) {
        res.status(400).json({
          success: false,
          message: 'Invalid status. Must be one of: active, unsubscribed, bounced, pending'
        });
        return;
      }

      const subscriber = await AdminNewsletterService.updateSubscriberStatus(subscriberId, status);
      res.json({
        success: true,
        message: 'Subscriber status updated successfully',
        data: subscriber
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Subscriber not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update subscriber status'
      });
    }
  }

  static async deleteSubscriber(req: Request, res: Response): Promise<void> {
    try {
      const { subscriberId } = req.params;
      await AdminNewsletterService.deleteSubscriber(subscriberId);
      res.json({
        success: true,
        message: 'Subscriber deleted successfully'
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Subscriber not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete subscriber'
      });
    }
  }

  // ==================== CAMPAIGN METHODS ====================

  static async getCampaigns(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        search: req.query.search as string | undefined,
        type: req.query.type as string | undefined,
        status: req.query.status as string | undefined,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        sortBy: req.query.sortBy as string | undefined,
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
      };

      const result = await AdminNewsletterService.getCampaigns(filters);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get campaigns'
      });
    }
  }

  static async getCampaignById(req: Request, res: Response): Promise<void> {
    try {
      const { campaignId } = req.params;
      const campaign = await AdminNewsletterService.getCampaignById(campaignId);
      res.json({
        success: true,
        data: campaign
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Campaign not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get campaign'
      });
    }
  }

  static async createCampaign(req: Request, res: Response): Promise<void> {
    try {
      const campaignData = req.body;
      const createdBy = (req as any).user?.userId;
      const campaign = await AdminNewsletterService.createCampaign(campaignData, createdBy);
      res.status(201).json({
        success: true,
        message: 'Campaign created successfully',
        data: campaign
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create campaign'
      });
    }
  }

  static async updateCampaign(req: Request, res: Response): Promise<void> {
    try {
      const { campaignId } = req.params;
      const updateData = req.body;
      const campaign = await AdminNewsletterService.updateCampaign(campaignId, updateData);
      res.json({
        success: true,
        message: 'Campaign updated successfully',
        data: campaign
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Campaign not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update campaign'
      });
    }
  }

  static async updateCampaignStatus(req: Request, res: Response): Promise<void> {
    try {
      const { campaignId } = req.params;
      const { status, scheduledAt } = req.body;

      if (!status || !['draft', 'scheduled', 'sending', 'sent', 'cancelled'].includes(status)) {
        res.status(400).json({
          success: false,
          message: 'Invalid status. Must be one of: draft, scheduled, sending, sent, cancelled'
        });
        return;
      }

      const campaign = await AdminNewsletterService.updateCampaignStatus(
        campaignId,
        status,
        scheduledAt ? new Date(scheduledAt) : undefined
      );
      res.json({
        success: true,
        message: 'Campaign status updated successfully',
        data: campaign
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Campaign not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update campaign status'
      });
    }
  }

  static async deleteCampaign(req: Request, res: Response): Promise<void> {
    try {
      const { campaignId } = req.params;
      await AdminNewsletterService.deleteCampaign(campaignId);
      res.json({
        success: true,
        message: 'Campaign deleted successfully'
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Campaign not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete campaign'
      });
    }
  }
}

