import { WishlistService } from '../services/wishlistService';
import { Wishlist } from '../models/Wishlist';
import mongoose from 'mongoose';

// Mock data
const mockUserId = new mongoose.Types.ObjectId().toString();
const mockProductId = new mongoose.Types.ObjectId().toString();

describe('Wishlist Service', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear wishlist collection before each test
    await Wishlist.deleteMany({});
  });

  describe('Wishlist Management', () => {
    it('should create a new wishlist for user', async () => {
      const wishlist = await WishlistService.getUserWishlist(mockUserId);
      expect(wishlist).toBeDefined();
      expect(wishlist.userId).toBe(mockUserId);
      expect(wishlist.items).toHaveLength(0);
    });

    it('should add product to wishlist', async () => {
      // Mock product exists
      const wishlist = await WishlistService.addToWishlist(mockUserId, mockProductId, 'Test note');
      expect(wishlist.items).toHaveLength(1);
      expect(wishlist.items[0].productId.toString()).toBe(mockProductId);
      expect(wishlist.items[0].notes).toBe('Test note');
    });

    it('should check if product is in wishlist', async () => {
      // Add product first
      await WishlistService.addToWishlist(mockUserId, mockProductId);
      
      // Check if product is in wishlist
      const isInWishlist = await WishlistService.isInWishlist(mockUserId, mockProductId);
      expect(isInWishlist).toBe(true);
    });

    it('should remove product from wishlist', async () => {
      // Add product first
      await WishlistService.addToWishlist(mockUserId, mockProductId);
      
      // Remove product
      await WishlistService.removeFromWishlist(mockUserId, mockProductId);
      
      // Check if product is removed
      const isInWishlist = await WishlistService.isInWishlist(mockUserId, mockProductId);
      expect(isInWishlist).toBe(false);
    });

    it('should clear wishlist', async () => {
      // Add multiple products
      await WishlistService.addToWishlist(mockUserId, mockProductId);
      await WishlistService.addToWishlist(mockUserId, new mongoose.Types.ObjectId().toString());
      
      // Clear wishlist
      await WishlistService.clearWishlist(mockUserId);
      
      // Check if wishlist is empty
      const wishlist = await WishlistService.getUserWishlist(mockUserId);
      expect(wishlist.items).toHaveLength(0);
    });
  });

  describe('Wishlist Statistics', () => {
    it('should get wishlist statistics', async () => {
      // Add product to wishlist
      await WishlistService.addToWishlist(mockUserId, mockProductId);
      
      // Get statistics
      const stats = await WishlistService.getWishlistStats(mockUserId);
      expect(stats.totalItems).toBe(1);
      expect(stats.totalValue).toBeGreaterThanOrEqual(0);
      expect(stats.averagePrice).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Wishlist Items Pagination', () => {
    it('should get paginated wishlist items', async () => {
      // Add multiple products
      for (let i = 0; i < 5; i++) {
        await WishlistService.addToWishlist(mockUserId, new mongoose.Types.ObjectId().toString());
      }
      
      // Get paginated items
      const result = await WishlistService.getWishlistItems(mockUserId, 1, 3);
      expect(result.items).toHaveLength(3);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(3);
      expect(result.pagination.total).toBe(5);
    });
  });

  describe('Error Handling', () => {
    it('should handle non-existent product', async () => {
      const nonExistentProductId = new mongoose.Types.ObjectId().toString();
      
      await expect(
        WishlistService.addToWishlist(mockUserId, nonExistentProductId)
      ).rejects.toThrow('Product not found');
    });

    it('should handle removing non-existent item', async () => {
      const nonExistentProductId = new mongoose.Types.ObjectId().toString();
      
      await expect(
        WishlistService.removeFromWishlist(mockUserId, nonExistentProductId)
      ).rejects.toThrow('Wishlist not found');
    });
  });
});
