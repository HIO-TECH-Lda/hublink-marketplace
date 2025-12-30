# Admin Product Management API Documentation

## Overview

The Admin Product Management API provides comprehensive endpoints for managing products in the administrative panel. This includes viewing product statistics, listing products with filters, viewing product details, updating products, and managing product statuses.

## Base URL

All endpoints are prefixed with: `/api/v1/admin/products`

## Authentication

**Required:** Admin role only

All endpoints require:
- Valid JWT token in the Authorization header
- User must have `admin` role

### Headers

```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

---

## Endpoints

### 1. Get Product Statistics

Get summary statistics about products.

**Endpoint:** `GET /api/v1/admin/products/stats`

**Response:**

```json
{
  "success": true,
  "data": {
    "total": 1250,
    "active": 980,
    "pending": 45,
    "rejected": 225,
    "averageRating": 4.7
  }
}
```

**Response Fields:**
- `total`: Total number of products
- `active`: Number of active products
- `pending`: Number of products with draft status (pending approval)
- `rejected`: Number of archived/rejected products
- `averageRating`: Average rating across all products (rounded to 1 decimal place)

---

### 2. Get All Products (with filters)

Get a paginated list of products with optional filtering and search.

**Endpoint:** `GET /api/v1/admin/products`

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `search` | string | Search by product name, seller name, SKU, or product ID | `?search=maçã` |
| `status` | string | Filter by status: `draft`, `active`, `inactive`, `archived` | `?status=draft` |
| `categoryId` | string | Filter by category ID | `?categoryId=507f1f77bcf86cd799439011` |
| `page` | number | Page number (default: 1) | `?page=1` |
| `limit` | number | Items per page (default: 10) | `?limit=20` |
| `sortBy` | string | Field to sort by (default: `createdAt`) | `?sortBy=name` |
| `sortOrder` | string | Sort order: `asc` or `desc` (default: `desc`) | `?sortOrder=asc` |

**Example Request:**

```
GET /api/v1/admin/products?search=orgânico&status=active&categoryId=507f1f77bcf86cd799439011&page=1&limit=10
```

**Response:**

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "507f1f77bcf86cd799439011",
        "name": "Maçãs Orgânicas",
        "primaryImage": "https://example.com/images/apple.jpg",
        "stock": 50,
        "price": 15.00,
        "currency": "MZM",
        "category": {
          "id": "507f1f77bcf86cd799439012",
          "name": "Frutas",
          "slug": "frutas"
        },
        "subcategory": {
          "id": "507f1f77bcf86cd799439013",
          "name": "Frutas Frescas",
          "slug": "frutas-frescas"
        },
        "seller": {
          "id": "507f1f77bcf86cd799439014",
          "name": "Fazenda Verde",
          "email": "contato@fazendaverde.com"
        },
        "averageRating": 4.8,
        "totalReviews": 25,
        "status": "active",
        "isFeatured": true,
        "isBestSeller": false,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-20T14:20:00.000Z"
      }
    ],
    "total": 1250,
    "page": 1,
    "limit": 10,
    "totalPages": 125
  }
}
```

**Response Fields:**

**Product Object:**
- `id`: Product ID
- `name`: Product name
- `primaryImage`: URL of the primary product image
- `stock`: Available stock quantity
- `price`: Product price
- `currency`: Currency code (default: "MZM")
- `category`: Category information (id, name, slug)
- `subcategory`: Subcategory information (if exists)
- `seller`: Seller information (id, name, email)
- `averageRating`: Average product rating
- `totalReviews`: Total number of reviews
- `status`: Product status (`draft`, `active`, `inactive`, `archived`)
- `isFeatured`: Whether product is featured
- `isBestSeller`: Whether product is a best seller
- `createdAt`: Product creation date
- `updatedAt`: Last update date

---

### 3. Get Product by ID

Get detailed information about a specific product.

**Endpoint:** `GET /api/v1/admin/products/:productId`

**Path Parameters:**
- `productId`: Product ID (MongoDB ObjectId)

**Example Request:**

