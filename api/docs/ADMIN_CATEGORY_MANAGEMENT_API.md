# Admin Category Management API Documentation

## Overview

API endpoints for managing categories in the admin panel.

## Base URL

`/api/v1/admin/categories`

## Authentication

**Required:** Admin role only

```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Get Category Statistics

**GET** `/api/v1/admin/categories/stats`

**Response:**

```json
{
  "success": true,
  "data": {
    "total": 5,
    "active": 4,
    "inactive": 1,
    "totalProducts": 78
  }
}
```

---

### 2. Get All Categories

**GET** `/api/v1/admin/categories`

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `search` | string | Search by name, description, or slug | `?search=frutas` |
| `isActive` | boolean | Filter by status: `true` (active), `false` (inactive) | `?isActive=true` |
| `page` | number | Page number (default: 1) | `?page=1` |
| `limit` | number | Items per page (default: 10) | `?limit=20` |
| `sortBy` | string | Field to sort by (default: `createdAt`) | `?sortBy=name` |
| `sortOrder` | string | Sort order: `asc` or `desc` (default: `desc`) | `?sortOrder=asc` |

**Response:**

```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "507f1f77bcf86cd799439011",
        "name": "Frutas",
        "description": "Frutas frescas e orgânicas",
        "slug": "frutas",
        "image": "https://example.com/frutas.jpg",
        "icon": "tag",
        "isActive": true,
        "isFeatured": false,
        "productCount": 25,
        "parent": null,
        "level": 0,
        "sortOrder": 0,
        "createdAt": "2024-01-10T10:30:00.000Z",
        "updatedAt": "2024-01-20T14:20:00.000Z"
      }
    ],
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

### 3. Get Category by ID

**GET** `/api/v1/admin/categories/:categoryId`

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Frutas",
    "description": "Frutas frescas e orgânicas",
    "slug": "frutas",
    "image": "https://example.com/frutas.jpg",
    "icon": "tag",
    "isActive": true,
    "isFeatured": false,
    "productCount": 25,
    "childrenCount": 2,
    "parent": null,
    "parentId": null,
    "level": 0,
    "sortOrder": 0,
    "metaTitle": "Frutas - Txova",
    "metaDescription": "Compre frutas frescas",
    "keywords": ["frutas", "orgânico"],
    "createdAt": "2024-01-10T10:30:00.000Z",
    "updatedAt": "2024-01-20T14:20:00.000Z"
  }
}
```

---

### 4. Create Category

**POST** `/api/v1/admin/categories`

**Request Body:**

```json
{
  "name": "Frutas",
  "description": "Frutas frescas e orgânicas",
  "slug": "frutas",
  "parentId": null,
  "image": "https://example.com/frutas.jpg",
  "icon": "tag",
  "isActive": true,
  "isFeatured": false,
  "sortOrder": 0,
  "metaTitle": "Frutas - Txova",
  "metaDescription": "Compre frutas frescas",
  "keywords": ["frutas", "orgânico"]
}
```

**Required Fields:**
- `name`: Category name
- `slug`: URL-friendly slug (auto-generated from name if not provided)

**Response:**

```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    // Full category object
  }
}
```

---

### 5. Update Category

**PUT** `/api/v1/admin/categories/:categoryId`

**Request Body:**

```json
{
  "name": "Frutas Premium",
  "description": "Updated description...",
  "isActive": true,
  "isFeatured": true
  // ... any other fields to update
}
```

**Note:** All fields are optional. Only provided fields will be updated.

**Response:**

```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    // Full updated category object
  }
}
```

---

### 6. Update Category Status

**PATCH** `/api/v1/admin/categories/:categoryId/status`

**Request Body:**

```json
{
  "isActive": true
}
```

**Response:**

```json
{
  "success": true,
  "message": "Category status updated successfully",
  "data": {
    // Full updated category object
  }
}
```

---

### 7. Delete Category

**DELETE** `/api/v1/admin/categories/:categoryId`

**Response:**

```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

**Error Response (if category has products or children):**

```json
{
  "success": false,
  "message": "Cannot delete category with 25 products. Please reassign products first."
}
```

---

## Status Mapping

| isActive | Label | Color |
|----------|-------|-------|
| `true` | Ativo | Green |
| `false` | Inativo | Gray/Red |

---

## TypeScript Interfaces

```typescript
interface CategoryStats {
  total: number;
  active: number;
  inactive: number;
  totalProducts: number;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  image?: string;
  icon?: string;
  isActive: boolean;
  isFeatured: boolean;
  productCount: number;
  parent: {
    id: string;
    name: string;
    slug: string;
  } | null;
  level: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface CategoryDetails extends Category {
  childrenCount: number;
  parentId?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}
```

---

## Notes

- Categories use `isActive` boolean (not status enum)
- Slug must be unique
- Cannot delete category with products or subcategories
- Product count is calculated in real-time
- Categories support hierarchical structure (parent-child)
- Slug is auto-generated from name if not provided

