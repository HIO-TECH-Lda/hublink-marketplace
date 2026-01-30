import { Request, Response } from 'express';
import { PayoutService } from '../services/payoutService';
import Messages from '../utils/messages';

export class PayoutController {
  // Get seller balance
  static async getBalance(req: Request, res: Response) {
    try {
      const sellerId = req.user!.sellerId || req.user!.userId;
      const balance = await PayoutService.getSellerBalance(sellerId!);

      return res.status(200).json({
        success: true,
        message: Messages.PAYOUT.BALANCE_RETRIEVED,
        data: balance
      });
    } catch (error) {
      console.error('Get balance error:', error);
      return res.status(500).json({
        success: false,
        message: Messages.PAYOUT.BALANCE_FAILED,
        error: error instanceof Error ? error.message : Messages.ERROR.SOMETHING_WENT_WRONG
      });
    }
  }

  // Get payout history
  static async getHistory(req: Request, res: Response) {
    try {
      const sellerId = req.user!.sellerId || req.user!.userId;
      const { page, limit, status } = req.query;

      const result = await PayoutService.getPayoutHistory(sellerId!, {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
        status: status as string
      });

      return res.status(200).json({
        success: true,
        message: Messages.PAYOUT.HISTORY_RETRIEVED,
        data: {
          payouts: result.payouts,
          pagination: result.pagination
        }
      });
    } catch (error) {
      console.error('Get payout history error:', error);
      return res.status(500).json({
        success: false,
        message: Messages.PAYOUT.HISTORY_FAILED,
        error: error instanceof Error ? error.message : Messages.ERROR.SOMETHING_WENT_WRONG
      });
    }
  }

  // Request payout
  static async requestPayout(req: Request, res: Response) {
    try {
      const sellerId = req.user!.sellerId || req.user!.userId;
      const { amount, method } = req.body;

      const payout = await PayoutService.requestPayout(sellerId!, {
        amount,
        method
      });

      return res.status(201).json({
        success: true,
        message: Messages.PAYOUT.REQUESTED,
        data: { payout }
      });
    } catch (error) {
      console.error('Request payout error:', error);
      return res.status(400).json({
        success: false,
        message: Messages.PAYOUT.REQUEST_FAILED,
        error: error instanceof Error ? error.message : Messages.ERROR.SOMETHING_WENT_WRONG
      });
    }
  }

  // Get payout by ID
  static async getPayoutById(req: Request, res: Response) {
    try {
      const { payoutId } = req.params;
      const sellerId = req.user!.sellerId || req.user!.userId;

      const payout = await PayoutService.getPayoutById(payoutId, sellerId);

      if (!payout) {
        return res.status(404).json({
          success: false,
          message: Messages.PAYOUT.NOT_FOUND
        });
      }

      return res.status(200).json({
        success: true,
        message: Messages.PAYOUT.RETRIEVED,
        data: { payout }
      });
    } catch (error) {
      console.error('Get payout error:', error);
      return res.status(500).json({
        success: false,
        message: Messages.PAYOUT.FETCH_FAILED,
        error: error instanceof Error ? error.message : Messages.ERROR.SOMETHING_WENT_WRONG
      });
    }
  }
}

