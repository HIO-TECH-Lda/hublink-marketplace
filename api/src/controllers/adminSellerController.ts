import { Request, Response } from 'express';
import { AdminSellerService } from '../services/adminSellerService';
import Messages from '../utils/messages';

export class AdminSellerController {
  // Get seller statistics
  static async getSellerStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await AdminSellerService.getSellerStats();
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.ADMIN_SELLER.STATS_FAILED
      });
    }
  }

  // Get all sellers with filters
  static async getSellers(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        search: req.query.search as string | undefined,
        status: req.query.status as 'active' | 'inactive' | 'suspended' | undefined,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        sortBy: req.query.sortBy as string | undefined,
        sortOrder: req.query.sortOrder as 'asc' | 'desc' | undefined
      };

      const result = await AdminSellerService.getSellers(filters);
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

  // Get seller by ID
  static async getSellerById(req: Request, res: Response): Promise<void> {
    try {
      const { sellerId } = req.params;
      const seller = await AdminSellerService.getSellerById(sellerId);
      res.json({
        success: true,
        data: seller
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Seller not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.ADMIN_SELLER.FETCH_FAILED
      });
    }
  }

  // Create seller
  static async createSeller(req: Request, res: Response): Promise<void> {
    try {
      const sellerData = req.body;
      const seller = await AdminSellerService.createSeller(sellerData);

      res.status(201).json({
        success: true,
        message: Messages.ADMIN_SELLER.CREATED,
        data: seller
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('already exists') ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.ADMIN_SELLER.CREATE_FAILED
      });
    }
  }

  // Update seller
  static async updateSeller(req: Request, res: Response): Promise<void> {
    try {
      const { sellerId } = req.params;
      const updateData = req.body;
      const seller = await AdminSellerService.updateSeller(sellerId, updateData);

      res.json({
        success: true,
        message: Messages.ADMIN_SELLER.UPDATED,
        data: seller
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Seller not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.ADMIN_SELLER.UPDATE_FAILED
      });
    }
  }

  // Update seller status
  static async updateSellerStatus(req: Request, res: Response): Promise<void> {
    try {
      const { sellerId } = req.params;
      const { status } = req.body;

      if (!status || !['active', 'inactive', 'suspended'].includes(status)) {
        res.status(400).json({
          success: false,
          message: Messages.VALIDATION.INVALID_VALUE
        });
        return;
      }

      const seller = await AdminSellerService.updateSellerStatus(
        sellerId,
        status as 'active' | 'inactive' | 'suspended'
      );

      res.json({
        success: true,
        message: Messages.ADMIN_SELLER.STATUS_UPDATED,
        data: seller
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Seller not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.ADMIN_SELLER.UPDATE_FAILED
      });
    }
  }
}

