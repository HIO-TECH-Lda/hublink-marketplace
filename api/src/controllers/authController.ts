import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { EmailService } from '../services/emailService';

export class AuthController {
  // Register new user
  static async register(req: Request, res: Response) {
    try {
      const { confirmPassword, ...userData } = req.body;
      
      const result = await AuthService.registerUser(userData);
      
      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: result.user,
          token: result.token
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed'
      });
    }
  }

  // Login user
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      
      const result = await AuthService.loginUser(email, password);
      
      return res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: result.user,
          token: result.token,
          refreshToken: result.refreshToken
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'Invalid credentials'
      });
    }
  }

  // Refresh token
  static async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      
      const result = await AuthService.refreshToken(refreshToken);
      
      return res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          token: result.token,
          refreshToken: result.refreshToken
        }
      });
    } catch (error) {
      console.error('Token refresh error:', error);
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }
  }

  // Get current user profile
  static async getProfile(req: Request, res: Response) {
    try {
      const user = await AuthService.getUserById(req.user!.userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      return res.json({
        success: true,
        message: 'User profile retrieved successfully',
        data: { user }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve user profile'
      });
    }
  }

  // Update user profile
  static async updateProfile(req: Request, res: Response) {
    try {
      const updatedUser = await AuthService.updateUserProfile(req.user!.userId, req.body);
      
      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      return res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { user: updatedUser }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update profile'
      });
    }
  }

  // Change password
  static async changePassword(req: Request, res: Response) {
    try {
      const { currentPassword, newPassword, confirmNewPassword } = req.body;
      
      await AuthService.changePassword(req.user!.userId, currentPassword, newPassword);
      
      return res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Change password error:', error);
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to change password'
      });
    }
  }

  // Logout (client-side token removal)
  static async logout(req: Request, res: Response) {
    return res.json({
      success: true,
      message: 'Logout successful'
    });
  }

  // Request password reset
  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const result = await AuthService.requestPasswordReset(email);
      
      // Send password reset email
      await EmailService.sendPasswordReset(result.user, result.resetToken);
      
      return res.json({
        success: true,
        message: 'If the email exists, a reset link will be sent'
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      return res.json({
        success: true,
        message: 'If the email exists, a reset link will be sent'
      });
    }
  }

  // Reset password with token
  static async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;
      const user = await AuthService.resetPassword(token, newPassword);
      
      return res.json({
        success: true,
        message: 'Password reset successful. You can now login with your new password.'
      });
    } catch (error) {
      console.error('Reset password error:', error);
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to reset password'
      });
    }
  }

  // Test protected route for buyers
  static async buyerTest(req: Request, res: Response) {
    return res.json({
      success: true,
      message: 'Buyer access granted',
      data: { user: req.user }
    });
  }

  // Test protected route for sellers
  static async sellerTest(req: Request, res: Response) {
    return res.json({
      success: true,
      message: 'Seller access granted',
      data: { user: req.user }
    });
  }

  // Test protected route for admins
  static async adminTest(req: Request, res: Response) {
    return res.json({
      success: true,
      message: 'Admin access granted',
      data: { user: req.user }
    });
  }
}
