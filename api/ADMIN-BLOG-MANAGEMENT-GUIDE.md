# Admin Blog Management - Frontend Integration Guide

## Overview

Complete guide for implementing admin blog management features, including creating, editing, publishing, and marking posts as featured. The blog system supports rich content, image uploads, SEO optimization, and featured posts.

---

## 📊 Blog Post Data Model

### Blog Post Object

```typescript
interface BlogPost {
  id: string;
  title: string;
  slug: string;                 // Auto-generated from title
  excerpt?: string;             // Short description
  content: string;              // Full HTML/Markdown content
  image?: string;               // Featured image URL
  author: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  authorId: string;
  authorName: string;
  category: string;
  tags?: string[];
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  isFeatured: boolean;         // Featured post flag
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  stats: {
    views: number;
    likes: number;
    shares: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔌 API Endpoints

### 1. Get Blog Statistics (Admin Dashboard)

**Endpoint:** `GET /api/v1/admin/blog/stats`

**Authentication:** Required (Admin role)

**Example Request:**
```javascript
const fetchBlogStats = async () => {
  const response = await fetch('/api/v1/admin/blog/stats', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 125,
    "published": 98,
    "draft": 22,
    "archived": 5,
    "totalViews": 45230,
    "totalCategories": 8
  }
}
```

---

### 2. Get All Posts (with Filters)

**Endpoint:** `GET /api/v1/admin/blog`

**Authentication:** Required (Admin role)

**Query Parameters:**
- `search` (string) - Search in title, excerpt, content, author name, tags
- `category` (string) - Filter by category
- `status` ('draft' | 'published' | 'archived') - Filter by status
- `authorId` (string) - Filter by author
- `isFeatured` (boolean) - Filter featured posts (`true` | `false`)
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10) - Items per page
- `sortBy` (string, default: 'createdAt') - Sort field
- `sortOrder` ('asc' | 'desc', default: 'desc') - Sort direction

**Example Request:**
```javascript
// Get all published featured posts
fetch('/api/v1/admin/blog?status=published&isFeatured=true')

// Get draft posts
fetch('/api/v1/admin/blog?status=draft&page=1&limit=20')

