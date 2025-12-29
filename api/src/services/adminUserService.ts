import User, { IUserDocument } from '../models/User';
import Order from '../models/Order';
import Payment from '../models/Payment';
import mongoose, { Types } from 'mongoose';

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
      throw new Error(
        `Failed to get user statistics: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
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
      throw new Error(
        `Failed to get users: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Get user by ID with full details
  static async getUserById(userId: string): Promise<any> {
    try {
      const user = await User.findById(userId).select('-password').lean();

      if (!user) {
        throw new Error('User not found');
      }

      // Get order statistics
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
            totalSpent: { $sum: '$total' }
          }
        }
      ]);

      const stats = orderStats[0] || { orderCount: 0, totalSpent: 0 };

      // Get last login (from last payment)
      const lastPayment = await Payment.findOne({ userId })
        .sort({ createdAt: -1 })
        .select('createdAt')
        .lean();

      return {
        ...user,
        id: user._id.toString(),
        orderCount: stats.orderCount,
        totalSpent: stats.totalSpent,
        lastLogin: lastPayment?.createdAt || user.updatedAt
      };
    } catch (error) {
      throw new Error(
        `Failed to get user: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Create new user (admin only)
  static async createUser(userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    role?: 'buyer' | 'seller' | 'admin' | 'support';
    status?: 'active' | 'inactive' | 'suspended';
  }): Promise<IUserDocument> {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email: userData.email }, { phone: userData.phone }]
      });

      if (existingUser) {
        throw new Error('User with this email or phone already exists');
      }

      // Create user
      const user = new User({
        ...userData,
        role: userData.role || 'buyer',
        status: userData.status || 'active'
      });

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
      email?: string;
      phone?: string;
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

      // Check if email/phone is being changed and already exists
      if (updateData.email && updateData.email !== user.email) {
        const existingUser = await User.findOne({ email: updateData.email });
        if (existingUser) {
          throw new Error('Email already in use');
        }
      }

      if (updateData.phone && updateData.phone !== user.phone) {
        const existingUser = await User.findOne({ phone: updateData.phone });
        if (existingUser) {
          throw new Error('Phone number already in use');
        }
      }

      // Update user
      Object.assign(user, updateData);
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
      throw new Error(
        `Failed to update user status: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
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
      throw new Error(
        `Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

