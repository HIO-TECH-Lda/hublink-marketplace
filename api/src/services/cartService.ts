import Cart, { ICart, ICartDocument } from '../models/Cart';
import Product from '../models/Product';
import User from '../models/User';

export class CartService {
  // Get user's cart
  static async getUserCart(userId: string): Promise<ICartDocument | null> {
    try {
      let cart = await Cart.findOne({ userId }).populate('items.productId');
      
      if (!cart) {
        // Create new cart if it doesn't exist
        cart = new Cart({ userId });
        await cart.save();
      }
      
      return cart;
    } catch (error) {
      throw new Error(`Failed to get user cart: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Add item to cart
  static async addToCart(userId: string, productId: string, quantity: number, variantId?: string): Promise<ICartDocument> {
    try {
      let cart = await this.getUserCart(userId);
      if (!cart) {
        throw new Error('Failed to get or create cart');
      }

      // Verify product exists and is available
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      if (product.status !== 'active') {
        throw new Error('Product is not available for purchase');
      }

      if (product.stock < quantity) {
        throw new Error(`Insufficient stock. Available: ${product.stock}`);
      }

      // Check variant if specified
      if (variantId) {
        const variant = product.variants?.find(v => v._id.toString() === variantId);
        if (!variant) {
          throw new Error('Product variant not found');
        }
        if (variant.stock < quantity) {
          throw new Error(`Insufficient stock for variant. Available: ${variant.stock}`);
        }
      }

      await cart.addItem(productId, quantity, variantId);
      return cart;
    } catch (error) {
      throw new Error(`Failed to add item to cart: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Remove item from cart
  static async removeFromCart(userId: string, productId: string, variantId?: string): Promise<ICartDocument> {
    try {
      const cart = await this.getUserCart(userId);
      if (!cart) {
        throw new Error('Cart not found');
      }

      await cart.removeItem(productId, variantId);
      return cart;
    } catch (error) {
      throw new Error(`Failed to remove item from cart: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Update item quantity in cart
  static async updateCartItemQuantity(userId: string, productId: string, quantity: number, variantId?: string): Promise<ICartDocument> {
    try {
      const cart = await this.getUserCart(userId);
      if (!cart) {
        throw new Error('Cart not found');
      }

      // Verify product stock
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      if (variantId) {
        const variant = product.variants?.find(v => v._id.toString() === variantId);
        if (!variant) {
          throw new Error('Product variant not found');
        }
        if (variant.stock < quantity) {
          throw new Error(`Insufficient stock for variant. Available: ${variant.stock}`);
        }
      } else {
        if (product.stock < quantity) {
          throw new Error(`Insufficient stock. Available: ${product.stock}`);
        }
      }

      await cart.updateQuantity(productId, quantity, variantId);
      return cart;
    } catch (error) {
      throw new Error(`Failed to update cart item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Clear cart
  static async clearCart(userId: string): Promise<ICartDocument> {
    try {
      const cart = await this.getUserCart(userId);
      if (!cart) {
        throw new Error('Cart not found');
      }

      await cart.clearCart();
      return cart;
    } catch (error) {
      throw new Error(`Failed to clear cart: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get cart summary
  static async getCartSummary(userId: string): Promise<{
    itemCount: number;
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    total: number;
    currency: string;
  }> {
    try {
      const cart = await this.getUserCart(userId);
      if (!cart) {
        throw new Error('Cart not found');
      }

      return {
        itemCount: cart.totalItems,
        subtotal: cart.subtotal,
        tax: cart.tax,
        shipping: cart.shipping,
        discount: cart.discount,
        total: cart.total,
        currency: cart.currency
      };
    } catch (error) {
      throw new Error(`Failed to get cart summary: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Check cart item availability
  static async checkCartItemAvailability(userId: string): Promise<{
    unavailableItems: Array<{
      productId: string;
      productName: string;
      reason: string;
    }>;
    lowStockItems: Array<{
      productId: string;
      productName: string;
      requestedQuantity: number;
      availableStock: number;
    }>;
  }> {
    try {
      const cart = await this.getUserCart(userId);
      if (!cart) {
        throw new Error('Cart not found');
      }

      const unavailableItems: Array<{
        productId: string;
        productName: string;
        reason: string;
      }> = [];

      const lowStockItems: Array<{
        productId: string;
        productName: string;
        requestedQuantity: number;
        availableStock: number;
      }> = [];

      for (const item of cart.items) {
        const product = await Product.findById(item.productId);
        if (!product) {
          unavailableItems.push({
            productId: item.productId.toString(),
            productName: item.productName,
            reason: 'Product not found'
          });
          continue;
        }

        if (product.status !== 'active') {
          unavailableItems.push({
            productId: item.productId.toString(),
            productName: item.productName,
            reason: 'Product is not available'
          });
          continue;
        }

        let availableStock = product.stock;
        if (item.variantId) {
          const variant = product.variants?.find(v => v._id.toString() === item.variantId);
          if (!variant) {
            unavailableItems.push({
              productId: item.productId.toString(),
              productName: item.productName,
              reason: 'Product variant not found'
            });
            continue;
          }
          availableStock = variant.stock;
        }

        if (availableStock < item.quantity) {
          lowStockItems.push({
            productId: item.productId.toString(),
            productName: item.productName,
            requestedQuantity: item.quantity,
            availableStock
          });
        }
      }

      return { unavailableItems, lowStockItems };
    } catch (error) {
      throw new Error(`Failed to check cart availability: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Merge guest cart with user cart (for when user logs in)
  static async mergeGuestCart(userId: string, guestCartItems: Array<{
    productId: string;
    quantity: number;
    variantId?: string;
  }>): Promise<ICartDocument> {
    try {
      const cart = await this.getUserCart(userId);
      if (!cart) {
        throw new Error('Failed to get or create cart');
      }

      for (const item of guestCartItems) {
        try {
          await cart.addItem(item.productId, item.quantity, item.variantId);
        } catch (error) {
          // Skip items that can't be added (e.g., out of stock)
          console.warn(`Failed to add item ${item.productId} to merged cart:`, error);
        }
      }

      return cart;
    } catch (error) {
      throw new Error(`Failed to merge guest cart: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get cart items with product details
  static async getCartWithProductDetails(userId: string): Promise<ICartDocument | null> {
    try {
      const cart = await Cart.findOne({ userId })
        .populate({
          path: 'items.productId',
          select: 'name description primaryImage price stock status variants'
        });

      return cart;
    } catch (error) {
      throw new Error(`Failed to get cart with product details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Apply discount to cart (placeholder for future discount system)
  static async applyDiscount(userId: string, discountCode: string): Promise<{
    success: boolean;
    message: string;
    discountAmount?: number;
  }> {
    try {
      const cart = await this.getUserCart(userId);
      if (!cart) {
        throw new Error('Cart not found');
      }

      // Placeholder for discount logic
      // In a real implementation, you would:
      // 1. Validate the discount code
      // 2. Check if it's applicable to the cart
      // 3. Calculate the discount amount
      // 4. Apply it to the cart

      return {
        success: false,
        message: 'Discount system not implemented yet'
      };
    } catch (error) {
      throw new Error(`Failed to apply discount: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Remove expired carts (cleanup function)
  static async removeExpiredCarts(): Promise<number> {
    try {
      const result = await Cart.deleteMany({
        expiresAt: { $lt: new Date() }
      });
      return result.deletedCount || 0;
    } catch (error) {
      throw new Error(`Failed to remove expired carts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
