# Refund API Integration Guide

## Overview

The Refund API allows buyers to request refunds for purchased products and sellers to manage refund requests for their products. All endpoints require authentication with appropriate role permissions.

**Base URL:** `/api/v1/refunds`

**Authentication:** All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

**Role Requirements:**
- Buyer endpoints: `role: 'buyer'`
- Seller endpoints: `role: 'seller'`

---

## Buyer Endpoints

### 1. Create Refund Request

Create a new refund request for a product from an order.

**Endpoint:** `POST /api/v1/refunds/request`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "orderId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "productId": "65a1b2c3d4e5f6g7h8i9j0k2",
  "reason": "Solicitado pelo cliente",
  "description": "Produto chegou danificado com manchas e rasgos visíveis.",
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "orderItemId": "optional-item-id"
}
```

**Request Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `orderId` | string | Yes | Order ID containing the product |
| `productId` | string | Yes | Product ID to refund |
| `reason` | string | Yes | Reason for refund (3-100 chars) |
| `description` | string | Yes | Detailed description (10-1000 chars) |
| `images` | string[] | No | Array of image URLs supporting the refund request |
| `orderItemId` | string | No | Optional order item identifier |

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Refund request created successfully",
  "data": {
    "refund": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
      "orderId": "65a1b2c3d4e5f6g7h8i9j0k1",
      "orderItemId": null,
      "sellerId": "65a1b2c3d4e5f6g7h8i9j0k4",
      "buyerId": "65a1b2c3d4e5f6g7h8i9j0k5",
      "productId": "65a1b2c3d4e5f6g7h8i9j0k2",
      "productName": "Camiseta Básica",
      "amount": 1500.00,
      "currency": "MZM",
      "status": "pending",
      "reason": "Solicitado pelo cliente",
      "description": "Produto chegou danificado com manchas e rasgos visíveis.",
      "images": [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg"
      ],
      "requestedAt": "2025-11-09T20:01:00.000Z",
      "createdAt": "2025-11-09T20:01:00.000Z",
      "updatedAt": "2025-11-09T20:01:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Validation error or business rule violation
  ```json
  {
    "success": false,
    "message": "Failed to create refund request",
    "error": "Order does not belong to buyer"
  }
  ```
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User is not a buyer
- `500 Internal Server Error`: Server error

**Common Errors:**
- `Order not found`
- `Order does not belong to buyer`
- `Product not found in order`
- `Refund request already exists for this product`

---

### 2. Get Buyer Refunds

Get paginated list of buyer's refund requests.

**Endpoint:** `GET /api/v1/refunds/my-refunds`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 10 | Items per page |
| `status` | string | No | - | Filter by status: `pending`, `approved`, `rejected` |

**Example Request:**
```
GET /api/v1/refunds/my-refunds?page=1&limit=10&status=pending
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Refunds retrieved successfully",
  "data": {
    "refunds": [
      {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
        "orderId": {
          "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
          "orderNumber": "ORD-2023-001234",
          "createdAt": "2025-11-09T18:00:00.000Z"
        },
        "sellerId": {
          "_id": "65a1b2c3d4e5f6g7h8i9j0k4",
          "firstName": "Helton",
          "lastName": "Helton"
        },
        "productId": {
          "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
          "name": "Camiseta Básica",
          "primaryImage": "https://example.com/product.jpg"
        },
        "productName": "Camiseta Básica",
        "amount": 1500.00,
        "currency": "MZM",
        "status": "pending",
        "reason": "Solicitado pelo cliente",
        "description": "Produto chegou danificado com manchas e rasgos visíveis.",
        "images": [
          "https://example.com/image1.jpg"
        ],
        "requestedAt": "2025-11-09T20:01:00.000Z",
        "processedAt": null,
        "rejectionReason": null,
        "createdAt": "2025-11-09T20:01:00.000Z",
        "updatedAt": "2025-11-09T20:01:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 2,
      "pages": 1
    }
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User is not a buyer
- `500 Internal Server Error`: Server error

---

### 3. Get Buyer Refund by ID

Get details of a specific refund request.

**Endpoint:** `GET /api/v1/refunds/my-refunds/:refundId`

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `refundId` | string | Yes | Refund ID |

**Example Request:**
```
GET /api/v1/refunds/my-refunds/65a1b2c3d4e5f6g7h8i9j0k3
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Refund retrieved successfully",
  "data": {
    "refund": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
      "orderId": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
        "orderNumber": "ORD-2023-001234",
        "createdAt": "2025-11-09T18:00:00.000Z",
        "total": 1500.00
      },
      "sellerId": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k4",
        "firstName": "Helton",
        "lastName": "Helton",
        "email": "helton@example.com"
      },
      "productId": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
        "name": "Camiseta Básica",
        "primaryImage": "https://example.com/product.jpg"
      },
      "productName": "Camiseta Básica",
      "amount": 1500.00,
      "currency": "MZM",
      "status": "pending",
      "reason": "Solicitado pelo cliente",
      "description": "Produto chegou danificado com manchas e rasgos visíveis.",
      "images": [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg"
      ],
      "requestedAt": "2025-11-09T20:01:00.000Z",
      "processedAt": null,
      "processedBy": null,
      "rejectionReason": null,
      "createdAt": "2025-11-09T20:01:00.000Z",
      "updatedAt": "2025-11-09T20:01:00.000Z"
    }
  }
}
```

**Error Responses:**
- `404 Not Found`: Refund not found or doesn't belong to buyer
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User is not a buyer
- `500 Internal Server Error`: Server error

---

## Seller Endpoints

### 4. Get Refund Statistics

Get refund statistics for seller's products.

**Endpoint:** `GET /api/v1/refunds/statistics`

**Headers:**
```
Authorization: Bearer <token>
```

**Request:** No body required

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Refund statistics retrieved successfully",
  "data": {
    "total": 2,
    "pending": 1,
    "approved": 1,
    "rejected": 0,
    "totalValue": 4000.00
  }
}
```

**Response Fields:**
- `total`: Total number of refund requests for seller's products
- `pending`: Number of pending refund requests
- `approved`: Number of approved refund requests
- `rejected`: Number of rejected refund requests
- `totalValue`: Total value of all refund requests (MTn)

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User is not a seller
- `500 Internal Server Error`: Server error

---

### 5. Get Seller Refunds

Get paginated list of refund requests for seller's products.

**Endpoint:** `GET /api/v1/refunds`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 10 | Items per page |
| `status` | string | No | - | Filter by status: `pending`, `approved`, `rejected` |
| `search` | string | No | - | Search by product name or reason |

**Example Request:**
```
GET /api/v1/refunds?page=1&limit=10&status=pending&search=Camiseta
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Refunds retrieved successfully",
  "data": {
    "refunds": [
      {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
        "orderId": {
          "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
          "orderNumber": "ORD-2023-001234",
          "createdAt": "2025-11-09T18:00:00.000Z"
        },
        "buyerId": {
          "_id": "65a1b2c3d4e5f6g7h8i9j0k5",
          "firstName": "João",
          "lastName": "Silva",
          "email": "joao@email.com"
        },
        "productId": {
          "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
          "name": "Camiseta Básica",
          "primaryImage": "https://example.com/product.jpg"
        },
        "productName": "Camiseta Básica",
        "amount": 1500.00,
        "currency": "MZM",
        "status": "pending",
        "reason": "Solicitado pelo cliente",
        "description": "Produto chegou danificado com manchas e rasgos visíveis.",
        "images": [
          "https://example.com/image1.jpg"
        ],
        "requestedAt": "2025-11-09T20:01:00.000Z",
        "processedAt": null,
        "rejectionReason": null,
        "createdAt": "2025-11-09T20:01:00.000Z",
        "updatedAt": "2025-11-09T20:01:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 2,
      "pages": 1
    }
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User is not a seller
- `500 Internal Server Error`: Server error

---

### 6. Get Refund by ID (Seller)

Get details of a specific refund request for seller's product.

**Endpoint:** `GET /api/v1/refunds/:refundId`

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `refundId` | string | Yes | Refund ID |

**Example Request:**
```
GET /api/v1/refunds/65a1b2c3d4e5f6g7h8i9j0k3
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Refund retrieved successfully",
  "data": {
    "refund": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
      "orderId": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
        "orderNumber": "ORD-2023-001234",
        "createdAt": "2025-11-09T18:00:00.000Z",
        "total": 1500.00
      },
      "buyerId": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k5",
        "firstName": "João",
        "lastName": "Silva",
        "email": "joao@email.com"
      },
      "productId": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
        "name": "Camiseta Básica",
        "primaryImage": "https://example.com/product.jpg"
      },
      "productName": "Camiseta Básica",
      "amount": 1500.00,
      "currency": "MZM",
      "status": "pending",
      "reason": "Solicitado pelo cliente",
      "description": "Produto chegou danificado com manchas e rasgos visíveis.",
      "images": [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg"
      ],
      "requestedAt": "2025-11-09T20:01:00.000Z",
      "processedAt": null,
      "processedBy": null,
      "rejectionReason": null,
      "createdAt": "2025-11-09T20:01:00.000Z",
      "updatedAt": "2025-11-09T20:01:00.000Z"
    }
  }
}
```

**Error Responses:**
- `404 Not Found`: Refund not found or doesn't belong to seller's products
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User is not a seller
- `500 Internal Server Error`: Server error

---

### 7. Approve Refund

Approve a pending refund request.

**Endpoint:** `PATCH /api/v1/refunds/:refundId/approve`

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `refundId` | string | Yes | Refund ID |

**Request:** No body required

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Refund approved successfully",
  "data": {
    "refund": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
      "status": "approved",
      "processedAt": "2025-11-10T10:30:00.000Z",
      "processedBy": "65a1b2c3d4e5f6g7h8i9j0k4",
      "updatedAt": "2025-11-10T10:30:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Refund is not pending or not found
  ```json
  {
    "success": false,
    "message": "Failed to approve refund",
    "error": "Refund is not pending"
  }
  ```
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User is not a seller
- `404 Not Found`: Refund not found or doesn't belong to seller
- `500 Internal Server Error`: Server error

---

### 8. Reject Refund

Reject a pending refund request with a reason.

**Endpoint:** `PATCH /api/v1/refunds/:refundId/reject`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `refundId` | string | Yes | Refund ID |

**Request Body:**
```json
{
  "rejectionReason": "Produto não apresenta os defeitos descritos após análise."
}
```

**Request Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `rejectionReason` | string | Yes | Reason for rejection (10-500 chars) |

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Refund rejected successfully",
  "data": {
    "refund": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
      "status": "rejected",
      "processedAt": "2025-11-10T10:30:00.000Z",
      "processedBy": "65a1b2c3d4e5f6g7h8i9j0k4",
      "rejectionReason": "Produto não apresenta os defeitos descritos após análise.",
      "updatedAt": "2025-11-10T10:30:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Validation error or refund is not pending
  ```json
  {
    "success": false,
    "message": "Failed to reject refund",
    "error": "Rejection reason is required"
  }
  ```
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User is not a seller
- `404 Not Found`: Refund not found or doesn't belong to seller
- `500 Internal Server Error`: Server error

**Validation Errors:**
- `Rejection reason is required`
- `Rejection reason must be at least 10 characters`
- `Rejection reason cannot exceed 500 characters`

---

## Status Values

### Refund Status
- `pending`: Refund request submitted, awaiting seller review
- `approved`: Refund approved by seller
- `rejected`: Refund rejected by seller (check `rejectionReason` field)

### Refund Reasons (Common Values)
- `Solicitado pelo cliente` - Requested by client
- `Transação fraudulenta` - Fraudulent transaction
- `Produto defeituoso` - Defective product
- `Produto não recebido` - Product not received
- `Produto incorreto` - Wrong product received
- `Outro` - Other (specify in description)

---

## Business Logic Notes

### Refund Request Creation
- Buyer can only request refunds for orders they own
- Product must exist in the order
- Only one active refund (pending or approved) per product per order
- Amount is automatically calculated from order item total price
- Seller ID is automatically extracted from order item

### Refund Approval/Rejection
- Only pending refunds can be approved/rejected
- Seller can only approve/reject refunds for their own products
- Once approved/rejected, status cannot be changed
- Rejection requires a reason (10-500 characters)

### Refund Amount
- Amount is calculated from the order item's `totalPrice`
- Currency matches the order currency (default: MZM)
- No partial refunds supported (full item amount)

---

## Example Frontend Integration

### React/TypeScript Example

```typescript
// Types
interface Refund {
  _id: string;
  orderId: string | { _id: string; orderNumber: string; createdAt: string };
  sellerId: string | { _id: string; firstName: string; lastName: string; email?: string };
  buyerId: string | { _id: string; firstName: string; lastName: string; email?: string };
  productId: string | { _id: string; name: string; primaryImage?: string };
  productName: string;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  description: string;
  images?: string[];
  requestedAt: string;
  processedAt?: string;
  processedBy?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

interface RefundStatistics {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  totalValue: number;
}

// API Service
class RefundService {
  private baseUrl = '/api/v1/refunds';
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }

    const data = await response.json();
    return data.data;
  }

  // Buyer methods
  async createRefundRequest(data: {
    orderId: string;
    productId: string;
    reason: string;
    description: string;
    images?: string[];
    orderItemId?: string;
  }): Promise<{ refund: Refund }> {
    return this.request<{ refund: Refund }>('/request', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getBuyerRefunds(page = 1, limit = 10, status?: string): Promise<{
    refunds: Refund[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (status) params.append('status', status);

    return this.request(`/my-refunds?${params.toString()}`);
  }

  async getBuyerRefundById(refundId: string): Promise<{ refund: Refund }> {
    return this.request<{ refund: Refund }>(`/my-refunds/${refundId}`);
  }

  // Seller methods
  async getStatistics(): Promise<RefundStatistics> {
    return this.request<RefundStatistics>('/statistics');
  }

  async getSellerRefunds(
    page = 1,
    limit = 10,
    status?: string,
    search?: string
  ): Promise<{
    refunds: Refund[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (status) params.append('status', status);
    if (search) params.append('search', search);

    return this.request(`?${params.toString()}`);
  }

  async getRefundById(refundId: string): Promise<{ refund: Refund }> {
    return this.request<{ refund: Refund }>(`/${refundId}`);
  }

  async approveRefund(refundId: string): Promise<{ refund: Refund }> {
    return this.request<{ refund: Refund }>(`/${refundId}/approve`, {
      method: 'PATCH',
    });
  }

  async rejectRefund(
    refundId: string,
    rejectionReason: string
  ): Promise<{ refund: Refund }> {
    return this.request<{ refund: Refund }>(`/${refundId}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ rejectionReason }),
    });
  }
}

