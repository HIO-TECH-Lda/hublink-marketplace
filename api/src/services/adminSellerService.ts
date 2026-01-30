import User from '../models/User';
import Product from '../models/Product';
import Order from '../models/Order';
import Review from '../models/Review';
import Payment from '../models/Payment';
import mongoose, { Types } from 'mongoose';
import Messages from '../utils/messages';

export interface SellerListFilters {
  search?: string;
  status?: 'active' | 'inactive' | 'suspended';
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SellerStats {
  total: number;
  approved: number; // active sellers
  pending: number; // inactive sellers (pending approval)
  rejected: number; // suspended sellers
  totalSales: number;
  averageRating: number;
}

export class AdminSellerService {
  // Get seller statistics
  static async getSellerStats(): Promise<SellerStats> {
    try {
      const [total, approved, pending, rejected, salesStats, ratingStats] = await Promise.all([
        User.countDocuments({ role: 'seller' }),
        User.countDocuments({ role: 'seller', status: 'active' }),
        User.countDocuments({ role: 'seller', status: 'inactive' }),
        User.countDocuments({ role: 'seller', status: 'suspended' }),
        // Calculate total sales from orders
        Order.aggregate([
          {
            $unwind: '$items'
          },
          {
            $lookup: {
              from: 'products',
              localField: 'items.productId',
              foreignField: '_id',
              as: 'product'
            }
          },
          {
            $unwind: '$product'
          },
          {
            $match: {
              'product.sellerId': { $exists: true },
              status: { $ne: 'cancelled' }
            }
          },
          {
            $group: {
              _id: null,
              totalSales: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
            }
          }
        ]),
        // Calculate average rating from products
        Product.aggregate([
          {
            $match: {
              sellerId: { $exists: true }
            }
          },
          {
            $group: {
              _id: null,
              averageRating: { $avg: '$averageRating' },
              count: { $sum: 1 }
            }
          }
        ])
      ]);

      const totalSales = salesStats[0]?.totalSales || 0;
      const averageRating = ratingStats[0]?.averageRating || 0;

      return {
        total,
        approved,
        pending,
        rejected,
        totalSales: Math.round(totalSales * 100) / 100,
        averageRating: Math.round(averageRating * 10) / 10
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : Messages.ADMIN_SELLER.STATS_FAILED);
    }
  }

  // Get all sellers with filters and pagination
  static async getSellers(filters: SellerListFilters = {}): Promise<{
    sellers: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const {
        search,
        status,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = filters;

      // Build query
      const query: any = { role: 'seller' };

      // Status filter
      if (status) {
        query.status = status;
      }

      // Search filter (store name, contact name, email, NUIT if exists)
      if (search) {
        query.$or = [
          { 'sellerProfile.storeName': { $regex: search, $options: 'i' } },
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ];
      }

      // Calculate pagination
      const skip = (page - 1) * limit;
      const sort: any = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

      // Get total count
      const total = await User.countDocuments(query);

      // Get sellers
      const sellers = await User.find(query)
        .select('-password')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();

      // Get seller IDs
      const sellerIds = sellers.map((s: any) => s._id);

      // Get product counts and sales for each seller
      const productCounts = await Product.aggregate([
        {
          $match: {
            sellerId: { $in: sellerIds }
          }
        },
        {
          $group: {
            _id: '$sellerId',
            productCount: { $sum: 1 },
            averageRating: { $avg: '$averageRating' },
            totalReviews: { $sum: '$totalReviews' }
          }
        }
      ]);

      // Get sales totals from orders
      const salesData = await Order.aggregate([
        {
          $unwind: '$items'
        },
        {
          $lookup: {
            from: 'products',
            localField: 'items.productId',
            foreignField: '_id',
            as: 'product'
          }
        },
        {
          $unwind: '$product'
        },
        {
          $match: {
            'product.sellerId': { $in: sellerIds },
            status: { $ne: 'cancelled' }
          }
        },
        {
          $group: {
            _id: '$product.sellerId',
            totalSales: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
          }
        }
      ]);

      // Create maps for quick lookup
      const productMap = new Map();
      productCounts.forEach((item: any) => {
        productMap.set(item._id.toString(), {
          productCount: item.productCount,
          averageRating: item.averageRating || 0,
          totalReviews: item.totalReviews || 0
        });
      });

      const salesMap = new Map();
      salesData.forEach((item: any) => {
        salesMap.set(item._id.toString(), item.totalSales);
      });

      // Format sellers for frontend
      const formattedSellers = sellers.map((seller: any) => {
        const productData = productMap.get(seller._id.toString()) || {
          productCount: 0,
          averageRating: 0,
          totalReviews: 0
        };
        const totalSales = salesMap.get(seller._id.toString()) || 0;

        return {
          id: seller._id.toString(),
          company: {
            name: seller.sellerProfile?.storeName || 'N/A',
            description: seller.sellerProfile?.storeDescription
          },
          contact: {
            name: `${seller.firstName || ''} ${seller.lastName || ''}`.trim() || seller.email,
            email: seller.email,
            phone: seller.phone
          },
          sellerProfile: seller.sellerProfile || null,
          totalProducts: productData.productCount, // Renamed for clarity
          productCount: productData.productCount, // Keep for backward compatibility
          totalSales: Math.round(totalSales * 100) / 100,
          averageRating: Math.round(productData.averageRating * 10) / 10,
          totalReviews: productData.totalReviews,
          status: seller.status, // active = approved, inactive = pending, suspended = rejected
          createdAt: seller.createdAt,
          updatedAt: seller.updatedAt
        };
      });

      return {
        sellers: formattedSellers,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : Messages.ADMIN_SELLER.LIST_FAILED);
    }
  }

