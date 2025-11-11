# Review API Integration Guide

## Overview

The Review API lets shoppers write product reviews, update or delete their own reviews, and mark other reviews as helpful. Public endpoints expose product review listings and statistics, while authenticated routes enforce purchase verification and ownership rules.

**Base URL:** `/api/v1/reviews`

**Authentication:**
- Public read endpoints do **not** require authentication.
- Creating/updating/deleting reviews and marking them helpful require a valid JWT (`Authorization: Bearer <token>`).
- Admin-only moderation endpoints require `role: 'admin'` (documented for completeness at the end).

---

## Buyer Endpoints

### 1. Create Product Review

Create a verified review for a product you purchased.

**Endpoint:** `POST /api/v1/reviews`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "productId": "65a1b2c3d4e5f6g7h8i9j0p1",
  "orderId": "65a1b2c3d4e5f6g7h8i9j0o2",
  "rating": 5,
  "title": "Excelente qualidade",
  "content": "Produto chegou rápido e com ótima qualidade!",
  "images": [
    "https://example.com/review-image-01.jpg"
  ]
}
```

**Field Rules:**
- `productId`, `orderId`: required Mongo IDs.
- `rating`: 1–5 (integer).
- `title`: 5–100 characters.
- `content`: 10–1000 characters.
- `images`: optional array of **URLs** (no base64 uploads; upload separately and pass URLs).

**Business Rules:**
- Only one review per product per user.
- Order must belong to the user, include the product, and be delivered/completed.

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Review created successfully",
  "data": {
    "_id": "65b1c2d3e4f5g6h7i8j9k0l1",
    "productId": "65a1b2c3d4e5f6g7h8i9j0p1",
    "userId": "65f1e2d3c4b5a69788776655",
    "orderId": "65a1b2c3d4e5f6g7h8i9j0o2",
    "rating": 5,
    "title": "Excelente qualidade",
    "content": "Produto chegou rápido e com ótima qualidade!",
    "images": [
      "https://example.com/review-image-01.jpg"
    ],
    "isVerified": true,
    "status": "pending",
    "createdAt": "2025-11-11T14:20:00.000Z",
    "updatedAt": "2025-11-11T14:20:00.000Z"
  }
}
```

**Error Examples:**
```json
{
  "success": false,
  "message": "You have already reviewed this product"
}
```

```json
{
  "success": false,
  "message": "Order must be delivered or completed to review"
}
```

---

### 2. Update My Review

Only pending/rejected reviews can be edited.

**Endpoint:** `PUT /api/v1/reviews/:reviewId`

**Headers:** Same as above.

**Request Body (all fields optional):**
```json
{
  "rating": 4,
  "title": "Boa, mas poderia ser melhor",
  "content": "Após alguns dias de uso, notei alguns pontos de melhoria.",
  "images": [
    "https://example.com/review-image-02.jpg"
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Review updated successfully",
  "data": {
    "_id": "65b1c2d3e4f5g6h7i8j9k0l1",
    "rating": 4,
    "title": "Boa, mas poderia ser melhor",
    "content": "Após alguns dias de uso, notei alguns pontos de melhoria.",
    "images": ["https://example.com/review-image-02.jpg"],
    "status": "pending",
    "updatedAt": "2025-11-12T09:45:00.000Z"
  }
}
```

**Error Example:**
```json
{
  "success": false,
  "message": "Cannot edit approved reviews"
}
```

---

### 3. Delete My Review

**Endpoint:** `DELETE /api/v1/reviews/:reviewId`

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

**Error Example:**
```json
{
  "success": false,
  "message": "You can only delete your own reviews"
}
```

---

### 4. Get My Reviews

List reviews authored by the authenticated user.

