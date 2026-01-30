import { Request, Response } from 'express';
import { AdminOrderService } from '../services/adminOrderService';
import { OrderService } from '../services/orderService';
import Messages from '../utils/messages';

export class AdminOrderController {
  // Get order statistics
  static async getOrderStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await AdminOrderService.getOrderStats();

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.ADMIN_ORDER.STATS_FAILED
      });
    }
  }

  // Get all orders with filters
  static async getOrders(req: Request, res: Response): Promise<void> {
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
        status: status as 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | undefined,
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        sortBy: sortBy as string,
        sortOrder: (sortOrder as 'asc' | 'desc') || 'desc'
      };

      const result = await AdminOrderService.getOrders(filters);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.ADMIN_ORDER.LIST_FAILED
      });
    }
  }

  // Get order by ID
  static async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;

      const order = await AdminOrderService.getOrderById(orderId);

      res.status(200).json({
        success: true,
        data: order
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Order not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.ADMIN_ORDER.FETCH_FAILED
      });
    }
  }

  // Update order status (reuse existing service)
  static async updateOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;
      const { status, trackingNumber, cancelReason, refundAmount } = req.body;
      const updatedBy = req.user!.userId;

      const order = await OrderService.updateOrderStatus(orderId, status, {
        trackingNumber,
        cancelledBy: updatedBy,
        cancelReason,
        refundAmount
      });

      res.status(200).json({
        success: true,
        message: Messages.ADMIN_ORDER.STATUS_UPDATED,
        data: order
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Order not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.ADMIN_ORDER.STATUS_UPDATE_FAILED
      });
    }
  }

  // Update order details
  static async updateOrder(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;
      const updateData = req.body;

      const order = await AdminOrderService.updateOrder(orderId, updateData);

      res.status(200).json({
        success: true,
        message: Messages.ADMIN_ORDER.UPDATED,
        data: order
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Order not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.ADMIN_ORDER.UPDATE_FAILED
      });
    }
  }
}

