import BlogPost from '../models/BlogPost';
import mongoose, { Types } from 'mongoose';
import Messages from '../utils/messages';

export interface BlogListFilters {
  search?: string;
  category?: string;
  status?: 'draft' | 'published' | 'archived';
  authorId?: string;
  isFeatured?: boolean;
  tags?: string[];
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class BlogService {
  // Get published posts (public)
  static async getPublishedPosts(filters: BlogListFilters = {}): Promise<{
    posts: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const {
        search,
        category,
        isFeatured,
        tags,
        page = 1,
        limit = 10,
        sortBy = 'publishedAt',
        sortOrder = 'desc'
      } = filters;

      const query: any = { status: 'published' };

      // Category filter
      if (category) {
        query.category = category;
      }

      // Featured filter
      if (isFeatured !== undefined) {
        query.isFeatured = isFeatured;
      }

      // Tags filter
      if (tags && tags.length > 0) {
        query.tags = { $in: tags };
      }

      // Search filter
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { excerpt: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } }
        ];
      }

      const skip = (page - 1) * limit;
      const sort: any = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

      const total = await BlogPost.countDocuments(query);

      const posts = await BlogPost.find(query)
        .select('-content') // Exclude full content from list
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();

      const formattedPosts = posts.map((post: any) => ({
        id: post._id.toString(),
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        image: post.image,
        authorName: post.authorName,
        category: post.category,
        tags: post.tags || [],
        publishedAt: post.publishedAt,
        isFeatured: post.isFeatured || false,
        stats: {
          views: post.stats?.views || 0,
          likes: post.stats?.likes || 0,
          shares: post.stats?.shares || 0
        },
        createdAt: post.createdAt
      }));

      return {
        posts: formattedPosts,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(
        `Failed to get published posts: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Get post by slug (public)
  static async getPostBySlug(slug: string): Promise<any> {
    try {
      const post = await BlogPost.findOne({ slug, status: 'published' })
        .populate('authorId', 'firstName lastName email avatar')
        .lean();

      if (!post) {
        throw new Error(Messages.BLOG.POST_NOT_FOUND);
      }

      // Increment view count
      await BlogPost.findByIdAndUpdate(post._id, {
        $inc: { 'stats.views': 1 }
      });

      const author = post.authorId as any;

      return {
        ...post,
        id: post._id.toString(),
        author: {
          id: author?._id?.toString() || author?.toString(),
          name: post.authorName,
          email: author?.email,
          avatar: author?.avatar
        },
        stats: {
          views: (post.stats?.views || 0) + 1, // Include the increment
          likes: post.stats?.likes || 0,
          shares: post.stats?.shares || 0
        }
      };
    } catch (error) {
      throw new Error(
        `Failed to get post: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Get related posts (public)
  static async getRelatedPosts(postId: string, category: string, limit: number = 3): Promise<any[]> {
    try {
      const posts = await BlogPost.find({
        _id: { $ne: new Types.ObjectId(postId) },
        status: 'published',
        category
      })
        .select('_id title slug excerpt image authorName category publishedAt stats')
        .sort({ publishedAt: -1 })
        .limit(limit)
        .lean();

      return posts.map((post: any) => ({
        id: post._id.toString(),
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        image: post.image,
        authorName: post.authorName,
        category: post.category,
        publishedAt: post.publishedAt,
        stats: {
          views: post.stats?.views || 0
        }
      }));
    } catch (error) {
      throw new Error(
        `Failed to get related posts: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Get categories list (public)
  static async getCategories(): Promise<string[]> {
    try {
      const categories = await BlogPost.distinct('category', { status: 'published' });
      return categories;
    } catch (error) {
      throw new Error(
        `Failed to get categories: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Get tags list (public)
  static async getTags(): Promise<string[]> {
    try {
      const tags = await BlogPost.distinct('tags', { status: 'published' });
      return tags.filter(Boolean);
    } catch (error) {
      throw new Error(
        `Failed to get tags: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

