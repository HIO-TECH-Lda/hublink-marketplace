import { Request, Response } from 'express';
import User from '../models/User';
import Category from '../models/Category';
import Product from '../models/Product';

export class TestController {
  // Test database connection
  static async testDatabase(req: Request, res: Response) {
    try {
      const userCount = await User.countDocuments();
      res.json({
        success: true,
        message: 'Database connection successful',
        data: {
          userCount,
          timestamp: new Date().toISOString(),
          database: 'MongoDB Atlas'
        }
      });
    } catch (error) {
      console.error('Database test error:', error);
      res.status(500).json({
        success: false,
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Create test user
  static async createTestUser(req: Request, res: Response) {
    try {
      const testUser = new User({
        firstName: 'Test',
        lastName: 'User',
        email: `test-${Date.now()}@example.com`,
        phone: '+258841234567',
        password: 'TestPassword123!',
        role: 'buyer'
      });

      await testUser.save();

      res.status(201).json({
        success: true,
        message: 'Test user created successfully',
        data: {
          userId: testUser._id,
          email: testUser.email,
          fullName: testUser.fullName
        }
      });
    } catch (error) {
      console.error('Create test user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create test user',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Create test category
  static async createTestCategory(req: Request, res: Response) {
    try {
      const testCategory = new Category({
        name: 'Electronics',
        description: 'Electronic devices and gadgets',
        slug: 'electronics',
        isActive: true,
        isFeatured: true,
        sortOrder: 1
      });

      await testCategory.save();

      res.status(201).json({
        success: true,
        message: 'Test category created successfully',
        data: {
          categoryId: testCategory._id,
          name: testCategory.name,
          slug: testCategory.slug
        }
      });
    } catch (error) {
      console.error('Create test category error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create test category',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Create test product
  static async createTestProduct(req: Request, res: Response) {
    try {
      // First, get a seller user
      const seller = await User.findOne({ role: 'seller' });
      if (!seller) {
        return res.status(400).json({
          success: false,
          message: 'No seller user found. Please create a seller user first.'
        });
      }

      // Get a category
      const category = await Category.findOne({ isActive: true });
      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'No category found. Please create a category first.'
        });
      }

      const testProduct = new Product({
        name: 'Smartphone Test',
        description: 'A high-quality smartphone for testing purposes',
        shortDescription: 'Latest smartphone with advanced features',
        sellerId: seller._id,
        sellerName: `${seller.firstName} ${seller.lastName}`,
        categoryId: category._id,
        price: 1500,
        stock: 10,
        images: [{
          url: 'https://example.com/phone.jpg',
          alt: 'Smartphone',
          isPrimary: true,
          order: 0
        }],
        primaryImage: 'https://example.com/phone.jpg',
        status: 'active',
        isFeatured: true,
        tags: ['smartphone', 'electronics', 'mobile'],
        labels: ['premium']
      });

      await testProduct.save();

      return res.status(201).json({
        success: true,
        message: 'Test product created successfully',
        data: {
          productId: testProduct._id,
          name: testProduct.name,
          price: testProduct.price,
          sellerName: testProduct.sellerName,
          categoryName: category.name
        }
      });
    } catch (error) {
      console.error('Create test product error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create test product',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
