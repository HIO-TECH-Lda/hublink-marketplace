### Affiliate Feature – Frontend Integration Guide

This guide is for the frontend team (`../project`) to integrate the affiliate feature based on what is already implemented in backend.

It is based on:

- `api/docs/AFFILIATE_FEATURE_OVERVIEW.md`
- Existing frontend/admin patterns in this project

Implementation should follow the same conventions already documented in `project/FRONTEND-INTEGRATION-GUIDE.md`:

- `lib/api-client.ts` for authenticated HTTP calls
- `hooks/*` with React Query for data fetching/mutations
- `types/api.ts` (or feature-local types) for API contracts
- App Router pages with protected route checks for user/admin areas

---

### 1) Goal

Deliver frontend pages and flows for the currently available affiliate APIs:

- Affiliate tracking entry
- Affiliate self-service dashboard
- Admin affiliate management
- Admin conversion review

---

### 2) Pages to Build

#### A. Public Tracking Entry (No dedicated page required)

Route options:

- `/ref/:code`
- `/affiliate/:code`

Behavior:

1. Read `code` from URL.
2. Call backend tracking endpoint.
3. Persist returned tracking token/code in storage (cookie/localStorage).
4. Redirect user to intended landing page (home/product/cart).

Fallback:

- If code invalid/expired, continue normal user flow (no hard error screen).

---

#### B. Affiliate User Area

Suggested routes:

- `/affiliate/dashboard`
- `/affiliate/conversions`

Dashboard widgets:

- Total clicks / unique clicks
- Total conversions
- Conversion rate
- Pending, approved, paid commission totals
- Recent conversions table

Tables:

- Conversions: date, order, amount, commission, status
- Clicks: date, landing page, source/utm, session

States to support:

- loading, empty, error, no-access (not affiliate yet)

---

#### C. Admin Area

Suggested routes:

- `/admin/affiliates`
- `/admin/affiliates/conversions`

Admin Affiliates page:

- list with search/filter/status
- activate/block actions
- commission override action

Admin Conversions page:

- list with filter by status/date/affiliate
- approve/reject actions
- side panel with attribution details

---

### 3) API Mapping (Current Backend)

Use these endpoints (already implemented):

- Public tracking:
  - `GET /api/v1/affiliate/track/:code`
  - `POST /api/v1/affiliate/resolve`

- Affiliate self:
  - `GET /api/v1/affiliate/me`
  - `GET /api/v1/affiliate/me/dashboard`
  - `GET /api/v1/affiliate/me/conversions?page=&limit=&status=`

- Admin:
  - `GET /api/v1/admin/affiliates?page=&limit=&status=&search=`
  - `PATCH /api/v1/admin/affiliates/:affiliateId/status`
  - `GET /api/v1/admin/affiliates/conversions?page=&limit=&status=`
  - `PATCH /api/v1/admin/affiliates/conversions/:conversionId/approve`
  - `PATCH /api/v1/admin/affiliates/conversions/:conversionId/reject`

### 3.1 Checkout payload requirement

To attribute orders to affiliates, frontend must send `affiliateCode` when creating orders:

```json
{
  "payment": {
    "method": "cash_on_delivery",
    "paymentDetails": {
      "affiliateCode": "ABC123"
    }
  }
}
```

This works for both:

- `POST /api/v1/orders/create`
- `POST /api/v1/orders/create-from-cart`

---

### 3.2 API Response Contracts (Current Backend)

All endpoints return:

```json
{
  "success": true,
  "message": "string",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "string"
}
```

Key responses the frontend should type:

- `GET /affiliate/track/:code`
  - `data: { tracked: boolean, affiliateId?: string, code?: string, cookieWindowDays?: number }`
- `GET /affiliate/me`
  - `data: { affiliate: Affiliate | null }`
- `GET /affiliate/me/dashboard`
  - `data: { affiliate, summary } | null`
