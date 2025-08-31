import Order, { IOrder, IOrderDocument } from '../models/Order';
import Cart, { ICartDocument } from '../models/Cart';
import Product from '../models/Product';
import User from '../models/User';
import { CartService } from './cartService';

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
  ): Promise<IOrderDocument> {
    try {
      // Get user's cart
      const cart = await CartService.getUserCart(userId);
      if (!cart || cart.items.length === 0) {
        throw new Error('Cart is empty');
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
      throw new Error(`Failed to create order: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
  ): Promise<IOrderDocument> {
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
          const variant = product.variants?.find(v => v._id.toString() === itemData.variantId);
          if (!variant) {
            throw new Error(`Product variant not found: ${itemData.variantId}`);
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
      const tax = subtotal * 0.1; // 10% tax
      const shipping = subtotal >= 50 ? 0 : 5; // Free shipping over $50
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
        currency: 'USD'
      });

      await order.save();

      // Update product stock
      await this.updateProductStock(orderItems);

      return order;
    } catch (error) {
      throw new Error(`Failed to create order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get order by ID
  static async getOrderById(orderId: string, userId?: string): Promise<IOrderDocument | null> {
    try {
      const query: any = { _id: orderId };
      if (userId) {
        query.userId = userId;
      }

      const order = await Order.findOne(query)
        .populate('userId', 'firstName lastName email')
        .populate('cancelledBy', 'firstName lastName');

      return order;
    } catch (error) {
      throw new Error(`Failed to get order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get order by order number
  static async getOrderByNumber(orderNumber: string, userId?: string): Promise<IOrderDocument | null> {
    try {
      const query: any = { orderNumber };
      if (userId) {
        query.userId = userId;
      }

      const order = await Order.findOne(query)
        .populate('userId', 'firstName lastName email')
        .populate('cancelledBy', 'firstName lastName');

      return order;
    } catch (error) {
      throw new Error(`Failed to get order: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
    orders: IOrderDocument[];
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
    orders: IOrderDocument[];
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
      throw new Error(`Failed to get all orders: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
  ): Promise<IOrderDocument> {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      switch (status) {
        case 'confirmed':
          await order.confirmOrder();
          break;
        case 'processing':
          await order.processOrder();
          break;
        case 'shipped':
          if (!options.trackingNumber) {
            throw new Error('Tracking number is required for shipped status');
          }
          await order.shipOrder(options.trackingNumber);
          break;
        case 'delivered':
          await order.deliverOrder();
          break;
        case 'cancelled':
          if (!options.cancelledBy || !options.cancelReason) {
            throw new Error('Cancelled by and reason are required for cancelled status');
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
          throw new Error('Invalid order status');
      }

      return order;
    } catch (error) {
      throw new Error(`Failed to update order status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Cancel order
  static async cancelOrder(orderId: string, cancelledBy: string, reason: string): Promise<IOrderDocument> {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      if (!order.canCancel) {
        throw new Error('Order cannot be cancelled in current status');
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
        query.userId = userId;
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
      throw new Error(`Failed to get order statistics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Update product stock when order is created
  private static async updateProductStock(orderItems: any[]): Promise<void> {
    for (const item of orderItems) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      if (item.variantId) {
        // Update variant stock
        const variantIndex = product.variants?.findIndex(v => v._id.toString() === item.variantId);
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
        const variantIndex = product.variants?.findIndex(v => v._id.toString() === item.variantId);
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
