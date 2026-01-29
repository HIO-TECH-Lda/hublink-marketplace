import User from '../models/User';
import Product from '../models/Product';
import Review from '../models/Review';
import Order from '../models/Order';
import { ApiError } from '../utils/ApiError';

/**
 * Service for calculating and updating seller ratings
 * Seller ratings are calculated from their products' reviews
 */
export class SellerRatingService {
  /**
   * Calculate and update seller rating based on all their products' reviews
   */
  static async updateSellerRating(sellerId: string): Promise<void> {
    try {
      // Get all products for this seller
      const products = await Product.find({ 
        sellerId: sellerId,
        status: 'active'
      }).select('_id');

      const productIds = products.map(p => p._id);

      if (productIds.length === 0) {
        // No products, set rating to 0
        await User.findByIdAndUpdate(sellerId, {
          rating: 0,
          totalReviews: 0
        });
        return;
      }

      // Aggregate all approved reviews for seller's products
      const stats = await Review.aggregate([
        {
          $match: {
            productId: { $in: productIds },
            status: 'approved'
          }
        },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 }
          }
        }
      ]);

      if (stats.length > 0) {
        const { averageRating, totalReviews } = stats[0];
        
        // Round to 1 decimal place
        const roundedRating = Math.round(averageRating * 10) / 10;

        await User.findByIdAndUpdate(sellerId, {
          rating: roundedRating,
          totalReviews: totalReviews
        });

        console.log(`Updated seller ${sellerId} rating: ${roundedRating} (${totalReviews} reviews)`);
      } else {
        // No approved reviews yet
        await User.findByIdAndUpdate(sellerId, {
          rating: 0,
          totalReviews: 0
        });
      }
    } catch (error) {
      console.error('Error updating seller rating:', error);
      throw error;
    }
  }

  /**
   * Update seller rating when a product review is created/approved
   * Call this after creating or approving a product review
   */
  static async updateSellerRatingFromProductReview(productId: string): Promise<void> {
    try {
      // Get the product to find the seller
      const product = await Product.findById(productId);
      
      if (!product) {
        throw new ApiError(404, 'Product not found');
      }

      // Update the seller's rating
      await this.updateSellerRating(product.sellerId.toString());
    } catch (error) {
      console.error('Error updating seller rating from product review:', error);
      throw error;
    }
  }

  /**
   * Update total sales count for a seller when an order is completed
   */
  static async updateSellerSales(sellerId: string): Promise<void> {
    try {
      // Count all completed orders containing seller's products
      const completedOrders = await Order.countDocuments({
        'items.sellerId': sellerId,
        status: { $in: ['delivered', 'completed'] }
      });

      await User.findByIdAndUpdate(sellerId, {
        totalSales: completedOrders
      });

      console.log(`Updated seller ${sellerId} total sales: ${completedOrders}`);
    } catch (error) {
      console.error('Error updating seller sales:', error);
      throw error;
    }
  }

  /**
   * Update seller sales when an order status changes to delivered/completed
   */
  static async updateSellerSalesFromOrder(orderId: string): Promise<void> {
    try {
      const order = await Order.findById(orderId);
      
      if (!order) {
        throw new ApiError(404, 'Order not found');
      }

      // Only update if order is delivered or completed
      if (!['delivered', 'completed'].includes(order.status)) {
        return;
      }

      // Get unique seller IDs from order items
      const sellerIds = [...new Set(
        order.items.map((item: any) => item.sellerId?.toString()).filter(Boolean)
      )];

      // Update sales count for each seller
      await Promise.all(
        sellerIds.map(sellerId => this.updateSellerSales(sellerId))
      );
    } catch (error) {
      console.error('Error updating seller sales from order:', error);
      throw error;
    }
  }

  /**
   * Get seller rating breakdown
   */
  static async getSellerRatingBreakdown(sellerId: string): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: { [key: number]: number };
    recentReviews: any[];
  }> {
    try {
      // Get all products for this seller
      const products = await Product.find({ 
        sellerId: sellerId,
        status: 'active'
      }).select('_id');

      const productIds = products.map(p => p._id);

      if (productIds.length === 0) {
        return {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          recentReviews: []
        };
      }

      // Get rating statistics
      const stats = await Review.aggregate([
        {
          $match: {
            productId: { $in: productIds },
            status: 'approved'
          }
        },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 }
          }
        }
      ]);

      // Get rating distribution
      const distribution = await Review.aggregate([
        {
          $match: {
            productId: { $in: productIds },
            status: 'approved'
          }
        },
        {
          $group: {
            _id: '$rating',
            count: { $sum: 1 }
          }
        }
      ]);

      const ratingDistribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      distribution.forEach((item: any) => {
        ratingDistribution[item._id] = item.count;
      });

      // Get recent reviews (last 5)
      const recentReviews = await Review.find({
        productId: { $in: productIds },
        status: 'approved'
      })
        .populate('userId', 'firstName lastName avatar')
        .populate('productId', 'name')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

      return {
        averageRating: stats.length > 0 ? Math.round(stats[0].averageRating * 10) / 10 : 0,
        totalReviews: stats.length > 0 ? stats[0].totalReviews : 0,
        ratingDistribution,
        recentReviews
      };
    } catch (error) {
      console.error('Error getting seller rating breakdown:', error);
      throw error;
    }
  }

  /**
   * Recalculate all seller ratings (admin utility function)
   * Use this if data gets out of sync
   */
  static async recalculateAllSellerRatings(): Promise<{
    updated: number;
    errors: number;
  }> {
    try {
      const sellers = await User.find({ role: 'seller' }).select('_id');
      
      let updated = 0;
      let errors = 0;

      for (const seller of sellers) {
        try {
          await this.updateSellerRating(seller._id.toString());
          await this.updateSellerSales(seller._id.toString());
          updated++;
        } catch (error) {
          console.error(`Error updating seller ${seller._id}:`, error);
          errors++;
        }
      }

      console.log(`Recalculated seller ratings: ${updated} updated, ${errors} errors`);

      return { updated, errors };
    } catch (error) {
      console.error('Error recalculating all seller ratings:', error);
      throw error;
    }
  }

  /**
   * Update verification status (admin only)
   */
  static async updateVerificationStatus(
    sellerId: string,
    isVerified: boolean
  ): Promise<void> {
    try {
      const seller = await User.findById(sellerId);
      
      if (!seller) {
        throw new ApiError(404, 'Seller not found');
      }

      if (seller.role !== 'seller') {
        throw new ApiError(400, 'User is not a seller');
      }

      await User.findByIdAndUpdate(sellerId, { isVerified });

      console.log(`Updated seller ${sellerId} verification status: ${isVerified}`);
    } catch (error) {
      console.error('Error updating verification status:', error);
      throw error;
    }
  }

  /**
   * Update featured status (admin only)
   */
  static async updateFeaturedStatus(
    sellerId: string,
    isFeatured: boolean
  ): Promise<void> {
    try {
      const seller = await User.findById(sellerId);
      
      if (!seller) {
        throw new ApiError(404, 'Seller not found');
      }

      if (seller.role !== 'seller') {
        throw new ApiError(400, 'User is not a seller');
      }

      await User.findByIdAndUpdate(sellerId, { isFeatured });

      console.log(`Updated seller ${sellerId} featured status: ${isFeatured}`);
    } catch (error) {
      console.error('Error updating featured status:', error);
      throw error;
    }
  }
}
