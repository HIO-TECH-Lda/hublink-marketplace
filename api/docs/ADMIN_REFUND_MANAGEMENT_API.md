# Admin Refund Management API Documentation

## Overview

The Admin Refund Management API provides comprehensive endpoints for managing refunds in the administrative panel. This includes listing refunds with filters, viewing refund details, and approving/rejecting refund requests.

## Base URL

All endpoints are prefixed with: `/api/v1/admin/refunds`

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

### 1. Get Refund Statistics

Get summary statistics about refunds.

**Endpoint:** `GET /api/v1/admin/refunds/stats`

**Response:**

```json
{
  "success": true,
  "data": {
    "total": 125,
    "pending": 8,
    "approved": 95,
    "rejected": 22,
    "totalValue": 4597.00
  }
}
```

**Response Fields:**
- `total`: Total number of refund requests
- `pending`: Number of pending refunds
- `approved`: Number of approved refunds
- `rejected`: Number of rejected refunds
- `totalValue`: Total value of all refunds (in MZM)

---

### 2. Get All Refunds (with filters)

Get a paginated list of refunds with optional filtering and search.

**Endpoint:** `GET /api/v1/admin/refunds`

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `search` | string | Search by refund ID, order number, client name, or email | `?search=re_1` |
| `status` | string | Filter by status: `pending`, `approved`, `rejected` | `?status=pending` |
| `page` | number | Page number (default: 1) | `?page=1` |
| `limit` | number | Items per page (default: 10) | `?limit=20` |
| `sortBy` | string | Field to sort by (default: `createdAt`) | `?sortBy=amount` |
| `sortOrder` | string | Sort order: `asc` or `desc` (default: `desc`) | `?sortOrder=asc` |

**Example Request:**

```
GET /api/v1/admin/refunds?search=joao&status=pending&page=1&limit=10
```

**Response:**

```json
{
  "success": true,
  "data": {
    "refunds": [
      {
        "id": "507f1f77bcf86cd799439011",
        "refundNumber": "re_439011",
        "order": {
          "id": "507f1f77bcf86cd799439012",
          "orderNumber": "ORD-2024-001",
          "date": "2024-01-20T12:30:00.000Z"
        },
        "client": {
          "id": "507f1f77bcf86cd799439013",
          "name": "João Silva",
          "email": "joao.silva@email.com"
        },
        "seller": {
          "id": "507f1f77bcf86cd799439014",
          "name": "Banca da Maria"
        },
        "product": {
          "id": "507f1f77bcf86cd799439015",
          "name": "Maçãs Orgânicas",
          "image": "https://..."
        },
        "amount": 2097.00,
        "currency": "MZM",
        "status": "pending",
        "reason": "Solicitado pelo cliente",
        "description": "Os produtos chegaram danificados...",
        "images": ["https://..."],
        "requestedAt": "2024-01-20T12:30:00.000Z",
        "processedAt": null,
        "processedBy": null,
        "rejectionReason": null,
        "createdAt": "2024-01-20T12:30:00.000Z",
        "updatedAt": "2024-01-20T12:30:00.000Z"
      }
    ],
    "total": 125,
    "page": 1,
    "limit": 10,
    "totalPages": 13
  }
}
```

**Refund Object Fields:**
- `id`: Refund ID
- `refundNumber`: Formatted refund number (e.g., "re_439011")
- `order`: Order information object
  - `id`: Order ID
  - `orderNumber`: Order number
  - `date`: Order creation date
- `client`: Client information object
  - `id`: User ID
  - `name`: Full name
  - `email`: Email address
- `seller`: Seller information object
  - `id`: Seller ID
  - `name`: Store name or seller name
- `product`: Product information object
  - `id`: Product ID
  - `name`: Product name
  - `image`: Product image URL
- `amount`: Refund amount
- `currency`: Currency code (default: "MZM")
- `status`: Refund status (`pending`, `approved`, `rejected`)
- `reason`: Refund reason
- `description`: Detailed description
- `images`: Array of image URLs
- `requestedAt`: Request date
- `processedAt`: Processing date (if processed)
- `processedBy`: Admin who processed it (if processed)
- `rejectionReason`: Rejection reason (if rejected)

---

### 3. Get Refund by ID

Get detailed information about a specific refund.

**Endpoint:** `GET /api/v1/admin/refunds/:refundId`

**Path Parameters:**
- `refundId`: Refund ID (MongoDB ObjectId)

**Example Request:**

```
GET /api/v1/admin/refunds/507f1f77bcf86cd799439011
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "refundNumber": "re_439011",
    "orderId": "507f1f77bcf86cd799439012",
    "order": {
      "id": "507f1f77bcf86cd799439012",
      "orderNumber": "ORD-2024-001",
      "total": 425.00,
      "status": "delivered",
      "createdAt": "2024-01-20T12:30:00.000Z"
    },
    "buyerId": "507f1f77bcf86cd799439013",
    "client": {
      "id": "507f1f77bcf86cd799439013",
      "name": "João Silva",
      "email": "joao.silva@email.com",
      "phone": "+258841234567"
    },
    "sellerId": "507f1f77bcf86cd799439014",
    "seller": {
      "id": "507f1f77bcf86cd799439014",
      "name": "Banca da Maria",
      "email": "maria@email.com"
    },
    "productId": "507f1f77bcf86cd799439015",
    "product": {
      "id": "507f1f77bcf86cd799439015",
      "name": "Maçãs Orgânicas",
      "image": "https://...",
      "description": "Fresh organic apples"
    },
    "productName": "Maçãs Orgânicas",
    "amount": 2097.00,
    "currency": "MZM",
    "status": "pending",
    "reason": "Solicitado pelo cliente",
    "description": "Os produtos chegaram danificados. As cebolas estavam murchas e as batatas doces tinham manchas escuras.",
    "images": ["https://..."],
    "requestedAt": "2024-01-20T12:30:00.000Z",
    "processedAt": null,
    "processedBy": null,
    "rejectionReason": null,
    "createdAt": "2024-01-20T12:30:00.000Z",
    "updatedAt": "2024-01-20T12:30:00.000Z"
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "message": "Refund not found"
}
```

