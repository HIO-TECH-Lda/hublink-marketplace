import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { AuditLogService } from '../services/auditLogService';
import { EmailService } from '../services/emailService';

export class AuthController {
  // Register new user
  static async register(req: Request, res: Response) {
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    try {
      const { confirmPassword, ...userData } = req.body;
      
      const result = await AuthService.registerUser(userData);
      
      // Log registration
      await AuditLogService.log({
        userId: result.user._id.toString(),
        userName: `${result.user.firstName || ''} ${result.user.lastName || ''}`.trim() || result.user.email,
        userEmail: result.user.email,
        userRole: result.user.role,
        action: 'create',
        entityType: 'user',
        entityId: result.user._id.toString(),
        entityName: result.user.email,
        description: `New user registered with role: ${result.user.role}`,
        metadata: {
          ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
          userAgent: req.headers['user-agent'],
          method: req.method,
          url: req.originalUrl,
          statusCode: 201
        }
      });
      
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
    const { email, password } = req.body;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    try {
      const result = await AuthService.loginUser(email, password);
      
      // Log successful login
      await AuditLogService.log({
        userId: result.user._id.toString(),
        userName: `${result.user.firstName || ''} ${result.user.lastName || ''}`.trim() || result.user.email,
        userEmail: result.user.email,
        userRole: result.user.role,
        action: 'read',
        entityType: 'auth',
        entityId: result.user._id.toString(),
        entityName: 'login',
        description: 'Successful login',
        metadata: {
          ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
          userAgent: req.headers['user-agent'],
          method: req.method,
          url: req.originalUrl,
          statusCode: 200
        }
      });
      
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
      
      // Log failed login attempt
      await AuditLogService.log({
        userId: undefined,
        userName: undefined,
        userEmail: email,
        userRole: undefined,
        action: 'read',
        entityType: 'auth',
        entityId: 'failed_login',
        entityName: 'login',
        description: `Failed login attempt for ${email}: ${error instanceof Error ? error.message : 'Invalid credentials'}`,
        metadata: {
          ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
          userAgent: req.headers['user-agent'],
          method: req.method,
          url: req.originalUrl,
          statusCode: 401
        }
      });
      
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
      
      // Log password change
      const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      await AuditLogService.log({
        userId: req.user!.userId,
        userName: `${req.user!.firstName || ''} ${req.user!.lastName || ''}`.trim() || req.user!.email,
        userEmail: req.user!.email,
        userRole: req.user!.role,
        action: 'update',
        entityType: 'auth',
        entityId: req.user!.userId,
        entityName: 'password',
        description: 'Password changed successfully',
        metadata: {
          ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
          userAgent: req.headers['user-agent'],
          method: req.method,
          url: req.originalUrl,
          statusCode: 200
        }
      });
      
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
    // Log logout if user is authenticated
    if ((req as any).user) {
      const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      await AuditLogService.log({
        userId: (req as any).user.userId,
        userName: `${(req as any).user.firstName || ''} ${(req as any).user.lastName || ''}`.trim() || (req as any).user.email,
        userEmail: (req as any).user.email,
        userRole: (req as any).user.role,
        action: 'read',
        entityType: 'auth',
        entityId: (req as any).user.userId,
        entityName: 'logout',
        description: 'User logged out',
        metadata: {
          ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
          userAgent: req.headers['user-agent'],
          method: req.method,
          url: req.originalUrl,
          statusCode: 200
        }
      });
    }
    
    return res.json({
      success: true,
      message: 'Logout successful'
    });
  }

  // Request password reset
  static async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    try {
      const result = await AuthService.requestPasswordReset(email);
      
      // Send password reset email
      await EmailService.sendPasswordReset(result.user, result.resetToken);
      
      // Log password reset request
      await AuditLogService.log({
        userId: result.user._id.toString(),
        userName: `${result.user.firstName || ''} ${result.user.lastName || ''}`.trim() || result.user.email,
        userEmail: result.user.email,
        userRole: result.user.role,
        action: 'update',
        entityType: 'auth',
        entityId: result.user._id.toString(),
        entityName: 'password_reset_request',
        description: 'Password reset requested',
        metadata: {
          ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
          userAgent: req.headers['user-agent'],
          method: req.method,
          url: req.originalUrl,
          statusCode: 200
        }
      });
      
      return res.json({
        success: true,
        message: 'If the email exists, a reset link will be sent'
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      
      // Log failed password reset attempt
      await AuditLogService.log({
        userId: undefined,
        userName: undefined,
        userEmail: email,
        userRole: undefined,
        action: 'update',
        entityType: 'auth',
        entityId: 'failed_password_reset',
        entityName: 'password_reset_request',
        description: `Password reset attempt for ${email}: ${error instanceof Error ? error.message : 'Failed'}`,
        metadata: {
          ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
          userAgent: req.headers['user-agent'],
          method: req.method,
          url: req.originalUrl,
          statusCode: 200 // Still return 200 to not reveal if email exists
        }
      });
      
      return res.json({
        success: true,
        message: 'If the email exists, a reset link will be sent'
      });
    }
  }

  // Reset password with token
  static async resetPassword(req: Request, res: Response) {
    const { token, newPassword } = req.body;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    try {
      const user = await AuthService.resetPassword(token, newPassword);
      
      // Log successful password reset
      await AuditLogService.log({
        userId: user._id.toString(),
        userName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
        userEmail: user.email,
        userRole: user.role,
        action: 'update',
        entityType: 'auth',
        entityId: user._id.toString(),
        entityName: 'password_reset_complete',
        description: 'Password reset completed successfully',
        metadata: {
          ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
          userAgent: req.headers['user-agent'],
          method: req.method,
          url: req.originalUrl,
          statusCode: 200
        }
      });
      
      return res.json({
        success: true,
        message: 'Password reset successful. You can now login with your new password.'
      });
    } catch (error) {
      console.error('Reset password error:', error);
      
      // Log failed password reset
      await AuditLogService.log({
        userId: undefined,
        userName: undefined,
        userEmail: undefined,
        userRole: undefined,
        action: 'update',
        entityType: 'auth',
        entityId: 'failed_password_reset',
        entityName: 'password_reset_complete',
        description: `Failed password reset attempt: ${error instanceof Error ? error.message : 'Invalid token'}`,
        metadata: {
          ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
          userAgent: req.headers['user-agent'],
          method: req.method,
          url: req.originalUrl,
          statusCode: 400
        }
      });
      
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
