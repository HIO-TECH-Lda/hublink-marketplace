# Seller Rating System - Frontend Integration Guide

## Overview

The seller rating system tracks and displays seller performance metrics including ratings, reviews, sales, verification status, and featured status. This guide provides everything the frontend team needs to integrate this feature.

---

## 📊 Data Model

### Seller Metrics (User Model - Root Level)

All sellers have the following metrics at the User model root level:

```typescript
interface SellerMetrics {
  rating: number;           // Average rating (0-5)
  totalReviews: number;     // Total number of reviews
  totalSales: number;       // Total completed orders
  isVerified: boolean;      // Seller verification status
  isFeatured: boolean;      // Featured seller status
}
```

### Complete Seller Response

```typescript
interface Seller {
  id: string;
  businessName: string;     // From sellerProfile.storeName or firstName + lastName
  logo: string;             // Avatar URL
  description: string;      // From sellerProfile.storeDescription
  rating: number;           // 0-5
  totalReviews: number;
  totalSales: number;
  totalProducts: number;
  location: string;         // "City, Province"
  isVerified: boolean;
  isFeatured: boolean;
  memberSince: Date;
}
```

---

## 🔌 API Endpoints

### 1. Get Public Sellers Directory

**Endpoint:** `GET /api/sellers`

**Query Parameters:**
- `search` (string) - Search by store name, description, or seller name
- `category` (string) - Filter by product category
- `minRating` (number) - Minimum rating (0-5)
- `location` (string) - Filter by city or province
- `verified` (boolean) - Filter verified sellers only
- `featured` (boolean) - Filter featured sellers only
- `page` (number, default: 1) - Page number
- `limit` (number, default: 12) - Items per page
- `sortBy` (string) - Sort field: `rating`, `sales`, `name`, `createdAt`
- `sortOrder` (string) - Sort direction: `asc` or `desc`

**Example Request:**
```javascript
// Get top-rated sellers
fetch('/api/sellers?sortBy=rating&sortOrder=desc&minRating=4.5&page=1&limit=12')

// Get featured sellers only
fetch('/api/sellers?featured=true')

// Get verified sellers in a location
fetch('/api/sellers?verified=true&location=Maputo')
```

**Response:**
```json
{
  "success": true,
  "sellers": [
    {
      "id": "507f1f77bcf86cd799439011",
      "businessName": "Tech Solutions MZ",
      "logo": "https://example.com/avatar.jpg",
      "description": "Premium electronics and gadgets",
      "rating": 4.8,
      "totalReviews": 156,
      "totalSales": 1250,
      "totalProducts": 45,
      "location": "Maputo, Maputo",
      "isVerified": true,
      "isFeatured": true,
      "memberSince": "2023-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 48,
    "totalPages": 4
  }
}
```

---

### 2. Get Seller Profile

**Endpoint:** `GET /api/sellers/:sellerId`

**Example Request:**
```javascript
fetch('/api/sellers/507f1f77bcf86cd799439011')
```

**Response:**
```json
{
  "success": true,
  "seller": {
    "id": "507f1f77bcf86cd799439011",
    "businessName": "Tech Solutions MZ",
    "logo": "https://example.com/avatar.jpg",
    "description": "Premium electronics and gadgets",
    "rating": 4.8,
    "totalReviews": 156,
    "totalSales": 1250,
    "totalProducts": 45,
    "location": "Av. Julius Nyerere, Maputo, Maputo",
    "isVerified": true,
    "isFeatured": true,
    "memberSince": "2023-01-15T10:30:00.000Z",
    "contactEmail": "seller@example.com",
    "phone": "+258841234567",
    "policies": {
      "returns": "30 days return policy",
      "shipping": "Ships within 2-3 business days",
      "warranty": "Standard warranty applies"
    },
    "statistics": {
      "avgResponseTime": "2-4 hours",
      "responseRate": 95,
      "avgShippingTime": "2-3 days",
      "successfulOrders": 1180
    },
    "recentProducts": [
      // Array of up to 8 recent products
    ]
  }
}
```

---

### 3. Get Top Sellers

**Endpoint:** `GET /api/sellers/top`

**Query Parameters:**
- `limit` (number, default: 10) - Number of sellers to return

**Example Request:**
```javascript
fetch('/api/sellers/top?limit=10')
```

**Response:**
```json
{
  "success": true,
  "sellers": [
    // Array of seller objects (minimum rating 4.0)
    // Sorted by: rating DESC, totalReviews DESC
  ]
}
```

**Usage:** Display on homepage, sidebar widgets, or "Top Sellers" page.

---

### 4. Get Featured Sellers

**Endpoint:** `GET /api/sellers/featured`

**Query Parameters:**
- `limit` (number, default: 6) - Number of sellers to return

**Example Request:**
```javascript
fetch('/api/sellers/featured?limit=6')
```

**Response:**
```json
{
  "success": true,
  "sellers": [
    // Array of featured seller objects
    // Sorted by: totalSales DESC
  ]
}
```

**Usage:** Display on homepage banners, promotional sections.

---

### 5. Get Seller Products

