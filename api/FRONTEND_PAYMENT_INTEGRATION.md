# Payment Integration Guide for Frontend Team

## Overview

This document provides comprehensive guidance for integrating payment functionality into the frontend application. The API supports a **unified payment endpoint** that automatically handles different payment methods based on the order's payment method, plus dedicated endpoints for admin management.

**Base URL:** `/api/v1/payments`

## Table of Contents

1. [Payment Status Lifecycle](#payment-status-lifecycle)
2. [Payment Methods Supported](#payment-methods-supported)
3. [API Reference](#api-reference)
   - [Process Payment (Unified)](#1-process-payment-unified)
   - [Create Payment Intent (Stripe)](#2-create-payment-intent-stripe-only)
   - [Confirm Payment (Stripe)](#3-confirm-payment-stripe-only)
   - [Create Manual Payment](#4-create-manual-payment)
   - [Mark Manual Payment Complete](#5-mark-manual-payment-as-completed)
   - [Get Payment by ID](#6-get-payment-by-id)
   - [Get Payment by Order](#7-get-payment-by-order-id)
   - [Get User Payments](#8-get-user-payments)
   - [Process Refund](#9-process-refund)
   - [Get Payments by Status](#10-get-payments-by-status)
   - [Admin Payments List](#11-admin-payments-list)
   - [Payment Statistics](#12-payment-statistics)
   - [Payment Analytics](#13-payment-analytics)
   - [Payment Performance](#14-payment-performance)
   - [Stripe Webhook](#15-stripe-webhook)
4. [Payment Flow by Method](#payment-flow-by-method)
5. [Response Handling](#response-handling)
6. [Error Handling](#error-handling)
7. [Testing](#testing)
8. [Environment Configuration](#environment-configuration)

---

## Payment Status Lifecycle

Every payment goes through these statuses. When a Payment record transitions, the corresponding `order.payment.status`, `order.payment.paidAt`, and `order.payment.transactionId` are automatically kept in sync.

```
pending ──→ processing ──→ completed ──→ refunded
                 │
                 └──→ failed
```

| Status | Meaning | What triggers it |
|---|---|---|
| `pending` | Payment created, awaiting action | Order creation |
| `processing` | Payment in progress (e.g. Stripe intent) | Gateway processing |
| `completed` | Payment confirmed/received | Webhook, manual confirmation, or Stripe confirm |
| `failed` | Payment attempt failed | Gateway rejection or error |
| `refunded` | Payment was refunded | Admin/seller processes refund |

### How status transitions map to order status

| Payment status | Order status effect |
|---|---|
| `completed` | Order auto-transitions to `confirmed` |
| `failed` | Order stays at current status |
| `refunded` | Order transitions to `refunded` |

---

## Payment Methods Supported

| Payment Method | Gateway | User Experience | Completion Trigger |
|---|---|---|---|
| `credit_card` | Stripe | Card form → Payment intent → Confirmation | Stripe webhook (automatic) |
| `debit_card` | Stripe | Card form → Payment intent → Confirmation | Stripe webhook (automatic) |
| `imali` | Imali | Pay-by-link → User clicks → Complete | Imali callback |
| `mpesa` | Imali | QR code → User scans → Complete | Imali callback |
| `emola` | Imali | QR code → User scans → Complete | Imali callback |
| `bank_transfer` | Manual | Instructions → Admin marks complete | Admin via API |
| `cash_on_delivery` | Manual | Order confirmation → Delivery → Admin marks complete | Admin/seller via API |

---

## API Reference

All endpoints require `Authorization: Bearer <token>` unless otherwise noted.

### 1. Process Payment (Unified)

The primary endpoint for all payment methods. Routes automatically based on `order.payment.method`.

```
POST /api/v1/payments/process
```

**Auth:** Authenticated user (owner of the order)

**Request body:**

```json
{
  "orderId": "string (required)",
  "paymentDetails": {
    "paymentIntentId": "string (Stripe confirmation)",

    "title": "string (Imali, max 100)",
    "short_description": "string (Imali, max 200)",
    "send_to_phone": "string (Imali, phone number)",
    "type": "DIRECT | RECURRING | DONATION",
    "payment_frequence": "DAILY | WEEKLY | MONTHLY | YEARLY",
    "expiration_datetime": "ISO date string",
    "customer_link_id": "string",
    "partner_transaction_id": "string",
    "thumbnail_image": "URL string",
    "transaction_type": "C2B | B2C | B2B | C2C",

    "mPesaPhoneNumber": "string",
    "eMolaPhoneNumber": "string",
    "imaliLinkId": "string"
  }
}
```

`paymentDetails` is optional — for cash on delivery and bank transfer, just send `{ "orderId": "..." }`.

**Success response (201):**

```json
{
  "success": true,
  "message": "Payment processed successfully",
  "data": { }
}
```

The `data` shape varies by payment method — see [Response Handling](#response-handling).

**Error responses:**

| Status | Condition |
|---|---|
| 400 | Order not found, order doesn't belong to user, order already paid, unsupported method |

---

### 2. Create Payment Intent (Stripe only)

Creates a Stripe PaymentIntent directly (alternative to unified endpoint).

```
POST /api/v1/payments/create-intent
```

**Auth:** Authenticated user

**Request body:**

```json
{
  "orderId": "string (required)",
  "amount": 100.00,
  "currency": "MZN",
  "paymentMethod": "card | bank_transfer | cash_on_delivery"
}
```

**Success response (201):**

```json
{
  "success": true,
  "message": "Payment intent created",
  "data": {
    "clientSecret": "pi_xxxxx_secret_xxxxx",
    "paymentIntentId": "pi_xxxxx",
    "amount": 100.00,
    "currency": "MZN"
  }
}
```

---

### 3. Confirm Payment (Stripe only)

Confirms a payment after the Stripe PaymentIntent succeeds on the client side.

```
POST /api/v1/payments/confirm
```

**Auth:** Authenticated user

**Request body:**

```json
{
  "paymentIntentId": "pi_xxxxx (required)"
}
```

**Success response (200):**

```json
{
  "success": true,
  "message": "Payment confirmed",
  "data": {
    "_id": "payment_id",
    "orderId": "order_id",
    "amount": 100.00,
    "status": "completed",
    "gatewayTransactionId": "pi_xxxxx"
  }
}
```

**Side effects:**
- Payment status → `completed`
- `order.payment.status` → `completed`
- `order.payment.paidAt` → current timestamp
- `order.payment.transactionId` → `paymentIntentId`
- Order status → `confirmed`

---

### 4. Create Manual Payment

Creates a pending payment record for manual methods (cash on delivery, bank transfer, mobile money).

```
POST /api/v1/payments/manual
```

**Auth:** Authenticated user

**Request body:**

```json
{
  "orderId": "string (required)",
  "amount": 100.00,
  "currency": "MZN",
  "method": "bank_transfer | cash_on_delivery | mpesa | emola | imali"
}
```

**Success response (201):**

```json
{
  "success": true,
  "message": "Manual payment created",
  "data": {
    "_id": "payment_id",
    "orderId": "order_id",
    "amount": 100.00,
    "currency": "MZN",
    "method": "cash_on_delivery",
    "gateway": "manual",
    "status": "pending"
  }
}
```

---

### 5. Mark Manual Payment as Completed

Admin or seller marks a manual payment as received/completed.

```
PATCH /api/v1/payments/manual/:paymentId/complete
```

**Auth:** Admin or Seller only

**Request body:** None

**Success response (200):**

```json
{
  "success": true,
  "message": "Manual payment completed",
  "data": {
    "_id": "payment_id",
    "status": "completed"
  }
}
```

**Side effects:**
- Payment status → `completed`
- `order.payment.status` → `completed`
- `order.payment.paidAt` → current timestamp
- Order status → `confirmed`

This is the **primary endpoint for completing cash-on-delivery and bank transfer payments**.

---

### 6. Get Payment by ID

```
GET /api/v1/payments/:paymentId
```

**Auth:** Authenticated user (owner or admin)

**Success response (200):**

```json
{
  "success": true,
  "message": "Payment retrieved",
  "data": {
    "_id": "payment_id",
    "orderId": "order_id",
    "userId": "user_id",
    "amount": 100.00,
    "currency": "MZN",
    "method": "cash_on_delivery",
    "status": "pending | processing | completed | failed | refunded",
    "gateway": "stripe | manual | imali",
    "gatewayTransactionId": "string or null",
    "createdAt": "ISO date",
    "updatedAt": "ISO date"
  }
}
```

---

### 7. Get Payment by Order ID

```
GET /api/v1/payments/order/:orderId
```

**Auth:** Authenticated user (owner or admin)

**Success response (200):**

```json
{
  "success": true,
  "message": "Payment retrieved",
  "data": { }
}
```

---

### 8. Get User Payments

Returns all payments for the authenticated user.

```
GET /api/v1/payments/user/payments
```

**Auth:** Authenticated user

**Success response (200):**

```json
{
  "success": true,
  "message": "Payments retrieved",
  "data": [ ]
}
```

---

### 9. Process Refund

```
POST /api/v1/payments/refund
```

**Auth:** Admin or Seller only

**Request body:**

```json
{
  "paymentId": "string (required)",
  "amount": 50.00,
  "reason": "string (required, 10-500 chars)"
}
```

**Success response (200):**

```json
{
  "success": true,
  "message": "Refund processed",
  "data": {
    "_id": "payment_id",
    "status": "refunded",
    "refundAmount": 50.00,
    "refundReason": "Customer requested refund"
  }
}
```

**Side effects:**
- Payment status → `refunded`
- `order.payment.status` → `refunded`
- `order.payment.refundedAt` → current timestamp
- `order.payment.refundAmount` → refund amount
- For Stripe payments, refund is also processed through Stripe

---

### 10. Get Payments by Status

```
GET /api/v1/payments/status/:status
```

**Auth:** Admin only

**Path params:** `status` = `pending | processing | completed | failed | refunded`

**Success response (200):**

```json
{
  "success": true,
  "message": "Payments retrieved",
  "data": [ ]
}
```

---

### 11. Admin Payments List

Paginated list of all payments with order and buyer info.

```
GET /api/v1/payments/admin
```

**Auth:** Admin only

**Query params:**

| Param | Type | Description |
|---|---|---|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page |
| `status` | string | Filter by status |
| `method` | string | Filter by payment method |
| `gateway` | string | Filter by gateway |

**Success response (200):**

```json
{
  "success": true,
  "message": "Payments retrieved",
  "data": { }
}
```

---

### 12. Payment Statistics

```
GET /api/v1/payments/statistics/overview
```

**Auth:** Admin only

---

### 13. Payment Analytics

```
GET /api/v1/payments/analytics?period=30d
```

**Auth:** Admin only

**Query params:** `period` = `7d | 30d | 90d | 1y`

---

### 14. Payment Performance

```
GET /api/v1/payments/performance
```

**Auth:** Admin only

---

### 15. Stripe Webhook

```
POST /api/v1/payments/webhook/stripe
```

**Auth:** None (uses Stripe signature verification)

Handled events:
- `payment_intent.succeeded` → Payment `completed`, order `confirmed`, `order.payment.status` synced
- `payment_intent.payment_failed` → Payment `failed`, `order.payment.status` synced
- `charge.refunded` → Payment updated with refund info

---

## Payment Flow by Method

### Credit/Debit Card (Stripe)

```
Frontend                         API                          Stripe
   │                              │                             │
   │── POST /payments/process ───→│                             │
   │                              │── create PaymentIntent ────→│
   │←── { clientSecret } ────────│                             │
   │                              │  order.payment.status=pending│
   │── stripe.confirmCardPayment ─────────────────────────────→│
   │                              │                             │
   │                              │←── webhook: succeeded ─────│
   │                              │  payment.status=completed   │
   │                              │  order.payment.status=completed
   │                              │  order.payment.paidAt=now   │
   │                              │  order.status=confirmed     │
```

### Cash on Delivery

```
Frontend                         API
   │                              │
   │── POST /payments/process ───→│
   │                              │  Creates Payment (status=pending)
   │←── { type: "manual" } ──────│
   │                              │
   │  (show instructions to user) │
   │                              │
   │  ... delivery happens ...    │
   │                              │
   │  Admin: PATCH /payments/manual/:paymentId/complete
   │                              │  payment.status=completed
   │                              │  order.payment.status=completed
   │                              │  order.payment.paidAt=now
   │                              │  order.status=confirmed
```

### Bank Transfer

```
Frontend                         API
   │                              │
   │── POST /payments/process ───→│
   │                              │  Creates Payment (status=pending)
   │←── { type: "manual" } ──────│
   │                              │
   │  (show bank details to user) │
   │                              │
   │  ... user transfers money ...│
   │                              │
   │  Admin: PATCH /payments/manual/:paymentId/complete
   │                              │  payment.status=completed
   │                              │  order.payment.status=completed
   │                              │  order.payment.paidAt=now
   │                              │  order.status=confirmed
```

### Imali / M-Pesa / eMola

```
Frontend                         API                          Imali
   │                              │                             │
   │── POST /payments/process ───→│                             │
   │                              │── create pay-by-link ──────→│
   │←── { paymentLink / QR } ────│                             │
   │                              │                             │
   │  (show link or QR to user)   │                             │
   │  (user pays via phone)       │                             │
```

---

## Response Handling

### Stripe Response

```json
{
  "type": "stripe",
  "clientSecret": "pi_xxxxx_secret_xxxxx",
  "paymentIntentId": "pi_xxxxx",
  "amount": 100.00,
  "currency": "MZN"
}
```

### Manual Payment Response (Cash on Delivery / Bank Transfer)

```json
{
  "type": "manual",
  "paymentId": "payment_id",
  "method": "cash_on_delivery",
  "amount": 100.00,
  "currency": "MZN",
  "status": "pending",
  "message": "Payment created for cash_on_delivery. Admin will mark as completed when payment is received."
}
```

### Imali Pay-by-Link Response

```json
{
  "status": "success",
  "data": {
    "paymentLink": {
      "link_id": "link_xxxxx",
      "link_url": "https://pay.imali.co.mz/link/xxxxx",
      "customer_link_id": "ORDER_12345_1234567890",
      "amount": "100.00",
      "currency": "MZN",
      "status": "PENDING",
      "expiration_datetime": "2026-01-01T23:59:59Z"
    },
    "order": { }
  }
}
```

### Imali QR Code Response

```json
{
  "status": "success",
  "data": {
    "data": {
      "transaction": "transaction_id",
      "qrcode": "data:image/png;base64,...",
      "account_number": "1234567890"
    },
    "order": { }
  }
}
```

---

## Error Handling

### Common Error Responses

| Status | Message | Cause |
|---|---|---|
| 400 | Order not found | Invalid `orderId` |
| 400 | Order does not belong to user | User trying to pay for someone else's order |
| 400 | Order already paid | `order.payment.status` is already `completed` |
| 400 | Unsupported payment method | Order has an unknown `payment.method` |
| 400 | Payment cannot be refunded | Payment not in `completed` status |
| 400 | Refund amount exceeded | Refund amount > payment amount |
| 400 | Payment already exists | Duplicate payment for same order |
| 400 | Not a manual payment | Trying to mark a Stripe payment as manually completed |
| 403 | Access denied | Insufficient role for admin/seller endpoints |
| 404 | Payment not found | Invalid `paymentId` |

### Error Response Format

```json
{
  "success": false,
  "message": "Error description"
}
```

### Frontend Error Handling Example

```javascript
const processPayment = async (orderId, paymentDetails = {}) => {
  const response = await fetch('/api/v1/payments/process', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ orderId, paymentDetails })
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    const msg = result.message || `HTTP ${response.status}`;

    if (msg.includes('already paid'))    throw new Error('ORDER_ALREADY_PAID');
    if (msg.includes('not found'))       throw new Error('ORDER_NOT_FOUND');
    if (msg.includes('does not belong')) throw new Error('UNAUTHORIZED');

    throw new Error(msg);
  }

  return result.data;
};
```

---

## Testing

### Test Payment Flows

1. **Stripe Test Cards**
   - Success: `4242424242424242`
   - Decline: `4000000000000002`
   - Requires 3D Secure: `4000002500003155`

2. **Manual Payments (Cash on Delivery / Bank Transfer)**
   - Create order with `payment.method: "cash_on_delivery"`
   - Call `POST /payments/process` with just `{ "orderId": "..." }`
   - Verify response has `type: "manual"` and `status: "pending"`
   - As admin, call `PATCH /payments/manual/:paymentId/complete`
   - Verify `order.payment.status` is now `completed`
   - Verify `order.payment.paidAt` is set
   - Verify `order.status` is now `confirmed`

3. **Imali Test Environment**
   - Use test phone numbers: `+258123456789`
   - Test amounts: Any amount > 0

### Testing Checklist

- [ ] Credit card payment flow (create intent → confirm → webhook)
- [ ] Cash on delivery: create payment → admin marks complete → order confirmed
- [ ] Bank transfer: create payment → admin marks complete → order confirmed
- [ ] Imali pay-by-link flow
- [ ] M-Pesa / eMola QR code flow
- [ ] Refund flow (Stripe and manual)
- [ ] Verify `order.payment.status` syncs on every transition
- [ ] Verify `order.payment.paidAt` is set on completion
- [ ] Error: paying for already-paid order
- [ ] Error: paying for another user's order
- [ ] Error: marking non-manual payment as complete
- [ ] Admin payments list with filters
- [ ] Payment statistics and analytics

---

## Environment Configuration

### Required Environment Variables

```env
# Stripe (for card payments)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...

# API Base URL
REACT_APP_API_BASE_URL=http://localhost:3002/api/v1

# Optional: Imali configuration (if needed on frontend)
REACT_APP_IMALI_CLIENT_ID=your_client_id
```

### Frontend Configuration Example

```javascript
export const PAYMENT_CONFIG = {
  stripe: {
    publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
    currency: 'MZN',
    locale: 'en'
  },
  api: {
    baseUrl: process.env.REACT_APP_API_BASE_URL,
    timeout: 30000
  }
};
```

---

## Quick Reference: Admin Endpoints

| Method | Endpoint | Role | Description |
|---|---|---|---|
| `GET` | `/admin` | Admin | List all payments (paginated, filterable) |
| `PATCH` | `/manual/:paymentId/complete` | Admin, Seller | Mark cash/bank payment as received |
| `POST` | `/refund` | Admin, Seller | Process refund |
| `GET` | `/status/:status` | Admin | Filter payments by status |
| `GET` | `/statistics/overview` | Admin | Payment statistics |
| `GET` | `/analytics?period=30d` | Admin | Payment analytics by period |
| `GET` | `/performance` | Admin | Gateway performance monitoring |

---

**Last Updated:** August 2026
**API Version:** v1
**Payment Gateways:** Stripe + Imali + Manual
