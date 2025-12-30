# Admin Seller Management API Documentation

## Overview

API endpoints for managing sellers in the admin panel. Sellers are users with `role: 'seller'`.

## Base URL

`/api/v1/admin/sellers`

## Authentication

**Required:** Admin role only

```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Get Seller Statistics

**GET** `/api/v1/admin/sellers/stats`

**Response:**

```json
{
  "success": true,
  "data": {
    "total": 200,
    "approved": 150,
    "pending": 30,
    "rejected": 20,
    "totalSales": 21400.00,
    "averageRating": 4.7
  }
}
```

**Status Mapping:**
- `active` → Approved
- `inactive` → Pending
- `suspended` → Rejected

---

### 2. Get All Sellers

**GET** `/api/v1/admin/sellers`

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `search` | string | Search by store name, contact name, email, phone | `?search=fazenda` |
| `status` | string | Filter by status: `active`, `inactive`, `suspended` | `?status=inactive` |
| `page` | number | Page number (default: 1) | `?page=1` |
| `limit` | number | Items per page (default: 10) | `?limit=20` |
| `sortBy` | string | Field to sort by (default: `createdAt`) | `?sortBy=totalSales` |
| `sortOrder` | string | Sort order: `asc` or `desc` (default: `desc`) | `?sortOrder=asc` |

**Response:**

```json
{
  "success": true,
  "data": {
    "sellers": [
      {
        "id": "507f1f77bcf86cd799439014",
        "company": {
          "name": "Fazenda Verde",
          "description": "Produtos orgânicos frescos"
        },
        "contact": {
          "name": "João Silva",
          "email": "joao@fazendaverde.com",
          "phone": "+258841234567"
        },
        "productCount": 15,
        "totalSales": 12500.00,
        "averageRating": 4.8,
        "totalReviews": 45,
        "status": "active",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-20T14:20:00.000Z"
      }
    ],
    "total": 200,
    "page": 1,
    "limit": 10,
    "totalPages": 20
  }
}
```

---

### 3. Get Seller by ID

**GET** `/api/v1/admin/sellers/:sellerId`

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439014",
    "company": {
      "name": "Fazenda Verde",
      "description": "Produtos orgânicos frescos",
      "address": "Rua Example, 123",
      "city": "Maputo",
      "province": "Maputo",
      "postalCode": "1100",
      "productTypes": "Frutas e Legumes",
      "experience": "10 anos de experiência"
    },
    "contact": {
      "name": "João Silva",
      "firstName": "João",
      "lastName": "Silva",
      "email": "joao@fazendaverde.com",
      "phone": "+258841234567"
    },
    "statistics": {
      "productCount": 15,
      "averageRating": 4.8,
      "totalReviews": 45,
      "totalViews": 1250,
      "totalPurchases": 450,
      "totalOrders": 120,
      "totalSales": 12500.00,
      "totalQuantitySold": 450
    },
    "status": "active",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-20T14:20:00.000Z"
  }
}
```

---

### 4. Update Seller Status

**PATCH** `/api/v1/admin/sellers/:sellerId/status`

**Request Body:**

```json
{
  "status": "active"
}
```

**Valid Status Values:**
- `active` → Approved
- `inactive` → Pending
- `suspended` → Rejected

**Response:**

```json
{
  "success": true,
  "message": "Seller status updated successfully",
  "data": {
    // Full seller object
  }
}
```

---

## Status Labels (Portuguese)

| Status | Label | Color |
|--------|-------|-------|
| `active` | Aprovado | Green |
| `inactive` | Pendente | Yellow |
| `suspended` | Rejeitado | Red |

---

## TypeScript Interfaces

```typescript
interface SellerStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  totalSales: number;
  averageRating: number;
}

interface Seller {
  id: string;
  company: {
    name: string;
    description?: string;
  };
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  productCount: number;
  totalSales: number;
  averageRating: number;
  totalReviews: number;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

interface SellerDetails extends Seller {
  company: {
    name: string;
    description?: string;
    address?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    productTypes?: string;
    experience?: string;
  };
  contact: {
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  statistics: {
    productCount: number;
    averageRating: number;
    totalReviews: number;
    totalViews: number;
    totalPurchases: number;
    totalOrders: number;
    totalSales: number;
    totalQuantitySold: number;
  };
}
```

---

## Notes

- Sellers are users with `role: 'seller'`
- Status `active` = approved, `inactive` = pending approval, `suspended` = rejected
- Sales are calculated from completed orders (excluding cancelled)
- Ratings are aggregated from seller's products
- All prices in MZM (Mozambican Metical)

