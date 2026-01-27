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
      status: 'active' // Only show active sellers
    };

    // Search by business name or description
    if (search) {
      query.$or = [
        { 'sellerProfile.storeName': { $regex: search, $options: 'i' } },
        { 'sellerProfile.storeDescription': { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by verification status
    // if (verified !== undefined) {
    //   query.isVerified = verified === 'true' || verified === true;
    // }

    // Filter by featured status
    if (featured !== undefined) {
      query.isFeatured = featured === 'true' || featured === true;
    }

    // Filter by location
    if (location) {
      query.$or = query.$or || [];
      query.$or.push(
        { 'sellerProfile.city': { $regex: location, $options: 'i' } },
        { 'sellerProfile.province': { $regex: location, $options: 'i' } }
      );
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
      sort['sellerProfile.storeName'] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort.createdAt = sortOrder === 'asc' ? 1 : -1;
    }

    // Get sellers
    const sellers = await User.find(query)
      .select('firstName lastName email avatar sellerProfile rating totalReviews totalSales isVerified isFeatured createdAt')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count
    const total = await User.countDocuments(query);

    // If category filter is provided, get sellers who sell in that category
    if (category) {
      const sellersInCategory = await Product.distinct('sellerId', {
        category: category,
        status: 'active'
      });

      const filteredSellers = sellers.filter((seller: any) =>
        sellersInCategory.some((id: any) => id.toString() === seller._id.toString())
      );

      // Get product counts for filtered sellers
      const filteredSellerIds = filteredSellers.map((s: any) => s._id);
      const productCounts = await Product.aggregate([
        {
          $match: {
            seller: { $in: filteredSellerIds },
            status: 'active'
          }
        },
        {
          $group: {
            _id: '$seller',
            count: { $sum: 1 }
          }
        }
      ]);

      // Create a map of seller ID to product count
      const productCountMap = new Map();
      productCounts.forEach((pc: any) => {
        productCountMap.set(pc._id.toString(), pc.count);
      });

      return {
        sellers: filteredSellers.map((seller: any) => 
          this.formatPublicSeller(seller, productCountMap.get(seller._id.toString()) || 0)
        ),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: filteredSellers.length,
          totalPages: Math.ceil(filteredSellers.length / limit)
        }
      };
    }

    // Get product counts for all sellers
    const sellerIds = sellers.map((s: any) => s._id);
    const productCounts = await Product.aggregate([
      {
        $match: {
          sellerId: { $in: sellerIds },
          status: 'active'
        }
      },
      {
        $group: {
          _id: '$sellerId',
          count: { $sum: 1 }
        }
      }
    ]);

    // Create a map of seller ID to product count
    const productCountMap = new Map();
    productCounts.forEach((pc: any) => {
      productCountMap.set(pc._id.toString(), pc.count);
    });

    // Format sellers for public view with product counts
    const formattedSellers = sellers.map((seller: any) => 
      this.formatPublicSeller(seller, productCountMap.get(seller._id.toString()) || 0)
    );

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
      status: 'active'
    }).select('-password -refreshTokens -__v').lean();

    if (!seller) {
      throw new ApiError(404, 'Seller not found');
    }

    // Get seller's products count
    const totalProducts = await Product.countDocuments({
      sellerId: sellerId,
      status: 'active'
    });

    // Get recent products (last 8)
    const recentProducts = await Product.find({
      sellerId: sellerId,
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
      businessName: seller.sellerProfile?.storeName || `${seller.firstName} ${seller.lastName}`,
      logo: seller.avatar,
      description: seller.sellerProfile?.storeDescription,
      rating: seller.rating || 0,
      totalReviews: seller.totalReviews || 0,
      totalSales: seller.totalSales || 0,
      totalProducts,
      location: seller.sellerProfile?.address ? 
        `${seller.sellerProfile.address}, ${seller.sellerProfile.city}, ${seller.sellerProfile.province}` : 
        undefined,
      isVerified: seller.isVerified || false,
      isFeatured: seller.isFeatured || false,
      memberSince: seller.createdAt,
      contactEmail: seller.email,
      phone: seller.phone,
      policies: {
        returns: '30 days return policy', // TODO: Add to seller profile
        shipping: 'Ships within 2-3 business days', // TODO: Add to seller profile
        warranty: 'Standard warranty applies' // TODO: Add to seller profile
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
      status: 'active'
    });

    if (!seller) {
      throw new ApiError(404, 'Seller not found');
    }

    const query: any = {
      sellerId: sellerId,
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
      status: 'active',
      rating: { $gte: 4.0 }
    })
      .select('firstName lastName email avatar sellerProfile rating totalReviews totalSales isVerified isFeatured createdAt')
      .sort({ rating: -1, totalReviews: -1 })
      .limit(limit)
      .lean();

    // Get product counts for sellers
    const sellerIds = sellers.map((s: any) => s._id);
    const productCounts = await Product.aggregate([
      {
        $match: {
          sellerId: { $in: sellerIds },
          status: 'active'
        }
      },
      {
        $group: {
          _id: '$sellerId',
          count: { $sum: 1 }
        }
      }
    ]);

    const productCountMap = new Map();
    productCounts.forEach((pc: any) => {
      productCountMap.set(pc._id.toString(), pc.count);
    });

    return sellers.map((seller: any) => 
      this.formatPublicSeller(seller, productCountMap.get(seller._id.toString()) || 0)
    );
  }

  /**
   * Get featured sellers
   */
  static async getFeaturedSellers(limit: number = 6) {
    const sellers = await User.find({
      role: 'seller',
      status: 'active',
      isFeatured: true
    })
      .select('firstName lastName email avatar sellerProfile rating totalReviews totalSales isVerified isFeatured createdAt')
      .sort({ totalSales: -1 })
      .limit(limit)
      .lean();

    // Get product counts for sellers
    const sellerIds = sellers.map((s: any) => s._id);
    const productCounts = await Product.aggregate([
      {
        $match: {
          sellerId: { $in: sellerIds },
          status: 'active'
        }
      },
      {
        $group: {
          _id: '$sellerId',
          count: { $sum: 1 }
        }
      }
    ]);

    const productCountMap = new Map();
    productCounts.forEach((pc: any) => {
      productCountMap.set(pc._id.toString(), pc.count);
    });

    return sellers.map((seller: any) => 
      this.formatPublicSeller(seller, productCountMap.get(seller._id.toString()) || 0)
    );
  }

  /**
   * Format seller data for public view
   */
  private static formatPublicSeller(seller: any, totalProducts: number = 0) {
    return {
      id: seller._id,
      businessName: seller.sellerProfile?.storeName || `${seller.firstName} ${seller.lastName}`,
      logo: seller.avatar,
      description: seller.sellerProfile?.storeDescription,
      rating: seller.rating || 0,
      totalReviews: seller.totalReviews || 0,
      totalSales: seller.totalSales || 0,
      totalProducts,
      location: seller.sellerProfile?.city ? `${seller.sellerProfile.city}, ${seller.sellerProfile.province}` : undefined,
      isVerified: seller.isVerified || false,
      isFeatured: seller.isFeatured || false,
      memberSince: seller.createdAt
    };
  }
}