  // Get seller by ID with full details
  static async getSellerById(sellerId: string): Promise<any> {
    try {
      const seller = await User.findOne({ _id: sellerId, role: 'seller' })
        .select('-password')
        .lean();

      if (!seller) {
        throw new Error('Seller not found');
      }

      // Get product statistics
      const productStats = await Product.aggregate([
        {
          $match: {
            sellerId: new Types.ObjectId(sellerId)
          }
        },
        {
          $group: {
            _id: null,
            productCount: { $sum: 1 },
            averageRating: { $avg: '$averageRating' },
            totalReviews: { $sum: '$totalReviews' },
            totalViews: { $sum: '$viewCount' },
            totalPurchases: { $sum: '$purchaseCount' }
          }
        }
      ]);

      // Get sales statistics from orders
      const salesStats = await Order.aggregate([
        {
          $unwind: '$items'
        },
        {
          $lookup: {
            from: 'products',
            localField: 'items.productId',
            foreignField: '_id',
            as: 'product'
          }
        },
        {
          $unwind: '$product'
        },
        {
          $match: {
            'product.sellerId': new Types.ObjectId(sellerId),
            status: { $ne: 'cancelled' }
          }
        },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalSales: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
            totalQuantitySold: { $sum: '$items.quantity' }
          }
        }
      ]);

      const productData = productStats[0] || {
        productCount: 0,
        averageRating: 0,
        totalReviews: 0,
        totalViews: 0,
        totalPurchases: 0
      };

      const salesData = salesStats[0] || {
        totalOrders: 0,
        totalSales: 0,
        totalQuantitySold: 0
      };

      // Get all products for this seller
      const products = await Product.find({ sellerId: new Types.ObjectId(sellerId) })
        .select('_id name primaryImage price stock averageRating totalReviews status createdAt')
        .populate('categoryId', 'name slug')
        .sort({ createdAt: -1 })
        .lean();

      // Format products for frontend
      const formattedProducts = products.map((product: any) => ({
        id: product._id.toString(),
        name: product.name,
        primaryImage: product.primaryImage,
        price: product.price,
        stock: product.stock,
        averageRating: product.averageRating || 0,
        totalReviews: product.totalReviews || 0,
        status: product.status,
        category: {
          id: (product.categoryId as any)?._id?.toString(),
          name: (product.categoryId as any)?.name || 'N/A',
          slug: (product.categoryId as any)?.slug
        },
        createdAt: product.createdAt
      }));

