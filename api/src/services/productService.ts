import Product, { IProductDocument } from '../models/Product';
import Category from '../models/Category';
import { IProduct, IProductImage } from '../types';

export class ProductService {
  // Create new product
  static async createProduct(productData: Partial<IProduct>, sellerId: string, sellerName: string): Promise<IProductDocument> {
    try {
      // Validate category exists
      const category = await Category.findById(productData.categoryId);
      if (!category) {
        throw new Error('Category not found');
      }

      // Set primary image if not provided
      if (productData.images && productData.images.length > 0 && !productData.primaryImage) {
        const primaryImage = productData.images.find(img => img.isPrimary) || productData.images[0];
        productData.primaryImage = primaryImage.url;
      }

      const product = new Product({
        ...productData,
        sellerId,
        sellerName,
        status: 'draft' // Default to draft for review
      });

      await product.save();
      return product;
    } catch (error) {
      throw error;
    }
  }

  // Get product by ID
  static async getProductById(productId: string): Promise<IProductDocument | null> {
    try {
      const product = await Product.findById(productId)
        .populate('categoryId', 'name slug')
        .populate('subcategoryId', 'name slug')
        .populate('sellerId', 'firstName lastName businessName');

      if (product) {
        // Increment view count
        await product.incrementViewCount();
      }

      return product;
    } catch (error) {
      throw error;
    }
  }

  // Get product by slug
  static async getProductBySlug(slug: string): Promise<IProductDocument | null> {
    try {
      const product = await Product.findOne({ slug, status: 'active' })
        .populate('categoryId', 'name slug')
        .populate('subcategoryId', 'name slug')
        .populate('sellerId', 'firstName lastName businessName');

      if (product) {
        // Increment view count
        await product.incrementViewCount();
      }

      return product;
    } catch (error) {
      throw error;
    }
  }

  // Get products with pagination and filters
  static async getProducts(filters: {
    categoryId?: string;
    sellerId?: string;
    status?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
    isFeatured?: boolean;
    isBestSeller?: boolean;
    isNewArrival?: boolean;
  }): Promise<{ products: IProductDocument[]; total: number; page: number; pages: number }> {
    try {
      const {
        categoryId,
        sellerId,
        status = 'active',
        minPrice,
        maxPrice,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 20,
        isFeatured,
        isBestSeller,
        isNewArrival
      } = filters;

      // Build query
      const query: any = {};

      if (categoryId) {
        query.categoryId = categoryId;
      }

      if (sellerId) {
        query.sellerId = sellerId;
      }

      if (status) {
        query.status = status;
      }

      if (minPrice !== undefined || maxPrice !== undefined) {
        query.price = {};
        if (minPrice !== undefined) query.price.$gte = minPrice;
        if (maxPrice !== undefined) query.price.$lte = maxPrice;
      }

      if (isFeatured !== undefined) {
        query.isFeatured = isFeatured;
      }

      if (isBestSeller !== undefined) {
        query.isBestSeller = isBestSeller;
      }

      if (isNewArrival !== undefined) {
        query.isNewArrival = isNewArrival;
      }

      // Text search
      if (search) {
        query.$text = { $search: search };
      }

      // Build sort object
      const sort: any = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Execute query
      const skip = (page - 1) * limit;
      const products = await Product.find(query)
        .populate('categoryId', 'name slug')
        .populate('subcategoryId', 'name slug')
        .populate('sellerId', 'firstName lastName businessName')
        .sort(sort)
        .skip(skip)
        .limit(limit);

      const total = await Product.countDocuments(query);
      const pages = Math.ceil(total / limit);

      return {
        products,
        total,
        page,
        pages
      };
    } catch (error) {
      throw error;
    }
  }

  // Get featured products
  static async getFeaturedProducts(limit: number = 10): Promise<IProductDocument[]> {
    try {
      return await Product.find({ status: 'active', isFeatured: true })
        .populate('categoryId', 'name slug')
        .populate('sellerId', 'firstName lastName businessName')
        .sort({ createdAt: -1 })
        .limit(limit);
    } catch (error) {
      throw error;
    }
  }

  // Get best sellers
  static async getBestSellers(limit: number = 10): Promise<IProductDocument[]> {
    try {
      return await Product.find({ status: 'active', isBestSeller: true })
        .populate('categoryId', 'name slug')
        .populate('sellerId', 'firstName lastName businessName')
        .sort({ purchaseCount: -1 })
        .limit(limit);
    } catch (error) {
      throw error;
    }
  }

