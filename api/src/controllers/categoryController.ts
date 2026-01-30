import { Request, Response } from 'express';
import { CategoryService } from '../services/categoryService';
import Messages from '../utils/messages';

export class CategoryController {
  // Create new category
  static async createCategory(req: Request, res: Response) {
    try {
      const categoryData = req.body;
      const category = await CategoryService.createCategory(categoryData);

      return res.status(201).json({
        success: true,
        message: Messages.CATEGORY.CREATED,
        data: { category }
      });
    } catch (error) {
      console.error('Create category error:', error);
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.CATEGORY.CREATE_FAILED
      });
    }
  }

  // Get category by ID
  static async getCategoryById(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;
      const category = await CategoryService.getCategoryById(categoryId);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: Messages.CATEGORY.NOT_FOUND
        });
      }

      return res.json({
        success: true,
        message: Messages.CATEGORY.RETRIEVED,
        data: { category }
      });
    } catch (error) {
      console.error('Get category error:', error);
      return res.status(500).json({
        success: false,
        message: Messages.CATEGORY.FETCH_FAILED
      });
    }
  }

  // Get category by slug
  static async getCategoryBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const category = await CategoryService.getCategoryBySlug(slug);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: Messages.CATEGORY.NOT_FOUND
        });
      }

      return res.json({
        success: true,
        message: Messages.CATEGORY.RETRIEVED,
        data: { category }
      });
    } catch (error) {
      console.error('Get category by slug error:', error);
      return res.status(500).json({
        success: false,
        message: Messages.CATEGORY.FETCH_FAILED
      });
    }
  }

  // Get all categories
  static async getAllCategories(req: Request, res: Response) {
    try {
      const categories = await CategoryService.getAllCategories();

      return res.json({
        success: true,
        message: Messages.CATEGORY.FETCH_SUCCESS,
        data: { categories }
      });
    } catch (error) {
      console.error('Get all categories error:', error);
      return res.status(500).json({
        success: false,
        message: Messages.CATEGORY.FETCH_FAILED
      });
    }
  }

  // Get root categories
  static async getRootCategories(req: Request, res: Response) {
    try {
      const categories = await CategoryService.getRootCategories();

      return res.json({
        success: true,
        message: Messages.CATEGORY.ROOT_RETRIEVED,
        data: { categories }
      });
    } catch (error) {
      console.error('Get root categories error:', error);
      return res.status(500).json({
        success: false,
        message: Messages.CATEGORY.ROOT_FAILED
      });
    }
  }

  // Get category children
  static async getCategoryChildren(req: Request, res: Response) {
    try {
      const { parentId } = req.params;
      const categories = await CategoryService.getCategoryChildren(parentId);

      return res.json({
        success: true,
        message: Messages.CATEGORY.CHILDREN_RETRIEVED,
        data: { categories }
      });
    } catch (error) {
      console.error('Get category children error:', error);
      return res.status(500).json({
        success: false,
        message: Messages.CATEGORY.CHILDREN_FAILED
      });
    }
  }

  // Get featured categories
  static async getFeaturedCategories(req: Request, res: Response) {
    try {
      const categories = await CategoryService.getFeaturedCategories();

      return res.json({
        success: true,
        message: Messages.CATEGORY.FEATURED_RETRIEVED,
        data: { categories }
      });
    } catch (error) {
      console.error('Get featured categories error:', error);
      return res.status(500).json({
        success: false,
        message: Messages.CATEGORY.FEATURED_FAILED
      });
    }
  }

  // Build category tree
  static async buildCategoryTree(req: Request, res: Response) {
    try {
      const tree = await CategoryService.buildCategoryTree();

      return res.json({
        success: true,
        message: Messages.CATEGORY.TREE_BUILT,
        data: { tree }
      });
    } catch (error) {
      console.error('Build category tree error:', error);
      return res.status(500).json({
        success: false,
        message: Messages.CATEGORY.TREE_FAILED
      });
    }
  }

  // Update category
  static async updateCategory(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;
      const updateData = req.body;
      const category = await CategoryService.updateCategory(categoryId, updateData);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: Messages.CATEGORY.NOT_FOUND
        });
      }

      return res.json({
        success: true,
        message: Messages.CATEGORY.UPDATED,
        data: { category }
      });
    } catch (error) {
      console.error('Update category error:', error);
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.CATEGORY.UPDATE_FAILED
      });
    }
  }

  // Delete category
  static async deleteCategory(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;
      const deleted = await CategoryService.deleteCategory(categoryId);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: Messages.CATEGORY.HAS_CHILDREN
        });
      }

      return res.json({
        success: true,
        message: Messages.CATEGORY.DELETED
      });
    } catch (error) {
      console.error('Delete category error:', error);
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete category'
      });
    }
  }

  // Get category with product count
  static async getCategoryWithProductCount(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;
      const category = await CategoryService.getCategoryWithProductCount(categoryId);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: Messages.CATEGORY.NOT_FOUND
        });
      }

      return res.json({
        success: true,
        message: Messages.CATEGORY.WITH_COUNT_RETRIEVED,
        data: { category }
      });
    } catch (error) {
      console.error('Get category with product count error:', error);
      return res.status(500).json({
        success: false,
        message: Messages.CATEGORY.WITH_COUNT_FAILED
      });
    }
  }

  // Get category path
  static async getCategoryPath(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;
      const path = await CategoryService.getCategoryPath(categoryId);

      return res.json({
        success: true,
        message: Messages.CATEGORY.PATH_RETRIEVED,
        data: { path }
      });
    } catch (error) {
      console.error('Get category path error:', error);
      return res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to retrieve category path'
      });
    }
  }

  // Get category descendants
  static async getCategoryDescendants(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;
      const descendants = await CategoryService.getCategoryDescendants(categoryId);

      return res.json({
        success: true,
        message: Messages.CATEGORY.DESCENDANTS_RETRIEVED,
        data: { descendants }
      });
    } catch (error) {
      console.error('Get category descendants error:', error);
      return res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to retrieve category descendants'
      });
    }
  }

  // Search categories
  static async searchCategories(req: Request, res: Response) {
    try {
      const { q: searchTerm } = req.query;

      if (!searchTerm || typeof searchTerm !== 'string') {
        return res.status(400).json({
          success: false,
          message: Messages.CATEGORY.SEARCH_TERM_REQUIRED
        });
      }

      const categories = await CategoryService.searchCategories(searchTerm);

      return res.json({
        success: true,
        message: Messages.CATEGORY.SEARCH_COMPLETED,
        data: { categories }
      });
    } catch (error) {
      console.error('Search categories error:', error);
      return res.status(500).json({
        success: false,
        message: Messages.CATEGORY.SEARCH_FAILED
      });
    }
  }
}
