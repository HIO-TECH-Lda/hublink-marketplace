### Admin Payments API – Frontend Integration

This document describes how the frontend admin "Payments" page should consume the new backend endpoint.

---

### 1. Endpoint

- **Method**: `GET`  
- **URL**: `/api/payments/admin`  
- **Auth**: `Authorization: Bearer <admin-token>` (admin role required)

---

### 2. Query Parameters (optional)

- **`page`**: number, default `1`  
- **`limit`**: number, default `20`, max `100`  
- **`status`**: payment status  
  - One of: `pending`, `processing`, `completed`, `failed`, `refunded`
- **`method`**: payment method  
  - Examples: `credit_card`, `debit_card`, `paypal`, `bank_transfer`, `cash_on_delivery`, `mpesa`, `emola`, `imali`, `stripe`
- **`gateway`**: gateway provider  
  - Examples: `stripe`, `manual`

Example:

```http
GET /api/payments/admin?page=1&limit=20&status=completed&method=stripe
Authorization: Bearer <admin-token>
```

---

### 3. Response Shape

```json
{
  "success": true,
  "message": "Pagamentos obtidos com sucesso",
  "data": {
    "items": [
      {
        "_id": "pay_123",
        "orderId": {
          "_id": "ord_1",
          "orderNumber": "ORD-20250101-0001",
          "status": "confirmed",
          "total": 1500,
          "currency": "MZM",
          "userId": "user_1",
          "items": [
            {
              "productId": "prod_1",
              "productName": "Produto A",
              "sellerId": "seller_1",
              "sellerName": "Loja XPTO",
              "quantity": 2,
              "unitPrice": 500,
              "totalPrice": 1000
            }
          ],
          "createdAt": "2025-01-01T12:34:56.000Z",
          "updatedAt": "2025-01-01T12:35:10.000Z"
        },
        "userId": {
          "_id": "user_1",
          "name": "João Silva",
          "email": "joao@example.com"
        },
        "amount": 1500,
        "currency": "MZM",
        "method": "stripe",
        "gateway": "stripe",
        "status": "completed",
        "gatewayTransactionId": "pi_abc",
        "createdAt": "2025-01-01T12:34:56.000Z",
        "updatedAt": "2025-01-01T12:35:10.000Z"
      }
    ],
    "total": 123,
    "page": 1,
    "limit": 20,
    "stats": {
      "total": 123,
      "pending": 5,
      "processing": 3,
      "completed": 100,
      "failed": 10,
      "refunded": 5,
      "totalRevenue": 45000
    }
  }
}
```

#### Key fields for the UI

- **Payment**
  - `payment._id`
  - `payment.createdAt`
  - `payment.status`
  - `payment.amount`, `payment.currency`
  - `payment.method`, `payment.gateway`
  - `payment.gatewayTransactionId`

- **Buyer (from `userId` populate)**
  - `payment.userId._id`
  - `payment.userId.name`
  - `payment.userId.email`

- **Order (from `orderId` populate)**
  - `payment.orderId._id`
  - `payment.orderId.orderNumber`
  - `payment.orderId.status`
  - `payment.orderId.total`, `payment.orderId.currency`
  - `payment.orderId.createdAt`

- **Products & Seller (from `orderId.items`)**
  - `payment.orderId.items[*].productId`
  - `payment.orderId.items[*].productName`
  - `payment.orderId.items[*].sellerId`
  - `payment.orderId.items[*].sellerName`
  - `payment.orderId.items[*].quantity`, `unitPrice`, `totalPrice`

- **Stats (aggregated for the current filter)**
  - `stats.total` – number of payments in this result set
  - `stats.pending`, `stats.processing`, `stats.completed`, `stats.failed`, `stats.refunded`
  - `stats.totalRevenue` – sum of `amount` for all payments in this result set

---

### 4. Frontend Usage Hints

- **Table row**
  - Date: `payment.createdAt`
  - Order: `payment.orderId.orderNumber`
  - Buyer: `payment.userId.name` + `payment.userId.email`
  - Seller: e.g. `payment.orderId.items[0].sellerName`
  - Amount: `payment.amount` + `payment.currency`
  - Status: `payment.status`
  - Method / Gateway: `payment.method` / `payment.gateway`

- **Filters → Query params**
  - Status filter → `status=<value>`
  - Method filter → `method=<value>`
  - Gateway filter → `gateway=<value>`
  - Pagination → `page`, `limit`