---

### 4. Approve Refund

Approve a pending refund request.

**Endpoint:** `PATCH /api/v1/admin/refunds/:refundId/approve`

**Path Parameters:**
- `refundId`: Refund ID (MongoDB ObjectId)

**Response (200):**

```json
{
  "success": true,
  "message": "Refund approved successfully",
  "data": {
    // Full refund object (same as GET response)
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "message": "Refund is already approved"
}
```

---

### 5. Reject Refund

Reject a pending refund request.

**Endpoint:** `PATCH /api/v1/admin/refunds/:refundId/reject`

**Path Parameters:**
- `refundId`: Refund ID (MongoDB ObjectId)

**Request Body:**

```json
{
  "rejectionReason": "Produto está em condições adequadas conforme descrição"
}
```

**Required Fields:**
- `rejectionReason`: Reason for rejection (string)

**Response (200):**

```json
{
  "success": true,
  "message": "Refund rejected successfully",
  "data": {
    // Full refund object with updated status
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "message": "Rejection reason is required"
}
```

---

## Status Mapping

### Refund Status Labels (Portuguese)
- `pending` → "Pendente" (yellow badge)
- `approved` → "Aprovado" (green badge)
- `rejected` → "Rejeitado" (red badge)

---

## Integration Examples

### React Hook Example

```typescript
import { useState, useEffect } from 'react';

interface Refund {
  id: string;
  refundNumber: string;
  order: {
    orderNumber: string;
    date: string;
  };
  client: {
    name: string;
    email: string;
  };
  seller: {
    name: string;
  };
  product: {
    name: string;
    image: string;
  };
  amount: number;
  status: string;
  reason: string;
  description: string;
  images: string[];
}

function useRefunds(token: string, filters?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const [data, setData] = useState<{
    refunds: Refund[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRefunds() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        
        if (filters?.search) params.append('search', filters.search);
        if (filters?.status) params.append('status', filters.status);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.limit) params.append('limit', filters.limit.toString());

        const response = await fetch(
          `/api/v1/admin/refunds?${params.toString()}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch refunds');
        }

        const result = await response.json();
        if (result.success) {
          setData(result.data);
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchRefunds();
    }
  }, [token, filters]);

  return { data, loading, error };
}
```

### Approve Refund Example

```typescript
async function approveRefund(refundId: string) {
  try {
    const response = await fetch(`/api/v1/admin/refunds/${refundId}/approve`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Error approving refund:', error);
    throw error;
  }
}
```

### Reject Refund Example

```typescript
async function rejectRefund(refundId: string, rejectionReason: string) {
  try {
    const response = await fetch(`/api/v1/admin/refunds/${refundId}/reject`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ rejectionReason })
    });

    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Error rejecting refund:', error);
    throw error;
  }
}
```

---

## UI Recommendations

### Summary Cards

```typescript
const statsCards = [
  {
    title: 'Total',
    value: stats.total,
    icon: 'dollar'
  },
  {
    title: 'Pendentes',
    value: stats.pending,
    icon: 'clock',
    color: 'yellow'
  },
  {
    title: 'Aprovados',
    value: stats.approved,
    icon: 'checkmark',
    color: 'green'
  },
  {
    title: 'Rejeitados',
    value: stats.rejected,
    icon: 'x',
    color: 'red'
  },
  {
    title: 'Valor Total',
    value: formatCurrency(stats.totalValue),
    icon: 'dollar'
  }
];
```

### Status Badges

Use color-coded badges:
- **Pending**: Yellow (`#f59e0b`)
- **Approved**: Green (`#10b981`)
- **Rejected**: Red (`#ef4444`)

### Refund List Item Format

```typescript
// Display format for refund list
{
  header: `Reembolso #${refund.refundNumber}`,
  orderInfo: `Pedido #${refund.order.orderNumber} • ${formatDate(refund.order.date)}`,
  client: refund.client.name,
  email: refund.client.email,
  reason: refund.reason,
  description: refund.description,
  seller: refund.seller.name,
  status: refund.status,
  amount: formatCurrency(refund.amount)
}
```

---

## Error Handling

Always handle these error cases:

1. **401 Unauthorized**: Redirect to login
2. **403 Forbidden**: Show access denied message
3. **404 Not Found**: Show "Refund not found" message
4. **400 Bad Request**: Show validation error message
5. **500 Server Error**: Show generic error message

---

## Rate Limiting

The API has rate limiting enabled:
- **Limit**: 1000 requests per 15 minutes per IP
- If rate limited, you'll receive a `429 Too Many Requests` response

---

## Notes

- All monetary values are in MZM (Mozambican Metical)
- Refund numbers are formatted as `re_XXXXXX` (last 6 characters of ID)
- Search is case-insensitive and matches refund IDs, order numbers, client names, and emails
- Dates are in ISO 8601 format (UTC)
- Only pending refunds can be approved or rejected

