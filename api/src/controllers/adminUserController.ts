import { Request, Response } from 'express';
import { AdminUserService } from '../services/adminUserService';

export class AdminUserController {
  // Get user statistics
  static async getUserStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await AdminUserService.getUserStats();

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch user statistics'
      });
    }
  }

  // Get all users with filters
  static async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const {
        search,
        status,
        role,
        page = '1',
        limit = '10',
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const filters = {
        search: search as string | undefined,
        status: status as 'active' | 'inactive' | 'suspended' | undefined,
        role: role as 'buyer' | 'seller' | 'admin' | 'support' | undefined,
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        sortBy: sortBy as string,
        sortOrder: (sortOrder as 'asc' | 'desc') || 'desc'
      };

      const result = await AdminUserService.getUsers(filters);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch users'
      });
    }
  }

  // Get user by ID
  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const user = await AdminUserService.getUserById(userId);

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'User not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch user'
      });
    }
  }

  // Create new user
  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { firstName, lastName, email, phone, password, role, status } = req.body;

      if (!firstName || !lastName || !email || !phone || !password) {
        res.status(400).json({
          success: false,
          message: 'Missing required fields: firstName, lastName, email, phone, password'
        });
        return;
      }

      const user = await AdminUserService.createUser({
        firstName,
        lastName,
        email,
        phone,
        password,
        role,
        status
      });

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: userResponse
      });
    } catch (error) {
      const statusCode =
        error instanceof Error && error.message.includes('already exists') ? 409 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create user'
      });
    }
  }

  // Update user
  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const updateData = req.body;

      const user = await AdminUserService.updateUser(userId, updateData);

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: userResponse
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'User not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update user'
      });
    }
  }

  // Update user status
  static async updateUserStatus(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { status } = req.body;

      if (!status || !['active', 'inactive', 'suspended'].includes(status)) {
        res.status(400).json({
          success: false,
          message: 'Invalid status. Must be: active, inactive, or suspended'
        });
        return;
      }

      const user = await AdminUserService.updateUserStatus(userId, status);

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      res.status(200).json({
        success: true,
        message: 'User status updated successfully',
        data: userResponse
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'User not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update user status'
      });
    }
  }

  // Delete user
  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      await AdminUserService.deleteUser(userId);

      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      const statusCode =
        error instanceof Error && error.message === 'User not found' ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete user'
      });
    }
  }
}

