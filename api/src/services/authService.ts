import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User, { IUserDocument } from '../models/User';
import { JWTPayload } from '../types';
import Messages from '../utils/messages';
import { uploadBase64Image } from '../utils/cloudinary';

export class AuthService {
  // Generate JWT token
  static generateToken(user: IUserDocument): string {
    const payload: JWTPayload = {
      userId: (user._id as any).toString(),
      email: user.email,
      phone: user.phone,
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
      phone: user.phone,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      sellerId: user.sellerId?.toString()
    };

    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
    } as jwt.SignOptions);
  }

  // Helper to normalize Mozambican phone numbers to international format +258XXXXXXXXX
  static normalizePhone(phone: string): string {
    const clean = phone.trim().replace(/[\s\-]/g, '');
    if (/^[0-9]{9}$/.test(clean)) {
      return `+258${clean}`;
    }
    if (clean.startsWith('258') && clean.length === 12) {
      return `+${clean}`;
    }
    return clean;
  }

  // Verify user credentials by email or phone (accepts with or without +258)
  static async verifyCredentials(identifier: string, password: string): Promise<IUserDocument | null> {
    try {
      const cleanIdentifier = identifier.trim();
      const isEmail = cleanIdentifier.includes('@');

      const orConditions: any[] = [];

      if (isEmail) {
        orConditions.push({ email: cleanIdentifier.toLowerCase() });
      } else {
        const normalizedDigits = cleanIdentifier.replace(/[\s\-]/g, '');
        const candidatePhones = new Set<string>([cleanIdentifier, normalizedDigits]);

        if (normalizedDigits.startsWith('+258')) {
          const local = normalizedDigits.slice(4);
          candidatePhones.add(local);
          candidatePhones.add('258' + local);
        } else if (normalizedDigits.startsWith('258') && normalizedDigits.length === 12) {
          const local = normalizedDigits.slice(3);
          candidatePhones.add(local);
          candidatePhones.add('+258' + local);
        } else if (/^[0-9]{9}$/.test(normalizedDigits)) {
          candidatePhones.add('+258' + normalizedDigits);
          candidatePhones.add('258' + normalizedDigits);
        }

        orConditions.push({ phone: { $in: Array.from(candidatePhones) } });
      }

      // Find user by either email (case-insensitive) or any phone representation
      const user = await User.findOne({
        $or: orConditions
      }).select('+password');
      
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
    email?: string;
    phone: string;
    password: string;
    role?: string;
    sellerProfile?: {
      storeName: string;
      storeDescription: string;
      address: string;
      city: string;
      province: string;
      postalCode: string;
      productTypes: string;
      experience?: string;
    };
  }): Promise<{ user: IUserDocument; token: string }> {
    try {
      const cleanEmail = userData.email?.trim().toLowerCase();
      const cleanPhone = this.normalizePhone(userData.phone);

      const orConditions: any[] = [{ phone: cleanPhone }];
      if (cleanEmail) {
        orConditions.push({ email: cleanEmail });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ $or: orConditions });

      if (existingUser) {
        if (cleanEmail && existingUser.email === cleanEmail) {
          throw new Error(Messages.AUTH.EMAIL_ALREADY_EXISTS);
        }
        throw new Error(Messages.AUTH.PHONE_ALREADY_EXISTS);
      }

      // Prepare user data
      const userToCreate: any = {
        ...userData,
        phone: cleanPhone,
        role: userData.role || 'buyer'
      };

      if (cleanEmail) {
        userToCreate.email = cleanEmail;
      } else {
        delete userToCreate.email;
      }

      // Create new user
      const user = new User(userToCreate);

      await user.save();

      // Generate token
      const token = this.generateToken(user);

      return { user, token };
    } catch (error) {
      throw error;
    }
  }

  // Login user with email or phone
  static async loginUser(identifier: string, password: string): Promise<{ user: IUserDocument; token: string; refreshToken: string }> {
    try {
      const user = await this.verifyCredentials(identifier, password);
      
      if (!user) {
        throw new Error(Messages.AUTH.INVALID_CREDENTIALS);
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
        throw new Error('User not found or inactive');
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
  static async updateUserProfile(userId: string, updateData: Partial<IUserDocument> & { email?: string }): Promise<IUserDocument | null> {
    try {
      // Remove sensitive fields that shouldn't be updated directly
      const { password, role, status, ...safeUpdateData } = updateData as any;

      // Check and handle email update
      if ('email' in safeUpdateData) {
        if (safeUpdateData.email && safeUpdateData.email.trim()) {
          const cleanEmail = safeUpdateData.email.trim().toLowerCase();
          const existingUserWithEmail = await User.findOne({
            email: cleanEmail,
            _id: { $ne: userId }
          });

          if (existingUserWithEmail) {
            throw new Error(Messages.AUTH.EMAIL_ALREADY_EXISTS);
          }
          safeUpdateData.email = cleanEmail;
        } else {
          // If explicitly set to empty or null, unset email so sparse index doesn't conflict
          delete safeUpdateData.email;
          await User.findByIdAndUpdate(userId, { $unset: { email: 1 } });
        }
      }

      // Check and handle phone update
      if ('phone' in safeUpdateData && safeUpdateData.phone) {
        const cleanPhone = this.normalizePhone(safeUpdateData.phone);
        const existingUserWithPhone = await User.findOne({
          phone: cleanPhone,
          _id: { $ne: userId }
        });

        if (existingUserWithPhone) {
          throw new Error(Messages.AUTH.PHONE_ALREADY_EXISTS);
        }
        safeUpdateData.phone = cleanPhone;
      }

      // Upload avatar to Cloudinary if provided (base64 or file data)
      if (safeUpdateData.avatar) {
        const uploaded = await uploadBase64Image(safeUpdateData.avatar, 'avatars');
        safeUpdateData.avatar = uploaded.url;
      }

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
        throw new Error(Messages.USER.NOT_FOUND);
      }

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      
      if (!isCurrentPasswordValid) {
        throw new Error(Messages.AUTH.CURRENT_PASSWORD_INCORRECT);
      }

      // Update password
      user.password = newPassword;
      await user.save();

      return true;
    } catch (error) {
      throw error;
    }
  }

  // Request password reset
  static async requestPasswordReset(email: string): Promise<{ user: IUserDocument; resetToken: string }> {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      
      if (!user) {
        // Don't reveal if email exists for security
        throw new Error('If the email exists, a reset link will be sent');
      }

      // Generate reset token
      const crypto = require('crypto');
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

      // Save hashed token and expiry
      user.passwordResetToken = resetTokenHash;
      user.passwordResetExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      await user.save();

      return { user, resetToken };
    } catch (error) {
      throw error;
    }
  }

  // Reset password with token
  static async resetPassword(resetToken: string, newPassword: string): Promise<IUserDocument> {
    try {
      const crypto = require('crypto');
      const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

      const user = await User.findOne({
        passwordResetToken: resetTokenHash,
        passwordResetExpires: { $gt: new Date() }
      }).select('+password');

      if (!user) {
        throw new Error(Messages.AUTH.INVALID_RESET_TOKEN);
      }

      // Update password and clear reset token
      user.password = newPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      return user;
    } catch (error) {
      throw error;
    }
  }
}
