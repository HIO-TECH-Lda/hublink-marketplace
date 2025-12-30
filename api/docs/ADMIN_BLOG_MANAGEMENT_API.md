# Admin Blog Management API Documentation

## Overview

API endpoints for managing blog posts. Admin endpoints for CRUD operations, public endpoints for viewing published posts.

## Base URLs

- **Admin:** `/api/v1/admin/blog`
- **Public:** `/api/v1/blog`

## Authentication

**Admin endpoints require:** Admin role only
**Public endpoints:** No authentication required

```
Authorization: Bearer <token> (admin only)
```

---

## Admin Endpoints

### 1. Get Blog Statistics

**GET** `/api/v1/admin/blog/stats`

**Response:**

```json
{
  "success": true,
  "data": {
    "total": 6,
    "published": 6,
    "draft": 0,
    "archived": 0,
    "totalViews": 2689,
    "totalCategories": 5
  }
}
```

---

### 2. Get All Posts (Admin)

**GET** `/api/v1/admin/blog`

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `search` | string | Search by title, content, author, tags | `?search=orgânico` |
| `category` | string | Filter by category | `?category=Saúde` |
| `status` | string | Filter by status: `draft`, `published`, `archived` | `?status=published` |
| `authorId` | string | Filter by author ID | `?authorId=507f1f77bcf86cd799439011` |
| `isFeatured` | boolean | Filter featured posts | `?isFeatured=true` |
| `page` | number | Page number (default: 1) | `?page=1` |
| `limit` | number | Items per page (default: 10) | `?limit=20` |
| `sortBy` | string | Field to sort by (default: `createdAt`) | `?sortBy=publishedAt` |
| `sortOrder` | string | Sort order: `asc` or `desc` (default: `desc`) | `?sortOrder=asc` |

**Response:**

```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "507f1f77bcf86cd799439011",
        "title": "Os Benefícios dos Alimentos Orgânicos",
        "slug": "os-beneficios-dos-alimentos-organicos",
        "excerpt": "Descubra por que escolher alimentos orgânicos...",
        "image": "https://example.com/post.jpg",
        "author": {
          "id": "507f1f77bcf86cd799439012",
          "name": "Dr. Maria Silva",
          "email": "maria@email.com"
        },
        "category": "Saúde",
        "tags": ["orgânico", "saúde", "nutrição"],
        "status": "published",
        "publishedAt": "2024-01-15T10:30:00.000Z",
        "isFeatured": false,
        "stats": {
          "views": 450,
          "likes": 25,
          "shares": 12
        },
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-20T14:20:00.000Z"
      }
    ],
    "total": 6,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

### 3. Get Post by ID (Admin)

**GET** `/api/v1/admin/blog/:postId`

**Response:** Full post object with complete content.

---

### 4. Create Post

**POST** `/api/v1/admin/blog`

**Request Body:**

```json
{
  "title": "Os Benefícios dos Alimentos Orgânicos",
  "slug": "os-beneficios-dos-alimentos-organicos",
  "excerpt": "Descubra por que escolher alimentos orgânicos...",
  "content": "<p>Conteúdo completo do post em HTML...</p>",
  "image": "https://example.com/post.jpg",
  "authorId": "507f1f77bcf86cd799439012",
  "authorName": "Dr. Maria Silva",
  "category": "Saúde",
  "tags": ["orgânico", "saúde", "nutrição"],
  "status": "draft",
  "isFeatured": false,
  "seo": {
    "title": "Benefícios dos Alimentos Orgânicos - Txova",
    "description": "Descubra os benefícios...",
    "keywords": ["orgânico", "saúde"]
  }
}
```

**Required Fields:**
- `title`: Post title
- `content`: Post content (HTML)
- `authorId`: Author user ID
- `authorName`: Author name
- `category`: Category name

**Response:**

```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    // Full post object
  }
}
```

---

### 5. Update Post

**PUT** `/api/v1/admin/blog/:postId`

**Request Body:** Same as create (all fields optional).

**Response:**

```json
{
  "success": true,
  "message": "Post updated successfully",
  "data": {
    // Full updated post object
  }
}
```

---

### 6. Update Post Status

**PATCH** `/api/v1/admin/blog/:postId/status`

**Request Body:**

```json
{
  "status": "published"
}
```

**Valid Status Values:**
- `draft`: Draft (not visible to public)
- `published`: Published (visible to public)
- `archived`: Archived (hidden from public)

**Response:**

```json
{
  "success": true,
  "message": "Post status updated successfully",
  "data": {
    // Full updated post object
  }
}
```

---

### 7. Delete Post

**DELETE** `/api/v1/admin/blog/:postId`

**Response:**

```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

