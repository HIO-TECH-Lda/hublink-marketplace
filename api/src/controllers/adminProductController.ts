import { Request, Response } from 'express';
import { AdminProductService } from '../services/adminProductService';

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
        message: error instanceof Error ? error.message : 'Failed to get product statistics'
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
        message: error instanceof Error ? error.message : 'Failed to get product'
      });
    }
  }

  // Update product
  static async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { productId } = req.params;
      const updateData = req.body;
      const product = await AdminProductService.updateProduct(productId, updateData);
      res.json({
        success: true,
        message: 'Product updated successfully',
        data: product
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Product not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update product'
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
          message: 'Invalid status. Must be one of: draft, active, inactive, archived'
        });
        return;
      }

      const product = await AdminProductService.updateProductStatus(
        productId,
        status as 'draft' | 'active' | 'inactive' | 'archived'
      );
      res.json({
        success: true,
        message: 'Product status updated successfully',
        data: product
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Product not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update product status'
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
        message: 'Product deleted successfully'
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Product not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete product'
      });
    }
  }
}

