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
      // Check if body is empty (might indicate form data not parsed)
      if (!req.body || Object.keys(req.body).length === 0) {
        res.status(400).json({
          success: false,
          message: 'Request body is empty. Ensure Content-Type is set correctly (application/x-www-form-urlencoded or multipart/form-data)'
        });
        return;
      }

      // Handle file upload from multer (if present)
      if ((req as any).file) {
        // Convert file buffer to base64
        const file = (req as any).file;
        const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        req.body.image = base64;
      }

      // Parse form data (strings need to be converted)
      const postData: any = {
        ...req.body
      };

      // Remove empty strings and convert to undefined for optional fields
      Object.keys(postData).forEach(key => {
        if (postData[key] === '' && key !== 'content' && key !== 'excerpt') {
          delete postData[key];
        }
      });

      // Parse tags if it's a string (from form data)
      if (postData.tags) {
        if (typeof postData.tags === 'string') {
          try {
            postData.tags = JSON.parse(postData.tags);
          } catch {
            // If not JSON, split by comma
            postData.tags = postData.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean);
          }
        }
        // Ensure it's an array
        if (!Array.isArray(postData.tags)) {
          postData.tags = [];
        }
      }

      // Parse SEO if it's a string (from form data)
      if (postData.seo) {
        if (typeof postData.seo === 'string') {
          try {
            postData.seo = JSON.parse(postData.seo);
          } catch {
            // If parsing fails, ignore SEO
            delete postData.seo;
          }
        }
      }

      // Convert boolean strings to booleans
      if (postData.isFeatured !== undefined) {
        postData.isFeatured = postData.isFeatured === 'true' || postData.isFeatured === true;
      }

      // Convert status if needed
      if (postData.status && typeof postData.status === 'string') {
        postData.status = postData.status.toLowerCase();
      }

      // Ensure required fields are present
      if (!postData.title || !postData.content || !postData.authorId || !postData.authorName || !postData.category) {
        res.status(400).json({
          success: false,
          message: 'Missing required fields: title, content, authorId, authorName, and category are required'
        });
        return;
      }

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
      
      // Handle file upload from multer (if present)
      if ((req as any).file) {
        // Convert file buffer to base64
        const file = (req as any).file;
        const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        req.body.image = base64;
      }

      // Parse form data (strings need to be converted)
      const updateData: any = {
        ...req.body
      };

      // Parse tags if it's a string (from form data)
      if (updateData.tags !== undefined) {
        if (typeof updateData.tags === 'string') {
          try {
            updateData.tags = JSON.parse(updateData.tags);
          } catch {
            // If not JSON, split by comma
            updateData.tags = updateData.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean);
          }
        }
      }

      // Parse SEO if it's a string (from form data)
      if (updateData.seo !== undefined) {
        if (typeof updateData.seo === 'string') {
          try {
            updateData.seo = JSON.parse(updateData.seo);
          } catch {
            // If parsing fails, ignore SEO
            delete updateData.seo;
          }
        }
      }

      // Convert boolean strings to booleans
      if (updateData.isFeatured !== undefined) {
        updateData.isFeatured = updateData.isFeatured === 'true' || updateData.isFeatured === true;
      }

      // Convert status if needed
      if (updateData.status && typeof updateData.status === 'string') {
        updateData.status = updateData.status.toLowerCase();
      }

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

  // Toggle featured status
  static async toggleFeatured(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;
      const { isFeatured } = req.body;

      if (typeof isFeatured !== 'boolean') {
        res.status(400).json({
          success: false,
          message: 'isFeatured must be a boolean value (true or false)'
        });
        return;
      }

      const post = await AdminBlogService.toggleFeatured(postId, isFeatured);
      res.json({
        success: true,
        message: `Post ${isFeatured ? 'marked as featured' : 'unmarked as featured'} successfully`,
        data: post
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Post not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update featured status'
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