  // Get new arrivals
  static async getNewArrivals(limit: number = 10): Promise<IProductDocument[]> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      return await Product.find({
        status: 'active',
        createdAt: { $gte: thirtyDaysAgo }
      })
        .populate('categoryId', 'name slug')
        .populate('sellerId', 'firstName lastName businessName')
        .sort({ createdAt: -1 })
        .limit(limit);
    } catch (error) {
      throw error;
    }
  }

  // Update product
  static async updateProduct(productId: string, updateData: Partial<IProduct>, sellerId: string): Promise<IProductDocument | null> {
    try {
      // Verify product belongs to seller
      const product = await Product.findOne({ _id: productId, sellerId });
      if (!product) {
        throw new Error('Product not found or access denied');
      }

      // Set primary image if not provided
      if (updateData.images && updateData.images.length > 0 && !updateData.primaryImage) {
        const primaryImage = updateData.images.find(img => img.isPrimary) || updateData.images[0];
        updateData.primaryImage = primaryImage.url;
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        updateData,
        { new: true, runValidators: true }
      ).populate('categoryId', 'name slug')
       .populate('subcategoryId', 'name slug')
       .populate('sellerId', 'firstName lastName businessName');

      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }

  // Delete product
  static async deleteProduct(productId: string, sellerId: string): Promise<boolean> {
    try {
      // Verify product belongs to seller
      const product = await Product.findOne({ _id: productId, sellerId });
      if (!product) {
        throw new Error('Product not found or access denied');
      }

      await Product.findByIdAndDelete(productId);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Update product status
  static async updateProductStatus(productId: string, status: string, sellerId: string): Promise<IProductDocument | null> {
    try {
      // Verify product belongs to seller
      const product = await Product.findOne({ _id: productId, sellerId });
      if (!product) {
        throw new Error('Product not found or access denied');
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { status },
        { new: true, runValidators: true }
      ).populate('categoryId', 'name slug')
       .populate('sellerId', 'firstName lastName businessName');

      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }

  // Update product stock
  static async updateProductStock(productId: string, quantity: number, sellerId: string): Promise<IProductDocument | null> {
    try {
      // Verify product belongs to seller
      const product = await Product.findOne({ _id: productId, sellerId });
      if (!product) {
        throw new Error('Product not found or access denied');
      }

      const newStock = Math.max(0, product.stock + quantity);
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { stock: newStock },
        { new: true, runValidators: true }
      );

      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }

  // Search products
  static async searchProducts(searchTerm: string, filters: any = {}): Promise<IProductDocument[]> {
    try {
      const query: any = {
        status: 'active',
        $text: { $search: searchTerm }
      };

      // Apply additional filters
      if (filters.categoryId) query.categoryId = filters.categoryId;
      if (filters.minPrice !== undefined) query.price = { $gte: filters.minPrice };
      if (filters.maxPrice !== undefined) {
        if (query.price) {
          query.price.$lte = filters.maxPrice;
        } else {
          query.price = { $lte: filters.maxPrice };
        }
      }

      return await Product.find(query)
        .populate('categoryId', 'name slug')
        .populate('sellerId', 'firstName lastName businessName')
        .sort({ score: { $meta: 'textScore' } })
        .limit(filters.limit || 20);
    } catch (error) {
      throw error;
    }
  }

  // Get products by category
  static async getProductsByCategory(categoryId: string, filters: any = {}): Promise<IProductDocument[]> {
    try {
      const query: any = {
        categoryId,
        status: 'active'
      };

      // Apply additional filters
      if (filters.minPrice !== undefined) query.price = { $gte: filters.minPrice };
      if (filters.maxPrice !== undefined) {
        if (query.price) {
          query.price.$lte = filters.maxPrice;
        } else {
          query.price = { $lte: filters.maxPrice };
        }
      }

      return await Product.find(query)
        .populate('categoryId', 'name slug')
        .populate('sellerId', 'firstName lastName businessName')
        .sort({ createdAt: -1 })
        .limit(filters.limit || 20);
    } catch (error) {
      throw error;
    }
  }

  // Get seller products
  static async getSellerProducts(sellerId: string, filters: any = {}): Promise<IProductDocument[]> {
    try {
      const query: any = { sellerId };

      if (filters.status) {
        query.status = filters.status;
      }

      return await Product.find(query)
        .populate('categoryId', 'name slug')
        .sort({ createdAt: -1 })
        .limit(filters.limit || 50);
    } catch (error) {
      throw error;
    }
  }
}
