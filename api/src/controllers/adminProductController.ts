import { Request, Response } from 'express';
import { AdminProductService } from '../services/adminProductService';
import Messages from '../utils/messages';

export class AdminProductController {
  // Get product statistics
  static async getProductStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await AdminProductService.getProductStats();
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.ADMIN_PRODUCT.STATS_FAILED
      });
    }
  }

  // Get all products with filters
  static async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        search: req.query.search as string | undefined,
        status: req.query.status as 'draft' | 'active' | 'inactive' | 'archived' | undefined,
        categoryId: req.query.categoryId as string | undefined,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        sortBy: req.query.sortBy as string | undefined,
        sortOrder: req.query.sortOrder as 'asc' | 'desc' | undefined
      };

      const result = await AdminProductService.getProducts(filters);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get products'
      });
    }
  }

  // Create product (multipart/form-data)
  static async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const product = await AdminProductService.createProduct(req.body);
      res.status(201).json({
        success: true,
        message: Messages.ADMIN_PRODUCT.CREATED,
        data: { product }
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create product'
      });
    }
  }

  // Get product by ID
  static async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { productId } = req.params;
      const product = await AdminProductService.getProductById(productId);
      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Product not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.ADMIN_PRODUCT.FETCH_FAILED
      });
    }
  }

  // Update product (multipart/form-data)
  static async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { productId } = req.params;

      const product = await AdminProductService.updateProduct(productId, req.body);
      res.json({
        success: true,
        message: Messages.ADMIN_PRODUCT.UPDATED,
        data: product
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Product not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.ADMIN_PRODUCT.UPDATE_FAILED
      });
    }
  }

  // Update product status
  static async updateProductStatus(req: Request, res: Response): Promise<void> {
    try {
      const { productId } = req.params;
      const { status } = req.body;

      if (!status || !['draft', 'active', 'inactive', 'archived'].includes(status)) {
        res.status(400).json({
          success: false,
          message: Messages.ADMIN_PRODUCT.INVALID_STATUS
        });
        return;
      }

      const product = await AdminProductService.updateProductStatus(
        productId,
        status as 'draft' | 'active' | 'inactive' | 'archived'
      );
      res.json({
        success: true,
        message: Messages.ADMIN_PRODUCT.STATUS_UPDATED,
        data: product
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Product not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.ADMIN_PRODUCT.UPDATE_FAILED
      });
    }
  }

  // Delete product
  static async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { productId } = req.params;
      await AdminProductService.deleteProduct(productId);
      res.json({
        success: true,
        message: Messages.ADMIN_PRODUCT.DELETED
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Product not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.ADMIN_PRODUCT.DELETE_FAILED
      });
    }
  }
}