**Endpoint:** `GET /api/v1/reviews/user/reviews`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
| Param | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `page` | number | no | 1 | Page index |
| `limit` | number | no | 10 | Items per page |
| `status` | string | no | all | Filter by `pending`, `approved`, `rejected` |

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User reviews retrieved successfully",
  "data": {
    "reviews": [
      {
        "_id": "65b1c2d3e4f5g6h7i8j9k0l1",
        "productId": "65a1b2c3d4e5f6g7h8i9j0p1",
        "rating": 4,
        "status": "pending",
        "title": "Boa, mas poderia ser melhor",
        "content": "Após alguns dias de uso...",
        "createdAt": "2025-11-11T14:20:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 3,
      "pages": 1
    }
  }
}
```

---

### 5. Mark Review Helpful / Not Helpful

Toggle helpfulness for a review (one vote per user).

**Endpoint:** `POST /api/v1/reviews/:reviewId/helpful`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "isHelpful": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Review marked as helpful successfully",
  "data": {
    "_id": "65b1c2d3e4f5g6h7i8j9k0l1",
    "isHelpful": true,
    "helpfulVotes": 12,
    "notHelpfulVotes": 2
  }
}
```

---

## Public Endpoints

### 6. Get Product Reviews

**Endpoint:** `GET /api/v1/reviews/product/:productId`

**Query Parameters:**
| Param | Type | Default | Notes |
|-------|------|---------|-------|
| `page` | number | 1 | Pagination |
| `limit` | number | 10 | Items per page |
| `status` | string | `approved` | 
| `sortBy` | string | `createdAt` | `createdAt`, `rating`, `helpfulVotes` |
| `sortOrder` | string | `desc` | `asc` or `desc` |

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Product reviews retrieved successfully",
  "data": {
    "reviews": [
      {
        "_id": "65b1c2d3e4f5g6h7i8j9k0l1",
        "userId": {
          "_id": "65f1e2d3c4b5a69788776655",
          "firstName": "João",
          "lastName": "Silva"
        },
        "rating": 5,
        "title": "Excelente qualidade",
        "content": "Produto chegou rápido...",
        "images": ["https://example.com/review-image-01.jpg"],
        "status": "approved",
        "helpfulVotes": 12,
        "notHelpfulVotes": 2,
        "createdAt": "2025-11-11T14:20:00.000Z"
      }
    ],
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3,
    "averageRating": 4.6
  }
}
```

---

### 7. Get Product Review Statistics

**Endpoint:** `GET /api/v1/reviews/product/:productId/statistics`

**Response:**
```json
{
  "success": true,
  "message": "Review statistics retrieved successfully",
  "data": {
    "averageRating": 4.6,
    "totalReviews": 25,
    "ratingDistribution": {
      "5": 18,
      "4": 4,
      "3": 2,
      "2": 1,
      "1": 0
    },
    "verifiedReviews": 24,
    "helpfulReviews": 15
  }
}
```

---

### 8. Get Review by ID

**Endpoint:** `GET /api/v1/reviews/:reviewId`

Returns populated user, product, order, and moderation info for display.

---

### 9. Get Recent Reviews (Dashboard/Widgets)

**Endpoint:** `GET /api/v1/reviews/recent/reviews?limit=5`

Returns latest approved reviews (default 10).

---

## Business Logic Notes

- One review per product per user.
- Only delivered/completed orders can be reviewed.
- Reviews start as `pending`; an admin must approve for public display.
- Approved reviews cannot be edited (delete + recreate instead).
- Helpfulness voting prevents duplicate votes by the same user.
- Images must be externally hosted; pass public URLs.
- `isVerified` flag indicates purchase verification.

---

## Example Frontend Service (TypeScript)

```typescript
interface Review {
  _id: string;
  productId: string;
  orderId: string;
  userId: string | { _id: string; firstName: string; lastName: string };
  rating: number;
  title: string;
  content: string;
  images?: string[];
  status: 'pending' | 'approved' | 'rejected';
  helpfulVotes?: number;
  notHelpfulVotes?: number;
  createdAt: string;
}

