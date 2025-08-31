import { Request, Response } from 'express';
import { CartService } from '../services/cartService';

export class CartController {
  // Get user's cart
  static async getCart(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const cart = await CartService.getCartWithProductDetails(userId);

      if (!cart) {
        return res.status(404).json({
          success: false,
          message: 'Cart not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Cart retrieved successfully',
        data: {
          items: cart.items,
          summary: {
            itemCount: cart.totalItems,
            subtotal: cart.subtotal,
            tax: cart.tax,
            shipping: cart.shipping,
            discount: cart.discount,
            total: cart.total,
            currency: cart.currency
          }
        }
      });
    } catch (error) {
      console.error('Get cart error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve cart',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Add item to cart
  static async addToCart(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const { productId, quantity, variantId } = req.body;

      const cart = await CartService.addToCart(userId, productId, quantity, variantId);

      return res.status(200).json({
        success: true,
        message: 'Item added to cart successfully',
        data: {
          cart: {
            items: cart.items,
            summary: {
              itemCount: cart.totalItems,
              subtotal: cart.subtotal,
              tax: cart.tax,
              shipping: cart.shipping,
              discount: cart.discount,
              total: cart.total,
              currency: cart.currency
            }
          }
        }
      });
    } catch (error) {
      console.error('Add to cart error:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to add item to cart',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Remove item from cart
  static async removeFromCart(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const { productId, variantId } = req.body;

      const cart = await CartService.removeFromCart(userId, productId, variantId);

      return res.status(200).json({
        success: true,
        message: 'Item removed from cart successfully',
        data: {
          cart: {
            items: cart.items,
            summary: {
              itemCount: cart.totalItems,
              subtotal: cart.subtotal,
              tax: cart.tax,
              shipping: cart.shipping,
              discount: cart.discount,
              total: cart.total,
              currency: cart.currency
            }
          }
        }
      });
    } catch (error) {
      console.error('Remove from cart error:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to remove item from cart',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Update item quantity in cart
  static async updateCartItem(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const { productId, quantity, variantId } = req.body;

      const cart = await CartService.updateCartItemQuantity(userId, productId, quantity, variantId);

      return res.status(200).json({
        success: true,
        message: 'Cart item updated successfully',
        data: {
          cart: {
            items: cart.items,
            summary: {
              itemCount: cart.totalItems,
              subtotal: cart.subtotal,
              tax: cart.tax,
              shipping: cart.shipping,
              discount: cart.discount,
              total: cart.total,
              currency: cart.currency
            }
          }
        }
      });
    } catch (error) {
      console.error('Update cart item error:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to update cart item',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Clear cart
  static async clearCart(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const cart = await CartService.clearCart(userId);

      return res.status(200).json({
        success: true,
        message: 'Cart cleared successfully',
        data: {
          cart: {
            items: cart.items,
            summary: {
              itemCount: cart.totalItems,
              subtotal: cart.subtotal,
              tax: cart.tax,
              shipping: cart.shipping,
              discount: cart.discount,
              total: cart.total,
              currency: cart.currency
            }
          }
        }
      });
    } catch (error) {
      console.error('Clear cart error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to clear cart',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get cart summary
  static async getCartSummary(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const summary = await CartService.getCartSummary(userId);

      return res.status(200).json({
        success: true,
        message: 'Cart summary retrieved successfully',
        data: summary
      });
    } catch (error) {
      console.error('Get cart summary error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get cart summary',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Check cart item availability
  static async checkCartAvailability(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const availability = await CartService.checkCartItemAvailability(userId);

      return res.status(200).json({
        success: true,
        message: 'Cart availability checked successfully',
        data: availability
      });
    } catch (error) {
      console.error('Check cart availability error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to check cart availability',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Merge guest cart with user cart
  static async mergeGuestCart(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const { guestCartItems } = req.body;

      const cart = await CartService.mergeGuestCart(userId, guestCartItems);

      return res.status(200).json({
        success: true,
        message: 'Guest cart merged successfully',
        data: {
          cart: {
            items: cart.items,
            summary: {
              itemCount: cart.totalItems,
              subtotal: cart.subtotal,
              tax: cart.tax,
              shipping: cart.shipping,
              discount: cart.discount,
              total: cart.total,
              currency: cart.currency
            }
          }
        }
      });
    } catch (error) {
      console.error('Merge guest cart error:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to merge guest cart',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Apply discount to cart
  static async applyDiscount(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const { discountCode } = req.body;

      const result = await CartService.applyDiscount(userId, discountCode);

      return res.status(200).json({
        success: result.success,
        message: result.message,
        data: {
          discountAmount: result.discountAmount
        }
      });
    } catch (error) {
      console.error('Apply discount error:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to apply discount',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
