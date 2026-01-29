# Admin Review Management - Frontend Integration Guide

## Overview

This guide provides everything the frontend team needs to implement a complete admin review management system. Admins can view, moderate, approve, reject, and analyze all product reviews on the platform.

---

## 📊 Review Data Model

### Review Object

```typescript
interface Review {
  _id: string;
  productId: {
    _id: string;
    name: string;
    images: string[];
    primaryImage: string;
  };
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
  orderId: {
    _id: string;
    orderNumber: string;
  };
  rating: number;              // 1-5
  title: string;
  content: string;
  images?: string[];
  isVerified: boolean;         // User purchased the product
  isHelpful: number;           // Count of helpful votes
  isNotHelpful: number;        // Count of not helpful votes
  status: 'pending' | 'approved' | 'rejected';
  moderatorNotes?: string;     // Admin notes (only visible to admins)
  moderatedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  moderatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔌 API Endpoints

### 1. Get Pending Reviews (Admin Only)

**Endpoint:** `GET /api/v1/reviews/admin/pending`

**Authentication:** Required (Admin role)

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10) - Items per page
- `sortBy` (string, default: 'createdAt') - Sort field
- `sortOrder` ('asc' | 'desc', default: 'desc') - Sort direction

**Example Request:**
```javascript
const fetchPendingReviews = async (page = 1, limit = 10) => {
  const response = await fetch(
    `/api/v1/reviews/admin/pending?page=${page}&limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.json();
};
```

**Response:**
```json
{
  "success": true,
  "message": "Pending reviews retrieved successfully",
  "data": {
    "reviews": [
      {
        "_id": "65abc123...",
        "productId": {
          "_id": "65xyz789...",
          "name": "Wireless Headphones",
          "primaryImage": "https://..."
        },
        "userId": {
          "_id": "65user123...",
          "firstName": "João",
          "lastName": "Silva",
          "avatar": "https://..."
        },
        "orderId": {
          "_id": "65order456...",
          "orderNumber": "ORD-2026-001234"
        },
        "rating": 5,
        "title": "Excellent product!",
        "content": "Great quality and fast delivery...",
        "images": ["https://..."],
        "isVerified": true,
        "status": "pending",
        "createdAt": "2026-01-29T10:30:00.000Z"
      }
    ],
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "averageRating": 0
  }
}
```

---

### 2. Moderate Review (Approve/Reject) (Admin Only)

**Endpoint:** `PATCH /api/v1/reviews/:reviewId/moderate`

**Authentication:** Required (Admin role)

**Request Body:**
```typescript
{
  status: 'approved' | 'rejected';  // Required
  notes?: string;                    // Optional (max 500 chars)
}
```

**Example Request:**
```javascript
const moderateReview = async (reviewId, status, notes = '') => {
  const response = await fetch(
    `/api/v1/reviews/${reviewId}/moderate`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status, notes })
    }
  );
  return response.json();
};

// Approve a review
await moderateReview('65abc123...', 'approved');

// Reject a review with notes
await moderateReview('65abc123...', 'rejected', 'Contains inappropriate language');
```

**Response:**
```json
{
  "success": true,
  "message": "Review approved successfully",
  "data": {
    "_id": "65abc123...",
    "status": "approved",
    "moderatorNotes": "",
    "moderatedBy": "65admin789...",
    "moderatedAt": "2026-01-29T11:00:00.000Z",
    // ... other review fields
  }
}
```

**Important Notes:**
- ✅ When approved, the review becomes visible to the public
- ✅ Product rating is automatically recalculated
- ✅ **Seller rating is automatically updated** (new feature)
- ❌ When rejected, the review is hidden from public view

---

### 3. Get Review Analytics (Admin Only)

**Endpoint:** `GET /api/v1/reviews/admin/analytics`

**Authentication:** Required (Admin role)

**Example Request:**
```javascript
const fetchReviewAnalytics = async () => {
  const response = await fetch('/api/v1/reviews/admin/analytics', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};
```

**Response:**
```json
{
  "success": true,
  "message": "Review analytics retrieved successfully",
  "data": {
    "totalReviews": 1250,
    "pendingReviews": 45,
    "approvedReviews": 1180,
    "rejectedReviews": 25,
    "averageRating": 4.3,
    "recentReviews": 87      // Last 30 days
  }
}
```

---

### 4. Get Review by ID

**Endpoint:** `GET /api/v1/reviews/:reviewId`

**Authentication:** Not required (public endpoint, but admin sees all fields)

**Example Request:**
```javascript
const fetchReviewById = async (reviewId) => {
  const response = await fetch(`/api/v1/reviews/${reviewId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,  // Optional
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};
```

**Response:**
```json
{
  "success": true,
  "message": "Review retrieved successfully",
  "data": {
    "_id": "65abc123...",
    "productId": { /* populated product */ },
    "userId": { /* populated user */ },
    "orderId": { /* populated order */ },
    "moderatedBy": { /* populated admin (if moderated) */ },
    // ... all review fields
  }
}
```

---

### 5. Get All Reviews (with Filters)

**Endpoint:** `GET /api/v1/reviews/product/:productId`

**Authentication:** Not required

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `status` (string, default: 'approved') - 'pending' | 'approved' | 'rejected' | 'all'
- `sortBy` (string, default: 'createdAt')
- `sortOrder` ('asc' | 'desc', default: 'desc')

**Admin Note:** When authenticated as admin, you can use `status=all` to see all reviews regardless of status.

---

### 6. Get Recent Reviews

**Endpoint:** `GET /api/v1/reviews/recent/reviews`

**Authentication:** Not required

**Query Parameters:**
- `limit` (number, default: 10) - Number of reviews to return

**Example Request:**
```javascript
const fetchRecentReviews = async (limit = 10) => {
  const response = await fetch(
    `/api/v1/reviews/recent/reviews?limit=${limit}`
  );
  return response.json();
};
```

---

## 🎨 UI Components & Pages

### 1. Admin Reviews Dashboard Page

**Route:** `/admin/reviews`

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  📊 Review Analytics (Cards)                         │
│  ┌──────────┬──────────┬──────────┬──────────┐     │
│  │ Total    │ Pending  │ Approved │ Rejected │     │
│  │ 1,250    │    45    │  1,180   │    25    │     │
│  └──────────┴──────────┴──────────┴──────────┘     │
│                                                      │
│  📋 Quick Stats                                      │
│  • Average Rating: 4.3 ⭐                           │
│  • Recent Reviews (30d): 87                         │
│                                                      │
│  🔍 Filters & Tabs                                  │
│  [Pending] [Approved] [Rejected] [All]              │
│                                                      │
│  📝 Reviews Table/List                              │
│  ┌──────────────────────────────────────────────┐  │
│  │ Review 1 (with moderation buttons)           │  │
│  ├──────────────────────────────────────────────┤  │
│  │ Review 2                                      │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  ◀ 1 2 3 4 5 ▶ (Pagination)                        │
└─────────────────────────────────────────────────────┘
```

**Components Needed:**

#### a) Review Analytics Cards
```jsx
function ReviewAnalyticsCards({ analytics }) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total Reviews"
        value={analytics.totalReviews.toLocaleString()}
        icon={<MessageSquare />}
        color="blue"
      />
      <StatCard
        title="Pending"
        value={analytics.pendingReviews}
        icon={<Clock />}
        color="yellow"
        badge={analytics.pendingReviews > 0}
      />
      <StatCard
        title="Approved"
        value={analytics.approvedReviews.toLocaleString()}
        icon={<CheckCircle />}
        color="green"
      />
      <StatCard
        title="Rejected"
        value={analytics.rejectedReviews.toLocaleString()}
        icon={<XCircle />}
        color="red"
      />
    </div>
  );
}
```

#### b) Review Card with Moderation
```jsx
function ReviewCard({ review, onModerate }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showModerateModal, setShowModerateModal] = useState(false);

  return (
    <div className="border rounded-lg p-4 mb-4 hover:shadow-md transition">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          {/* User Avatar */}
          <img
            src={review.userId.avatar || '/default-avatar.png'}
            alt={review.userId.firstName}
            className="w-10 h-10 rounded-full"
          />
          
          {/* User Info */}
          <div>
            <div className="font-semibold">
              {review.userId.firstName} {review.userId.lastName}
              {review.isVerified && (
                <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  ✓ Verified Purchase
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <StatusBadge status={review.status} />
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-2">
        <StarRating rating={review.rating} />
        <span className="font-semibold text-lg">{review.rating}.0</span>
      </div>

      {/* Product Info */}
      <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
        <Package size={14} />
        <span>Product: {review.productId.name}</span>
      </div>

      {/* Review Title */}
      <h3 className="font-semibold text-lg mb-2">{review.title}</h3>

      {/* Review Content */}
      <p className={`text-gray-700 mb-3 ${!isExpanded && 'line-clamp-3'}`}>
        {review.content}
      </p>

      {review.content.length > 150 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 text-sm mb-3"
        >
          {isExpanded ? 'Show less' : 'Read more'}
        </button>
      )}

      {/* Review Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-3">
          {review.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Review image ${idx + 1}`}
              className="w-20 h-20 object-cover rounded cursor-pointer hover:opacity-75"
              onClick={() => openImageModal(img)}
            />
          ))}
        </div>
      )}

      {/* Helpful Votes */}
      <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
        <span>👍 Helpful: {review.isHelpful}</span>
        <span>👎 Not Helpful: {review.isNotHelpful}</span>
      </div>

      {/* Order Number */}
      <div className="text-sm text-gray-500 mb-3">
        Order: {review.orderId.orderNumber}
      </div>

      {/* Moderator Notes (if exists) */}
      {review.moderatorNotes && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-3">
          <div className="font-semibold text-sm mb-1">Admin Notes:</div>
          <div className="text-sm">{review.moderatorNotes}</div>
        </div>
      )}

      {/* Moderation Info (if moderated) */}
      {review.moderatedBy && (
        <div className="text-sm text-gray-500 mb-3">
          Moderated by {review.moderatedBy.firstName} {review.moderatedBy.lastName} on{' '}
          {new Date(review.moderatedAt).toLocaleDateString()}
        </div>
      )}

      {/* Action Buttons (for pending reviews) */}
      {review.status === 'pending' && (
        <div className="flex gap-2 pt-3 border-t">
          <button
            onClick={() => onModerate(review._id, 'approved')}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            ✓ Approve
          </button>
          <button
            onClick={() => setShowModerateModal(true)}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            ✗ Reject
          </button>
        </div>
      )}

      {/* Reject Modal */}
      {showModerateModal && (
        <RejectModal
          review={review}
          onConfirm={(notes) => {
            onModerate(review._id, 'rejected', notes);
            setShowModerateModal(false);
          }}
          onClose={() => setShowModerateModal(false)}
        />
      )}
    </div>
  );
}
```

#### c) Status Badge
```jsx
function StatusBadge({ status }) {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };

  const icons = {
    pending: '⏳',
    approved: '✓',
    rejected: '✗'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
      {icons[status]} {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
```

#### d) Reject Modal with Notes
```jsx
function RejectModal({ review, onConfirm, onClose }) {
  const [notes, setNotes] = useState('');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">Reject Review</h3>
        
        <p className="text-gray-600 mb-4">
          Are you sure you want to reject this review? You can optionally add notes
          explaining the reason.
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Admin Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={500}
            rows={4}
            className="w-full border rounded px-3 py-2"
            placeholder="e.g., Contains inappropriate language, violates community guidelines..."
          />
          <div className="text-sm text-gray-500 text-right mt-1">
            {notes.length}/500
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 border px-4 py-2 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(notes)}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Reject Review
          </button>
        </div>
      </div>
    </div>
  );
}
```

#### e) Star Rating Display
```jsx
function StarRating({ rating }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${
            star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
    </div>
  );
}
```

---

### 2. Complete Page Implementation

```jsx
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function AdminReviewsPage() {
  const [activeTab, setActiveTab] = useState('pending');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  // Fetch analytics
  const { data: analytics } = useQuery(
    ['reviewAnalytics'],
    fetchReviewAnalytics
  );

  // Fetch reviews based on active tab
  const { data: reviewsData, isLoading } = useQuery(
    ['reviews', activeTab, page],
    () => fetchReviewsByStatus(activeTab, page)
  );

  // Moderate mutation
  const moderateMutation = useMutation(
    ({ reviewId, status, notes }) => moderateReview(reviewId, status, notes),
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(['reviews']);
        queryClient.invalidateQueries(['reviewAnalytics']);
        
        // Show success message
        toast.success('Review moderated successfully');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to moderate review');
      }
    }
  );

  const handleModerate = (reviewId, status, notes = '') => {
    if (window.confirm(`Are you sure you want to ${status} this review?`)) {
      moderateMutation.mutate({ reviewId, status, notes });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Review Management</h1>

      {/* Analytics */}
      {analytics && (
        <ReviewAnalyticsCards analytics={analytics.data} />
      )}

      {/* Quick Stats */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-6">
          <div>
            <span className="font-semibold">Average Rating:</span>{' '}
            <span className="text-xl">⭐ {analytics?.data.averageRating.toFixed(1)}</span>
          </div>
          <div>
            <span className="font-semibold">Recent (30d):</span>{' '}
            <span className="text-xl">{analytics?.data.recentReviews}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        {[
          { key: 'pending', label: 'Pending', badge: analytics?.data.pendingReviews },
          { key: 'approved', label: 'Approved' },
          { key: 'rejected', label: 'Rejected' },
          { key: 'all', label: 'All' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setPage(1);
            }}
            className={`px-4 py-2 font-medium ${
              activeTab === tab.key
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
            {tab.badge > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      {isLoading ? (
        <LoadingSpinner />
      ) : reviewsData?.data.reviews.length === 0 ? (
        <EmptyState message={`No ${activeTab} reviews found`} />
      ) : (
        <>
          <div className="space-y-4">
            {reviewsData?.data.reviews.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
                onModerate={handleModerate}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={reviewsData?.data.totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}

// API Functions
async function fetchReviewAnalytics() {
  const response = await fetch('/api/v1/reviews/admin/analytics', {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch analytics');
  return response.json();
}

async function fetchReviewsByStatus(status, page) {
  const endpoint = status === 'pending'
    ? `/api/v1/reviews/admin/pending?page=${page}`
    : `/api/v1/reviews/product/all?status=${status}&page=${page}`;
  
  const response = await fetch(endpoint, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch reviews');
  return response.json();
}

async function moderateReview(reviewId, status, notes) {
  const response = await fetch(`/api/v1/reviews/${reviewId}/moderate`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status, notes })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  return response.json();
}
```

---

## 🔄 Workflows

### Approve Review Workflow
```
1. Admin clicks "Approve" button
2. Confirm dialog (optional)
3. PATCH /api/v1/reviews/:id/moderate { status: 'approved' }
4. Backend:
   ✓ Updates review status to 'approved'
   ✓ Recalculates product rating
   ✓ Updates seller rating (NEW)
5. Frontend:
   ✓ Refreshes review list
   ✓ Updates analytics counts
   ✓ Shows success message
   ✓ Removes from pending list
```

### Reject Review Workflow
```
1. Admin clicks "Reject" button
2. Modal opens asking for notes (optional)
3. PATCH /api/v1/reviews/:id/moderate { status: 'rejected', notes: '...' }
4. Backend:
   ✓ Updates review status to 'rejected'
   ✓ Stores admin notes
5. Frontend:
   ✓ Refreshes review list
   ✓ Updates analytics counts
   ✓ Shows success message
   ✓ Removes from pending list
```

---

## 📱 Responsive Design

### Mobile
- Stack review cards vertically
- Show condensed user info
- Collapsible review content
- Bottom sheet for moderation actions

### Tablet
- 1-2 column grid for analytics
- Full review cards
- Side drawer for filters

### Desktop
- 4 column grid for analytics
- Full-width review cards
- Sidebar with quick filters
- Inline moderation actions

---

## 🔔 Real-time Updates (Optional)

For a better admin experience, consider implementing real-time updates:

### Using WebSockets or Server-Sent Events
```javascript
// Connect to WebSocket
const ws = new WebSocket('ws://your-api.com/admin/reviews');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.type === 'NEW_REVIEW') {
    // Show notification
    toast.info('New review pending moderation');
    // Refresh pending count
    queryClient.invalidateQueries(['reviewAnalytics']);
  }
};
```

### Using Polling (Simpler Alternative)
```javascript
// Poll for new pending reviews every 30 seconds
useInterval(() => {
  queryClient.invalidateQueries(['reviewAnalytics']);
}, 30000);
```

---

## 🎯 Key Features to Implement

### Must Have
- ✅ View pending reviews
- ✅ Approve/reject reviews
- ✅ View analytics dashboard
- ✅ Filter by status (pending/approved/rejected)
- ✅ Pagination
- ✅ View review details (product, user, order)
- ✅ Add rejection notes

### Nice to Have
- 📊 Charts for rating distribution
- 🔍 Search reviews by keyword
- 📅 Filter by date range
- 📧 Email notifications for new reviews
- 🔔 Browser notifications
- 📊 Export reviews to CSV
- 📈 Advanced analytics (trends, top reviewers)
- 🚫 Bulk moderation (approve/reject multiple)

---

## 🐛 Error Handling

```javascript
const handleModerate = async (reviewId, status, notes) => {
  try {
    const response = await moderateReview(reviewId, status, notes);
    
    if (!response.success) {
      throw new Error(response.message);
    }
    
    // Success handling
    toast.success(`Review ${status} successfully`);
    queryClient.invalidateQueries(['reviews']);
    
  } catch (error) {
    // Error handling
    if (error.message.includes('403')) {
      toast.error('Access denied. Admin privileges required.');
    } else if (error.message.includes('404')) {
      toast.error('Review not found.');
    } else if (error.message.includes('Network')) {
      toast.error('Network error. Please check your connection.');
    } else {
      toast.error(error.message || 'Failed to moderate review');
    }
  }
};
```

---

## 🔐 Security & Permissions

### Authentication
- All admin review endpoints require authentication
- Must have `admin` role in JWT token
- Token must be included in `Authorization` header

### Authorization
```javascript
// Example middleware check (handled by backend)
if (user.role !== 'admin') {
  return { error: 'Access denied. Admin only.' };
}
```

### Frontend Protection
```javascript
// Protect admin routes
function AdminRoute({ children }) {
  const { user } = useAuth();
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }
  
  return children;
}

// Usage
<Route path="/admin/reviews" element={
  <AdminRoute>
    <AdminReviewsPage />
  </AdminRoute>
} />
```

---

## ✅ Testing Checklist

### Functional Testing
- [ ] Admin can view pending reviews
- [ ] Admin can approve a review
- [ ] Admin can reject a review
- [ ] Admin can add notes when rejecting
- [ ] Analytics display correctly
- [ ] Tabs switch properly (pending/approved/rejected/all)
- [ ] Pagination works
- [ ] Filters work correctly
- [ ] Review details display properly (product, user, order)
- [ ] Status badges show correct status
- [ ] Helpful/not helpful counts display
- [ ] Review images display and can be viewed
- [ ] Verified purchase badge shows for verified reviews
- [ ] Moderator notes display (after rejection)
- [ ] Moderation updates analytics in real-time

### Permission Testing
- [ ] Non-admin users cannot access admin endpoints
- [ ] Unauthenticated users are redirected
- [ ] Token expiration is handled
- [ ] 403 errors show appropriate messages

### UI/UX Testing
- [ ] Loading states work
- [ ] Empty states display when no reviews
- [ ] Success messages show after actions
- [ ] Error messages are clear and helpful
- [ ] Confirm dialogs prevent accidental actions
- [ ] Mobile responsive layout works
- [ ] Images load properly
- [ ] Long content truncates with "Read more"

### Edge Cases
- [ ] Handle very long review content
- [ ] Handle reviews with no images
- [ ] Handle reviews with many images (10+)
- [ ] Handle special characters in content
- [ ] Handle network errors gracefully
- [ ] Handle concurrent moderation (two admins moderating same review)

---

## 📊 Analytics Dashboard (Advanced)

### Additional Metrics to Display
```jsx
function AdvancedAnalytics({ data }) {
  return (
    <div className="grid grid-cols-3 gap-4 mt-6">
      {/* Rating Distribution Chart */}
      <div className="col-span-2 border rounded-lg p-4">
        <h3 className="font-bold mb-4">Rating Distribution</h3>
        <BarChart data={data.ratingDistribution} />
      </div>

      {/* Recent Activity */}
      <div className="border rounded-lg p-4">
        <h3 className="font-bold mb-4">Recent Activity</h3>
        <Timeline events={data.recentActivity} />
      </div>

      {/* Top Reviewers */}
      <div className="border rounded-lg p-4">
        <h3 className="font-bold mb-4">Top Reviewers</h3>
        <UserList users={data.topReviewers} />
      </div>

      {/* Response Time */}
      <div className="border rounded-lg p-4">
        <h3 className="font-bold mb-4">Avg. Moderation Time</h3>
        <Metric value={data.avgModerationTime} unit="hours" />
      </div>
    </div>
  );
}
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install @tanstack/react-query axios react-hot-toast
```

### 2. Set Up API Client
```javascript
// api/reviews.js
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

export const reviewAPI = {
  getPending: (page, limit) => 
    axios.get(`${API_BASE}/reviews/admin/pending`, { params: { page, limit } }),
  
  moderate: (reviewId, status, notes) => 
    axios.patch(`${API_BASE}/reviews/${reviewId}/moderate`, { status, notes }),
  
  getAnalytics: () => 
    axios.get(`${API_BASE}/reviews/admin/analytics`),
  
  getById: (reviewId) => 
    axios.get(`${API_BASE}/reviews/${reviewId}`)
};
```

### 3. Create Admin Review Page
- Use the components provided above
- Integrate with your routing system
- Add to admin navigation menu

### 4. Test with Admin Account
```javascript
// Test credentials format
{
  email: 'admin@example.com',
  password: 'your-password',
  role: 'admin'
}
```

---

## 📞 Support

If you encounter issues or need clarification:
1. Check the API response in browser DevTools
2. Verify JWT token is valid and includes admin role
3. Check backend logs for detailed error messages
4. Contact backend team for API-specific issues

---

## 📝 Summary

**What's Already Working (Backend):**
- ✅ Get pending reviews
- ✅ Approve/reject reviews (with notes)
- ✅ Get analytics
- ✅ Automatic product rating updates
- ✅ **Automatic seller rating updates** (NEW)
- ✅ Admin authentication & authorization

**What Frontend Needs to Build:**
- 📱 Admin reviews dashboard page
- 🎯 Review moderation interface (approve/reject)
- 📊 Analytics display
- 🔍 Filters and tabs
- 📄 Pagination
- 🎨 Review cards with all details
- ⚠️ Confirmation dialogs
- 🎉 Success/error notifications

---

**Last Updated:** January 29, 2026  
**API Version:** 1.0.0  
**Backend Team Contact:** [Your Contact Info]
