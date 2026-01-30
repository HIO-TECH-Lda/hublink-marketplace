import { Request, Response } from 'express';
import { AdminCategoryService } from '../services/adminCategoryService';
import Messages from '../utils/messages';

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
        message: error instanceof Error ? error.message : Messages.ADMIN_CATEGORY.LIST_FAILED
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
        message: error instanceof Error ? error.message : Messages.ADMIN_CATEGORY.FETCH_FAILED
      });
    }
  }

  // Create category
  static async createCategory(req: Request, res: Response): Promise<void> {
    try {
      // Handle file upload from multer (if present)
      if ((req as any).file) {
        // Convert file buffer to base64
        const file = (req as any).file;
        const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        req.body.image = base64;
      }

      // Parse form data (strings need to be converted)
      const categoryData: any = {
        ...req.body
      };

      // Convert boolean strings to booleans
      if (categoryData.isActive !== undefined) {
        categoryData.isActive = categoryData.isActive === 'true' || categoryData.isActive === true;
      }
      if (categoryData.isFeatured !== undefined) {
        categoryData.isFeatured = categoryData.isFeatured === 'true' || categoryData.isFeatured === true;
      }

      // Convert sortOrder to number if it's a string
      if (categoryData.sortOrder !== undefined && typeof categoryData.sortOrder === 'string') {
        categoryData.sortOrder = parseInt(categoryData.sortOrder, 10) || 0;
      }

      const category = await AdminCategoryService.createCategory(categoryData);
      res.status(201).json({
        success: true,
        message: Messages.ADMIN_CATEGORY.CREATED,
        data: category
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('already exists') ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.ADMIN_CATEGORY.CREATE_FAILED
      });
    }
  }

  // Update category
  static async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId } = req.params;

      // Handle file upload from multer (if present)
      if ((req as any).file) {
        // Convert file buffer to base64
        const file = (req as any).file;
        const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        req.body.image = base64;
      }

      // Parse form data (strings need to be converted)
      const updateData: any = {
        ...req.body
      };

      // Convert boolean strings to booleans
      if (updateData.isActive !== undefined) {
        updateData.isActive = updateData.isActive === 'true' || updateData.isActive === true;
      }
      if (updateData.isFeatured !== undefined) {
        updateData.isFeatured = updateData.isFeatured === 'true' || updateData.isFeatured === true;
      }

      // Convert sortOrder to number if it's a string
      if (updateData.sortOrder !== undefined && typeof updateData.sortOrder === 'string') {
        updateData.sortOrder = parseInt(updateData.sortOrder, 10);
      }

      const category = await AdminCategoryService.updateCategory(categoryId, updateData);
      res.json({
        success: true,
        message: Messages.ADMIN_CATEGORY.UPDATED,
        data: category
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Category not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.ADMIN_CATEGORY.UPDATE_FAILED
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
          message: Messages.VALIDATION.INVALID_VALUE
        });
        return;
      }

      const category = await AdminCategoryService.updateCategoryStatus(categoryId, isActive);
      res.json({
        success: true,
        message: Messages.ADMIN_CATEGORY.STATUS_UPDATED,
        data: category
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Category not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.ADMIN_CATEGORY.STATUS_UPDATE_FAILED
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
        message: Messages.ADMIN_CATEGORY.DELETED
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Category not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.ADMIN_CATEGORY.DELETE_FAILED
      });
    }
  }
}

