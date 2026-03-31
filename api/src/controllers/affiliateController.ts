import { Request, Response } from 'express';
import { AffiliateService } from '../services/affiliateService';
import Messages from '../utils/messages';

export class AffiliateController {
  static async apply(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const { code, paymentMethod, paymentDetails } = req.body;

      const affiliate = await AffiliateService.apply(userId, {
        code,
        paymentMethod,
        paymentDetails,
      });

      return res.status(201).json({
        success: true,
        message: Messages.SUCCESS,
        data: { affiliate },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.INTERNAL_ERROR,
      });
    }
  }

  static async track(req: Request, res: Response) {
    try {
      const { code } = req.params;
      const result = await AffiliateService.trackCode(code, {
        userId: req.user?.userId,
        sessionId: req.headers['x-session-id'] as string | undefined,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        referer: req.headers.referer,
        landingUrl: req.query.landingUrl as string | undefined,
        utm: {
          source: req.query.utm_source as string | undefined,
          medium: req.query.utm_medium as string | undefined,
          campaign: req.query.utm_campaign as string | undefined,
          content: req.query.utm_content as string | undefined,
          term: req.query.utm_term as string | undefined,
        },
      });

      return res.status(200).json({
        success: true,
        message: Messages.SUCCESS,
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.INTERNAL_ERROR,
      });
    }
  }

  static async getMe(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const affiliate = await AffiliateService.getMyAffiliate(userId);

      return res.status(200).json({
        success: true,
        message: Messages.SUCCESS,
        data: { affiliate },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.INTERNAL_ERROR,
      });
    }
  }

  static async getMyDashboard(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const dashboard = await AffiliateService.getMyDashboard(userId);

      return res.status(200).json({
        success: true,
        message: Messages.SUCCESS,
        data: dashboard,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.INTERNAL_ERROR,
      });
    }
  }

  static async getMyConversions(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const { page = '1', limit = '10', status } = req.query;

      const result = await AffiliateService.getMyConversions(
        userId,
        parseInt(page as string, 10),
        parseInt(limit as string, 10),
        status as string | undefined
      );

      return res.status(200).json({
        success: true,
        message: Messages.SUCCESS,
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.INTERNAL_ERROR,
      });
    }
  }
}

