# Admin Order Management API Documentation

## Overview

The Admin Order Management API provides comprehensive endpoints for managing orders in the administrative panel. This includes listing orders with filters, viewing order details, and updating order statuses.

## Base URL

All endpoints are prefixed with: `/api/v1/admin/orders`

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

### 1. Get Order Statistics

Get summary statistics about orders.

**Endpoint:** `GET /api/v1/admin/orders/stats`

**Response:**

```json
{
  "success": true,
  "data": {
    "total": 3450,
    "pending": 45,
    "totalRevenue": 1250000.50,
    "delivered": 2800,
    "cancelled": 205
  }
}
```

**Response Fields:**
- `total`: Total number of orders
- `pending`: Number of pending orders
- `totalRevenue`: Total revenue from all orders
- `delivered`: Number of delivered orders
- `cancelled`: Number of cancelled orders

---

### 2. Get All Orders (with filters)

Get a paginated list of orders with optional filtering and search.

**Endpoint:** `GET /api/v1/admin/orders`

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `search` | string | Search by order number, client name, or email | `?search=ORD123456` |
| `status` | string | Filter by status | `?status=pending` |
| `page` | number | Page number (default: 1) | `?page=1` |
| `limit` | number | Items per page (default: 10) | `?limit=20` |
| `sortBy` | string | Field to sort by (default: `createdAt`) | `?sortBy=total` |
| `sortOrder` | string | Sort order: `asc` or `desc` (default: `desc`) | `?sortOrder=asc` |

**Valid Status Values:**
- `pending`
- `confirmed`
- `processing`
- `shipped`
- `delivered`
- `cancelled`
- `refunded`

**Example Request:**

```
GET /api/v1/admin/orders?search=joao&status=pending&page=1&limit=10
```

**Response:**

```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "507f1f77bcf86cd799439011",
        "orderNumber": "ORD-2024-001",
        "client": {
          "id": "507f1f77bcf86cd799439012",
          "name": "João Silva",
          "email": "joao.silva@email.com"
        },
        "total": 125.90,
        "status": "pending",
        "date": "2024-01-20T12:30:00.000Z",
        "itemCount": 3,
        "paymentStatus": "completed",
        "currency": "MZM"
      }
    ],
    "total": 3450,
    "page": 1,
    "limit": 10,
    "totalPages": 345
  }
}
```

**Order Object Fields:**
- `id`: Order ID
- `orderNumber`: Order number (e.g., "ORD-2024-001")
- `client`: Client information object
  - `id`: User ID
  - `name`: Full name
  - `email`: Email address
- `total`: Order total amount
- `status`: Order status
- `date`: Order creation date
- `itemCount`: Number of items in order
- `paymentStatus`: Payment status
- `currency`: Currency code (default: "MZM")

---

### 3. Get Order by ID

Get detailed information about a specific order.

**Endpoint:** `GET /api/v1/admin/orders/:orderId`

**Path Parameters:**
- `orderId`: Order ID (MongoDB ObjectId)

**Example Request:**

```
GET /api/v1/admin/orders/507f1f77bcf86cd799439011
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "orderNumber": "ORD-2024-001",
    "userId": "507f1f77bcf86cd799439012",
    "client": {
      "id": "507f1f77bcf86cd799439012",
      "name": "João Silva",
      "email": "joao.silva@email.com",
      "phone": "+258841234567"
    },
    "items": [
      {
        "productId": "507f1f77bcf86cd799439013",
        "productName": "Maçãs Orgânicas",
        "productImage": "https://...",
        "quantity": 2,
        "unitPrice": 25.50,
        "totalPrice": 51.00,
        "sellerId": "507f1f77bcf86cd799439014",
        "sellerName": "Fazenda Verde",
        "status": "pending"
      }
    ],
    "status": "pending",
    "subtotal": 125.90,
    "tax": 0,
    "shipping": 0,
    "discount": 0,
    "total": 125.90,
    "currency": "MZM",
    "shippingAddress": {
      "firstName": "João",
      "lastName": "Silva",
      "email": "joao.silva@email.com",
      "phone": "+258841234567",
      "address": "Rua Principal, nº 123",
      "city": "Maputo",
      "state": "Maputo",
      "country": "Mozambique",
      "zipCode": "1100"
    },
    "billingAddress": { ... },
    "payment": {
      "method": "imali",
      "status": "completed",
      "amount": 125.90,
      "currency": "MZM",
      "transactionId": "txn_123456",
      "paidAt": "2024-01-20T12:35:00.000Z"
    },
    "notes": "Please deliver before 5 PM",
    "createdAt": "2024-01-20T12:30:00.000Z",
    "updatedAt": "2024-01-20T12:35:00.000Z"
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "message": "Order not found"
}
```