```
GET /api/v1/admin/products/507f1f77bcf86cd799439011
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Maçãs Orgânicas",
    "description": "Maçãs orgânicas frescas, cultivadas sem pesticidas...",
    "shortDescription": "Maçãs orgânicas frescas",
    "primaryImage": "https://example.com/images/apple.jpg",
    "images": [
      {
        "url": "https://example.com/images/apple.jpg",
        "alt": "Maçãs Orgânicas",
        "isPrimary": true,
        "order": 0
      }
    ],
    "price": 15.00,
    "originalPrice": 18.00,
    "discountPercentage": 16.67,
    "stock": 50,
    "sku": "PROD-APPLE-001",
    "barcode": "1234567890123",
    "status": "active",
    "isFeatured": true,
    "isBestSeller": false,
    "isNewArrival": true,
    "seller": {
      "id": "507f1f77bcf86cd799439014",
      "name": "Fazenda Verde",
      "email": "contato@fazendaverde.com",
      "phone": "+258841234567",
      "storeName": "Fazenda Verde"
    },
    "category": {
      "id": "507f1f77bcf86cd799439012",
      "name": "Frutas",
      "slug": "frutas",
      "description": "Frutas frescas e orgânicas"
    },
    "subcategory": {
      "id": "507f1f77bcf86cd799439013",
      "name": "Frutas Frescas",
      "slug": "frutas-frescas"
    },
    "statistics": {
      "totalReviews": 25,
      "averageRating": 4.8,
      "ratingDistribution": [
        { "rating": 5, "count": 15 },
        { "rating": 4, "count": 8 },
        { "rating": 3, "count": 2 },
        { "rating": 2, "count": 0 },
        { "rating": 1, "count": 0 }
      ],
      "totalOrders": 120,
      "totalQuantitySold": 450,
      "totalRevenue": 6750.00,
      "viewCount": 1250,
      "purchaseCount": 450
    },
    "inStock": true,
    "discountedPrice": 12.50,
    "variants": [],
    "specifications": [
      {
        "name": "Peso",
        "value": "1kg"
      }
    ],
    "tags": ["orgânico", "fresco", "local"],
    "labels": ["organic", "local"],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-20T14:20:00.000Z"
  }
}
```

**Response Fields:**

**Statistics Object:**
- `totalReviews`: Total number of reviews
- `averageRating`: Average rating (0-5)
- `ratingDistribution`: Array of rating counts (5 stars to 1 star)
- `totalOrders`: Total number of orders containing this product
- `totalQuantitySold`: Total quantity sold
- `totalRevenue`: Total revenue from this product
- `viewCount`: Number of product views
- `purchaseCount`: Number of purchases

---

### 4. Update Product

Update product information. All fields are optional - only provided fields will be updated.

**Endpoint:** `PUT /api/v1/admin/products/:productId`

**Path Parameters:**
- `productId`: Product ID (MongoDB ObjectId)

**Request Body:**

```json
{
  "name": "Maçãs Orgânicas Premium",
  "description": "Updated description...",
  "price": 18.00,
  "stock": 75,
  "status": "active",
  "isFeatured": true,
  "discountPercentage": 10
}
```

**Response:**

```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    // Full product object (same as GET /:productId)
  }
}
```

**Note:** You can update any product field except `_id`, `createdAt`, and `updatedAt`. The response includes the full updated product object with populated relationships.

---

### 5. Update Product Status

Update only the product status.

**Endpoint:** `PATCH /api/v1/admin/products/:productId/status`

**Path Parameters:**
- `productId`: Product ID (MongoDB ObjectId)

**Request Body:**

```json
{
  "status": "active"
}
```

**Valid Status Values:**
- `draft`: Product is in draft/pending state
- `active`: Product is active and visible
- `inactive`: Product is inactive (hidden but not deleted)
- `archived`: Product is archived/rejected

**Response:**

```json
{
  "success": true,
  "message": "Product status updated successfully",
  "data": {
    // Full product object (same as GET /:productId)
  }
}
```

**Error Response (Invalid Status):**

```json
{
  "success": false,
  "message": "Invalid status. Must be one of: draft, active, inactive, archived"
}
```

---

### 6. Delete Product

Soft delete a product by archiving it.

**Endpoint:** `DELETE /api/v1/admin/products/:productId`

**Path Parameters:**
- `productId`: Product ID (MongoDB ObjectId)

**Response:**

```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

**Note:** This is a soft delete - the product status is set to `archived`. The product data remains in the database but is hidden from normal listings.

---

## Status Mapping

For frontend display, map status values as follows:

| Status Value | Portuguese Label | UI Color |
|-------------|------------------|----------|
| `draft` | Pendente | Yellow |
| `active` | Ativo | Green |
| `inactive` | Inativo | Gray |
| `archived` | Rejeitado | Red |

---

## Error Responses

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "message": "Error description"
}
```

