import Category from '../models/Category';
import Product from '../models/Product';
import mongoose, { Types } from 'mongoose';
import { uploadBase64Image } from '../utils/cloudinary';

export interface CategoryListFilters {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CategoryStats {
  total: number;
  active: number;
  inactive: number;
  totalProducts: number;
}

export class AdminCategoryService {
  // Get category statistics
  static async getCategoryStats(): Promise<CategoryStats> {
    try {
      const [total, active, inactive, totalProducts] = await Promise.all([
        Category.countDocuments(),
        Category.countDocuments({ isActive: true }),
        Category.countDocuments({ isActive: false }),
        Product.countDocuments()
      ]);

      return {
        total,
        active,
        inactive,
        totalProducts
      };
    } catch (error) {
      throw new Error(
        `Failed to get category statistics: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Get all categories with filters and pagination
  static async getCategories(filters: CategoryListFilters = {}): Promise<{
    categories: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const {
        search,
        isActive,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = filters;

      // Build query
      const query: any = {};

      // Status filter
      if (isActive !== undefined) {
        query.isActive = isActive;
      }

      // Search filter (name, description)
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { slug: { $regex: search, $options: 'i' } }
        ];
      }

      // Calculate pagination
      const skip = (page - 1) * limit;
      const sort: any = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

      // Get total count
      const total = await Category.countDocuments(query);

      // Get categories
      const categories = await Category.find(query)
        .populate('parentId', 'name slug')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();

      // Get category IDs
      const categoryIds = categories.map((c: any) => c._id);

      // Get product counts for each category
      const productCounts = await Product.aggregate([
        {
          $match: {
            categoryId: { $in: categoryIds }
          }
        },
        {
          $group: {
            _id: '$categoryId',
            productCount: { $sum: 1 }
          }
        }
      ]);

      // Create map for quick lookup
      const productMap = new Map();
      productCounts.forEach((item: any) => {
        productMap.set(item._id.toString(), item.productCount);
      });

      // Format categories for frontend
      const formattedCategories = categories.map((category: any) => {
        const parent = category.parentId as any;
        const productCount = productMap.get(category._id.toString()) || 0;

        return {
          id: category._id.toString(),
          name: category.name,
          description: category.description || '',
          slug: category.slug,
          image: category.image,
          icon: category.icon,
          isActive: category.isActive,
          isFeatured: category.isFeatured || false,
          productCount,
          parent: parent ? {
            id: parent._id.toString(),
            name: parent.name,
            slug: parent.slug
          } : null,
          level: category.level || 0,
          sortOrder: category.sortOrder || 0,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt
        };
      });

      return {
        categories: formattedCategories,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(
        `Failed to get categories: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Get category by ID with full details
  static async getCategoryById(categoryId: string): Promise<any> {
    try {
      const category = await Category.findById(categoryId)
        .populate('parentId', 'name slug description')
        .lean();

      if (!category) {
        throw new Error('Category not found');
      }

      // Get product count
      const productCount = await Product.countDocuments({ categoryId: new Types.ObjectId(categoryId) });

      // Get child categories count
      const childrenCount = await Category.countDocuments({ parentId: new Types.ObjectId(categoryId) });

      // Get all products for this category
      const products = await Product.find({ categoryId: new Types.ObjectId(categoryId) })
        .select('_id name primaryImage price stock averageRating totalReviews status sellerId createdAt')
        .populate('sellerId', 'firstName lastName sellerProfile')
        .sort({ createdAt: -1 })
        .limit(100) // Limit to prevent huge responses
        .lean();

      // Format products for frontend
      const formattedProducts = products.map((product: any) => {
        const seller = product.sellerId as any;
        return {
          id: product._id.toString(),
          name: product.name,
          primaryImage: product.primaryImage,
          price: product.price,
          stock: product.stock,
          averageRating: product.averageRating || 0,
          totalReviews: product.totalReviews || 0,
          status: product.status,
          seller: seller ? {
            id: seller._id?.toString() || seller?.toString(),
            name: seller.sellerProfile?.storeName || 
                  `${seller.firstName || ''} ${seller.lastName || ''}`.trim() || 
                  'N/A'
          } : null,
          createdAt: product.createdAt
        };
      });

      const parent = category.parentId as any;

      return {
        ...category,
        id: category._id.toString(),
        productCount,
        childrenCount,
        products: formattedProducts,
        parent: parent ? {
          id: parent._id.toString(),
          name: parent.name,
          slug: parent.slug,
          description: parent.description
        } : null
      };
    } catch (error) {
      throw new Error(
        `Failed to get category: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Create category
  static async createCategory(categoryData: any): Promise<any> {
    try {
      // Check if slug already exists
      if (categoryData.slug) {
        const existing = await Category.findOne({ slug: categoryData.slug });
        if (existing) {
          throw new Error('Category slug already exists');
        }
      }

      // Upload image to Cloudinary if provided (base64 or URL)
      if (categoryData.image) {
        const uploaded = await uploadBase64Image(categoryData.image, 'categories');
        categoryData.image = uploaded.url;
      }

      const category = new Category(categoryData);
      await category.save();

      // Return created category with populated data
      return await this.getCategoryById(category._id.toString());
    } catch (error) {
      throw new Error(
        `Failed to create category: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Update category
  static async updateCategory(categoryId: string, updateData: any): Promise<any> {
    try {
      const category = await Category.findById(categoryId);

      if (!category) {
        throw new Error('Category not found');
      }

      // Check slug uniqueness if being updated
      if (updateData.slug && updateData.slug !== category.slug) {
        const existing = await Category.findOne({ slug: updateData.slug });
        if (existing) {
          throw new Error('Category slug already exists');
        }
      }

      // Upload new image to Cloudinary if provided (base64 or URL)
      if (updateData.image) {
        const uploaded = await uploadBase64Image(updateData.image, 'categories');
        updateData.image = uploaded.url;
      }

      // Update fields
      Object.keys(updateData).forEach(key => {
        if (key !== '_id' && key !== 'createdAt' && key !== 'updatedAt') {
          (category as any)[key] = updateData[key];
        }
      });

      await category.save();

      // Return updated category with populated data
      return await this.getCategoryById(categoryId);
    } catch (error) {
      throw new Error(
        `Failed to update category: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Update category status (activate/deactivate)
  static async updateCategoryStatus(categoryId: string, isActive: boolean): Promise<any> {
    try {
      const category = await Category.findById(categoryId);

      if (!category) {
        throw new Error('Category not found');
      }

      category.isActive = isActive;
      await category.save();

      // Return updated category with populated data
      return await this.getCategoryById(categoryId);
    } catch (error) {
      throw new Error(
        `Failed to update category status: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Delete category
  static async deleteCategory(categoryId: string): Promise<void> {
    try {
      const category = await Category.findById(categoryId);

      if (!category) {
        throw new Error('Category not found');
      }

      // Check if category has products
      const productCount = await Product.countDocuments({ categoryId: new Types.ObjectId(categoryId) });
      if (productCount > 0) {
        throw new Error(`Cannot delete category with ${productCount} products. Please reassign products first.`);
      }

      // Check if category has children
      const childrenCount = await Category.countDocuments({ parentId: new Types.ObjectId(categoryId) });
      if (childrenCount > 0) {
        throw new Error(`Cannot delete category with ${childrenCount} subcategories. Please delete or reassign subcategories first.`);
      }

      await Category.findByIdAndDelete(categoryId);
    } catch (error) {
      throw new Error(
        `Failed to delete category: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

