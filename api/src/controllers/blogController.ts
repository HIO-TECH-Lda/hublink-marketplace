import { Request, Response } from 'express';
import { BlogService } from '../services/blogService';
import Messages from '../utils/messages';

export class BlogController {
  // Get published posts (public)
  static async getPublishedPosts(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        search: req.query.search as string | undefined,
        category: req.query.category as string | undefined,
        isFeatured: req.query.isFeatured === 'true' ? true : undefined,
        tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        sortBy: req.query.sortBy as string | undefined,
        sortOrder: req.query.sortOrder as 'asc' | 'desc' | undefined
      };

      const result = await BlogService.getPublishedPosts(filters);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.BLOG.FETCH_FAILED
      });
    }
  }

  // Get post by slug (public)
  static async getPostBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const post = await BlogService.getPostBySlug(slug);

      // Get related posts
      const relatedPosts = await BlogService.getRelatedPosts(post.id, post.category, 3);

      res.json({
        success: true,
        data: {
          ...post,
          relatedPosts
        }
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('não encontrado') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.BLOG.FETCH_FAILED
      });
    }
  }

  // Get categories (public)
  static async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await BlogService.getCategories();
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

  // Get tags (public)
  static async getTags(req: Request, res: Response): Promise<void> {
    try {
      const tags = await BlogService.getTags();
      res.json({
        success: true,
        data: tags
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.BLOG.FETCH_FAILED
      });
    }
  }
}

