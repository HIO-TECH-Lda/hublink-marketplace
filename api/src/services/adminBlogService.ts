import BlogPost from '../models/BlogPost';
import User from '../models/User';
import { uploadBase64Image } from '../utils/cloudinary';
import mongoose, { Types } from 'mongoose';
import Messages from '../utils/messages';

export interface BlogListFilters {
  search?: string;
  category?: string;
  status?: 'draft' | 'published' | 'archived';
  authorId?: string;
  isFeatured?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface BlogStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
  totalViews: number;
  totalCategories: number;
}

export class AdminBlogService {
  // Get blog statistics
  static async getBlogStats(): Promise<BlogStats> {
    try {
      const [total, published, draft, archived, viewsStats, categories] = await Promise.all([
        BlogPost.countDocuments(),
        BlogPost.countDocuments({ status: 'published' }),
        BlogPost.countDocuments({ status: 'draft' }),
        BlogPost.countDocuments({ status: 'archived' }),
        BlogPost.aggregate([
          {
            $group: {
              _id: null,
              totalViews: { $sum: '$stats.views' }
            }
          }
        ]),
        BlogPost.distinct('category')
      ]);

      return {
        total,
        published,
        draft,
        archived,
        totalViews: viewsStats[0]?.totalViews || 0,
        totalCategories: categories.length
      };
    } catch (error) {
      throw new Error(
        `Failed to get blog statistics: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Get all posts with filters and pagination
  static async getPosts(filters: BlogListFilters = {}): Promise<{
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
        status,
        authorId,
        isFeatured,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = filters;

      // Build query
      const query: any = {};

      // Status filter
      if (status) {
        query.status = status;
      }

      // Category filter
      if (category) {
        query.category = category;
      }

      // Author filter
      if (authorId) {
        query.authorId = new Types.ObjectId(authorId);
      }

      // Featured filter
      if (isFeatured !== undefined) {
        query.isFeatured = isFeatured;
      }

      // Search filter
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { excerpt: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
          { authorName: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } }
        ];
      }

      // Calculate pagination
      const skip = (page - 1) * limit;
      const sort: any = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

      // Get total count
      const total = await BlogPost.countDocuments(query);

      // Get posts
      const posts = await BlogPost.find(query)
        .populate('authorId', 'firstName lastName email')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();

      // Format posts for frontend
      const formattedPosts = posts.map((post: any) => {
        const author = post.authorId as any;
        return {
          id: post._id.toString(),
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || '',
          image: post.image,
          author: {
            id: author?._id?.toString() || author?.toString(),
            name: post.authorName,
            email: author?.email || 'N/A'
          },
          category: post.category,
          tags: post.tags || [],
          status: post.status,
          publishedAt: post.publishedAt,
          isFeatured: post.isFeatured || false,
          stats: {
            views: post.stats?.views || 0,
            likes: post.stats?.likes || 0,
            shares: post.stats?.shares || 0
          },
          createdAt: post.createdAt,
          updatedAt: post.updatedAt
        };
      });

      return {
        posts: formattedPosts,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(
        `Failed to get posts: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Get post by ID
  static async getPostById(postId: string): Promise<any> {
    try {
      const post = await BlogPost.findById(postId)
        .populate('authorId', 'firstName lastName email avatar')
        .lean();

      if (!post) {
        throw new Error(Messages.BLOG.POST_NOT_FOUND);
      }

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
          views: post.stats?.views || 0,
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

  // Create post
  static async createPost(postData: any): Promise<any> {
    try {
      // Check if slug already exists
      if (postData.slug) {
        const existing = await BlogPost.findOne({ slug: postData.slug });
        if (existing) {
          throw new Error(Messages.BLOG.SLUG_EXISTS);
        }
      }

      // Get author name if authorId provided
      if (postData.authorId && !postData.authorName) {
        const author = await User.findById(postData.authorId);
        if (author) {
          postData.authorName = `${author.firstName || ''} ${author.lastName || ''}`.trim() || author.email;
        }
      }

      // Upload image to Cloudinary if provided (base64 or URL)
      if (postData.image) {
        const uploaded = await uploadBase64Image(postData.image, 'blog');
        postData.image = uploaded.url;
      }

      // Set publishedAt if status is published
      if (postData.status === 'published' && !postData.publishedAt) {
        postData.publishedAt = new Date();
      }

      const post = new BlogPost(postData);
      await post.save();

      // Return created post with populated data
      return await this.getPostById(post._id.toString());
    } catch (error) {
      throw new Error(
        `Failed to create post: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Update post
  static async updatePost(postId: string, updateData: any): Promise<any> {
    try {
      const post = await BlogPost.findById(postId);

      if (!post) {
        throw new Error(Messages.BLOG.POST_NOT_FOUND);
      }

      // Check slug uniqueness if being updated
      if (updateData.slug && updateData.slug !== post.slug) {
        const existing = await BlogPost.findOne({ slug: updateData.slug });
        if (existing) {
          throw new Error(Messages.BLOG.SLUG_EXISTS);
        }
      }

      // Update author name if authorId changed
      if (updateData.authorId && updateData.authorId !== post.authorId.toString()) {
        const author = await User.findById(updateData.authorId);
        if (author) {
          updateData.authorName = `${author.firstName || ''} ${author.lastName || ''}`.trim() || author.email;
        }
      }

      // Upload new image to Cloudinary if provided (base64 or URL)
      if (updateData.image && updateData.image !== post.image) {
        const uploaded = await uploadBase64Image(updateData.image, 'blog');
        updateData.image = uploaded.url;
      }

      // Set publishedAt if status changes to published
      if (updateData.status === 'published' && post.status !== 'published') {
        updateData.publishedAt = new Date();
      }

      // Update fields
      Object.keys(updateData).forEach(key => {
        if (key !== '_id' && key !== 'createdAt' && key !== 'updatedAt') {
          (post as any)[key] = updateData[key];
        }
      });

      await post.save();

      // Return updated post with populated data
      return await this.getPostById(postId);
    } catch (error) {
      throw new Error(
        `Failed to update post: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Update post status
  static async updatePostStatus(
    postId: string,
    status: 'draft' | 'published' | 'archived'
  ): Promise<any> {
    try {
      const post = await BlogPost.findById(postId);

      if (!post) {
        throw new Error(Messages.BLOG.POST_NOT_FOUND);
      }

      post.status = status;

      // Set publishedAt if publishing
      if (status === 'published' && !post.publishedAt) {
        post.publishedAt = new Date();
      }

      await post.save();

      // Return updated post with populated data
      return await this.getPostById(postId);
    } catch (error) {
      throw new Error(
        `Failed to update post status: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Toggle featured status
  static async toggleFeatured(postId: string, isFeatured: boolean): Promise<any> {
    try {
      const post = await BlogPost.findById(postId);

      if (!post) {
        throw new Error(Messages.BLOG.POST_NOT_FOUND);
      }

      post.isFeatured = isFeatured;
      await post.save();

      // Return updated post with populated data
      return await this.getPostById(postId);
    } catch (error) {
      throw new Error(
        `Failed to update featured status: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Delete post
  static async deletePost(postId: string): Promise<void> {
    try {
      const post = await BlogPost.findById(postId);

      if (!post) {
        throw new Error(Messages.BLOG.POST_NOT_FOUND);
      }

      await BlogPost.findByIdAndDelete(postId);
    } catch (error) {
      throw new Error(
        `Failed to delete post: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Get categories list
  static async getCategories(): Promise<string[]> {
    try {
      const categories = await BlogPost.distinct('category');
      return categories;
    } catch (error) {
      throw new Error(
        `Failed to get categories: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

