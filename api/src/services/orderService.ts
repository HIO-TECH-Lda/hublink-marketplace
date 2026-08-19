import Order, { IOrder } from '../models/Order';
import Cart, { ICart } from '../models/Cart';
import Product from '../models/Product';
import User from '../models/User';
import { CartService } from './cartService';
import Messages from '../utils/messages';
import mongoose from 'mongoose';

export class OrderService {
  // Create order from cart
  static async createOrderFromCart(
    userId: string,
    orderData: {
      shippingAddress: any;
      billingAddress: any;
      payment: any;
      notes?: string;
    }
  ): Promise<IOrder> {
    try {
      // Get user's cart
      const cart = await CartService.getUserCart(userId);
      if (!cart || cart.items.length === 0) {
        throw new Error(Messages.ORDER.CART_EMPTY);
      }

      // Check cart item availability
      const availability = await CartService.checkCartItemAvailability(userId);
      if (availability.unavailableItems.length > 0) {
        throw new Error(`Some items are unavailable: ${availability.unavailableItems.map(item => item.productName).join(', ')}`);
      }

      if (availability.lowStockItems.length > 0) {
        throw new Error(`Some items have insufficient stock: ${availability.lowStockItems.map(item => item.productName).join(', ')}`);
      }

      // Create order items from cart items
      const orderItems = cart.items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        productSlug: item.productSlug,
        sellerId: item.sellerId,
        sellerName: item.sellerName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        variantId: item.variantId,
        variantName: item.variantName,
        variantValue: item.variantValue,
        variantPrice: item.variantPrice,
        status: 'pending' as const
      }));

      // Create order
      const order = new Order({
        userId,
        items: orderItems,
        shippingAddress: orderData.shippingAddress,
        billingAddress: orderData.billingAddress,
        payment: {
          ...orderData.payment,
          amount: cart.total,
          status: 'pending'
        },
        notes: orderData.notes,
        subtotal: cart.subtotal,
        tax: cart.tax,
        shipping: cart.shipping,
        discount: cart.discount,
        total: cart.total,
        currency: cart.currency
      });

      await order.calculateTotals();
      await order.save();

      // Clear the cart after successful order creation
      await CartService.clearCart(userId);

      // Update product stock
      await this.updateProductStock(orderItems);

      return order;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : Messages.ORDER.CREATE_FAILED);
    }
  }

  // Create order with specific items (not from cart)
  static async createOrder(
    userId: string,
    orderData: {
      items: Array<{
        productId: string;
        quantity: number;
        variantId?: string;
      }>;
      shippingAddress: any;
      billingAddress: any;
      payment: any;
      notes?: string;
    }
  ): Promise<IOrder> {
    try {
      const orderItems = [];
      let subtotal = 0;

      // Process each item
      for (const itemData of orderData.items) {
        const product = await Product.findById(itemData.productId);
        if (!product) {
          throw new Error(`Product not found: ${itemData.productId}`);
        }

        if (product.status !== 'active') {
          throw new Error(`Product is not available: ${product.name}`);
        }

        // Check stock
        let availableStock = product.stock;
        let unitPrice = product.price;
        let variantName, variantValue, variantPrice;

        if (itemData.variantId) {
          const variant = product.variants?.find((v: any) => v._id.toString() === itemData.variantId);
          if (!variant) {
            throw new Error(Messages.PRODUCT.VARIANT_NOT_FOUND);
          }
          availableStock = variant.stock;
          unitPrice = variant.price;
          variantName = variant.name;
          variantValue = variant.value;
          variantPrice = variant.price;
        }

        if (availableStock < itemData.quantity) {
          throw new Error(`Insufficient stock for ${product.name}. Available: ${availableStock}`);
        }

        // Get seller info
        const seller = await User.findById(product.sellerId);
        const sellerName = seller ? `${seller.firstName} ${seller.lastName}` : 'Unknown Seller';

        const totalPrice = unitPrice * itemData.quantity;
        subtotal += totalPrice;

        orderItems.push({
          productId: product._id,
          productName: product.name,
          productImage: product.primaryImage || product.images?.[0]?.url || '',
          productSlug: product.slug,
          sellerId: product.sellerId,
          sellerName,
          quantity: itemData.quantity,
          unitPrice,
          totalPrice,
          variantId: itemData.variantId,
          variantName,
          variantValue,
          variantPrice,
          status: 'pending' as const
        });
      }

      // Calculate totals
      // const tax = subtotal * 0.1; // 10% tax
      const tax = 0;
      // const shipping = subtotal >= 50 ? 0 : 5; // Free shipping over $50
      const shipping = 0;
      const discount = 0;
      const total = subtotal + tax + shipping - discount;

      // Create order
      const order = new Order({
        userId,
        items: orderItems,
        shippingAddress: orderData.shippingAddress,
        billingAddress: orderData.billingAddress,
        payment: {
          ...orderData.payment,
          amount: total,
          status: 'pending'
        },
        notes: orderData.notes,
        subtotal,
        tax,
        shipping,
        discount,
        total,
        currency: 'MZM'
      });

      await order.save();

      // Update product stock
      await this.updateProductStock(orderItems);

      return order;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : Messages.ORDER.CREATE_FAILED);
    }
  }

  // Get order by ID
  static async getOrderById(orderId: string, userId?: string): Promise<IOrder | null> {
    try {
      const query: any = { _id: orderId };
      if (userId) {
        query.userId = userId;
      }

      const order = await Order.findOne(query)
        .populate('userId', 'firstName lastName email')
        .populate('cancelledBy', 'firstName lastName')
        .populate({
          path: 'refunds',
          options: { sort: { requestedAt: -1 } },
          populate: [
            { path: 'buyerId', select: 'firstName lastName email' },
            { path: 'sellerId', select: 'firstName lastName email' },
            { path: 'productId', select: 'name primaryImage' }
          ]
        });

      return order;
    } catch (error) {
      throw new Error(`Failed to get order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get order by order number
  static async getOrderByNumber(orderNumber: string, userId?: string): Promise<IOrder | null> {
    try {
      const query: any = { orderNumber };
      if (userId) {
        query.userId = userId;
      }

      const order = await Order.findOne(query)
        .populate('userId', 'firstName lastName email')
        .populate('cancelledBy', 'firstName lastName')
        .populate({
          path: 'refunds',
          options: { sort: { requestedAt: -1 } },
          populate: [
            { path: 'buyerId', select: 'firstName lastName email' },
            { path: 'sellerId', select: 'firstName lastName email' },
            { path: 'productId', select: 'name primaryImage' }
          ]
        });

      return order;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : Messages.ORDER.FETCH_FAILED);
    }
  }

  // Get user's orders
  static async getUserOrders(
    userId: string,
    options: {
      page?: number;
      limit?: number;
      status?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    } = {}
  ): Promise<{
    orders: IOrder[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    try {
      const { page = 1, limit = 10, status, sortBy = 'createdAt', sortOrder = 'desc' } = options;

      const query: any = { userId };
      if (status) {
        query.status = status;
      }

      const sort: any = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const total = await Order.countDocuments(query);
      const pages = Math.ceil(total / limit);

      const orders = await Order.find(query)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('userId', 'firstName lastName email');

      return {
        orders,
        pagination: {
          page,
          limit,
          total,
          pages
        }
      };
    } catch (error) {
      throw new Error(`Failed to get user orders: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get all orders (admin only)
  static async getAllOrders(
    options: {
      page?: number;
      limit?: number;
      status?: string;
      userId?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    } = {}
  ): Promise<{
    orders: IOrder[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    try {
      const { page = 1, limit = 10, status, userId, sortBy = 'createdAt', sortOrder = 'desc' } = options;

      const query: any = {};
      if (status) query.status = status;
      if (userId) query.userId = userId;

      const sort: any = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const total = await Order.countDocuments(query);
      const pages = Math.ceil(total / limit);

      const orders = await Order.find(query)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('userId', 'firstName lastName email')
        .populate('cancelledBy', 'firstName lastName');

      return {
        orders,
        pagination: {
          page,
          limit,
          total,
          pages
        }
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : Messages.ORDER.GET_ALL_FAILED);
    }
  }

  // Update order status
  static async updateOrderStatus(
    orderId: string,
    status: string,
    options: {
      trackingNumber?: string;
      cancelledBy?: string;
      cancelReason?: string;
      refundAmount?: number;
    } = {}
  ): Promise<IOrder> {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error(Messages.ORDER.NOT_FOUND);
      }

      switch (status) {
        case 'confirmed':
          await order.confirmOrder();
          break;
        case 'processing':
          await order.processOrder();
          break;
        case 'shipped':
          await order.shipOrder(options.trackingNumber);
          break;
        case 'delivered':
          await order.deliverOrder();
          // Sync marketplace sales to finance for all sellers in this order
          await this.syncFinanceForDeliveredOrder(order);
          // Update seller sales count (new feature)
          const { SellerRatingService } = await import('./sellerRatingService');
          await SellerRatingService.updateSellerSalesFromOrder(orderId);
          break;
        case 'cancelled':
          if (!options.cancelledBy || !options.cancelReason) {
            throw new Error(Messages.ORDER.CANCEL_REQUIRED);
          }
          await order.cancelOrder(options.cancelledBy, options.cancelReason);
          break;
        case 'refunded':
          if (!options.refundAmount) {
            throw new Error('Refund amount is required for refunded status');
          }
          await order.refundOrder(options.refundAmount);
          break;
        default:
          throw new Error(Messages.ORDER.INVALID_STATUS);
      }

      return order;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : Messages.ORDER.STATUS_UPDATE_FAILED);
    }
  }

  // Sync finance entries for all sellers when order is delivered
  private static async syncFinanceForDeliveredOrder(order: IOrder): Promise<void> {
    try {
      const { FinanceService } = require('./financeService');
      const sellerIds = [...new Set(order.items.map(item => item.sellerId.toString()))];
      
      // Sync for each seller in the order
      for (const sellerId of sellerIds) {
        try {
          await FinanceService.syncMarketplaceSales(sellerId, order._id!.toString());
        } catch (error) {
          // Log but don't fail the order update if finance sync fails
          console.error(`Failed to sync finance for seller ${sellerId} and order ${order._id}:`, error);
        }
      }
    } catch (error) {
      // Don't throw - finance sync failure shouldn't break order update
      console.error('Error syncing finance for delivered order:', error);
    }
  }

  // Get seller's orders (only items belonging to the seller)
  static async getSellerOrders(
    sellerId: string,
    options: {
      page?: number;
      limit?: number;
      status?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    } = {}
  ): Promise<{
    orders: IOrder[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }> {
    try {
      const { page = 1, limit = 10, status, sortBy = 'createdAt', sortOrder = 'desc' } = options;

      // Base query finds orders that contain at least one item for this seller
      const baseQuery: any = { 'items.sellerId': sellerId };
      if (status) baseQuery.status = status;

      const sort: any = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const total = await Order.countDocuments(baseQuery);
      const pages = Math.ceil(total / limit);

      const rawOrders = await Order.find(baseQuery)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('userId', 'firstName lastName email');

      // Filter items to only those belonging to the seller
      const orders = rawOrders.map((order: any) => {
        const filteredItems = order.items.filter((it: any) => (it.sellerId?.toString?.() || it.sellerId) === sellerId);
        return {
          ...order.toObject(),
          items: filteredItems
        } as IOrder;
      });

      return {
        orders,
        pagination: { page, limit, total, pages }
      };
    } catch (error) {
      throw new Error(`Failed to get seller orders: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Cancel order
  static async cancelOrder(orderId: string, cancelledBy: string, reason: string): Promise<IOrder> {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error(Messages.ORDER.NOT_FOUND);
      }

      if (!order.canCancel) {
        throw new Error(Messages.ORDER.CANNOT_CANCEL);
      }

      await order.cancelOrder(cancelledBy, reason);

      // Restore product stock
      await this.restoreProductStock(order.items);

      return order;
    } catch (error) {
      throw new Error(`Failed to cancel order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get order statistics
  static async getOrderStatistics(userId?: string): Promise<{
    total: number;
    pending: number;
    confirmed: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    refunded: number;
    totalRevenue: number;
  }> {
    try {
      const query: any = {};
      if (userId) {
        query.userId = new mongoose.Types.ObjectId(userId);
      }

      const stats = await Order.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            totalRevenue: { $sum: '$total' },
            pending: {
              $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
            },
            confirmed: {
              $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
            },
            processing: {
              $sum: { $cond: [{ $eq: ['$status', 'processing'] }, 1, 0] }
            },
            shipped: {
              $sum: { $cond: [{ $eq: ['$status', 'shipped'] }, 1, 0] }
            },
            delivered: {
              $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
            },
            cancelled: {
              $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
            },
            refunded: {
              $sum: { $cond: [{ $eq: ['$status', 'refunded'] }, 1, 0] }
            }
          }
        }
      ]);

      return stats[0] || {
        total: 0,
        pending: 0,
        confirmed: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        refunded: 0,
        totalRevenue: 0
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : Messages.ORDER.STATS_FAILED);
    }
  }

  // Update product stock when order is created
  private static async updateProductStock(orderItems: any[]): Promise<void> {
    for (const item of orderItems) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      if (item.variantId) {
        // Update variant stock
        const variantIndex = product.variants?.findIndex((v: any) => v._id.toString() === item.variantId);
        if (variantIndex !== undefined && variantIndex >= 0 && product.variants) {
          product.variants[variantIndex].stock -= item.quantity;
        }
      } else {
        // Update main product stock
        product.stock -= item.quantity;
      }

      await product.save();
    }
  }

  // Restore product stock when order is cancelled
  private static async restoreProductStock(orderItems: any[]): Promise<void> {
    for (const item of orderItems) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      if (item.variantId) {
        // Restore variant stock
        const variantIndex = product.variants?.findIndex((v: any) => v._id.toString() === item.variantId);
        if (variantIndex !== undefined && variantIndex >= 0 && product.variants) {
          product.variants[variantIndex].stock += item.quantity;
        }
      } else {
        // Restore main product stock
        product.stock += item.quantity;
      }

      await product.save();
    }
  }
}