---

### 4. Update Order (Full Update)

Update order details including status, payment status, client info, and delivery address.

**Endpoint:** `PUT /api/v1/admin/orders/:orderId`

**Path Parameters:**
- `orderId`: Order ID (MongoDB ObjectId)

**Request Body:**

```json
{
  "status": "confirmed",
  "paymentStatus": "completed",
  "clientInfo": {
    "firstName": "João",
    "lastName": "Silva",
    "email": "joao.silva@email.com",
    "phone": "+258841234567"
  },
  "shippingAddress": {
    "address": "Avenida 25 de Setembro, 123",
    "city": "Maputo",
    "state": "Maputo",
    "zipCode": "1100"
  },
  "notes": "Please deliver before 5 PM",
  "trackingNumber": "TRACK123456"
}
```

**All fields are optional** - only include fields you want to update.

**Response (200):**

```json
{
  "success": true,
  "message": "Order updated successfully",
  "data": {
    // Full order object (same as GET response)
  }
}
```

---

### 5. Update Order Status (Quick Action)

Update only the order status (quick action).

**Endpoint:** `PATCH /api/v1/admin/orders/:orderId/status`

**Path Parameters:**
- `orderId`: Order ID (MongoDB ObjectId)

**Request Body:**

```json
{
  "status": "shipped",
  "trackingNumber": "TRACK123456"
}
```

**Status Transitions:**
- `pending` → `confirmed` → `processing` → `shipped` → `delivered`
- `pending` → `cancelled` (with `cancelReason`)
- `delivered` → `refunded` (with `refundAmount`)

**Request Body Fields:**
- `status` (required): New order status
- `trackingNumber` (optional): Tracking number (required for `shipped` status)
- `cancelReason` (optional): Reason for cancellation (required for `cancelled` status)
- `refundAmount` (optional): Refund amount (required for `refunded` status)

**Response (200):**

```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "orderNumber": "ORD-2024-001",
    "status": "shipped",
    "items": [
      {
        "status": "shipped",
        "trackingNumber": "TRACK123456",
        "shippedAt": "2024-01-20T14:00:00.000Z"
      }
    ],
    "shippedAt": "2024-01-20T14:00:00.000Z",
    "updatedAt": "2024-01-20T14:00:00.000Z"
  }
}
```

---

## Enhanced Order View Response

The `GET /api/v1/admin/orders/:orderId` endpoint now includes additional data:

### Timeline/Activity

```json
{
  "timeline": [
    {
      "type": "order_created",
      "label": "Pedido Criado",
      "date": "2024-01-20T12:30:00.000Z",
      "color": "green"
    },
    {
      "type": "order_confirmed",
      "label": "Pedido Confirmado",
      "date": "2024-01-20T13:00:00.000Z",
      "color": "blue"
    }
  ]
}
```

### Order Summary

```json
{
  "summary": {
    "itemCount": 2,
    "subtotal": 425.00,
    "tax": 0,
    "shipping": 0,
    "discount": 0,
    "total": 425.00
  }
}
```

