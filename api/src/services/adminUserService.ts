import User, { IUserDocument } from '../models/User';
import Order from '../models/Order';
import Payment from '../models/Payment';
import Review from '../models/Review';
import mongoose, { Types } from 'mongoose';
import Messages from '../utils/messages';
import { AuthService } from './authService';
import { PASSWORD_PATTERN } from '../utils/validation';

export interface UserListFilters {
  search?: string;
  status?: 'active' | 'inactive' | 'suspended';
  role?: 'buyer' | 'seller' | 'admin' | 'support';
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserWithStats extends IUserDocument {
  orderCount: number;
  totalSpent: number;
  lastLogin?: Date;
}

export interface UserStats {
  total: number;
  vendors: number;
  clients: number;
  active: number;
}

export class AdminUserService {
  // Get user statistics
  static async getUserStats(): Promise<UserStats> {
    try {
      const [total, vendors, clients, active] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: 'seller' }),
        User.countDocuments({ role: 'buyer' }),
        User.countDocuments({ status: 'active' })
      ]);

      return {
        total,
        vendors,
        clients,
        active
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : Messages.ADMIN_USER.STATS_FAILED);
    }
  }

  // Get all users with filters and pagination
  static async getUsers(filters: UserListFilters = {}): Promise<{
    users: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const {
        search,
        status,
        role,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = filters;

      // Build query
      const query: any = {};

      // Search filter (name, email, phone)
      if (search) {
        query.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ];
      }

      // Status filter
      if (status) {
        query.status = status;
      }

      // Role filter
      if (role) {
        query.role = role;
      }

      // Calculate pagination
      const skip = (page - 1) * limit;
      const sort: any = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

      // Get total count
      const total = await User.countDocuments(query);

      // Get users
      const users = await User.find(query)
        .select('-password')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();

      // Get order stats for each user
      const userIds = users.map((u: any) => u._id);
      const orderStats = await Order.aggregate([
        {
          $match: {
            userId: { $in: userIds },
            status: { $ne: 'cancelled' }
          }
        },
        {
          $group: {
            _id: '$userId',
            orderCount: { $sum: 1 },
            totalSpent: { $sum: '$total' }
          }
        }
      ]);

      // Create a map for quick lookup
      const statsMap = new Map(
        orderStats.map((stat: any) => [
          stat._id.toString(),
          { orderCount: stat.orderCount, totalSpent: stat.totalSpent }
        ])
      );

      // Get last login from Payment (approximation - last payment date)
      const lastPaymentMap = new Map();
      const lastPayments = await Payment.aggregate([
        {
          $match: {
            userId: { $in: userIds }
          }
        },
        {
          $sort: { createdAt: -1 }
        },
        {
          $group: {
            _id: '$userId',
            lastPayment: { $first: '$createdAt' }
          }
        }
      ]);

      lastPayments.forEach((payment: any) => {
        lastPaymentMap.set(payment._id.toString(), payment.lastPayment);
      });

      // Combine user data with stats
      const usersWithStats = users.map((user: any) => {
        const stats = statsMap.get(user._id.toString()) || { orderCount: 0, totalSpent: 0 };
        const lastLogin = lastPaymentMap.get(user._id.toString());

        return {
          ...user,
          id: user._id.toString(),
          orderCount: stats.orderCount,
          totalSpent: stats.totalSpent,
          lastLogin: lastLogin || user.updatedAt
        };
      });

      return {
        users: usersWithStats,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : Messages.ADMIN_USER.LIST_FAILED);
    }
  }

  // Get sellers list for dropdown
  static async getSellers(): Promise<any[]> {
    try {
      const sellers = await User.find({ role: 'seller', status: 'active' })
        .select('_id firstName lastName email sellerProfile')
        .sort({ 'sellerProfile.storeName': 1, firstName: 1 })
        .lean();

      return sellers.map((seller: any) => ({
        id: seller._id.toString(),
        name: seller.sellerProfile?.storeName || 
              `${seller.firstName || ''} ${seller.lastName || ''}`.trim() || 
              seller.email,
        email: seller.email,
        storeName: seller.sellerProfile?.storeName || null,
        fullName: `${seller.firstName || ''} ${seller.lastName || ''}`.trim() || seller.email
      }));
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : Messages.ADMIN_USER.SELLERS_FAILED);
    }
  }

  // Get user by ID with full details
  static async getUserById(userId: string): Promise<any> {
    try {
      const user = await User.findById(userId).select('-password').lean();

      if (!user) {
        throw new Error('User not found');
      }

      // Get comprehensive order statistics
      const orderStats = await Order.aggregate([
        {
          $match: {
            userId: new Types.ObjectId(userId),
            status: { $ne: 'cancelled' }
          }
        },
        {
          $group: {
            _id: null,
            orderCount: { $sum: 1 },
            totalSpent: { $sum: '$total' },
            deliveredCount: {
              $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
            }
          }
        }
      ]);

      const stats = orderStats[0] || { orderCount: 0, totalSpent: 0, deliveredCount: 0 };

      // Get review statistics
      const reviewStats = await Review.aggregate([
        {
          $match: {
            userId: new Types.ObjectId(userId),
            status: 'approved'
          }
        },
        {
          $group: {
            _id: null,
            totalReviews: { $sum: 1 },
            averageRating: { $avg: '$rating' }
          }
        }
      ]);

      const reviewData = reviewStats[0] || { totalReviews: 0, averageRating: 0 };

      // Get last login (from last payment)
      const lastPayment = await Payment.findOne({ userId })
        .sort({ createdAt: -1 })
        .select('createdAt')
        .lean();

      // Get recent orders (last 10)
      const recentOrders = await Order.find({ userId: new Types.ObjectId(userId) })
        .sort({ createdAt: -1 })
        .limit(10)
        .select('orderNumber items sellerName total status createdAt')
        .lean();

      // Get recent reviews (last 10)
      const recentReviews = await Review.find({ userId: new Types.ObjectId(userId) })
        .populate('productId', 'name primaryImage')
        .sort({ createdAt: -1 })
        .limit(10)
        .select('productId rating title content createdAt')
        .lean();

      // Format orders for frontend
      const formattedOrders = recentOrders.map((order: any) => ({
        id: order._id.toString(),
        orderNumber: order.orderNumber,
        vendor: order.items[0]?.sellerName || 'N/A',
        itemCount: order.items.length,
        amount: order.total,
        status: order.status,
        date: order.createdAt
      }));

      // Format reviews for frontend
      const formattedReviews = recentReviews.map((review: any) => ({
        id: review._id.toString(),
        productName: review.productId?.name || 'Product Deleted',
        productImage: review.productId?.primaryImage,
        rating: review.rating,
        title: review.title,
        comment: review.content,
        date: review.createdAt
      }));

      // Activity timeline
      const activities = [
        {
          type: 'last_login',
          label: 'Último login',
          date: lastPayment?.createdAt || user.updatedAt || new Date(),
          color: 'green'
        },
        {
          type: 'account_created',
          label: 'Conta criada',
          date: user.createdAt || new Date(),
          color: 'blue'
        },
        {
          type: 'last_update',
          label: 'Última atualização',
          date: user.updatedAt || new Date(),
          color: 'purple'
        }
      ].sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      });

      return {
        ...user,
        id: user._id.toString(),
        // Summary statistics
        statistics: {
          totalOrders: stats.orderCount,
          deliveredOrders: stats.deliveredCount,
          totalSpent: stats.totalSpent,
          averageRating: Math.round(reviewData.averageRating * 10) / 10,
          totalReviews: reviewData.totalReviews
        },
        // Detailed data
        orders: formattedOrders,
        reviews: formattedReviews,
        activities: activities,
        // Legacy fields for backward compatibility
        orderCount: stats.orderCount,
        totalSpent: stats.totalSpent,
        lastLogin: lastPayment?.createdAt || user.updatedAt
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : Messages.ADMIN_USER.FETCH_FAILED);
    }
  }

  // Create new user (admin only)
  static async createUser(userData: {
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
    password: string;
    role?: 'buyer' | 'seller' | 'admin' | 'support';
    status?: 'active' | 'inactive' | 'suspended';
  }): Promise<IUserDocument> {
    try {
      const cleanEmail = userData.email?.trim().toLowerCase();
      const cleanPhone = AuthService.normalizePhone(userData.phone);

      // Validate password
      const trimmedPassword = userData.password?.trim();
      if (!trimmedPassword || trimmedPassword.length < 8) {
        throw new Error('A senha deve ter pelo menos 8 caracteres');
      }
      if (!PASSWORD_PATTERN.test(trimmedPassword)) {
        throw new Error(
          'A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial'
        );
      }

      // Check if user already exists
      const orConditions: any[] = [{ phone: cleanPhone }];
      if (cleanEmail) {
        orConditions.push({ email: cleanEmail });
      }

      const existingUser = await User.findOne({ $or: orConditions });

      if (existingUser) {
        if (cleanEmail && existingUser.email === cleanEmail) {
          throw new Error(Messages.ADMIN_USER.EMAIL_EXISTS);
        }
        if (existingUser.phone === cleanPhone) {
          throw new Error(Messages.ADMIN_USER.PHONE_EXISTS);
        }
        throw new Error(Messages.AUTH.EMAIL_PHONE_EXISTS);
      }

      // Create user
      const userToCreate: any = {
        ...userData,
        phone: cleanPhone,
        password: trimmedPassword,
        role: userData.role || 'buyer',
        status: userData.status || 'active'
      };

      if (cleanEmail) {
        userToCreate.email = cleanEmail;
      } else {
        delete userToCreate.email;
      }

      const user = new User(userToCreate);
      await user.save();

      return user;
    } catch (error) {
      throw new Error(
        `Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Update user
  static async updateUser(
    userId: string,
    updateData: {
      firstName?: string;
      lastName?: string;
      email?: string | null;
      phone?: string;
      password?: string;
      role?: 'buyer' | 'seller' | 'admin' | 'support';
      status?: 'active' | 'inactive' | 'suspended';
      emailVerified?: boolean;
      phoneVerified?: boolean;
    }
  ): Promise<IUserDocument> {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      const safeData = { ...updateData } as any;

      // Handle password update & sanitization
      if ('password' in safeData) {
        if (typeof safeData.password === 'string' && safeData.password.trim() !== '') {
          const trimmedPassword = safeData.password.trim();
          if (trimmedPassword.length < 8) {
            throw new Error('A senha deve ter pelo menos 8 caracteres');
          }
          if (!PASSWORD_PATTERN.test(trimmedPassword)) {
            throw new Error(
              'A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial'
            );
          }
          user.password = trimmedPassword;
        }
        // Remove password from safeData so Object.assign does not overwrite with raw or blank string
        delete safeData.password;
      }

      // Check and normalize email update
      if ('email' in safeData) {
        if (typeof safeData.email === 'string' && safeData.email.trim() !== '') {
          const cleanEmail = safeData.email.trim().toLowerCase();
          if (cleanEmail !== user.email) {
            const existingUser = await User.findOne({
              email: cleanEmail,
              _id: { $ne: userId }
            });
            if (existingUser) {
              throw new Error(Messages.ADMIN_USER.EMAIL_EXISTS);
            }
            safeData.email = cleanEmail;
          }
        } else {
          // If explicitly set to empty or null, unset email so sparse index doesn't conflict
          delete safeData.email;
          user.email = undefined;
          await User.updateOne({ _id: userId }, { $unset: { email: 1 } });
        }
      }

      // Check and normalize phone update
      if ('phone' in safeData && safeData.phone) {
        const cleanPhone = AuthService.normalizePhone(safeData.phone);
        if (cleanPhone !== user.phone) {
          const existingUser = await User.findOne({
            phone: cleanPhone,
            _id: { $ne: userId }
          });
          if (existingUser) {
            throw new Error(Messages.ADMIN_USER.PHONE_EXISTS);
          }
          safeData.phone = cleanPhone;
        }
      }

      // Update remaining user fields
      Object.assign(user, safeData);
      await user.save();

      return user;
    } catch (error) {
      throw new Error(
        `Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Update user status
  static async updateUserStatus(
    userId: string,
    status: 'active' | 'inactive' | 'suspended'
  ): Promise<IUserDocument> {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { status },
        { new: true, runValidators: true }
      );

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : Messages.ADMIN_USER.UPDATE_FAILED);
    }
  }

  // Delete user
  static async deleteUser(userId: string): Promise<void> {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      // Check if user has orders
      const orderCount = await Order.countDocuments({ userId });
      if (orderCount > 0) {
        throw new Error('Cannot delete user with existing orders. Consider suspending instead.');
      }

      await User.findByIdAndDelete(userId);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : Messages.ADMIN_USER.DELETE_FAILED);
    }
  }
}