- `GET /affiliate/me/conversions`
  - `data: { conversions: Conversion[], pagination: { page, limit, total, pages } } | null`
- `GET /admin/affiliates`
  - `data: { affiliates: Affiliate[], pagination: { page, limit, total, pages } }`
- `GET /admin/affiliates/conversions`
  - `data: { conversions: Conversion[], pagination: { page, limit, total, pages } }`
- `PATCH /admin/affiliates/:affiliateId/status`
  - `data: { affiliate: Affiliate }`
- `PATCH /admin/affiliates/conversions/:conversionId/approve`
  - `data: { conversion: Conversion }`
- `PATCH /admin/affiliates/conversions/:conversionId/reject`
  - `data: { conversion: Conversion }`

---

### 4) Frontend Data Shapes (Recommended)

Keep API adapter layer so UI is stable even if backend fields change.

#### Affiliate Dashboard ViewModel

```ts
type AffiliateDashboardVM = {
  summary: {
    clicks: number;
    uniqueClicks: number;
    conversions: number;
    conversionRate: number;
    pendingCommission: number;
    approvedCommission: number;
    paidCommission: number;
    rejectedCommission: number;
  };
  recentConversions: ConversionVM[];
  recentClicks: ClickVM[];
};
```

#### Conversion ViewModel

```ts
type ConversionVM = {
  id: string;
  orderId: string;
  orderNumber?: string;
  date: string;
  orderAmount: number;
  commissionAmount: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
};
```

---

### 5) Tracking Persistence Strategy

Store both:

- `affiliateCode`
- `affiliateTrackedAt`

Suggested TTL:

- 30 days (or backend-configured value)

When placing order:

- include `affiliateCode` in order payload metadata if endpoint supports it;
- otherwise rely on backend session/cookie tracking.

---

### 6) UX and Product Rules

- Never block checkout if affiliate tracking fails.
- Show affiliate metrics in user currency format.
- Use status badges with consistent color coding:
  - pending (warning)
  - approved (info/success)
  - paid (success strong)
  - rejected (danger)
- Admin reject action must require reason text.

---

### 7) Permissions

- Affiliate pages: authenticated user + affiliate profile status check.
- Admin pages: admin role only.
- Non-affiliate users hitting affiliate routes:
  - show CTA to apply/join affiliate program.

---

### 8) Error and Empty Handling

Empty states:

- No clicks yet
- No conversions yet

Errors:

- invalid tracking code
- unauthorized/forbidden
- service unavailable

UI recommendation:

- use retry action and keep last successful cached list where possible.

---

### 9) Delivery Plan (Frontend)

1. Add route guards + navigation entries.
2. Build tracking route and storage utility.
3. Build Affiliate Dashboard (summary + recent lists).
4. Build Affiliate Conversions table.
5. Build Admin Affiliates page.
6. Build Admin Conversions moderation page.
7. Add tests and analytics events.

---

### 10) Suggested File Structure (Next.js + React Query)

```txt
project/
  src/
    app/
      ref/[code]/page.tsx
      affiliate/dashboard/page.tsx
      affiliate/conversions/page.tsx
      admin/affiliates/page.tsx
      admin/affiliates/conversions/page.tsx
    hooks/
      useAffiliate.ts
      useAdminAffiliates.ts
    services/
      affiliateApi.ts
    types/
      affiliate.ts
    utils/
      affiliateTracking.ts
```

`affiliateApi.ts` should wrap `apiClient` with typed methods, and hooks should only call `affiliateApi.ts`.

---

### 11) Test Checklist

- Visiting `/ref/:code` stores code and redirects.
- Invalid code does not break navigation.
- Affiliate dashboard loads and formats values correctly.
- Filters/pagination work in conversions tables.
- Admin can approve/reject conversion and list refreshes.
- Role guards prevent unauthorized access.

---

Keep integration layer isolated (`services/affiliateApi.ts`) to reduce refactor cost.

