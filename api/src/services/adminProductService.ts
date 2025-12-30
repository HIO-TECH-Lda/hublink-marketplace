import Product from '../models/Product';
import User from '../models/User';
import Category from '../models/Category';
import Review from '../models/Review';
import Order from '../models/Order';
import mongoose, { Types } from 'mongoose';

export interface ProductListFilters {
  search?: string;
  status?: 'draft' | 'active' | 'inactive' | 'archived';
  categoryId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ProductStats {
  total: number;
  active: number;
  pending: number; // draft status
  rejected: number; // archived status
  averageRating: number;
}

export class AdminProductService {
  // Get product statistics
  static async getProductStats(): Promise<ProductStats> {
    try {
      const [total, active, pending, rejected, ratingStats] = await Promise.all([
        Product.countDocuments(),
        Product.countDocuments({ status: 'active' }),
        Product.countDocuments({ status: 'draft' }),
        Product.countDocuments({ status: 'archived' }),
        Product.aggregate([
          {
            $group: {
              _id: null,
              averageRating: { $avg: '$averageRating' },
              count: { $sum: 1 }
            }
          }
        ])
      ]);

      const averageRating = ratingStats[0]?.averageRating || 0;

      return {
        total,
        active,
        pending,
        rejected,
        averageRating: Math.round(averageRating * 10) / 10 // Round to 1 decimal place
      };
    } catch (error) {
      throw new Error(
        `Failed to get product statistics: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Get all products with filters and pagination
  static async getProducts(filters: ProductListFilters = {}): Promise<{
    products: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const {
        search,
        status,
        categoryId,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = filters;

      // Build query
      const query: any = {};

      // Status filter
      if (status) {
        query.status = status;
      }

      // Category filter
      if (categoryId) {
        query.categoryId = new Types.ObjectId(categoryId);
      }

      // Search filter (product name, seller name, SKU)
      if (search) {
        // Find sellers matching the search
        const sellers = await User.find({
          $or: [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { 'sellerProfile.storeName': { $regex: search, $options: 'i' } }
          ]
        }).select('_id').limit(100).lean();

        const sellerIds = sellers.map((s: any) => s._id);

        // Try to parse as ObjectId for product ID search
        let productIdQuery: any = null;
        if (mongoose.Types.ObjectId.isValid(search)) {
          productIdQuery = { _id: new Types.ObjectId(search) };
        }

        query.$or = [
          productIdQuery,
          { name: { $regex: search, $options: 'i' } },
          { sku: { $regex: search, $options: 'i' } },
          { sellerId: { $in: sellerIds } }
        ].filter(Boolean);
      }

      // Calculate pagination
      const skip = (page - 1) * limit;
      const sort: any = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

      // Get total count
      const total = await Product.countDocuments(query);

      // Get products with populated data
      const products = await Product.find(query)
        .populate('sellerId', 'firstName lastName email sellerProfile')
        .populate('categoryId', 'name slug')
        .populate('subcategoryId', 'name slug')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();

      // Format products for frontend
      const formattedProducts = products.map((product: any) => {
        const seller = product.sellerId as any;
        const category = product.categoryId as any;
        const subcategory = product.subcategoryId as any;

        return {
          id: product._id.toString(),
          name: product.name,
          primaryImage: product.primaryImage,
          stock: product.stock,
          price: product.price,
          currency: 'MZM',
          category: {
            id: category?._id?.toString() || category?.toString(),
            name: category?.name || 'N/A',
            slug: category?.slug
          },
          subcategory: subcategory ? {
            id: subcategory._id?.toString(),
            name: subcategory.name,
            slug: subcategory.slug
          } : null,
          seller: {
            id: seller?._id?.toString() || seller?.toString(),
            name: seller?.sellerProfile?.storeName || 
                  (seller ? `${seller.firstName || ''} ${seller.lastName || ''}`.trim() : 'N/A'),
            email: seller?.email || 'N/A'
          },
          averageRating: product.averageRating || 0,
          totalReviews: product.totalReviews || 0,
          status: product.status,
          isFeatured: product.isFeatured || false,
          isBestSeller: product.isBestSeller || false,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        };
      });

      return {
        products: formattedProducts,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(
        `Failed to get products: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Get product by ID with full details
  static async getProductById(productId: string): Promise<any> {
    try {
      const product = await Product.findById(productId)
        .populate('sellerId', 'firstName lastName email phone sellerProfile')
        .populate('categoryId', 'name slug description')
        .populate('subcategoryId', 'name slug')
        .lean();

      if (!product) {
        throw new Error('Product not found');
      }

      // Get additional statistics
      const [reviewStats, orderStats] = await Promise.all([
        Review.aggregate([
          { $match: { productId: new Types.ObjectId(productId) } },
          {
            $group: {
              _id: null,
              totalReviews: { $sum: 1 },
              averageRating: { $avg: '$rating' },
              ratingDistribution: {
                $push: '$rating'
              }
            }
          }
        ]),
        Order.aggregate([
          {
            $unwind: '$items'
          },
          {
            $match: {
              'items.productId': new Types.ObjectId(productId)
            }
          },
          {
            $group: {
              _id: null,
              totalOrders: { $sum: 1 },
              totalQuantitySold: { $sum: '$items.quantity' },
              totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
            }
          }
        ])
      ]);

      const reviewData = reviewStats[0] || { totalReviews: 0, averageRating: 0, ratingDistribution: [] };
      const orderData = orderStats[0] || { totalOrders: 0, totalQuantitySold: 0, totalRevenue: 0 };

      // Calculate rating distribution
      const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
        const count = (reviewData.ratingDistribution || []).filter((r: number) => r === rating).length;
        return { rating, count };
      });

      const seller = product.sellerId as any;
      const category = product.categoryId as any;
      const subcategory = product.subcategoryId as any;

      return {
        ...product,
        id: product._id.toString(),
        seller: {
          id: seller?._id?.toString() || seller?.toString(),
          name: seller?.sellerProfile?.storeName || 
                (seller ? `${seller.firstName || ''} ${seller.lastName || ''}`.trim() : 'N/A'),
          email: seller?.email || 'N/A',
          phone: seller?.phone || 'N/A',
          storeName: seller?.sellerProfile?.storeName || null
        },
        category: {
          id: category?._id?.toString() || category?.toString(),
          name: category?.name || 'N/A',
          slug: category?.slug,
          description: category?.description
        },
        subcategory: subcategory ? {
          id: subcategory._id?.toString(),
          name: subcategory.name,
          slug: subcategory.slug
        } : null,
        statistics: {
          totalReviews: reviewData.totalReviews || product.totalReviews || 0,
          averageRating: reviewData.averageRating || product.averageRating || 0,
          ratingDistribution,
          totalOrders: orderData.totalOrders || 0,
          totalQuantitySold: orderData.totalQuantitySold || 0,
          totalRevenue: orderData.totalRevenue || 0,
          viewCount: product.viewCount || 0,
          purchaseCount: product.purchaseCount || 0
        },
        inStock: (product.stock || 0) > 0,
        discountedPrice: product.discountPercentage && product.discountPercentage > 0
          ? product.price * (1 - product.discountPercentage / 100)
          : product.price
      };
    } catch (error) {
      throw new Error(
        `Failed to get product: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Update product
  static async updateProduct(productId: string, updateData: any): Promise<any> {
    try {
      const product = await Product.findById(productId);

      if (!product) {
        throw new Error('Product not found');
      }

      // Update fields
      Object.keys(updateData).forEach(key => {
        if (key !== '_id' && key !== 'createdAt' && key !== 'updatedAt') {
          (product as any)[key] = updateData[key];
        }
      });

      await product.save();

      // Return updated product with populated data
      return await this.getProductById(productId);
    } catch (error) {
      throw new Error(
        `Failed to update product: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Update product status
  static async updateProductStatus(
    productId: string,
    status: 'draft' | 'active' | 'inactive' | 'archived'
  ): Promise<any> {
    try {
      const product = await Product.findById(productId);

      if (!product) {
        throw new Error('Product not found');
      }

      product.status = status;
      await product.save();

      // Return updated product with populated data
      return await this.getProductById(productId);
    } catch (error) {
      throw new Error(
        `Failed to update product status: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Delete product (soft delete by archiving)
  static async deleteProduct(productId: string): Promise<void> {
    try {
      const product = await Product.findById(productId);

      if (!product) {
        throw new Error('Product not found');
      }

      // Soft delete by archiving
      product.status = 'archived';
      await product.save();
    } catch (error) {
      throw new Error(
        `Failed to delete product: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