interface ReviewListResponse {
  reviews: Review[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  averageRating: number;
}

class ReviewApi {
  private baseUrl = '/api/v1/reviews';
  private token?: string;

  constructor(token?: string) {
    this.token = token;
  }

  private headers(json = true) {
    return {
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...(json ? { 'Content-Type': 'application/json' } : {})
    };
  }

  private async request<T>(endpoint: string, init: RequestInit = {}): Promise<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      ...init,
      headers: {
        ...this.headers(init.body !== undefined),
        ...init.headers
      }
    });

    const payload = await res.json();
    if (!res.ok) {
      throw new Error(payload.message || 'Request failed');
    }
    return payload.data;
  }

  // Public
  getProductReviews(params: {
    productId: string;
    page?: number;
    limit?: number;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ReviewListResponse> {
    const { productId, ...query } = params;
    const search = new URLSearchParams(query as Record<string, string>).toString();
    return this.request(`/product/${productId}${search ? `?${search}` : ''}`);
  }

  getProductStatistics(productId: string) {
    return this.request(`/product/${productId}/statistics`);
  }

  getReviewById(reviewId: string) {
    return this.request(`/${reviewId}`);
  }

  getRecentReviews(limit = 5) {
    return this.request(`/recent/reviews?limit=${limit}`);
  }

  // Authenticated (buyer)
  createReview(data: {
    productId: string;
    orderId: string;
    rating: number;
    title: string;
    content: string;
    images?: string[];
  }) {
    return this.request('/', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  updateReview(reviewId: string, data: Partial<Omit<Review, '_id' | 'productId' | 'orderId' | 'status'>>) {
    return this.request(`/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  deleteReview(reviewId: string) {
    return this.request(`/${reviewId}`, { method: 'DELETE' });
  }

  getMyReviews(params: { page?: number; limit?: number; status?: string } = {}) {
    const search = new URLSearchParams(params as Record<string, string>).toString();
    return this.request(`/user/reviews${search ? `?${search}` : ''}`);
  }

  markHelpful(reviewId: string, isHelpful: boolean) {
    return this.request(`/${reviewId}/helpful`, {
      method: 'POST',
      body: JSON.stringify({ isHelpful })
    });
  }
}

// Usage
const reviewApi = new ReviewApi(userToken);
await reviewApi.createReview({
  productId: '65a1b2c3d4e5f6g7h8i9j0p1',
  orderId: '65a1b2c3d4e5f6g7h8i9j0o2',
  rating: 5,
  title: 'Excelente qualidade',
  content: 'Produto chegou rápido...',
  images: ['https://example.com/review-image-01.jpg']
});
```

---

## Testing Scenarios

1. **Create Review**
   - Valid purchase → success (status `pending`).
   - Duplicate review → fails.
   - Order not delivered → fails.

2. **Update/Delete Review**
   - Pending review → success.
   - Approved review → update fails, delete succeeds.

3. **Helpful Votes**
   - First vote → success.
   - Repeated vote → backend toggles state.

4. **Public Listing**
   - Verify pagination, sorting, filtering by status.
   - Confirm statistics reflect filtered reviews.

5. **Edge Cases**
   - Missing authentication for protected routes → `401`.
   - Invalid IDs → `400` or `404`.

---

## Admin Endpoints (Reference)

- `PATCH /:reviewId/moderate` – approve or reject reviews (admin only).
- `GET /admin/pending` – list pending reviews for moderation.
- `GET /admin/analytics` – aggregated analytics (total, pending, average rating, etc.).
- `POST /send-request` – send review request emails (admin/seller).

These are optional for the frontend team unless you are building admin dashboards.

---

## Notes & Tips

- Store muted state (pending/rejected) to inform users when their review is awaiting moderation.
- Expose helpful vote counts next to reviews.
- When displaying reviews, show `isVerified` badge for verified purchases.
- Provide preview for uploaded image URLs before submission.
- Encourage users to include order ID and ensures order is delivered before showing review form.

**Last Updated:** January 2024