**Endpoint:** `GET /api/sellers/:sellerId/products`

**Query Parameters:**
- `category` (string) - Filter by category
- `search` (string) - Search products
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `sortBy` (string) - `price`, `name`, `rating`, `createdAt`
- `sortOrder` (string) - `asc` or `desc`

**Example Request:**
```javascript
fetch('/api/sellers/507f1f77bcf86cd799439011/products?sortBy=rating&sortOrder=desc')
```

---

## 🎨 UI Components Recommendations

### 1. Seller Rating Badge

Display the seller's rating prominently:

```jsx
function SellerRatingBadge({ rating, totalReviews }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={star <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
            size={16}
          />
        ))}
      </div>
      <span className="font-semibold">{rating.toFixed(1)}</span>
      <span className="text-gray-500">({totalReviews.toLocaleString()} reviews)</span>
    </div>
  );
}
```

---

### 2. Seller Verification Badge

Show verification and featured status:

```jsx
function SellerBadges({ isVerified, isFeatured }) {
  return (
    <div className="flex gap-2">
      {isVerified && (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
          <ShieldCheck size={14} />
          Verified
        </span>
      )}
      {isFeatured && (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
          <Star size={14} />
          Featured
        </span>
      )}
    </div>
  );
}
```

---

### 3. Seller Card

Display seller in directory/grid:

