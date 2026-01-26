import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string; // Only in detail view
  image?: string;
  authorName: string; // Simple string, not object
  category: string;
  tags: string[];
  publishedAt?: string;
  isFeatured: boolean;
  stats: {
    views: number;
    likes: number;
    shares: number;
  };
  createdAt: string;
}

export interface BlogPostsResponse {
  posts: BlogPost[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BlogPostDetailResponse extends BlogPost {
  relatedPosts: BlogPost[];
}

export const useBlogPosts = (params?: {
  search?: string;
  category?: string;
  isFeatured?: boolean;
  tags?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  return useQuery({
    queryKey: ['blog', 'posts', params],
    queryFn: async () => {
      const response = await apiClient.get('/blog', { params });
      return response.data.data as BlogPostsResponse;
    },
  });
};

export const useBlogPost = (slug: string) => {
  return useQuery({
    queryKey: ['blog', 'post', slug],
    queryFn: async () => {
      const response = await apiClient.get(`/blog/slug/${slug}`);
      return response.data.data as BlogPostDetailResponse;
    },
    enabled: !!slug,
  });
};

export const useBlogCategories = () => {
  return useQuery({
    queryKey: ['blog', 'categories'],
    queryFn: async () => {
      const response = await apiClient.get('/blog/categories');
      return response.data.data as string[];
    },
  });
};

export const useBlogTags = () => {
  return useQuery({
    queryKey: ['blog', 'tags'],
    queryFn: async () => {
      const response = await apiClient.get('/blog/tags');
      return response.data.data as string[];
    },
  });
};

export const useFeaturedPosts = () => {
  return useQuery({
    queryKey: ['blog', 'featured'],
    queryFn: async () => {
      const response = await apiClient.get('/blog', {
        params: { isFeatured: true, limit: 5 }
      });
      return response.data.data as BlogPostsResponse;
    },
  });
};
