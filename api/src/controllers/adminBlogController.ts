import { Request, Response } from 'express';
import { AdminBlogService } from '../services/adminBlogService';

export class AdminBlogController {
  // Get blog statistics
  static async getBlogStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await AdminBlogService.getBlogStats();
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get blog statistics'
      });
    }
  }

  // Get all posts with filters
  static async getPosts(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        search: req.query.search as string | undefined,
        category: req.query.category as string | undefined,
        status: req.query.status as 'draft' | 'published' | 'archived' | undefined,
        authorId: req.query.authorId as string | undefined,
        isFeatured: req.query.isFeatured === 'true' ? true : undefined,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        sortBy: req.query.sortBy as string | undefined,
        sortOrder: req.query.sortOrder as 'asc' | 'desc' | undefined
      };

      const result = await AdminBlogService.getPosts(filters);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get posts'
      });
    }
  }

  // Get post by ID
  static async getPostById(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;
      const post = await AdminBlogService.getPostById(postId);
      res.json({
        success: true,
        data: post
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Post not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get post'
      });
    }
  }

  // Create post
  static async createPost(req: Request, res: Response): Promise<void> {
    try {
      const postData = req.body;
      const post = await AdminBlogService.createPost(postData);
      res.status(201).json({
        success: true,
        message: 'Post created successfully',
        data: post
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('already exists') ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create post'
      });
    }
  }

  // Update post
  static async updatePost(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;
      const updateData = req.body;
      const post = await AdminBlogService.updatePost(postId, updateData);
      res.json({
        success: true,
        message: 'Post updated successfully',
        data: post
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Post not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update post'
      });
    }
  }

  // Update post status
  static async updatePostStatus(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;
      const { status } = req.body;

      if (!status || !['draft', 'published', 'archived'].includes(status)) {
        res.status(400).json({
          success: false,
          message: 'Invalid status. Must be one of: draft, published, archived'
        });
        return;
      }

      const post = await AdminBlogService.updatePostStatus(
        postId,
        status as 'draft' | 'published' | 'archived'
      );
      res.json({
        success: true,
        message: 'Post status updated successfully',
        data: post
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Post not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update post status'
      });
    }
  }

  // Delete post
  static async deletePost(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;
      await AdminBlogService.deletePost(postId);
      res.json({
        success: true,
        message: 'Post deleted successfully'
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Post not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete post'
      });
    }
  }

  // Get categories
  static async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await AdminBlogService.getCategories();
      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get categories'
      });
    }
  }
}

