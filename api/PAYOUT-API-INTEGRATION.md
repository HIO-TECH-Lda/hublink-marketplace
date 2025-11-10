# Seller Payout/Transfer API Integration Guide

## Overview

The Payout API allows sellers to view their earnings balance, request transfers, and view payout history. All endpoints require seller authentication.

**Base URL:** `/api/v1/payouts`

**Authentication:** All endpoints require a valid JWT token with `role: 'seller'` in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Get Seller Balance

Get the seller's available balance, pending balance, and total earnings.

**Endpoint:** `GET /api/v1/payouts/balance`

**Headers:**
```
Authorization: Bearer <token>
```

**Request:** No body required

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Balance retrieved successfully",
  "data": {
    "available": 1203525.00,
    "pending": 185040.00,
    "totalEarned": 1463590.00
  }
}
```

**Response Fields:**
- `available`: Amount available for withdrawal (from delivered orders with completed payments, not yet paid out)
- `pending`: Amount pending (from processing/shipped orders or pending payments)
- `totalEarned`: Total earnings all-time (after 10% commission deduction)

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User is not a seller
- `500 Internal Server Error`: Server error

---

### 2. Get Payout History

Get paginated list of payout/transfer history.

**Endpoint:** `GET /api/v1/payouts/history`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 10 | Items per page |
| `status` | string | No | - | Filter by status: `pending`, `processing`, `completed`, `failed` |

**Example Request:**
```
GET /api/v1/payouts/history?page=1&limit=10&status=completed
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Payout history retrieved successfully",
  "data": {
    "payouts": [
      {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
        "sellerId": "65a1b2c3d4e5f6g7h8i9j0k2",
        "amount": 112080.00,
        "currency": "MZM",
        "status": "completed",
        "method": "mpesa",
        "periodStart": "2023-11-16T00:00:00.000Z",
        "periodEnd": "2023-11-30T23:59:59.999Z",
        "orderIds": [
          "65a1b2c3d4e5f6g7h8i9j0k3",
          "65a1b2c3d4e5f6g7h8i9j0k4"
        ],
        "commissionRate": 10,
        "commissionAmount": 0,
        "netAmount": 112080.00,
        "processedAt": "2023-12-01T10:30:00.000Z",
        "createdAt": "2023-12-01T09:00:00.000Z",
        "updatedAt": "2023-12-01T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 12,
      "pages": 2
    }
  }
}
```

**Payout Object Fields:**
- `_id`: Payout ID
- `sellerId`: Seller user ID
- `amount`: Requested payout amount (MTn)
- `currency`: Currency code (default: "MZM")
- `status`: Payout status (`pending`, `processing`, `completed`, `failed`)
- `method`: Payment method (`mpesa`, `bank_transfer`, `emola`)
- `periodStart`: Start date of the period covered
- `periodEnd`: End date of the period covered
- `orderIds`: Array of order IDs included in this payout
- `commissionRate`: Commission percentage (10%)
- `commissionAmount`: Commission amount (already deducted, typically 0)
- `netAmount`: Net amount after commission (same as amount)
- `processedAt`: Date when payout was processed (null if pending)
- `failureReason`: Reason for failure (only if status is `failed`)
- `createdAt`: Payout creation date
- `updatedAt`: Last update date

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User is not a seller
- `500 Internal Server Error`: Server error

---

### 3. Request Payout

Request a new payout/transfer.

**Endpoint:** `POST /api/v1/payouts/request`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "amount": 112080.00,
  "method": "mpesa"
}
```