### Payment Labels

```json
{
  "payment": {
    "method": "credit_card",
    "methodLabel": "Cartão de Crédito",
    "status": "completed",
    "statusLabel": "Pago"
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "message": "Invalid status transition"
}
```

---

## Status Mapping

### Order Status Labels (Portuguese)
- `pending` → "Pendente" (yellow badge)
- `confirmed` → "Confirmado" (blue badge)
- `processing` → "Processando" (blue badge)
- `shipped` → "Enviado" (blue badge)
- `delivered` → "Entregue" (green badge)
- `cancelled` → "Cancelado" (red badge)
- `refunded` → "Reembolsado" (gray badge)

### Payment Status Labels
- `pending` → "Pendente"
- `processing` → "Processando"
- `completed` → "Completo"
- `failed` → "Falhou"
- `refunded` → "Reembolsado"

---

## Integration Examples

### React Hook Example

```typescript
import { useState, useEffect } from 'react';

interface Order {
  id: string;
  orderNumber: string;
  client: {
    name: string;
    email: string;
  };
  total: number;
  status: string;
  date: string;
  itemCount: number;
}

function useOrders(token: string, filters?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const [data, setData] = useState<{
    orders: Order[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        
        if (filters?.search) params.append('search', filters.search);
        if (filters?.status) params.append('status', filters.status);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.limit) params.append('limit', filters.limit.toString());

        const response = await fetch(
          `/api/v1/admin/orders?${params.toString()}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
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
      fetchOrders();
    }
  }, [token, filters]);

  return { data, loading, error };
}
```

### Get Statistics Example

```typescript
async function getOrderStats(token: string) {
  try {
    const response = await fetch('/api/v1/admin/orders/stats', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    if (result.success) {
      return result.data;
    }
  } catch (error) {
    console.error('Error fetching order stats:', error);
    throw error;
  }
}
```

### Update Status Example

```typescript
async function updateOrderStatus(
  orderId: string,
  status: string,
  options?: {
    trackingNumber?: string;
    cancelReason?: string;
    refundAmount?: number;
  }
) {
  try {
    const response = await fetch(`/api/v1/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status, ...options })
    });

    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Error updating order status:', error);
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
    title: 'Total de Pedidos',
    value: stats.total,
    subtitle: `${stats.pending} pendentes`,
    icon: 'shopping-cart'
  },
  {
    title: 'Receita Total',
    value: formatCurrency(stats.totalRevenue),
    icon: 'dollar'
  },
  {
    title: 'Pedidos Entregues',
    value: stats.delivered,
    icon: 'checkmark'
  },
  {
    title: 'Pedidos Cancelados',
    value: stats.cancelled,
    icon: 'x'
  }
];
```

### Status Badges

Use color-coded badges:
- **Pending**: Yellow (`#f59e0b`)
- **Confirmed/Processing/Shipped**: Blue (`#3b82f6`)
- **Delivered**: Green (`#10b981`)
- **Cancelled**: Red (`#ef4444`)
- **Refunded**: Gray (`#6b7280`)

### Date Formatting

Format dates consistently:
```typescript
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
```

### Currency Formatting

```typescript
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('pt-MZ', {
    style: 'currency',
    currency: 'MZN',
    minimumFractionDigits: 2
  }).format(amount);
};
```

---

## Error Handling

Always handle these error cases:

1. **401 Unauthorized**: Redirect to login
2. **403 Forbidden**: Show access denied message
3. **404 Not Found**: Show "Order not found" message
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
- Order numbers are unique and follow the format: `ORD-YYYYMMDD-####`
- Search is case-insensitive and matches order numbers, client names, and emails
- Dates are in ISO 8601 format (UTC)

---

## Additional Resources

For detailed frontend implementation examples for viewing and updating single orders, see:
- **`ADMIN_ORDER_VIEW_UPDATE_GUIDE.md`** - Complete React components and implementation guide