// Search posts
fetch('/api/v1/admin/blog?search=technology&sortBy=publishedAt&sortOrder=desc')
```

**Response:**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "65abc123...",
        "title": "Getting Started with React",
        "slug": "getting-started-with-react",
        "excerpt": "Learn the basics of React...",
        "image": "https://...",
        "author": {
          "id": "65user789...",
          "name": "João Silva",
          "email": "joao@example.com"
        },
        "category": "Technology",
        "tags": ["react", "javascript", "tutorial"],
        "status": "published",
        "publishedAt": "2026-01-15T10:00:00.000Z",
        "isFeatured": true,
        "stats": {
          "views": 1250,
          "likes": 45,
          "shares": 12
        },
        "createdAt": "2026-01-10T08:30:00.000Z",
        "updatedAt": "2026-01-15T10:00:00.000Z"
      }
    ],
    "total": 98,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

---

### 3. Get Post by ID

**Endpoint:** `GET /api/v1/admin/blog/:postId`

**Authentication:** Required (Admin role)

**Example Request:**
```javascript
const fetchPostById = async (postId) => {
  const response = await fetch(`/api/v1/admin/blog/${postId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};
```

**Response:**
```json
{
  "success": true,
  "data": {
    // Full blog post object with all fields
  }
}
```

---

### 4. Create New Post

**Endpoint:** `POST /api/v1/admin/blog`

**Authentication:** Required (Admin role)

**Content-Type:** `application/json` or `multipart/form-data` (for image upload)

**Request Body:**
```typescript
{
  title: string;              // Required
  slug?: string;              // Optional (auto-generated if not provided)
  excerpt?: string;
  content: string;            // Required
  image?: string;             // Base64 or file upload
  authorId: string;           // Required (current user ID)
  authorName: string;         // Required
  category: string;           // Required
  tags?: string[];
  status?: 'draft' | 'published' | 'archived';  // Default: 'draft'
  isFeatured?: boolean;       // Default: false
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}
```

**Example Request (JSON):**
```javascript
const createPost = async (postData) => {
  const response = await fetch('/api/v1/admin/blog', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: 'My New Blog Post',
      content: '<p>This is the content...</p>',
      authorId: currentUser.id,
      authorName: `${currentUser.firstName} ${currentUser.lastName}`,
      category: 'Technology',
      tags: ['react', 'javascript'],
      status: 'draft',
      isFeatured: false,  // ← Set featured status here
      excerpt: 'A brief introduction to...',
      seo: {
        title: 'My New Blog Post | Company Blog',
        description: 'Learn about React in this tutorial',
        keywords: ['react', 'javascript', 'tutorial']
      }
    })
  });
  return response.json();
};
```

**Example Request (Form Data with Image):**
```javascript
const createPostWithImage = async (postData, imageFile) => {
  const formData = new FormData();
  formData.append('title', postData.title);
  formData.append('content', postData.content);
  formData.append('authorId', postData.authorId);
  formData.append('authorName', postData.authorName);
  formData.append('category', postData.category);
  formData.append('tags', JSON.stringify(postData.tags));
  formData.append('isFeatured', postData.isFeatured.toString());
  formData.append('status', postData.status);
  
  if (imageFile) {
    formData.append('image', imageFile);
  }

  const response = await fetch('/api/v1/admin/blog', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
      // Do NOT set Content-Type for FormData
    },
    body: formData
  });
  return response.json();
};
```

**Response:**
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    // Created blog post object
  }
}
```

---

### 5. Update Post

**Endpoint:** `PUT /api/v1/admin/blog/:postId`

**Authentication:** Required (Admin role)

**Request Body:** (Same as create, all fields optional)

**Example Request:**
```javascript
const updatePost = async (postId, updates) => {
  const response = await fetch(`/api/v1/admin/blog/${postId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: 'Updated Title',
      isFeatured: true,  // ← Update featured status
      // ... other fields to update
    })
  });
  return response.json();
};
```

**Response:**
```json
{
  "success": true,
  "message": "Post updated successfully",
  "data": {
    // Updated blog post object
  }
}
```

---

### 6. Update Post Status (Quick Action)

**Endpoint:** `PATCH /api/v1/admin/blog/:postId/status`

**Authentication:** Required (Admin role)

**Request Body:**
```typescript
{
  status: 'draft' | 'published' | 'archived';  // Required
}
```

**Example Request:**
```javascript
const publishPost = async (postId) => {
  const response = await fetch(`/api/v1/admin/blog/${postId}/status`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status: 'published' })
  });
  return response.json();
};
```

**Response:**
```json
{
  "success": true,
  "message": "Post status updated successfully",
  "data": {
    // Updated blog post object
  }
}
```

---

### 7. Toggle Featured Status (Quick Action) 🆕

**Endpoint:** `PATCH /api/v1/admin/blog/:postId/featured`

**Authentication:** Required (Admin role)

**Request Body:**
```typescript
{
  isFeatured: boolean;  // Required (true or false)
}
```

**Example Request:**
```javascript
// Mark as featured
const markAsFeatured = async (postId) => {
  const response = await fetch(`/api/v1/admin/blog/${postId}/featured`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ isFeatured: true })
  });
  return response.json();
};

// Unmark as featured
const unmarkAsFeatured = async (postId) => {
  const response = await fetch(`/api/v1/admin/blog/${postId}/featured`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ isFeatured: false })
  });
  return response.json();
};
```

**Response:**
```json
{
  "success": true,
  "message": "Post marked as featured successfully",
  "data": {
    // Updated blog post object with isFeatured: true
  }
}
```

---

### 8. Delete Post

**Endpoint:** `DELETE /api/v1/admin/blog/:postId`

**Authentication:** Required (Admin role)

**Example Request:**
```javascript
const deletePost = async (postId) => {
  const response = await fetch(`/api/v1/admin/blog/${postId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};
```

**Response:**
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

---

### 9. Get Categories

**Endpoint:** `GET /api/v1/admin/blog/categories`

**Authentication:** Required (Admin role)

**Example Request:**
```javascript
const fetchCategories = async () => {
  const response = await fetch('/api/v1/admin/blog/categories', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};
```

**Response:**
```json
{
  "success": true,
  "data": [
    "Technology",
    "Business",
    "Marketing",
    "Design",
    "Development"
  ]
}
```

---

## 🎨 UI Components & Pages

### 1. Admin Blog Dashboard Page

**Route:** `/admin/blog`

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  📊 Blog Statistics (Cards)                          │
│  ┌───────┬───────┬────────┬──────────┬──────────┐  │
│  │ Total │ Publ. │ Draft  │ Archived │ Views    │  │
│  │  125  │  98   │   22   │    5     │ 45,230   │  │
│  └───────┴───────┴────────┴──────────┴──────────┘  │
│                                                      │
│  🔍 Filters & Actions                               │
│  [Search] [Category ▼] [Status ▼] [+ New Post]      │
│  [ ] Featured only                                   │
│                                                      │
│  📝 Posts Table                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │ Title | Category | Status | Featured | Actions│ │
│  ├──────────────────────────────────────────────┤  │
│  │ Post 1 | Tech    | Published | ⭐ | Edit Del│  │
│  │ Post 2 | Business | Draft    | ☆  | Edit Del│  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  ◀ 1 2 3 4 5 ▶ (Pagination)                        │
└─────────────────────────────────────────────────────┘
```

#### Blog Stats Cards Component
```jsx
function BlogStatsCards({ stats }) {
  return (
    <div className="grid grid-cols-5 gap-4 mb-6">
      <StatCard
        title="Total Posts"
        value={stats.total}
        icon={<FileText />}
        color="blue"
      />
      <StatCard
        title="Published"
        value={stats.published}
        icon={<CheckCircle />}
        color="green"
      />
      <StatCard
        title="Drafts"
        value={stats.draft}
        icon={<Edit />}
        color="yellow"
      />
      <StatCard
        title="Archived"
        value={stats.archived}
        icon={<Archive />}
        color="gray"
      />
      <StatCard
        title="Total Views"
        value={stats.totalViews.toLocaleString()}
        icon={<Eye />}
        color="purple"
      />
    </div>
  );
}
```

---

### 2. Blog Post Row Component

```jsx
function BlogPostRow({ post, onEdit, onDelete, onToggleFeatured, onChangeStatus }) {
  return (
    <tr className="border-b hover:bg-gray-50">
      {/* Featured indicator */}
      <td className="p-3">
        <button
          onClick={() => onToggleFeatured(post.id, !post.isFeatured)}
          className={`text-2xl ${post.isFeatured ? 'text-yellow-500' : 'text-gray-300'}`}
          title={post.isFeatured ? 'Unmark as featured' : 'Mark as featured'}
        >
          {post.isFeatured ? '⭐' : '☆'}
        </button>
      </td>

      {/* Image */}
      <td className="p-3">
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            className="w-16 h-16 object-cover rounded"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
            <ImageIcon className="text-gray-400" size={24} />
          </div>
        )}
      </td>

      {/* Title & Excerpt */}
      <td className="p-3">
        <div className="font-semibold">{post.title}</div>
        <div className="text-sm text-gray-500 line-clamp-1">{post.excerpt}</div>
        <div className="text-xs text-gray-400 mt-1">
          Slug: {post.slug}
        </div>
      </td>

      {/* Category */}
      <td className="p-3">
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
          {post.category}
        </span>
      </td>

      {/* Author */}
      <td className="p-3">
        <div className="text-sm">{post.author.name}</div>
      </td>

      {/* Status */}
      <td className="p-3">
        <select
          value={post.status}
          onChange={(e) => onChangeStatus(post.id, e.target.value)}
          className={`px-3 py-1 rounded text-sm font-medium ${
            post.status === 'published'
              ? 'bg-green-100 text-green-700'
              : post.status === 'draft'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </td>

      {/* Stats */}
      <td className="p-3 text-sm text-gray-600">
        <div>👁 {post.stats.views}</div>
        <div>❤ {post.stats.likes}</div>
      </td>

      {/* Date */}
      <td className="p-3 text-sm text-gray-500">
        {post.publishedAt
          ? new Date(post.publishedAt).toLocaleDateString()
          : 'Not published'}
      </td>

      {/* Actions */}
      <td className="p-3">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(post.id)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(post.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded"
            title="Delete"
          >
            <Trash size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
```

---

### 3. Featured Toggle Button (Standalone)

```jsx
function FeaturedToggle({ post, onToggle }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      await onToggle(post.id, !post.isFeatured);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
        post.isFeatured
          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      <Star size={16} className={post.isFeatured ? 'fill-yellow-500' : ''} />
      {post.isFeatured ? 'Featured' : 'Mark as Featured'}
    </button>
  );
}
```

---

### 4. Create/Edit Post Form

```jsx
function BlogPostForm({ post = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    category: post?.category || '',
    tags: post?.tags || [],
    status: post?.status || 'draft',
    isFeatured: post?.isFeatured || false,  // ← Featured toggle
    seo: post?.seo || {}
  });

  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData, imageFile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Slug (auto-generated if empty)
        </label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Featured Toggle */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isFeatured"
          checked={formData.isFeatured}
          onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
          className="w-4 h-4"
        />
        <label htmlFor="isFeatured" className="text-sm font-medium flex items-center gap-2">
          <Star size={16} className={formData.isFeatured ? 'fill-yellow-500 text-yellow-500' : ''} />
          Mark as Featured Post
        </label>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Featured Image
        </label>
        {post?.image && !imageFile && (
          <img
            src={post.image}
            alt="Current"
            className="w-32 h-32 object-cover rounded mb-2"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="w-full"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Category *
        </label>
        <input
          type="text"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          value={formData.tags.join(', ')}
          onChange={(e) => setFormData({
            ...formData,
            tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
          })}
          className="w-full border rounded px-3 py-2"
          placeholder="react, javascript, tutorial"
        />
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Excerpt
        </label>
        <textarea
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          rows={3}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Content (Rich Text Editor) */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Content *
        </label>
        <RichTextEditor
          value={formData.content}
          onChange={(content) => setFormData({ ...formData, content })}
        />
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Status
        </label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* SEO (Collapsible) */}
      <details>
        <summary className="cursor-pointer font-medium">SEO Settings</summary>
        <div className="mt-4 space-y-4 pl-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              SEO Title
            </label>
            <input
              type="text"
              value={formData.seo.title || ''}
              onChange={(e) => setFormData({
                ...formData,
                seo: { ...formData.seo, title: e.target.value }
              })}
              className="w-full border rounded px-3 py-2"
              maxLength={60}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              SEO Description
            </label>
            <textarea
              value={formData.seo.description || ''}
              onChange={(e) => setFormData({
                ...formData,
                seo: { ...formData.seo, description: e.target.value }
              })}
              rows={2}
              className="w-full border rounded px-3 py-2"
              maxLength={160}
            />
          </div>
        </div>
      </details>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {post ? 'Update Post' : 'Create Post'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border rounded hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
```

---

## 📱 Public Blog API (For Frontend Display)

### Get Featured Posts
```javascript
// Get featured posts for homepage
GET /api/v1/blog?isFeatured=true&limit=3

// Response includes only published, featured posts
```

### Get All Published Posts
```javascript
// Regular blog listing
GET /api/v1/blog?page=1&limit=10

// With category filter
GET /api/v1/blog?category=Technology

// With search
GET /api/v1/blog?search=react
```

---

## 🎯 Key Features to Implement

### Must Have
- ✅ Blog dashboard with statistics
- ✅ Create/edit posts with rich text editor
- ✅ Upload featured images
- ✅ **Mark posts as featured** (checkbox in form + quick toggle button)
- ✅ Change post status (draft/published/archived)
- ✅ Delete posts
- ✅ Filter by status, category, featured
- ✅ Search posts
- ✅ Pagination

### Nice to Have
- 📊 Advanced analytics (views over time)
- 🖼️ Image gallery/media library
- 📅 Schedule posts for future publishing
- 💬 Comments management
- 🔗 URL preview/social cards
- 📱 Mobile app support
- 🔍 Advanced SEO tools
- 📊 A/B testing for titles

---

## ✅ Testing Checklist

### Featured Posts Functionality
- [ ] Can mark a post as featured when creating
- [ ] Can mark a post as featured when editing
- [ ] Can toggle featured status with quick action button
- [ ] Featured toggle displays correct state (⭐ vs ☆)
- [ ] Can filter posts by featured status
- [ ] Featured posts appear on public blog with `isFeatured=true` query
- [ ] Only published posts appear in public featured list
- [ ] Featured badge shows on blog post cards

### General Blog Management
- [ ] Can view blog statistics
- [ ] Can create new post
- [ ] Can edit existing post
- [ ] Can upload images
- [ ] Can change post status
- [ ] Can delete post
- [ ] Slug auto-generates from title
- [ ] Published date sets automatically when publishing
- [ ] Can search posts
- [ ] Can filter by category
- [ ] Can filter by status
- [ ] Pagination works
- [ ] Rich text editor works
- [ ] Tags can be added/removed
- [ ] SEO fields save correctly

---

## 🚀 Quick Start

### 1. Install Rich Text Editor
```bash
npm install react-quill
# or
npm install @tinymce/tinymce-react
```

### 2. Create API Client
```javascript
// api/blog.js
export const blogAPI = {
  getStats: () => fetch('/api/v1/admin/blog/stats'),
  getPosts: (filters) => fetch(`/api/v1/admin/blog?${new URLSearchParams(filters)}`),
  getPostById: (id) => fetch(`/api/v1/admin/blog/${id}`),
  createPost: (data, image) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'tags' || key === 'seo') {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    });
    if (image) formData.append('image', image);
    return fetch('/api/v1/admin/blog', {
      method: 'POST',
      body: formData
    });
  },
  updatePost: (id, data) => fetch(`/api/v1/admin/blog/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  updateStatus: (id, status) => fetch(`/api/v1/admin/blog/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  }),
  toggleFeatured: (id, isFeatured) => fetch(`/api/v1/admin/blog/${id}/featured`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isFeatured })
  }),
  deletePost: (id) => fetch(`/api/v1/admin/blog/${id}`, { method: 'DELETE' })
};
```

### 3. Use in Components
```javascript
import { useQuery, useMutation } from '@tanstack/react-query';
import { blogAPI } from './api/blog';

