import { Request, Response } from 'express';
import { RefundService } from '../services/refundService';
import Messages from '../utils/messages';

export class RefundController {
  // Get refund statistics
  static async getStatistics(req: Request, res: Response) {
    try {
      const sellerId = req.user!.sellerId || req.user!.userId;
      const stats = await RefundService.getSellerRefundStatistics(sellerId!);

      return res.status(200).json({
        success: true,
        message: Messages.REFUND.STATS_RETRIEVED,
        data: stats
      });
    } catch (error) {
      console.error('Get refund statistics error:', error);
      return res.status(500).json({
        success: false,
        message: Messages.REFUND.STATS_FAILED,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get seller refunds
  static async getRefunds(req: Request, res: Response) {
    try {
      const sellerId = req.user!.sellerId || req.user!.userId;
      const { page, limit, status, search } = req.query;

      const result = await RefundService.getSellerRefunds(sellerId!, {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
        status: status as string,
        search: search as string
      });

      return res.status(200).json({
        success: true,
        message: Messages.REFUND.FETCH_SUCCESS,
        data: {
          refunds: result.refunds,
          pagination: result.pagination
        }
      });
    } catch (error) {
      console.error('Get refunds error:', error);
      return res.status(500).json({
        success: false,
        message: Messages.REFUND.FETCH_FAILED,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get refund by ID
  static async getRefundById(req: Request, res: Response) {
    try {
      const { refundId } = req.params;
      const sellerId = req.user!.sellerId || req.user!.userId;

      const refund = await RefundService.getRefundById(refundId, sellerId);

      if (!refund) {
        return res.status(404).json({
          success: false,
          message: Messages.REFUND.NOT_FOUND
        });
      }

      return res.status(200).json({
        success: true,
        message: Messages.REFUND.RETRIEVED,
        data: { refund }
      });
    } catch (error) {
      console.error('Get refund error:', error);
      return res.status(500).json({
        success: false,
        message: Messages.REFUND.FETCH_FAILED,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Approve refund
  static async approveRefund(req: Request, res: Response) {
    try {
      const { refundId } = req.params;
      const sellerId = req.user!.sellerId || req.user!.userId;
      const processedBy = req.user!.userId;

      const refund = await RefundService.approveRefund(refundId, sellerId!, processedBy);

      return res.status(200).json({
        success: true,
        message: Messages.REFUND.APPROVED,
        data: { refund }
      });
    } catch (error) {
      console.error('Approve refund error:', error);
      return res.status(400).json({
        success: false,
        message: Messages.REFUND.APPROVE_FAILED,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Reject refund
  static async rejectRefund(req: Request, res: Response) {
    try {
      const { refundId } = req.params;
      const { rejectionReason } = req.body;
      const sellerId = req.user!.sellerId || req.user!.userId;
      const processedBy = req.user!.userId;

      if (!rejectionReason) {
        return res.status(400).json({
          success: false,
          message: Messages.REFUND.REJECTION_REASON_REQUIRED
        });
      }

      const refund = await RefundService.rejectRefund(
        refundId,
        sellerId!,
        processedBy,
        rejectionReason
      );

      return res.status(200).json({
        success: true,
        message: Messages.REFUND.REJECTED,
        data: { refund }
      });
    } catch (error) {
      console.error('Reject refund error:', error);
      return res.status(400).json({
        success: false,
        message: Messages.REFUND.REJECT_FAILED,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Create refund request (buyer)
  static async createRefundRequest(req: Request, res: Response) {
    try {
      const buyerId = req.user!.userId;
      const { orderId, orderItemId, productId, reason, description, images } = req.body;

      const refund = await RefundService.createRefundRequest(buyerId, {
        orderId,
        orderItemId,
        productId,
        reason,
        description,
        images
      });

      return res.status(201).json({
        success: true,
        message: Messages.REFUND.REQUESTED,
        data: { refund }
      });
    } catch (error) {
      console.error('Create refund request error:', error);
      return res.status(400).json({
        success: false,
        message: Messages.REFUND.CREATE_FAILED,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get buyer refunds
  static async getBuyerRefunds(req: Request, res: Response) {
    try {
      const buyerId = req.user!.userId;
      const { page, limit, status } = req.query;

      const result = await RefundService.getBuyerRefunds(buyerId, {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
        status: status as string
      });

      return res.status(200).json({
        success: true,
        message: Messages.REFUND.FETCH_SUCCESS,
        data: {
          refunds: result.refunds,
          pagination: result.pagination
        }
      });
    } catch (error) {
      console.error('Get buyer refunds error:', error);
      return res.status(500).json({
        success: false,
        message: Messages.REFUND.FETCH_FAILED,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get refund by ID (buyer)
  static async getBuyerRefundById(req: Request, res: Response) {
    try {
      const { refundId } = req.params;
      const buyerId = req.user!.userId;

      const refund = await RefundService.getRefundByIdForBuyer(refundId, buyerId);

      if (!refund) {
        return res.status(404).json({
          success: false,
          message: Messages.REFUND.NOT_FOUND
        });
      }

      return res.status(200).json({
        success: true,
        message: Messages.REFUND.RETRIEVED,
        data: { refund }
      });
    } catch (error) {
      console.error('Get buyer refund error:', error);
      return res.status(500).json({
        success: false,
        message: Messages.REFUND.FETCH_FAILED,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get all refunds (admin)
  static async getAllRefunds(req: Request, res: Response) {
    try {
      const { page, limit, status, sellerId, buyerId, search } = req.query;

      const result = await RefundService.getAllRefunds({
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
        status: status as string,
        sellerId: sellerId as string,
        buyerId: buyerId as string,
        search: search as string
      });

      return res.status(200).json({
        success: true,
        message: Messages.REFUND.FETCH_SUCCESS,
        data: {
          refunds: result.refunds,
          pagination: result.pagination
        }
      });
    } catch (error) {
      console.error('Get all refunds error:', error);
      return res.status(500).json({
        success: false,
        message: Messages.REFUND.FETCH_FAILED,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get all refund statistics (admin)
  static async getAllStatistics(req: Request, res: Response) {
    try {
      const stats = await RefundService.getAllRefundStatistics();

      return res.status(200).json({
        success: true,
        message: Messages.REFUND.STATS_RETRIEVED,
        data: stats
      });
    } catch (error) {
      console.error('Get all refund statistics error:', error);
      return res.status(500).json({
        success: false,
        message: Messages.REFUND.STATS_FAILED,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get any refund by ID (admin)
  static async getAnyRefundById(req: Request, res: Response) {
    try {
      const { refundId } = req.params;

      const refund = await RefundService.getRefundById(refundId);

      if (!refund) {
        return res.status(404).json({
          success: false,
          message: Messages.REFUND.NOT_FOUND
        });
      }

      return res.status(200).json({
        success: true,
        message: Messages.REFUND.RETRIEVED,
        data: { refund }
      });
    } catch (error) {
      console.error('Get refund error:', error);
      return res.status(500).json({
        success: false,
        message: Messages.REFUND.FETCH_FAILED,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Approve refund (admin)
  static async approveRefundByAdmin(req: Request, res: Response) {
    try {
      const { refundId } = req.params;
      const processedBy = req.user!.userId;

      const refund = await RefundService.approveRefundByAdmin(refundId, processedBy);

      return res.status(200).json({
        success: true,
        message: Messages.REFUND.APPROVED,
        data: { refund }
      });
    } catch (error) {
      console.error('Approve refund error:', error);
      return res.status(400).json({
        success: false,
        message: Messages.REFUND.APPROVE_FAILED,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Reject refund (admin)
  static async rejectRefundByAdmin(req: Request, res: Response) {
    try {
      const { refundId } = req.params;
      const { rejectionReason } = req.body;
      const processedBy = req.user!.userId;

      if (!rejectionReason) {
        return res.status(400).json({
          success: false,
          message: Messages.REFUND.REJECTION_REASON_REQUIRED
        });
      }

      const refund = await RefundService.rejectRefundByAdmin(
        refundId,
        processedBy,
        rejectionReason
      );

      return res.status(200).json({
        success: true,
        message: Messages.REFUND.REJECTED,
        data: { refund }
      });
    } catch (error) {
      console.error('Reject refund error:', error);
      return res.status(400).json({
        success: false,
        message: Messages.REFUND.REJECT_FAILED,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

