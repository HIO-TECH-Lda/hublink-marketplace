import { Request, Response } from 'express';
import { AdminRefundService } from '../services/adminRefundService';
import Messages from '../utils/messages';

export class AdminRefundController {
  // Get refund statistics
  static async getRefundStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await AdminRefundService.getRefundStats();

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.ADMIN_REFUND.STATS_FAILED
      });
    }
  }

  // Get all refunds with filters
  static async getRefunds(req: Request, res: Response): Promise<void> {
    try {
      const {
        search,
        status,
        page = '1',
        limit = '10',
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const filters = {
        search: search as string | undefined,
        status: status as 'pending' | 'approved' | 'rejected' | undefined,
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        sortBy: sortBy as string,
        sortOrder: (sortOrder as 'asc' | 'desc') || 'desc'
      };

      const result = await AdminRefundService.getRefunds(filters);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.ADMIN_REFUND.LIST_FAILED
      });
    }
  }

  // Get refund by ID
  static async getRefundById(req: Request, res: Response): Promise<void> {
    try {
      const { refundId } = req.params;

      const refund = await AdminRefundService.getRefundById(refundId);

      res.status(200).json({
        success: true,
        data: refund
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Refund not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch refund'
      });
    }
  }

  // Approve refund
  static async approveRefund(req: Request, res: Response): Promise<void> {
    try {
      const { refundId } = req.params;
      const processedBy = req.user!.userId;

      const refund = await AdminRefundService.approveRefund(refundId, processedBy);

      res.status(200).json({
        success: true,
        message: Messages.ADMIN_REFUND.APPROVED,
        data: refund
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Refund not found' ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to approve refund'
      });
    }
  }

  // Reject refund
  static async rejectRefund(req: Request, res: Response): Promise<void> {
    try {
      const { refundId } = req.params;
      const { rejectionReason } = req.body;
      const processedBy = req.user!.userId;

      if (!rejectionReason) {
        res.status(400).json({
          success: false,
          message: Messages.REFUND.REJECTION_REASON_REQUIRED
        });
        return;
      }

      const refund = await AdminRefundService.rejectRefund(
        refundId,
        processedBy,
        rejectionReason
      );

      res.status(200).json({
        success: true,
        message: 'Refund rejected successfully',
        data: refund
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Refund not found' ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.ADMIN_REFUND.REJECT_FAILED
      });
    }
  }
}

