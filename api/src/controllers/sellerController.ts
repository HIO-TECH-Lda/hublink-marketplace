import { Request, Response } from 'express';
import { SellerService } from '../services/sellerService';
import Messages from '../utils/messages';

export class SellerController {
  /**
   * Get public seller directory
   */
  static async getPublicSellers(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        search: req.query.search,
        category: req.query.category,
        minRating: req.query.minRating,
        location: req.query.location,
        verified: req.query.verified,
        featured: req.query.featured,
        page: req.query.page,
        limit: req.query.limit,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder as 'asc' | 'desc'
      };

      const result = await SellerService.getPublicSellers(filters);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get sellers'
      });
    }
  }

  /**
   * Get public seller profile
   */
  static async getPublicSellerProfile(req: Request, res: Response): Promise<void> {
    try {
      const { sellerId } = req.params;
      const seller = await SellerService.getPublicSellerProfile(sellerId);

      res.json({
        success: true,
        data: seller
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Seller not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.SELLER.FETCH_FAILED
      });
    }
  }

  /**
   * Get seller's products (public)
   */
  static async getSellerProducts(req: Request, res: Response): Promise<void> {
    try {
      const { sellerId } = req.params;
      const filters = {
        category: req.query.category,
        search: req.query.search,
        page: req.query.page,
        limit: req.query.limit,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder as 'asc' | 'desc'
      };

      const result = await SellerService.getSellerProducts(sellerId, filters);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Seller not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.PRODUCT.FETCH_FAILED
      });
    }
  }

  /**
   * Get top-rated sellers
   */
  static async getTopSellers(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const sellers = await SellerService.getTopSellers(limit);

      res.json({
        success: true,
        data: sellers
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get top sellers'
      });
    }
  }

  /**
   * Get featured sellers
   */
  static async getFeaturedSellers(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
      const sellers = await SellerService.getFeaturedSellers(limit);

      res.json({
        success: true,
        data: sellers
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.SELLER.FETCH_FAILED
      });
    }
  }
}