**Request Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `amount` | number | Yes | Amount to withdraw (must be > 0.01 and ≤ available balance) |
| `method` | string | Yes | Payment method: `mpesa`, `bank_transfer`, or `emola` |

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Payout requested successfully",
  "data": {
    "payout": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "sellerId": "65a1b2c3d4e5f6g7h8i9j0k2",
      "amount": 112080.00,
      "currency": "MZM",
      "status": "pending",
      "method": "mpesa",
      "periodStart": "2023-11-16T00:00:00.000Z",
      "periodEnd": "2023-11-30T23:59:59.999Z",
      "orderIds": [
        "65a1b2c3d4e5f6g7h8i9j0k3",
        "65a1b2c3d4e5f6g7h8i9j0k4"
      ],
      "commissionRate": 10,
      "commissionAmount": 0,
      "netAmount": 112080.00,
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Validation error or insufficient balance
  ```json
  {
    "success": false,
    "message": "Failed to request payout",
    "error": "Insufficient available balance"
  }
  ```
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User is not a seller
- `500 Internal Server Error`: Server error

**Validation Errors:**
- `Amount must be at least 0.01`
- `Amount is required`
- `Method must be mpesa, bank_transfer, or emola`
- `Payment method is required`

---

### 4. Get Payout by ID

Get details of a specific payout.

**Endpoint:** `GET /api/v1/payouts/:payoutId`

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `payoutId` | string | Yes | Payout ID |

**Example Request:**
```
GET /api/v1/payouts/65a1b2c3d4e5f6g7h8i9j0k1
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Payout retrieved successfully",
  "data": {
    "payout": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "sellerId": "65a1b2c3d4e5f6g7h8i9j0k2",
      "amount": 112080.00,
      "currency": "MZM",
      "status": "completed",
      "method": "mpesa",
      "periodStart": "2023-11-16T00:00:00.000Z",
      "periodEnd": "2023-11-30T23:59:59.999Z",
      "orderIds": [
        {
          "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
          "orderNumber": "ORD-2023-001234",
          "total": 56040.00
        },
        {
          "_id": "65a1b2c3d4e5f6g7h8i9j0k4",
          "orderNumber": "ORD-2023-001235",
          "total": 56040.00
        }
      ],
      "commissionRate": 10,
      "commissionAmount": 0,
      "netAmount": 112080.00,
      "processedAt": "2023-12-01T10:30:00.000Z",
      "createdAt": "2023-12-01T09:00:00.000Z",
      "updatedAt": "2023-12-01T10:30:00.000Z"
    }
  }
}
```

**Error Responses:**
- `404 Not Found`: Payout not found or doesn't belong to seller
  ```json
  {
    "success": false,
    "message": "Payout not found"
  }
  ```
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User is not a seller
- `500 Internal Server Error`: Server error

---

## Status Values

### Payout Status
- `pending`: Payout requested, awaiting processing
- `processing`: Payout is being processed
- `completed`: Payout successfully completed
- `failed`: Payout failed (check `failureReason` field)

### Payment Methods
- `mpesa`: M-Pesa mobile money transfer
- `bank_transfer`: Bank account transfer
- `emola`: E-Mola mobile money transfer

---

## Business Logic Notes

### Commission Calculation
- **Commission Rate:** 10% (fixed)
- Commission is automatically deducted when calculating earnings
- `available` and `pending` balances already reflect net amounts (after commission)
- When requesting a payout, the `amount` is the net amount the seller will receive

### Balance Calculation
- **Available Balance:** Sum of net earnings from delivered orders with completed payments that haven't been included in a completed/processing payout
- **Pending Balance:** Sum of net earnings from orders with status `processing`, `shipped`, or `confirmed`, or orders with `payment.status` of `processing`
- **Total Earned:** All-time total net earnings (after commission) from all seller's orders

### Payout Request Logic
- Only available balance can be withdrawn
- System automatically selects orders to fulfill the requested amount
- Orders are selected from oldest to newest
- Each order can only be included in one payout (prevents double-payout)

---

## Example Frontend Integration

### React/TypeScript Example

```typescript
// Types
interface Balance {
  available: number;
  pending: number;
  totalEarned: number;
}

interface Payout {
  _id: string;
  sellerId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  method: 'mpesa' | 'bank_transfer' | 'emola';
  periodStart: string;
  periodEnd: string;
  orderIds: string[];
  netAmount: number;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// API Service
class PayoutService {
  private baseUrl = '/api/v1/payouts';
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

  async getBalance(): Promise<Balance> {
    return this.request<Balance>('/balance');
  }

  async getHistory(page = 1, limit = 10, status?: string): Promise<{
    payouts: Payout[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (status) params.append('status', status);

    return this.request(`/history?${params.toString()}`);
  }

  async requestPayout(amount: number, method: 'mpesa' | 'bank_transfer' | 'emola'): Promise<{ payout: Payout }> {
    return this.request<{ payout: Payout }>('/request', {
      method: 'POST',
      body: JSON.stringify({ amount, method }),
    });
  }

  async getPayoutById(payoutId: string): Promise<{ payout: Payout }> {
    return this.request<{ payout: Payout }>(`/${payoutId}`);
  }
}

// Usage
const payoutService = new PayoutService(userToken);

// Get balance
const balance = await payoutService.getBalance();
console.log(`Available: MTn ${balance.available}`);

// Request payout
try {
  const result = await payoutService.requestPayout(112080.00, 'mpesa');
  console.log('Payout requested:', result.payout._id);
} catch (error) {
  console.error('Payout request failed:', error.message);
}

// Get history
const history = await payoutService.getHistory(1, 10);
console.log('Payouts:', history.payouts);
```

---

## Error Handling Best Practices

1. **Always check response status** before accessing data
2. **Handle validation errors** - Check for `errors` array in 400 responses
3. **Display user-friendly messages** - Map error messages to user-friendly text
4. **Retry logic** - Consider retry for 500 errors
5. **Token refresh** - Handle 401 errors by refreshing token or redirecting to login

---

## Testing

### Test Scenarios

1. **Get Balance**
   - Verify correct calculation of available, pending, and total
   - Test with no orders (should return zeros)

2. **Request Payout**
   - Request amount ≤ available balance (should succeed)
   - Request amount > available balance (should fail with 400)
   - Request with invalid method (should fail validation)

3. **Get History**
   - Test pagination
   - Test status filtering
   - Test with no payouts (should return empty array)

4. **Get Payout by ID**
   - Test with valid payout ID (should return payout)
   - Test with invalid payout ID (should return 404)
   - Test with payout from different seller (should return 404)

---

## Support

For questions or issues, contact the backend team or refer to the main API documentation.

**Last Updated:** January 2024

