timport { Request, Response } from 'express';
import { WishlistService } from '../services/wishlistService';
import { validateWishlistAdd, validateWishlistUpdate } from '../utils/validation';
import { AuthenticatedRequest } from '../types';

export class WishlistController {
  /**
   * Get user's wishlist
   * GET /api/v1/wishlist
   */
  static async getUserWishlist(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const wishlist = await WishlistService.getUserWishlist(userId);

      return res.status(200).json({
        success: true,
        message: 'Wishlist retrieved successfully',
        data: wishlist
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to get wishlist',
        error: error.message
      });
    }
  }

  /**
   * Add product to wishlist
   * POST /api/v1/wishlist/add
   */
  static async addToWishlist(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { productId, notes } = req.body;

      // Validate request
      const { error } = validateWishlistAdd.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          error: error.details[0].message
        });
      }

      const wishlist = await WishlistService.addToWishlist(userId, productId, notes);

      return res.status(201).json({
        success: true,
        message: 'Product added to wishlist successfully',
        data: wishlist
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to add to wishlist',
        error: error.message
      });
    }
  }

  /**
   * Remove product from wishlist
   * DELETE /api/v1/wishlist/remove/:productId
   */
  static async removeFromWishlist(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { productId } = req.params;

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: 'Product ID is required'
        });
      }

      await WishlistService.removeFromWishlist(userId, productId);

      return res.status(200).json({
        success: true,
        message: 'Product removed from wishlist successfully'
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to remove from wishlist',
        error: error.message
      });
    }
  }

  /**
   * Check if product is in wishlist
   * GET /api/v1/wishlist/check/:productId
   */
  static async checkWishlistStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { productId } = req.params;

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: 'Product ID is required'
        });
      }

      const isInWishlist = await WishlistService.isInWishlist(userId, productId);

      return res.status(200).json({
        success: true,
        message: 'Wishlist status checked successfully',
        data: {
          productId,
          isInWishlist
        }
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to check wishlist status',
        error: error.message
      });
    }
  }

  /**
   * Clear user's wishlist
   * DELETE /api/v1/wishlist/clear
   */
  static async clearWishlist(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;

      await WishlistService.clearWishlist(userId);

      return res.status(200).json({
        success: true,
        message: 'Wishlist cleared successfully'
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to clear wishlist',
        error: error.message
      });
    }
  }

  /**
   * Move item from wishlist to cart
   * POST /api/v1/wishlist/move-to-cart/:productId
   */
  static async moveToCart(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { productId } = req.params;
      const { quantity = 1 } = req.body;

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: 'Product ID is required'
        });
      }

      if (quantity < 1) {
        return res.status(400).json({
          success: false,
          message: 'Quantity must be at least 1'
        });
      }

      await WishlistService.moveToCart(userId, productId, quantity);

      return res.status(200).json({
        success: true,
        message: 'Product moved to cart successfully'
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to move to cart',
        error: error.message
      });
    }
  }

  /**
   * Get wishlist statistics
   * GET /api/v1/wishlist/stats
   */
  static async getWishlistStats(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const stats = await WishlistService.getWishlistStats(userId);

      return res.status(200).json({
        success: true,
        message: 'Wishlist statistics retrieved successfully',
        data: stats
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to get wishlist statistics',
        error: error.message
      });
    }
  }

  /**
   * Get wishlist items with pagination
   * GET /api/v1/wishlist/items
   */
  static async getWishlistItems(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await WishlistService.getWishlistItems(userId, page, limit);

      return res.status(200).json({
        success: true,
        message: 'Wishlist items retrieved successfully',
        data: result.items,
        pagination: result.pagination
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to get wishlist items',
        error: error.message
      });
    }
  }

  /**
   * Update wishlist item notes
   * PUT /api/v1/wishlist/update-notes/:productId
   */
  static async updateItemNotes(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { productId } = req.params;
      const { notes } = req.body;

      // Validate request
      const { error } = validateWishlistUpdate.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          error: error.details[0].message
        });
      }

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: 'Product ID is required'
        });
      }

      await WishlistService.updateItemNotes(userId, productId, notes);

      return res.status(200).json({
        success: true,
        message: 'Wishlist item notes updated successfully'
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update wishlist item notes',
        error: error.message
      });
    }
  }

  /**
   * Get wishlist recommendations
   * GET /api/v1/wishlist/recommendations
   */
  static async getRecommendations(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const limit = parseInt(req.query.limit as string) || 10;

      const recommendations = await WishlistService.getRecommendations(userId, limit);

      return res.status(200).json({
        success: true,
        message: 'Recommendations retrieved successfully',
        data: recommendations
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to get recommendations',
        error: error.message
      });
    }
  }

  /**
   * Bulk add products to wishlist
   * POST /api/v1/wishlist/bulk-add
   */
  static async bulkAddToWishlist(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { products } = req.body;

      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Products array is required and must not be empty'
        });
      }

      const results = [];
      const errors = [];

      for (const product of products) {
        try {
          const { productId, notes } = product;
          
          if (!productId) {
            errors.push({ productId, error: 'Product ID is required' });
            continue;
          }

          await WishlistService.addToWishlist(userId, productId, notes);
          results.push({ productId, success: true });
        } catch (error: any) {
          errors.push({ productId: product.productId, error: error.message });
        }
      }

      const wishlist = await WishlistService.getUserWishlist(userId);

      return res.status(200).json({
        success: true,
        message: 'Bulk add to wishlist completed',
        data: {
          wishlist,
          results,
          errors
        }
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to bulk add to wishlist',
        error: error.message
      });
    }
  }

  /**
   * Bulk remove products from wishlist
   * DELETE /api/v1/wishlist/bulk-remove
   */
  static async bulkRemoveFromWishlist(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { productIds } = req.body;

      if (!Array.isArray(productIds) || productIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Product IDs array is required and must not be empty'
        });
      }

      const results = [];
      const errors = [];

      for (const productId of productIds) {
        try {
          await WishlistService.removeFromWishlist(userId, productId);
          results.push({ productId, success: true });
        } catch (error: any) {
          errors.push({ productId, error: error.message });
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Bulk remove from wishlist completed',
        data: {
          results,
          errors
        }
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to bulk remove from wishlist',
        error: error.message
      });
    }
  }
}