      return {
        ...seller,
        id: seller._id.toString(),
        company: {
          name: seller.sellerProfile?.storeName || 'N/A',
          description: seller.sellerProfile?.storeDescription,
          address: seller.sellerProfile?.address,
          city: seller.sellerProfile?.city,
          province: seller.sellerProfile?.province,
          postalCode: seller.sellerProfile?.postalCode,
          productTypes: seller.sellerProfile?.productTypes,
          experience: seller.sellerProfile?.experience
        },
        contact: {
          name: `${seller.firstName || ''} ${seller.lastName || ''}`.trim() || seller.email,
          firstName: seller.firstName,
          lastName: seller.lastName,
          email: seller.email,
          phone: seller.phone
        },
        statistics: {
          productCount: productData.productCount,
          averageRating: Math.round(productData.averageRating * 10) / 10,
          totalReviews: productData.totalReviews,
          totalViews: productData.totalViews,
          totalPurchases: productData.totalPurchases,
          totalOrders: salesData.totalOrders,
          totalSales: Math.round(salesData.totalSales * 100) / 100,
          totalQuantitySold: salesData.totalQuantitySold
        },
        products: formattedProducts,
        status: seller.status
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : Messages.ADMIN_SELLER.FETCH_FAILED);
    }
  }

  // Create seller
  static async createSeller(sellerData: any): Promise<any> {
    try {
      // Check if email already exists
      const existingUser = await User.findOne({ email: sellerData.email });
      if (existingUser) {
        throw new Error('Email already exists');
      }

      // Create seller profile
      const sellerProfile = {
        storeName: sellerData.storeName || sellerData.businessName,
        storeDescription: sellerData.storeDescription || sellerData.businessDescription,
        address: sellerData.address,
        city: sellerData.city,
        province: sellerData.province,
        postalCode: sellerData.postalCode,
        productTypes: sellerData.productTypes || sellerData.businessType,
        experience: sellerData.experience
      };

      // Create user with seller role
      const seller = new User({
        firstName: sellerData.firstName,
        lastName: sellerData.lastName,
        email: sellerData.email,
        phone: sellerData.phone,
        role: 'seller',
        status: sellerData.status || 'inactive', // Default to pending
        sellerProfile,
        password: sellerData.password || 'TempPassword123!' // Should be changed on first login
      });

      await seller.save();

      // Return created seller with populated data
      return await this.getSellerById(seller._id.toString());
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : Messages.ADMIN_SELLER.CREATE_FAILED);
    }
  }

  // Update seller
  static async updateSeller(sellerId: string, updateData: any): Promise<any> {
    try {
      const seller = await User.findOne({ _id: sellerId, role: 'seller' });

      if (!seller) {
        throw new Error('Seller not found');
      }

      // Update basic fields
      if (updateData.firstName) seller.firstName = updateData.firstName;
      if (updateData.lastName) seller.lastName = updateData.lastName;
      if (updateData.email) seller.email = updateData.email;
      if (updateData.phone) seller.phone = updateData.phone;
      if (updateData.status) seller.status = updateData.status;

      // Initialize sellerProfile if it doesn't exist
      if (!seller.sellerProfile) {
        seller.sellerProfile = {
          storeName: '',
          storeDescription: '',
          address: '',
          city: '',
          province: '',
          postalCode: '',
          productTypes: '',
          experience: ''
        } as any;
      }

      const profile = seller.sellerProfile as any;

      // Update seller profile
      if (updateData.storeName || updateData.businessName) {
        profile.storeName = updateData.storeName || updateData.businessName;
      }
      if (updateData.storeDescription || updateData.businessDescription) {
        profile.storeDescription = updateData.storeDescription || updateData.businessDescription;
      }
      if (updateData.address) {
        profile.address = updateData.address;
      }
      if (updateData.city) {
        profile.city = updateData.city;
      }
      if (updateData.province) {
        profile.province = updateData.province;
      }
      if (updateData.postalCode) {
        profile.postalCode = updateData.postalCode;
      }
      if (updateData.productTypes || updateData.businessType) {
        profile.productTypes = updateData.productTypes || updateData.businessType;
      }
      if (updateData.experience) {
        profile.experience = updateData.experience;
      }

      await seller.save();

      // Return updated seller with populated data
      return await this.getSellerById(sellerId);
    } catch (error) {
      throw new Error(
        `Failed to update seller: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Update seller status (approve/reject)
  static async updateSellerStatus(
    sellerId: string,
    status: 'active' | 'inactive' | 'suspended'
  ): Promise<any> {
    try {
      const seller = await User.findOne({ _id: sellerId, role: 'seller' });

      if (!seller) {
        throw new Error('Seller not found');
      }

      seller.status = status;
      await seller.save();

      // Return updated seller with populated data
      return await this.getSellerById(sellerId);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : Messages.ADMIN_SELLER.UPDATE_FAILED);
    }
  }
}