// Usage Examples

// Buyer: Create refund request
const refundService = new RefundService(userToken);
try {
  const result = await refundService.createRefundRequest({
    orderId: '65a1b2c3d4e5f6g7h8i9j0k1',
    productId: '65a1b2c3d4e5f6g7h8i9j0k2',
    reason: 'Solicitado pelo cliente',
    description: 'Produto chegou danificado com manchas e rasgos visíveis.',
    images: ['https://example.com/image1.jpg']
  });
  console.log('Refund requested:', result.refund._id);
} catch (error) {
  console.error('Refund request failed:', error.message);
}

// Buyer: Get refunds
const buyerRefunds = await refundService.getBuyerRefunds(1, 10, 'pending');
console.log('Pending refunds:', buyerRefunds.refunds);

// Seller: Get statistics
const stats = await refundService.getStatistics();
console.log(`Total: ${stats.total}, Pending: ${stats.pending}`);

// Seller: Approve refund
try {
  await refundService.approveRefund('65a1b2c3d4e5f6g7h8i9j0k3');
  console.log('Refund approved');
} catch (error) {
  console.error('Approval failed:', error.message);
}

// Seller: Reject refund
try {
  await refundService.rejectRefund(
    '65a1b2c3d4e5f6g7h8i9j0k3',
    'Produto não apresenta os defeitos descritos após análise.'
  );
  console.log('Refund rejected');
} catch (error) {
  console.error('Rejection failed:', error.message);
}
```

---

## Error Handling Best Practices

1. **Always check response status** before accessing data
2. **Handle validation errors** - Check for `errors` array in 400 responses
3. **Display user-friendly messages** - Map error messages to user-friendly text
4. **Status-specific handling**:
   - `pending`: Show "Awaiting seller review"
   - `approved`: Show "Refund approved" with processed date
   - `rejected`: Show "Refund rejected" with rejection reason
5. **Retry logic** - Consider retry for 500 errors
6. **Token refresh** - Handle 401 errors by refreshing token or redirecting to login

---

## UI Recommendations

### Buyer Refund Request Form
- Show order items that can be refunded
- Allow image upload (convert to URLs before sending)
- Pre-fill product and order information
- Validate reason and description length before submission
- Show success message with refund ID

### Seller Refund Dashboard
- Display statistics cards (Total, Pending, Approved, Rejected, Total Value)
- Filterable refund list with search
- Status badges with appropriate colors:
  - Pending: Yellow/Orange
  - Approved: Green
  - Rejected: Red
- Quick actions: Approve/Reject buttons
- Refund detail modal with buyer info, images, and reason

### Refund Status Display
- **Pending**: "Aguardando análise do vendedor" (Awaiting seller review)
- **Approved**: "Reembolso aprovado" (Refund approved) + processed date
- **Rejected**: "Reembolso rejeitado" (Refund rejected) + rejection reason

---

## Testing Scenarios

### Buyer Scenarios
1. **Create Refund Request**
   - Request refund for own order (should succeed)
   - Request refund for someone else's order (should fail with 400)
   - Request duplicate refund (should fail with 400)
   - Request with invalid data (should fail validation)

2. **View Refunds**
   - Get all refunds (should return buyer's refunds only)
   - Filter by status (should return filtered results)
   - Pagination (should work correctly)

### Seller Scenarios
1. **View Refunds**
   - Get refunds (should return only seller's product refunds)
   - Search functionality (should filter by product name/reason)
   - Statistics (should calculate correctly)

2. **Approve/Reject**
   - Approve pending refund (should succeed)
   - Reject pending refund with reason (should succeed)
   - Approve already processed refund (should fail with 400)
   - Approve refund from different seller (should fail with 404)

---

## Support

For questions or issues, contact the backend team or refer to the main API documentation.

**Last Updated:** January 2024

