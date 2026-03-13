### Order Cancellation – Frontend Integration Guide

This document explains how the frontend should call the **order cancellation** endpoint.

---

### 1. Endpoint

- **Method**: `POST`  
- **URL**: `/api/v1/orders/:orderId/cancel`  
- **Auth**: `Authorization: Bearer <user-token>` (logged-in buyer)

`orderId` is the backend `_id` of the order.

---

### 2. Request Body

Validated by `cancelOrderSchema`:

```json
{
  "reason": "string (10–500 characters, required)"
}
```

Example:

```http
POST /api/v1/orders/64f2c3b1e1e4ab0012345678/cancel
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "I need to change my shipping address before it ships."
}
```

---

### 3. Response

On success (HTTP `200`):

```json
{
  "success": true,
  "message": "Pedido cancelado com sucesso",
  "data": {
    "order": {
      /* full order object, now with status = "cancelled" */
    }
  }
}
```

On failure (HTTP `400` / `500`), you will get:

```json
{
  "success": false,
  "message": "Falha ao cancelar pedido",
  "error": "detailed error message"
}
```

Relevant error cases for the UI:

- Order not found
- Order cannot be canceled in the current status (e.g. already shipped or delivered)
- Reason too short / missing (validation error)

---

### 4. When the Frontend Should Show “Cancel Order”

The backend allows cancellation while:

- `order.status` is one of: `pending`, `confirmed`, or `processing`

Recommended UI rule:

- Show the **Cancel Order** button only if:
  - The user is the owner of the order, and
  - `status` is `pending`, `confirmed`, or `processing`.

---

### 5. Typical Frontend Flow (Pseudo‑code)

```ts
async function cancelOrder(orderId: string, reason: string) {
  const res = await fetch(`/api/v1/orders/${orderId}/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ reason })
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || json.message || 'Failed to cancel order');
  }

  return json.data.order;
}
```

