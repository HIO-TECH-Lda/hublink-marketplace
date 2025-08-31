import { Request, Response } from 'express';
import { OrderService } from '../services/orderService';

export class OrderController {
  // Create order from cart
  static async createOrderFromCart(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const { shippingAddress, billingAddress, payment, notes } = req.body;

      const order = await OrderService.createOrderFromCart(userId, {
        shippingAddress,
        billingAddress,
        payment,
        notes
      });

      return res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: {
          order: {
            orderNumber: order.orderNumber,
            orderId: order._id,
            status: order.status,
            total: order.total,
            currency: order.currency,
            items: order.items,
            shippingAddress: order.shippingAddress,
            billingAddress: order.billingAddress,
            payment: order.payment,
            createdAt: order.createdAt
          }
        }
      });
    } catch (error) {
      console.error('Create order from cart error:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to create order',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Create order with specific items
  static async createOrder(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const { items, shippingAddress, billingAddress, payment, notes } = req.body;

      const order = await OrderService.createOrder(userId, {
        items,
        shippingAddress,
        billingAddress,
        payment,
        notes
      });

      return res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: {
          order: {
            orderNumber: order.orderNumber,
            orderId: order._id,
            status: order.status,
            total: order.total,
            currency: order.currency,
            items: order.items,
            shippingAddress: order.shippingAddress,
            billingAddress: order.billingAddress,
            payment: order.payment,
            createdAt: order.createdAt
          }
        }
      });
    } catch (error) {
      console.error('Create order error:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to create order',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get order by ID
  static async getOrderById(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const userId = req.user!.userId;
      const userRole = req.user!.role;

      // Users can only see their own orders, admins can see all
      const order = await OrderService.getOrderById(orderId, userRole === 'admin' ? undefined : userId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Order retrieved successfully',
        data: { order }
      });
    } catch (error) {
      console.error('Get order by ID error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve order',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get order by order number
  static async getOrderByNumber(req: Request, res: Response) {
    try {
      const { orderNumber } = req.params;
      const userId = req.user!.userId;
      const userRole = req.user!.role;

      // Users can only see their own orders, admins can see all
      const order = await OrderService.getOrderByNumber(orderNumber, userRole === 'admin' ? undefined : userId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Order retrieved successfully',
        data: { order }
      });
    } catch (error) {
      console.error('Get order by number error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve order',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get user's orders
  static async getUserOrders(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const { page, limit, status, sortBy, sortOrder } = req.query;

      const options = {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
        status: status as string,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc'
      };

      const result = await OrderService.getUserOrders(userId, options);

      return res.status(200).json({
        success: true,
        message: 'User orders retrieved successfully',
        data: {
          orders: result.orders,
          pagination: result.pagination
        }
      });
    } catch (error) {
      console.error('Get user orders error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve user orders',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get all orders (admin only)
  static async getAllOrders(req: Request, res: Response) {
    try {
      const { page, limit, status, userId, sortBy, sortOrder } = req.query;

      const options = {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
        status: status as string,
        userId: userId as string,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc'
      };

      const result = await OrderService.getAllOrders(options);

      return res.status(200).json({
        success: true,
        message: 'All orders retrieved successfully',
        data: {
          orders: result.orders,
          pagination: result.pagination
        }
      });
    } catch (error) {
      console.error('Get all orders error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve orders',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Update order status (admin/seller only)
  static async updateOrderStatus(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const { status, trackingNumber, cancelReason, refundAmount } = req.body;
      const updatedBy = req.user!.userId;

      const options: any = {};
      if (trackingNumber) options.trackingNumber = trackingNumber;
      if (cancelReason) options.cancelReason = cancelReason;
      if (refundAmount) options.refundAmount = refundAmount;
      if (status === 'cancelled') options.cancelledBy = updatedBy;

      const order = await OrderService.updateOrderStatus(orderId, status, options);

      return res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
        data: { order }
      });
    } catch (error) {
      console.error('Update order status error:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to update order status',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Cancel order
  static async cancelOrder(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const { reason } = req.body;
      const cancelledBy = req.user!.userId;

      const order = await OrderService.cancelOrder(orderId, cancelledBy, reason);

      return res.status(200).json({
        success: true,
        message: 'Order cancelled successfully',
        data: { order }
      });
    } catch (error) {
      console.error('Cancel order error:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to cancel order',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get order statistics
  static async getOrderStatistics(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const userRole = req.user!.role;

      // Users can only see their own statistics, admins can see all
      const stats = await OrderService.getOrderStatistics(userRole === 'admin' ? undefined : userId);

      return res.status(200).json({
        success: true,
        message: 'Order statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Get order statistics error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve order statistics',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get order tracking information
  static async getOrderTracking(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const userId = req.user!.userId;
      const userRole = req.user!.role;

      const order = await OrderService.getOrderById(orderId, userRole === 'admin' ? undefined : userId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      const trackingInfo = {
        orderNumber: order.orderNumber,
        status: order.status,
        estimatedDelivery: order.estimatedDelivery,
        trackingNumber: order.items[0]?.trackingNumber,
        statusHistory: [
          {
            status: 'pending',
            date: order.createdAt,
            description: 'Order placed'
          },
          ...(order.confirmedAt ? [{
            status: 'confirmed',
            date: order.confirmedAt,
            description: 'Order confirmed'
          }] : []),
          ...(order.processedAt ? [{
            status: 'processing',
            date: order.processedAt,
            description: 'Order being processed'
          }] : []),
          ...(order.shippedAt ? [{
            status: 'shipped',
            date: order.shippedAt,
            description: 'Order shipped',
            trackingNumber: order.items[0]?.trackingNumber
          }] : []),
          ...(order.deliveredAt ? [{
            status: 'delivered',
            date: order.deliveredAt,
            description: 'Order delivered'
          }] : []),
          ...(order.cancelledAt ? [{
            status: 'cancelled',
            date: order.cancelledAt,
            description: 'Order cancelled',
            reason: order.cancelReason
          }] : [])
        ]
      };

      return res.status(200).json({
        success: true,
        message: 'Order tracking information retrieved successfully',
        data: trackingInfo
      });
    } catch (error) {
      console.error('Get order tracking error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve order tracking information',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
