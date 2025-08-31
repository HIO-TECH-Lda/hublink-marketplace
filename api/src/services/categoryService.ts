import Category, { ICategoryDocument } from '../models/Category';
import { ICategory } from '../types';

export class CategoryService {
  // Create new category
  static async createCategory(categoryData: Partial<ICategory>): Promise<ICategoryDocument> {
    try {
      const category = new Category(categoryData);
      await category.save();
      return category;
    } catch (error) {
      throw error;
    }
  }

  // Get category by ID
  static async getCategoryById(categoryId: string): Promise<ICategoryDocument | null> {
    try {
      return await Category.findById(categoryId);
    } catch (error) {
      throw error;
    }
  }

  // Get category by slug
  static async getCategoryBySlug(slug: string): Promise<ICategoryDocument | null> {
    try {
      return await Category.findOne({ slug, isActive: true });
    } catch (error) {
      throw error;
    }
  }

  // Get all categories
  static async getAllCategories(): Promise<ICategoryDocument[]> {
    try {
      return await Category.find({ isActive: true }).sort({ sortOrder: 1 });
    } catch (error) {
      throw error;
    }
  }

  // Get root categories
  static async getRootCategories(): Promise<ICategoryDocument[]> {
    try {
      return await Category.findRoots();
    } catch (error) {
      throw error;
    }
  }

  // Get category children
  static async getCategoryChildren(parentId: string): Promise<ICategoryDocument[]> {
    try {
      return await Category.findChildren(parentId);
    } catch (error) {
      throw error;
    }
  }

  // Get featured categories
  static async getFeaturedCategories(): Promise<ICategoryDocument[]> {
    try {
      return await Category.findFeatured();
    } catch (error) {
      throw error;
    }
  }

  // Build category tree
  static async buildCategoryTree(): Promise<any[]> {
    try {
      return await Category.buildTree();
    } catch (error) {
      throw error;
    }
  }

  // Update category
  static async updateCategory(categoryId: string, updateData: Partial<ICategory>): Promise<ICategoryDocument | null> {
    try {
      const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        updateData,
        { new: true, runValidators: true }
      );
      return updatedCategory;
    } catch (error) {
      throw error;
    }
  }

  // Delete category
  static async deleteCategory(categoryId: string): Promise<boolean> {
    try {
      // Check if category has children
      const children = await Category.find({ parentId: categoryId });
      if (children.length > 0) {
        throw new Error('Cannot delete category with children. Please delete children first.');
      }

      await Category.findByIdAndDelete(categoryId);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get category with product count
  static async getCategoryWithProductCount(categoryId: string): Promise<any> {
    try {
      const category = await Category.findById(categoryId)
        .populate({
          path: 'productCount',
          match: { status: 'active' }
        });

      return category;
    } catch (error) {
      throw error;
    }
  }

  // Get category path
  static async getCategoryPath(categoryId: string): Promise<ICategoryDocument[]> {
    try {
      const category = await Category.findById(categoryId);
      if (!category) {
        throw new Error('Category not found');
      }

      return await category.getAncestors();
    } catch (error) {
      throw error;
    }
  }

  // Get category descendants
  static async getCategoryDescendants(categoryId: string): Promise<ICategoryDocument[]> {
    try {
      const category = await Category.findById(categoryId);
      if (!category) {
        throw new Error('Category not found');
      }

      return await category.getDescendants();
    } catch (error) {
      throw error;
    }
  }

  // Search categories
  static async searchCategories(searchTerm: string): Promise<ICategoryDocument[]> {
    try {
      return await Category.find({
        isActive: true,
        $text: { $search: searchTerm }
      }).sort({ score: { $meta: 'textScore' } });
    } catch (error) {
      throw error;
    }
  }
}
