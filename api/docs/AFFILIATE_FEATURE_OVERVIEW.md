### Affiliate Feature – Full Overview

This document defines a full overview of the affiliate subsystem for the marketplace, aligned with the current backend structure (`routes` + `controllers` + `services` + `models` + admin modules).

---

### 1) Objective

Add an affiliate program that allows partners to:

- Share referral links/codes
- Generate tracked clicks and attributed orders
- Earn commissions
- Monitor performance and payout readiness

Admin should be able to:

- Manage affiliates (approve/block/configure)
- Review conversions and commissions
- Approve/reject payouts
- Monitor fraud/risk signals

---

### 2) Product Scope

#### Phase 1 (MVP)

- Affiliate registration/activation
- Unique affiliate code + referral links
- Last-click attribution (single touch)
- Conversion + commission ledger
- Affiliate dashboard (summary + list views)
- Admin list/filters for affiliates and conversions

#### Phase 2

- Payout batch processing
- Commission rules per seller/category/product
- Better anti-fraud controls
- Webhook events / notifications

#### Phase 3

- Multi-touch attribution models
- Coupon + affiliate hybrid attribution
- Advanced cohort and retention analytics

---

### 3) Architecture Fit (Current Project Pattern)

Follow the same pattern used in existing modules:

- `src/models/Affiliate.ts`
- `src/models/AffiliateClick.ts`
- `src/models/AffiliateConversion.ts`
- `src/models/AffiliatePayout.ts` (phase 2+)
- `src/services/affiliateService.ts`
- `src/controllers/affiliateController.ts`
- `src/routes/affiliate.ts`
- `src/controllers/adminAffiliateController.ts`
- `src/services/adminAffiliateService.ts`
- `src/routes/adminAffiliates.ts`

Add in `src/app.ts`:

- `/api/v1/affiliate`
- `/api/v1/admin/affiliates`

---

### 4) Core Domain Models

#### 4.1 Affiliate

Represents a partner account.

Suggested fields:

- `userId` (ref `User`)
- `code` (unique, indexed, uppercase/slug-like)
- `status`: `pending | active | blocked`
- `commissionType`: `percentage | fixed`
- `commissionValue`: number
- `cookieWindowDays`: number (default 30)
- `minPayoutAmount`: number
- `paymentMethod`: `bank_transfer | mpesa | emola | other`
- `paymentDetails`: object
- `totals`: cached counters (optional)
- timestamps

#### 4.2 AffiliateClick

Tracks incoming traffic from affiliate links.

Suggested fields:

- `affiliateId` (ref `Affiliate`)
- `code`
- `sessionId` (or anonymous tracking id)
- `buyerId?` (if logged in)
- `ipHash` (not raw IP if possible)
- `userAgent`
- `referer`
- `landingUrl`
- `utm` object
- `createdAt`

#### 4.3 AffiliateConversion

Immutable ledger row for an attributed order/commission.

Suggested fields:

- `affiliateId` (ref `Affiliate`)
- `orderId` (ref `Order`, unique with affiliate constraint)
- `paymentId?` (ref `Payment`)
- `buyerId` (ref `User`)
- `sellerId?` (if needed)
- `currency`
- `orderSubtotal`
- `orderTotal`
- `commissionBaseAmount`
- `commissionType`
- `commissionValue`
- `commissionAmount`
- `status`: `pending | approved | rejected | paid`
- `attributionModel`: `last_click`
- `attributedAt`
- `approvedAt?`
- `rejectedAt?`
- `paidAt?`
- `rejectReason?`
- `metadata`
- timestamps

#### 4.4 AffiliatePayout (Phase 2+)

Groups conversions paid in one transfer.

- `affiliateId`
- `conversionIds[]`
- `grossAmount`
- `fees`
- `netAmount`
- `status`: `queued | processing | paid | failed`
- `reference`
- `processedBy`
- `processedAt`

---

### 5) Attribution Strategy (MVP)

Use **last-click attribution** with expiry:

1. User opens affiliate link with `code`.
2. Backend validates `code` and creates `AffiliateClick`.
3. Client stores token/code in cookie/localStorage.
4. At checkout/order creation, include affiliate context (or resolve from cookie/session).
5. On successful payment, create `AffiliateConversion` with `pending`.
6. Approve conversion when business-safe condition is met (e.g., delivered + refund grace period) or via admin action.

Rules:

- Reject self-referrals (`buyerId === affiliate.userId`)
- Reject duplicate conversion for same order
- Ignore expired attribution window

---

### 6) API Proposal

#### 6.1 Public / Buyer-side Tracking

- `GET /api/v1/affiliate/track/:code`
  - Validates code
  - Creates click log
  - Returns tracking payload (or redirects)

- `POST /api/v1/affiliate/resolve`
  - Input: `{ code }`
  - Output: affiliate public info + validity

#### 6.2 Affiliate User APIs

- `GET /api/v1/affiliate/me`
- `GET /api/v1/affiliate/me/dashboard`
- `GET /api/v1/affiliate/me/clicks?page=&limit=`
- `GET /api/v1/affiliate/me/conversions?page=&limit=&status=`
- `GET /api/v1/affiliate/me/payouts?page=&limit=` (phase 2+)

#### 6.3 Admin APIs

- `GET /api/v1/admin/affiliates?page=&limit=&status=&search=`
- `POST /api/v1/admin/affiliates`
- `PATCH /api/v1/admin/affiliates/:id/status`
- `PATCH /api/v1/admin/affiliates/:id/commission`
- `GET /api/v1/admin/affiliates/conversions?page=&limit=&status=`
- `PATCH /api/v1/admin/affiliates/conversions/:id/approve`
- `PATCH /api/v1/admin/affiliates/conversions/:id/reject`
- `POST /api/v1/admin/affiliates/payouts/run` (phase 2+)

---

### 7) Event Integration Points (Existing Flows)

#### On Order Creation

- Persist affiliate context on order metadata if available.
- Do not create commission yet.

#### On Payment Success

- In payment success path (`PaymentService` and webhooks), create conversion row.
- Commission values are frozen at creation.

#### On Cancellation / Refund

- If conversion is `pending`, mark `rejected`.
- If `approved` and not paid, set `rejected` or reversal policy.
- If already paid, create negative adjustment (phase 2 policy).

---

### 8) Commission Rules (MVP)

Default simple rule:

- `commissionBaseAmount = order.subtotal`
- `commissionAmount = percentage * subtotal` (or fixed)
- Round to 2 decimals
- Currency follows order currency

Configuration source:

- Global default in `.env`
- Optional affiliate-level override in DB

---

### 9) Security and Fraud Controls

Minimum controls:

- Unique index on `Affiliate.code`
- Unique conversion by `(orderId, affiliateId)`
- Self-referral block
- IP burst/click spam monitoring
- Admin audit fields (`approvedBy`, `rejectedBy`, reasons)

Recommended:

- Store hashed IP (`ipHash`) instead of raw IP
- Rate-limit tracking endpoint
- Add suspicious click-to-order ratio report

---

### 10) Reporting and Stats

#### Affiliate Dashboard Stats

- Total clicks
- Unique clicks
- Total conversions
- Conversion rate
- Pending commissions
- Approved commissions
- Paid commissions
- Rejected commissions

#### Admin Stats

- Active affiliates
- Total attributed revenue
- Total commission liability
- Pending payout amount
- Top affiliates by conversions / commission

---

### 11) Suggested Response Shape (Affiliate Dashboard)

```json
{
  "success": true,
  "data": {
    "summary": {
      "clicks": 1200,
      "uniqueClicks": 870,
      "conversions": 86,
      "conversionRate": 7.17,
      "pendingCommission": 5400,
      "approvedCommission": 9200,
      "paidCommission": 6100,
      "rejectedCommission": 350
    },
    "recentConversions": [],
    "recentClicks": []
  }
}
```

---

### 12) Rollout Plan

1. **Schema + indexes**
2. **Tracking endpoint + click logging**
3. **Attribution context on order flow**
4. **Conversion creation on payment success**
5. **Affiliate dashboard endpoints**
6. **Admin moderation endpoints**
7. **Docs + QA scenarios**

