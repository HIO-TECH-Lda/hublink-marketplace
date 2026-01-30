import { Request, Response } from 'express';
import { AdminNewsletterService } from '../services/adminNewsletterService';
import Messages from '../utils/messages';

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
        message: error instanceof Error ? error.message : Messages.ADMIN_NEWSLETTER.STATS_FAILED
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
        message: error instanceof Error ? error.message : Messages.ADMIN_NEWSLETTER.LIST_FAILED
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
        message: error instanceof Error ? error.message : Messages.ADMIN_NEWSLETTER.FETCH_FAILED
      });
    }
  }

  static async createSubscriber(req: Request, res: Response): Promise<void> {
    try {
      const subscriberData = req.body;
      const subscriber = await AdminNewsletterService.createSubscriber(subscriberData);
      res.status(201).json({
        success: true,
        message: Messages.ADMIN_NEWSLETTER.CREATED,
        data: subscriber
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('already subscribed') ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.ADMIN_NEWSLETTER.CREATE_FAILED
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
        message: Messages.ADMIN_NEWSLETTER.UPDATED,
        data: subscriber
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Subscriber not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.ADMIN_NEWSLETTER.UPDATE_FAILED
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
          message: Messages.VALIDATION.INVALID_VALUE
        });
        return;
      }

      const subscriber = await AdminNewsletterService.updateSubscriberStatus(subscriberId, status);
      res.json({
        success: true,
        message: Messages.ADMIN_NEWSLETTER.STATUS_UPDATED,
        data: subscriber
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Subscriber not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.ADMIN_NEWSLETTER.STATUS_UPDATE_FAILED
      });
    }
  }

  static async deleteSubscriber(req: Request, res: Response): Promise<void> {
    try {
      const { subscriberId } = req.params;
      await AdminNewsletterService.deleteSubscriber(subscriberId);
      res.json({
        success: true,
        message: Messages.ADMIN_NEWSLETTER.DELETED
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Subscriber not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.ADMIN_NEWSLETTER.DELETE_FAILED
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
        message: error instanceof Error ? error.message : Messages.ADMIN_NEWSLETTER.LIST_FAILED
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
        message: error instanceof Error ? error.message : Messages.ADMIN_NEWSLETTER.FETCH_FAILED
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
        message: Messages.ADMIN_NEWSLETTER.CREATED,
        data: campaign
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.ADMIN_NEWSLETTER.CREATE_FAILED
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
        message: Messages.ADMIN_NEWSLETTER.UPDATED,
        data: campaign
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Campaign not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.ADMIN_NEWSLETTER.UPDATE_FAILED
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
          message: Messages.VALIDATION.INVALID_VALUE
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
        message: Messages.ADMIN_NEWSLETTER.STATUS_UPDATED,
        data: campaign
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Campaign not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.ADMIN_NEWSLETTER.STATUS_UPDATE_FAILED
      });
    }
  }

  static async deleteCampaign(req: Request, res: Response): Promise<void> {
    try {
      const { campaignId } = req.params;
      await AdminNewsletterService.deleteCampaign(campaignId);
      res.json({
        success: true,
        message: Messages.ADMIN_NEWSLETTER.DELETED
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Campaign not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.ADMIN_NEWSLETTER.DELETE_FAILED
      });
    }
  }
}

