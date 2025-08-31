import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User, { IUserDocument } from '../models/User';
import { JWTPayload } from '../types';

export class AuthService {
  // Generate JWT token
  static generateToken(user: IUserDocument): string {
    const payload: JWTPayload = {
      userId: (user._id as any).toString(),
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      sellerId: user.sellerId?.toString()
    };

    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    } as jwt.SignOptions);
  }

  // Generate refresh token
  static generateRefreshToken(user: IUserDocument): string {
    const payload: JWTPayload = {
      userId: (user._id as any).toString(),
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      sellerId: user.sellerId?.toString()
    };

    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
    } as jwt.SignOptions);
  }

  // Verify user credentials
  static async verifyCredentials(email: string, password: string): Promise<IUserDocument | null> {
    try {
      // Find user by email and include password for comparison
      const user = await User.findOne({ email }).select('+password');
      
      if (!user) {
        return null;
      }

      // Check if user is active
      if (user.status !== 'active') {
        return null;
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      
      if (!isPasswordValid) {
        return null;
      }

      return user;
    } catch (error) {
      console.error('Error verifying credentials:', error);
      return null;
    }
  }

  // Register new user
  static async registerUser(userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    role?: string;
  }): Promise<{ user: IUserDocument; token: string }> {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email: userData.email }, { phone: userData.phone }]
      });

      if (existingUser) {
        throw new Error('User with this email or phone already exists');
      }

      // Create new user
      const user = new User({
        ...userData,
        role: userData.role || 'buyer'
      });

      await user.save();

      // Generate token
      const token = this.generateToken(user);

      return { user, token };
    } catch (error) {
      throw error;
    }
  }

  // Login user
  static async loginUser(email: string, password: string): Promise<{ user: IUserDocument; token: string; refreshToken: string }> {
    try {
      const user = await this.verifyCredentials(email, password);
      
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Generate tokens
      const token = this.generateToken(user);
      const refreshToken = this.generateRefreshToken(user);

      return { user, token, refreshToken };
    } catch (error) {
      throw error;
    }
  }

  // Refresh token
  static async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as JWTPayload;
      
      const user = await User.findById(decoded.userId);
      
      if (!user || user.status !== 'active') {
        throw new Error('Invalid refresh token');
      }

      // Generate new tokens
      const newToken = this.generateToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      return { token: newToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  // Get user by ID
  static async getUserById(userId: string): Promise<IUserDocument | null> {
    try {
      return await User.findById(userId);
    } catch (error) {
      return null;
    }
  }

  // Update user profile
  static async updateUserProfile(userId: string, updateData: Partial<IUserDocument>): Promise<IUserDocument | null> {
    try {
      // Remove sensitive fields that shouldn't be updated directly
      const { password, email, role, status, ...safeUpdateData } = updateData;
      
      const user = await User.findByIdAndUpdate(
        userId,
        safeUpdateData,
        { new: true, runValidators: true }
      );

      return user;
    } catch (error) {
      throw error;
    }
  }

  // Change password
  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      const user = await User.findById(userId).select('+password');
      
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      user.password = newPassword;
      await user.save();

      return true;
    } catch (error) {
      throw error;
    }
  }
}