---

### 13) QA / Acceptance Checklist

- Affiliate code resolves correctly
- Click is logged once per track request
- Attributed orders create conversion on payment success
- No conversion created for expired or invalid code
- Self-referrals are rejected
- Refund/cancel updates conversion status correctly
- Admin can approve/reject conversion
- Dashboard stats match ledger totals

---

### 14) Open Decisions (Before Implementation)

- Approval timing:
  - immediate on payment success, or
  - delayed until delivered / refund window end
- Commission base:
  - subtotal vs total vs seller subtotal
- Multi-seller order split:
  - single commission vs item-level split
- Payout cadence:
  - manual batch vs automatic schedule

---

### 15) Recommendation

Implement **Phase 1 MVP** with:

- Last-click attribution
- Single conversion row per order
- Admin approval flow
- Manual payout tracking (no auto-transfer yet)

This gives fast value, low complexity, and clean extensibility for advanced payout and attribution later.

---

### 16) Current API Response Contracts

All endpoints follow:

```json
{
  "success": true,
  "message": "string",
  "data": {}
}
```

Error shape:

```json
{
  "success": false,
  "message": "string"
}
```

#### `GET /api/v1/affiliate/track/:code`

```json
{
  "success": true,
  "message": "Sucesso",
  "data": {
    "tracked": true,
    "affiliateId": "67...",
    "code": "ABC123",
    "cookieWindowDays": 30
  }
}
```

If invalid/inactive code:

```json
{
  "success": true,
  "message": "Sucesso",
  "data": {
    "tracked": false
  }
}
```

#### `GET /api/v1/affiliate/me`

```json
{
  "success": true,
  "message": "Sucesso",
  "data": {
    "affiliate": {
      "_id": "67...",
      "userId": "68...",
      "code": "ABC123",
      "status": "active",
      "commissionType": "percentage",
      "commissionValue": 5,
      "cookieWindowDays": 30,
      "minPayoutAmount": 1000
    }
  }
}
```

#### `GET /api/v1/affiliate/me/dashboard`

```json
{
  "success": true,
  "message": "Sucesso",
  "data": {
    "affiliate": { "...": "..." },
    "summary": {
      "clicks": 120,
      "conversions": 8,
      "pendingCommission": 450,
      "approvedCommission": 1200,
      "paidCommission": 800,
      "rejectedCommission": 50
    }
  }
}
```

If user has no affiliate profile yet:

```json
{
  "success": true,
  "message": "Sucesso",
  "data": null
}
```

#### `GET /api/v1/affiliate/me/conversions?page=1&limit=10&status=pending`

```json
{
  "success": true,
  "message": "Sucesso",
  "data": {
    "conversions": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 0,
      "pages": 0
    }
  }
}
```

#### `GET /api/v1/admin/affiliates?page=1&limit=10`

```json
{
  "success": true,
  "message": "Sucesso",
  "data": {
    "affiliates": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 0,
      "pages": 0
    }
  }
}
```

#### `PATCH /api/v1/admin/affiliates/:affiliateId/status`

Request body:

```json
{
  "status": "active"
}
```

Response:

```json
{
  "success": true,
  "message": "Sucesso",
  "data": {
    "affiliate": { "...": "..." }
  }
}
```

#### `GET /api/v1/admin/affiliates/conversions?page=1&limit=10`

```json
{
  "success": true,
  "message": "Sucesso",
  "data": {
    "conversions": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 0,
      "pages": 0
    }
  }
}
```

#### `PATCH /api/v1/admin/affiliates/conversions/:conversionId/approve`

```json
{
  "success": true,
  "message": "Sucesso",
  "data": {
    "conversion": { "...": "..." }
  }
}
```

#### `PATCH /api/v1/admin/affiliates/conversions/:conversionId/reject`

Request body:

```json
{
  "reason": "Invalid attribution"
}
```

Response:

```json
{
  "success": true,
  "message": "Sucesso",
  "data": {
    "conversion": { "...": "..." }
  }
}
```