---

### 8. Get Categories

**GET** `/api/v1/admin/blog/categories`

**Response:**

```json
{
  "success": true,
  "data": ["Saúde", "Cultivo", "Receitas", "Meio Ambiente"]
}
```

---

## Public Endpoints

### 1. Get Published Posts

**GET** `/api/v1/blog`

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `search` | string | Search posts | `?search=orgânico` |
| `category` | string | Filter by category | `?category=Saúde` |
| `isFeatured` | boolean | Get featured posts only | `?isFeatured=true` |
| `tags` | string | Filter by tags (comma-separated) | `?tags=orgânico,saúde` |
| `page` | number | Page number (default: 1) | `?page=1` |
| `limit` | number | Items per page (default: 10) | `?limit=20` |
| `sortBy` | string | Field to sort by (default: `publishedAt`) | `?sortBy=stats.views` |
| `sortOrder` | string | Sort order: `asc` or `desc` (default: `desc`) | `?sortOrder=asc` |

**Response:** Same structure as admin list, but only published posts (content excluded from list).

---

### 2. Get Post by Slug (Public)

**GET** `/api/v1/blog/slug/:slug`

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Os Benefícios dos Alimentos Orgânicos",
    "slug": "os-beneficios-dos-alimentos-organicos",
    "excerpt": "Descubra por que escolher alimentos orgânicos...",
    "content": "<p>Conteúdo completo do post...</p>",
    "image": "https://example.com/post.jpg",
    "author": {
      "id": "507f1f77bcf86cd799439012",
      "name": "Dr. Maria Silva",
      "email": "maria@email.com",
      "avatar": "https://example.com/avatar.jpg"
    },
    "category": "Saúde",
    "tags": ["orgânico", "saúde", "nutrição"],
    "publishedAt": "2024-01-15T10:30:00.000Z",
    "isFeatured": false,
    "stats": {
      "views": 451,
      "likes": 25,
      "shares": 12
    },
    "relatedPosts": [
      {
        "id": "...",
        "title": "...",
        "slug": "...",
        "excerpt": "...",
        "image": "...",
        "authorName": "...",
        "category": "...",
        "publishedAt": "...",
        "stats": {
          "views": 200
        }
      }
    ],
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Note:** View count is automatically incremented when post is viewed.

---

### 3. Get Categories (Public)

**GET** `/api/v1/blog/categories`

**Response:**

```json
{
  "success": true,
  "data": ["Saúde", "Cultivo", "Receitas", "Meio Ambiente"]
}
```

---

### 4. Get Tags (Public)

**GET** `/api/v1/blog/tags`

**Response:**

```json
{
  "success": true,
  "data": ["orgânico", "saúde", "nutrição", "cultivo", "receitas"]
}
```

---

## Status Mapping

| Status | Label | Visibility |
|--------|-------|------------|
| `draft` | Rascunho | Admin only |
| `published` | Publicado | Public |
| `archived` | Arquivado | Hidden |

---

## TypeScript Interfaces

```typescript
interface BlogStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
  totalViews: number;
  totalCategories: number;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  image?: string;
  author: {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  isFeatured: boolean;
  stats: {
    views: number;
    likes: number;
    shares: number;
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  createdAt: string;
  updatedAt: string;
}
```

---

## Features

- **Auto-slug generation** from title
- **View tracking** (auto-increments on public view)
- **Related posts** (by category)
- **SEO fields** (meta title, description, keywords)
- **Featured posts** support
- **Categories and tags** management
- **Author information** with user reference
- **Status workflow** (draft → published → archived)
- **Auto-publish date** when status changes to published

---

## Notes

- Only `published` posts are visible via public endpoints
- Slug must be unique
- View count increments automatically on public view
- `publishedAt` is set automatically when status changes to `published`
- Author name is auto-populated from user if `authorId` provided
- Content is excluded from list endpoints (included in detail endpoints)

