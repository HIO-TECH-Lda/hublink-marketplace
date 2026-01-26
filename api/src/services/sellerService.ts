import User from '../models/User';
import Product from '../models/Product';
import Order from '../models/Order';
import { ApiError } from '../utils/ApiError';

export class SellerService {
  /**
   * Get public seller directory with filters
   */
  static async getPublicSellers(filters: any) {
    const {
      search,
      category,
      minRating,
      location,
      verified,
      featured,
      page = 1,
      limit = 12,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filters;

    const query: any = {
      role: 'seller',
      isActive: true // Only show active sellers
    };

    // Search by business name
    if (search) {
      query.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { 'businessInfo.description': { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by verification status
    if (verified !== undefined) {
      query.isVerified = verified === 'true' || verified === true;
    }

    // Filter by featured status
    if (featured !== undefined) {
      query.isFeatured = featured === 'true' || featured === true;
    }

    // Filter by location
    if (location) {
      query.businessAddress = { $regex: location, $options: 'i' };
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort: any = {};
    if (sortBy === 'rating') {
      sort.rating = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'sales') {
      sort.totalSales = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'name') {
      sort.businessName = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort.createdAt = sortOrder === 'asc' ? 1 : -1;
    }

    // Get sellers
    const sellers = await User.find(query)
      .select('businessName businessInfo.logo businessInfo.description rating totalReviews totalSales businessAddress isVerified isFeatured createdAt')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count
    const total = await User.countDocuments(query);

    // If category filter is provided, get sellers who sell in that category
    if (category) {
      const sellersInCategory = await Product.distinct('seller', {
        category: category,
        status: 'active'
      });

      const filteredSellers = sellers.filter((seller: any) =>
        sellersInCategory.some((id: any) => id.toString() === seller._id.toString())
      );

      return {
        sellers: filteredSellers.map((seller: any) => this.formatPublicSeller(seller)),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: filteredSellers.length,
          totalPages: Math.ceil(filteredSellers.length / limit)
        }
      };
    }

    // Format sellers for public view
    const formattedSellers = sellers.map((seller: any) => this.formatPublicSeller(seller));

    return {
      sellers: formattedSellers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get public seller profile by ID
   */
  static async getPublicSellerProfile(sellerId: string) {
    const seller: any = await User.findOne({
      _id: sellerId,
      role: 'seller',
      isActive: true
    }).select('-password -refreshTokens -__v').lean();

    if (!seller) {
      throw new ApiError(404, 'Seller not found');
    }

    // Get seller's products count
    const totalProducts = await Product.countDocuments({
      seller: sellerId,
      status: 'active'
    });

    // Get recent products (last 8)
    const recentProducts = await Product.find({
      seller: sellerId,
      status: 'active'
    })
      .select('name slug price images rating reviewCount stock category')
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    // Get seller statistics
    const completedOrders = await Order.countDocuments({
      'items.seller': sellerId,
      status: 'delivered'
    });

    return {
      id: seller._id,
      businessName: seller.businessName,
      logo: seller.businessInfo?.logo,
      description: seller.businessInfo?.description,
      rating: seller.rating || 0,
      totalReviews: seller.totalReviews || 0,
      totalSales: seller.totalSales || 0,
      totalProducts,
      location: seller.businessAddress,
      isVerified: seller.isVerified || false,
      isFeatured: seller.isFeatured || false,
      memberSince: seller.createdAt,
      contactEmail: seller.businessInfo?.publicEmail || undefined,
      phone: seller.businessInfo?.publicPhone || undefined,
      website: seller.businessInfo?.website || undefined,
      policies: {
        returns: seller.businessInfo?.returnPolicy,
        shipping: seller.businessInfo?.shippingPolicy,
        warranty: seller.businessInfo?.warrantyPolicy
      },
      statistics: {
        avgResponseTime: '2-4 hours', // TODO: Calculate from tickets/messages
        responseRate: 95, // TODO: Calculate from tickets/messages
        avgShippingTime: '2-3 days', // TODO: Calculate from orders
        successfulOrders: completedOrders
      },
      recentProducts
    };
  }

  /**
   * Get seller's products (public)
   */
  static async getSellerProducts(sellerId: string, filters: any) {
    const {
      category,
      search,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filters;

    // Verify seller exists
    const seller = await User.findOne({
      _id: sellerId,
      role: 'seller',
      isActive: true
    });

    if (!seller) {
      throw new ApiError(404, 'Seller not found');
    }

    const query: any = {
      seller: sellerId,
      status: 'active'
    };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const sort: any = {};
    if (sortBy === 'price') {
      sort.price = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'name') {
      sort.name = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'rating') {
      sort.rating = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort.createdAt = sortOrder === 'asc' ? 1 : -1;
    }

    const products = await Product.find(query)
      .select('name slug price images rating reviewCount stock category description')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Product.countDocuments(query);

    return {
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get top-rated sellers
   */
  static async getTopSellers(limit: number = 10) {
    const sellers = await User.find({
      role: 'seller',
      isActive: true,
      rating: { $gte: 4.0 }
    })
      .select('businessName businessInfo.logo rating totalReviews totalSales isVerified isFeatured')
      .sort({ rating: -1, totalReviews: -1 })
      .limit(limit)
      .lean();

    return sellers.map((seller: any) => this.formatPublicSeller(seller));
  }

  /**
   * Get featured sellers
   */
  static async getFeaturedSellers(limit: number = 6) {
    const sellers = await User.find({
      role: 'seller',
      isActive: true,
      isFeatured: true
    })
      .select('businessName businessInfo.logo businessInfo.description rating totalReviews totalSales isVerified isFeatured')
      .sort({ totalSales: -1 })
      .limit(limit)
      .lean();

    return sellers.map((seller: any) => this.formatPublicSeller(seller));
  }

  /**
   * Format seller data for public view
   */
  private static formatPublicSeller(seller: any) {
    return {
      id: seller._id,
      businessName: seller.businessName,
      logo: seller.businessInfo?.logo,
      description: seller.businessInfo?.description,
      rating: seller.rating || 0,
      totalReviews: seller.totalReviews || 0,
      totalSales: seller.totalSales || 0,
      location: seller.businessAddress,
      isVerified: seller.isVerified || false,
      isFeatured: seller.isFeatured || false,
      memberSince: seller.createdAt
    };
  }
}
