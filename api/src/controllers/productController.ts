import { Request, Response } from 'express';
import { ProductService } from '../services/productService';

export class ProductController {
  // Create new product
  static async createProduct(req: Request, res: Response) {
    try {
      const productData = req.body;
      const sellerId = req.user!.userId;
      const sellerName = `${req.user!.firstName} ${req.user!.lastName}`;

      const product = await ProductService.createProduct(productData, sellerId, sellerName);

      return res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: { product }
      });
    } catch (error) {
      console.error('Create product error:', error);
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create product'
      });
    }
  }

  // Get product by ID
  static async getProductById(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const product = await ProductService.getProductById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      return res.json({
        success: true,
        message: 'Product retrieved successfully',
        data: { product }
      });
    } catch (error) {
      console.error('Get product error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve product'
      });
    }
  }

  // Get product by slug
  static async getProductBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const product = await ProductService.getProductBySlug(slug);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      return res.json({
        success: true,
        message: 'Product retrieved successfully',
        data: { product }
      });
    } catch (error) {
      console.error('Get product by slug error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve product'
      });
    }
  }

  // Get products with filters
  static async getProducts(req: Request, res: Response) {
    try {
      const filters = {
        categoryId: req.query.categoryId as string,
        sellerId: req.query.sellerId as string,
        status: req.query.status as string,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        search: req.query.search as string,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 20,
        isFeatured: req.query.isFeatured === 'true',
        isBestSeller: req.query.isBestSeller === 'true',
        isNewArrival: req.query.isNewArrival === 'true'
      };

      const result = await ProductService.getProducts(filters);

      return res.json({
        success: true,
        message: 'Products retrieved successfully',
        data: {
          products: result.products,
          pagination: {
            page: result.page,
            limit: filters.limit,
            total: result.total,
            pages: result.pages
          }
        }
      });
    } catch (error) {
      console.error('Get products error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve products'
      });
    }
  }

  // Get featured products
  static async getFeaturedProducts(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const products = await ProductService.getFeaturedProducts(limit);

      return res.json({
        success: true,
        message: 'Featured products retrieved successfully',
        data: { products }
      });
    } catch (error) {
      console.error('Get featured products error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve featured products'
      });
    }
  }

  // Get best sellers
  static async getBestSellers(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const products = await ProductService.getBestSellers(limit);

      return res.json({
        success: true,
        message: 'Best sellers retrieved successfully',
        data: { products }
      });
    } catch (error) {
      console.error('Get best sellers error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve best sellers'
      });
    }
  }

  // Get new arrivals
  static async getNewArrivals(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const products = await ProductService.getNewArrivals(limit);

      return res.json({
        success: true,
        message: 'New arrivals retrieved successfully',
        data: { products }
      });
    } catch (error) {
      console.error('Get new arrivals error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve new arrivals'
      });
    }
  }

  // Update product
  static async updateProduct(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const updateData = req.body;
      const sellerId = req.user!.userId;

      const product = await ProductService.updateProduct(productId, updateData, sellerId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found or access denied'
        });
      }

      return res.json({
        success: true,
        message: 'Product updated successfully',
        data: { product }
      });
    } catch (error) {
      console.error('Update product error:', error);
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update product'
      });
    }
  }

  // Delete product
  static async deleteProduct(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const sellerId = req.user!.userId;

      const deleted = await ProductService.deleteProduct(productId, sellerId);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Product not found or access denied'
        });
      }

      return res.json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      console.error('Delete product error:', error);
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete product'
      });
    }
  }

  // Update product status
  static async updateProductStatus(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const { status } = req.body;
      const sellerId = req.user!.userId;

      const product = await ProductService.updateProductStatus(productId, status, sellerId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found or access denied'
        });
      }

      return res.json({
        success: true,
        message: 'Product status updated successfully',
        data: { product }
      });
    } catch (error) {
      console.error('Update product status error:', error);
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update product status'
      });
    }
  }

  // Update product stock
  static async updateProductStock(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const { quantity } = req.body;
      const sellerId = req.user!.userId;

      const product = await ProductService.updateProductStock(productId, quantity, sellerId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found or access denied'
        });
      }

      return res.json({
        success: true,
        message: 'Product stock updated successfully',
        data: { product }
      });
    } catch (error) {
      console.error('Update product stock error:', error);
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update product stock'
      });
    }
  }

  // Search products
  static async searchProducts(req: Request, res: Response) {
    try {
      const { q: searchTerm } = req.query;
      const filters = {
        categoryId: req.query.categoryId as string,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : 20
      };

      if (!searchTerm || typeof searchTerm !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Search term is required'
        });
      }

      const products = await ProductService.searchProducts(searchTerm, filters);

      return res.json({
        success: true,
        message: 'Search completed successfully',
        data: { products }
      });
    } catch (error) {
      console.error('Search products error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to search products'
      });
    }
  }

  // Get products by category
  static async getProductsByCategory(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;
      const filters = {
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : 20
      };

      const products = await ProductService.getProductsByCategory(categoryId, filters);

      return res.json({
        success: true,
        message: 'Category products retrieved successfully',
        data: { products }
      });
    } catch (error) {
      console.error('Get products by category error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve category products'
      });
    }
  }

  // Get seller products
  static async getSellerProducts(req: Request, res: Response) {
    try {
      const sellerId = req.user!.userId;
      const filters = {
        status: req.query.status as string,
        limit: req.query.limit ? Number(req.query.limit) : 50
      };

      const products = await ProductService.getSellerProducts(sellerId, filters);

      return res.json({
        success: true,
        message: 'Seller products retrieved successfully',
        data: { products }
      });
    } catch (error) {
      console.error('Get seller products error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve seller products'
      });
    }
  }
}