function AdminBlogPage() {
  const { data: stats } = useQuery(['blogStats'], blogAPI.getStats);
  const { data: posts } = useQuery(['blogPosts'], () => blogAPI.getPosts({}));
  
  const toggleFeaturedMutation = useMutation(
    ({ id, isFeatured }) => blogAPI.toggleFeatured(id, isFeatured),
    {
      onSuccess: () => queryClient.invalidateQueries(['blogPosts'])
    }
  );

  return (
    <div>
      <BlogStatsCards stats={stats?.data} />
      {/* ... rest of component */}
    </div>
  );
}
```

---

## 📞 Summary

**Featured Posts Functionality:**
- ✅ **Backend fully implemented** - database field, filters, endpoints all working
- ✅ **3 ways to set featured status:**
  1. When creating a post (include `isFeatured: true` in POST body)
  2. When updating a post (include `isFeatured: true` in PUT body)
  3. Quick toggle endpoint (PATCH `/admin/blog/:postId/featured`) 🆕
- ✅ **Query featured posts:** `GET /api/v1/blog?isFeatured=true`
- ❌ **Missing:** Frontend UI to toggle featured status

**What Frontend Needs to Build:**
- 📱 Add featured toggle to create/edit post form
- ⭐ Add star icon button for quick toggle in post list
- 🔍 Add "Featured only" filter checkbox
- 🏠 Display featured posts on homepage

---

**Last Updated:** January 29, 2026  
**API Version:** 1.0.0  
**Backend Contact:** [Your Contact Info]