**Common HTTP Status Codes:**
- `200`: Success
- `400`: Bad Request (invalid parameters)
- `401`: Unauthorized (missing or invalid token)
- `403`: Forbidden (user doesn't have admin role)
- `404`: Not Found (product doesn't exist)
- `500`: Internal Server Error

---

## TypeScript Interfaces

For frontend TypeScript integration:

```typescript
interface ProductStats {
  total: number;
  active: number;
  pending: number;
  rejected: number;
  averageRating: number;
}

interface Product {
  id: string;
  name: string;
  primaryImage: string;
  stock: number;
  price: number;
  currency: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  subcategory: {
    id: string;
    name: string;
    slug: string;
  } | null;
  seller: {
    id: string;
    name: string;
    email: string;
  };
  averageRating: number;
  totalReviews: number;
  status: 'draft' | 'active' | 'inactive' | 'archived';
  isFeatured: boolean;
  isBestSeller: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductDetails extends Product {
  description: string;
  shortDescription?: string;
  images: ProductImage[];
  originalPrice?: number;
  discountPercentage?: number;
  sku?: string;
  barcode?: string;
  statistics: {
    totalReviews: number;
    averageRating: number;
    ratingDistribution: Array<{ rating: number; count: number }>;
    totalOrders: number;
    totalQuantitySold: number;
    totalRevenue: number;
    viewCount: number;
    purchaseCount: number;
  };
  inStock: boolean;
  discountedPrice: number;
  variants: ProductVariant[];
  specifications: ProductSpecification[];
  tags: string[];
  labels: string[];
}

interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

---

## Frontend Integration Examples

### React Hook Example

```typescript
import { useState, useEffect } from 'react';

interface UseProductsParams {
  search?: string;
  status?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}

export const useAdminProducts = (params: UseProductsParams = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        if (params.search) queryParams.append('search', params.search);
        if (params.status) queryParams.append('status', params.status);
        if (params.categoryId) queryParams.append('categoryId', params.categoryId);
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());

        const response = await fetch(
          `/api/v1/admin/products?${queryParams.toString()}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const data = await response.json();
        if (data.success) {
          setProducts(data.data.products);
          setPagination({
            total: data.data.total,
            page: data.data.page,
            limit: data.data.limit,
            totalPages: data.data.totalPages
          });
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [params.search, params.status, params.categoryId, params.page, params.limit]);

  return { products, loading, error, pagination };
};
```

### Update Product Status Example

```typescript
const updateProductStatus = async (productId: string, status: string) => {
  try {
    const response = await fetch(
      `/api/v1/admin/products/${productId}/status`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      }
    );

    const data = await response.json();
    if (data.success) {
      // Handle success (e.g., show notification, refresh list)
      return data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Failed to update product status:', error);
    throw error;
  }
};
```

---

## UI/UX Recommendations

1. **Product List Table:**
   - Display product image, name, seller, category, price, rating, and status
   - Use color-coded status badges (green for active, yellow for pending, red for rejected)
   - Show stock quantity with low stock warnings (< 10 items)
   - Include quick actions: View, Edit Status dropdown

2. **Product Details Page:**
   - Show comprehensive product information
   - Display statistics cards (reviews, orders, revenue)
   - Show rating distribution chart
   - Include edit form for updating product details
   - Show activity timeline (created, updated dates)

3. **Status Management:**
   - Use dropdown menu for quick status changes
   - Show confirmation dialog for status changes
   - Display status change history if available

4. **Search and Filters:**
   - Real-time search with debouncing
   - Multi-select category filter
   - Status filter chips
   - Clear filters button

5. **Statistics Dashboard:**
   - Display key metrics in cards
   - Show trends with charts (if historical data available)
   - Highlight pending products requiring attention

---

## Notes

- All prices are in MZM (Mozambican Metical)
- Product status `draft` represents products pending admin approval
- Product status `archived` represents rejected/soft-deleted products
- The `rejected` count in statistics refers to `archived` status products
- Product deletion is soft delete (status set to `archived`)
- Rating distribution shows count for each star rating (5 to 1)
- Statistics are calculated in real-time from orders and reviews

