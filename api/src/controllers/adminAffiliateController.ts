import { Request, Response } from 'express';
import { AdminAffiliateService } from '../services/adminAffiliateService';
import Messages from '../utils/messages';

export class AdminAffiliateController {
  static async getAffiliates(req: Request, res: Response) {
    try {
      const { page = '1', limit = '10', status, search } = req.query;
      const result = await AdminAffiliateService.getAffiliates({
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        status: status as 'pending' | 'active' | 'blocked' | undefined,
        search: search as string | undefined,
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

  static async updateAffiliateStatus(req: Request, res: Response) {
    try {
      const { affiliateId } = req.params;
      const { status } = req.body;

      const affiliate = await AdminAffiliateService.updateAffiliateStatus(affiliateId, status);

      return res.status(200).json({
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

  static async getConversions(req: Request, res: Response) {
    try {
      const { page = '1', limit = '10', status } = req.query;

      const result = await AdminAffiliateService.getConversions({
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        status: status as 'pending' | 'approved' | 'rejected' | 'paid' | undefined,
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

  static async approveConversion(req: Request, res: Response) {
    try {
      const { conversionId } = req.params;
      const conversion = await AdminAffiliateService.approveConversion(conversionId);

      return res.status(200).json({
        success: true,
        message: Messages.SUCCESS,
        data: { conversion },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.INTERNAL_ERROR,
      });
    }
  }

  static async rejectConversion(req: Request, res: Response) {
    try {
      const { conversionId } = req.params;
      const { reason } = req.body;
      const conversion = await AdminAffiliateService.rejectConversion(conversionId, reason);

      return res.status(200).json({
        success: true,
        message: Messages.SUCCESS,
        data: { conversion },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.INTERNAL_ERROR,
      });
    }
  }
}