```jsx
function SellerCard({ seller }) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition">
      <div className="flex items-start gap-4">
        <img
          src={seller.logo || '/default-avatar.png'}
          alt={seller.businessName}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{seller.businessName}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{seller.description}</p>
          
          <div className="mt-2">
            <SellerRatingBadge rating={seller.rating} totalReviews={seller.totalReviews} />
          </div>
          
          <div className="mt-2 flex gap-4 text-sm text-gray-600">
            <span>{seller.totalProducts} products</span>
            <span>{seller.totalSales.toLocaleString()} sales</span>
          </div>
          
          {seller.location && (
            <div className="mt-2 flex items-center gap-1 text-sm text-gray-600">
              <MapPin size={14} />
              {seller.location}
            </div>
          )}
          
          <div className="mt-3">
            <SellerBadges isVerified={seller.isVerified} isFeatured={seller.isFeatured} />
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

### 4. Seller Stats Widget

Display key metrics:

```jsx
function SellerStatsWidget({ seller }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="text-2xl font-bold text-blue-600">{seller.rating.toFixed(1)}</div>
        <div className="text-sm text-gray-600">Average Rating</div>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="text-2xl font-bold text-green-600">
          {seller.totalSales.toLocaleString()}
        </div>
        <div className="text-sm text-gray-600">Total Sales</div>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="text-2xl font-bold text-purple-600">
          {seller.totalReviews.toLocaleString()}
        </div>
        <div className="text-sm text-gray-600">Reviews</div>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="text-2xl font-bold text-orange-600">
          {seller.totalProducts}
        </div>
        <div className="text-sm text-gray-600">Products</div>
      </div>
    </div>
  );
}
```

---

## 🔍 Filtering & Sorting Examples

### Example: Seller Directory Page with Filters

```jsx
function SellerDirectory() {
  const [filters, setFilters] = useState({
    search: '',
    minRating: '',
    location: '',
    verified: false,
    featured: false,
    sortBy: 'rating',
    sortOrder: 'desc',
    page: 1,
    limit: 12
  });

  const { data, isLoading } = useQuery(
    ['sellers', filters],
    () => fetchSellers(filters)
  );

  return (
    <div className="container mx-auto p-6">
      {/* Filters */}
      <div className="mb-6 flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search sellers..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="border rounded px-4 py-2"
        />
        
        <select
          value={filters.minRating}
          onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
          className="border rounded px-4 py-2"
        >
          <option value="">All Ratings</option>
          <option value="4.5">4.5+ Stars</option>
          <option value="4.0">4.0+ Stars</option>
          <option value="3.5">3.5+ Stars</option>
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filters.verified}
            onChange={(e) => setFilters({ ...filters, verified: e.target.checked })}
          />
          Verified Only
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filters.featured}
            onChange={(e) => setFilters({ ...filters, featured: e.target.checked })}
          />
          Featured Only
        </label>

        <select
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
          className="border rounded px-4 py-2"
        >
          <option value="rating">Top Rated</option>
          <option value="sales">Most Sales</option>
          <option value="name">Name</option>
          <option value="createdAt">Newest</option>
        </select>
      </div>

      {/* Sellers Grid */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.sellers.map((seller) => (
              <SellerCard key={seller.id} seller={seller} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={data?.pagination.page}
            totalPages={data?.pagination.totalPages}
            onPageChange={(page) => setFilters({ ...filters, page })}
          />
        </>
      )}
    </div>
  );
}
```

---

## 📱 Responsive Design Recommendations

### Mobile
- Stack seller info vertically
- Show condensed metrics (rating + reviews only)
- Use bottom sheet for filters

### Tablet
- 2-column grid for seller cards
- Show all metrics
- Sidebar filters

### Desktop
- 3-4 column grid
- Full seller details
- Advanced filtering sidebar

---

## 🎯 Key Features to Implement

### Homepage
1. **Featured Sellers Carousel** - Use `/api/sellers/featured?limit=6`
2. **Top Sellers Grid** - Use `/api/sellers/top?limit=8`

### Seller Directory Page
1. **Search & Filters** - Implement all query parameters
2. **Sort Options** - Rating, Sales, Name, Newest
3. **Pagination** - Handle large seller lists
4. **Category Filter** - Filter by product categories

### Seller Profile Page
1. **Seller Header** - Logo, name, rating, badges
2. **Stats Dashboard** - Key metrics in cards
3. **About Section** - Description, location, policies
4. **Products Grid** - Seller's products with pagination
5. **Statistics Section** - Response time, shipping time, etc.

### Product Pages
1. **Seller Info Card** - Show seller rating & badges next to product
2. **Link to Seller Profile** - Allow users to visit seller page
3. **Other Products by Seller** - Show 4-6 related products

---

## 🔔 Important Notes

### Rating Display
- Always show rating with 1 decimal place: `4.8` not `4.83`
- Show stars visually (5-star scale)
- Include total review count in parentheses

### Verification Badge
- Only show for `isVerified === true`
- Use shield or checkmark icon
- Consistent color (typically blue)

### Featured Badge
- Only show for `isFeatured === true`
- Use star or crown icon
- Consistent color (typically purple/gold)

### No Data States
- If rating is 0: Show "No ratings yet"
- If totalReviews is 0: Don't show review count
- If seller has no products: Show appropriate message

### Performance
- Implement pagination for all lists
- Use lazy loading for seller images
- Cache API responses (React Query recommended)

---

## 🔄 Data Updates

### When Ratings Update
The seller rating metrics are automatically calculated when:
- A customer leaves a product review
- Reviews are approved/rejected by moderators
- Orders are completed

**Note:** Ratings are NOT real-time. There may be a delay while the system recalculates aggregates.

### Refresh Strategy
- **Homepage:** Cache for 5-10 minutes
- **Seller Directory:** Cache for 2-5 minutes
- **Seller Profile:** Cache for 1-2 minutes
- **Product Page Seller Info:** Cache for 5 minutes

---

## 🐛 Error Handling

```javascript
async function fetchSellers(filters) {
  try {
    const params = new URLSearchParams(
      Object.entries(filters)
        .filter(([_, value]) => value !== '' && value !== false)
        .map(([key, value]) => [key, String(value)])
    );

    const response = await fetch(`/api/sellers?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch sellers');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching sellers:', error);
    // Show user-friendly error message
    throw error;
  }
}
```

---

## ✅ Testing Checklist

- [ ] Seller directory loads with default settings
- [ ] Search filters sellers correctly
- [ ] Rating filter works (4.0+, 4.5+, etc.)
- [ ] Location filter works
- [ ] Verified/Featured filters work
- [ ] Sorting works (rating, sales, name, date)
- [ ] Pagination works correctly
- [ ] Seller profile page displays all data
- [ ] Seller products load with pagination
- [ ] Featured sellers carousel works
- [ ] Top sellers grid displays correctly
- [ ] Mobile responsive layout works
- [ ] Images load with proper fallbacks
- [ ] No data states display properly
- [ ] Loading states work
- [ ] Error handling works

---

## 📞 Support

If you have questions or need clarification on any endpoint:

1. Check the API documentation
2. Test endpoints using Postman/Thunder Client
3. Check response examples in this guide
4. Contact backend team for API issues

---

## 🚀 Quick Start

1. **Install dependencies** (if using React Query):
```bash
npm install @tanstack/react-query
```

2. **Create API client**:
```javascript
// api/sellers.js
export const sellerAPI = {
  getAll: (filters) => fetch(`/api/sellers?${new URLSearchParams(filters)}`).then(r => r.json()),
  getById: (id) => fetch(`/api/sellers/${id}`).then(r => r.json()),
  getTop: (limit = 10) => fetch(`/api/sellers/top?limit=${limit}`).then(r => r.json()),
  getFeatured: (limit = 6) => fetch(`/api/sellers/featured?limit=${limit}`).then(r => r.json()),
  getProducts: (id, filters) => fetch(`/api/sellers/${id}/products?${new URLSearchParams(filters)}`).then(r => r.json()),
};
```

3. **Use in components**:
```javascript
import { useQuery } from '@tanstack/react-query';
import { sellerAPI } from './api/sellers';

function TopSellers() {
  const { data, isLoading } = useQuery(['topSellers'], () => sellerAPI.getTop(8));
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div className="grid grid-cols-4 gap-4">
      {data?.sellers.map(seller => (
        <SellerCard key={seller.id} seller={seller} />
      ))}
    </div>
  );
}
```

---

## 📚 Additional Resources

- **API Base URL:** Check your environment variables
- **Authentication:** Most endpoints are public, no auth required
- **Rate Limiting:** Standard rate limits apply
- **CORS:** Configured for your frontend domain

---

**Last Updated:** January 29, 2026
**API Version:** 1.0.0
**Backend Contact:** Backend Team
