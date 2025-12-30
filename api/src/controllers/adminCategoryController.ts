import { Request, Response } from 'express';
import { AdminCategoryService } from '../services/adminCategoryService';

export class AdminCategoryController {
  // Get category statistics
  static async getCategoryStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await AdminCategoryService.getCategoryStats();
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get category statistics'
      });
    }
  }

  // Get all categories with filters
  static async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        search: req.query.search as string | undefined,
        isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        sortBy: req.query.sortBy as string | undefined,
        sortOrder: req.query.sortOrder as 'asc' | 'desc' | undefined
      };

      const result = await AdminCategoryService.getCategories(filters);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get categories'
      });
    }
  }

  // Get category by ID
  static async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId } = req.params;
      const category = await AdminCategoryService.getCategoryById(categoryId);
      res.json({
        success: true,
        data: category
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Category not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get category'
      });
    }
  }

  // Create category
  static async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const categoryData = req.body;
      const category = await AdminCategoryService.createCategory(categoryData);
      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('already exists') ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create category'
      });
    }
  }

  // Update category
  static async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId } = req.params;
      const updateData = req.body;
      const category = await AdminCategoryService.updateCategory(categoryId, updateData);
      res.json({
        success: true,
        message: 'Category updated successfully',
        data: category
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Category not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update category'
      });
    }
  }

  // Update category status
  static async updateCategoryStatus(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId } = req.params;
      const { isActive } = req.body;

      if (typeof isActive !== 'boolean') {
        res.status(400).json({
          success: false,
          message: 'isActive must be a boolean value'
        });
        return;
      }

      const category = await AdminCategoryService.updateCategoryStatus(categoryId, isActive);
      res.json({
        success: true,
        message: 'Category status updated successfully',
        data: category
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Category not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update category status'
      });
    }
  }

  // Delete category
  static async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId } = req.params;
      await AdminCategoryService.deleteCategory(categoryId);
      res.json({
        success: true,
        message: 'Category deleted successfully'
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Category not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete category'
      });
    }
  }
}

