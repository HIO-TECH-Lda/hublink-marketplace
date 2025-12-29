# Admin Dashboard API Documentation

## Overview

The Admin Dashboard API provides comprehensive statistics and metrics for the administrative panel. This endpoint aggregates data from multiple sources (users, orders, products, payments, reviews, refunds, tickets, etc.) and returns it in a single response.

## Endpoint

```
GET /api/v1/admin/dashboard
```

## Authentication

**Required:** Admin role only

This endpoint requires:
- Valid JWT token in the Authorization header
- User must have `admin` role

### Headers

```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

## Response Format

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "data": {
    "users": {
      "total": 1250,
      "changePercent": 12.5,
      "buyers": 1000,
      "sellers": 200,
      "admins": 50
    },
    "orders": {
      "total": 3450,
      "pending": 45,
      "confirmed": 120,
      "processing": 80,
      "shipped": 150,
      "delivered": 2800,
      "cancelled": 205,
      "recent": 320
    },
    "revenue": {
      "total": 1250000.50,
      "changePercent": 8.3,
      "thisMonth": 95000.00
    },
    "products": {
      "total": 5670,
      "activeSellers": 180,
      "lowStock": 45,
      "outOfStock": 12
    },
    "blogPosts": {
      "total": 0,
      "published": 0
    },
    "reviews": {
      "averageRating": 4.5,
      "total": 2340,
      "pending": 15
    },
    "refunds": {
      "total": 125,
      "pending": 8,
      "approved": 95,
      "rejected": 22
    },
    "tickets": {
      "total": 450,
      "open": 25,
      "inProgress": 12,
      "resolved": 380,
      "urgent": 5
    },
    "categories": {
      "total": 45
    },
    "payments": {
      "pending": 30,
      "processing": 15,
      "completed": 3200,
      "failed": 45
    },
    "recentActivity": []
  }
}
```

### Error Responses

#### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access token required"
}
```

#### 403 Forbidden
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to fetch dashboard data"
}
```

## Data Structure

### Users Object
| Field | Type | Description |
|-------|------|-------------|
| `total` | number | Total number of users |
| `changePercent` | number | Month-over-month percentage change (can be negative) |
| `buyers` | number | Total number of buyers |
| `sellers` | number | Total number of sellers |
| `admins` | number | Total number of admins |

### Orders Object
| Field | Type | Description |
|-------|------|-------------|
| `total` | number | Total number of orders |
| `pending` | number | Orders with pending status |
| `confirmed` | number | Orders with confirmed status |
| `processing` | number | Orders being processed |
| `shipped` | number | Orders that have been shipped |
| `delivered` | number | Orders that have been delivered |
| `cancelled` | number | Cancelled orders |
| `recent` | number | Orders created in the last 7 days |

### Revenue Object
| Field | Type | Description |
|-------|------|-------------|
| `total` | number | Total revenue from all completed payments |
| `changePercent` | number | Month-over-month percentage change |
| `thisMonth` | number | Revenue generated this month |

### Products Object
| Field | Type | Description |
|-------|------|-------------|
| `total` | number | Total number of products |
| `activeSellers` | number | Number of active sellers |
| `lowStock` | number | Products with stock < 10 |
| `outOfStock` | number | Products with stock = 0 |

### Reviews Object
| Field | Type | Description |
|-------|------|-------------|
| `averageRating` | number | Average rating across all approved reviews (0-5) |
| `total` | number | Total number of approved reviews |
| `pending` | number | Reviews awaiting moderation |

### Refunds Object
| Field | Type | Description |
|-------|------|-------------|
| `total` | number | Total number of refund requests |
| `pending` | number | Refund requests awaiting approval |
| `approved` | number | Approved refund requests |
| `rejected` | number | Rejected refund requests |

### Tickets Object
| Field | Type | Description |
|-------|------|-------------|
| `total` | number | Total number of support tickets |
| `open` | number | Open tickets |
| `inProgress` | number | Tickets currently being worked on |
| `resolved` | number | Resolved tickets |
| `urgent` | number | Tickets marked as urgent priority |

### Categories Object
| Field | Type | Description |
|-------|------|-------------|
| `total` | number | Total number of active categories |

### Payments Object
| Field | Type | Description |
|-------|------|-------------|
| `pending` | number | Payments with pending status |
| `processing` | number | Payments being processed |
| `completed` | number | Completed payments |
| `failed` | number | Failed payments |

## Integration Examples

### JavaScript/TypeScript (Fetch API)

```typescript
async function fetchDashboardData(token: string) {
  try {
    const response = await fetch('http://api.example.com/api/v1/admin/dashboard', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}

// Usage
const dashboardData = await fetchDashboardData(userToken);
console.log('Total Users:', dashboardData.users.total);
console.log('Pending Orders:', dashboardData.orders.pending);
```

### Axios

```typescript
import axios from 'axios';

async function getDashboardStats(token: string) {
  try {
    const response = await axios.get('/api/v1/admin/dashboard', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        // Handle unauthorized - redirect to login
        window.location.href = '/login';
      } else if (error.response?.status === 403) {
        // Handle forbidden - show access denied message
        alert('You do not have permission to access this page');
      }
    }
    throw error;
  }
}
```

### React Hook Example

```typescript
import { useState, useEffect } from 'react';

interface DashboardStats {
  users: {
    total: number;
    changePercent: number;
    buyers: number;
    sellers: number;
    admins: number;
  };
  orders: {
    total: number;
    pending: number;
    confirmed: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    recent: number;
  };
  // ... other fields
}

function useDashboard(token: string) {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch('/api/v1/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const result = await response.json();
        if (result.success) {
          setData(result.data);
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchData();
    }
  }, [token]);

  return { data, loading, error };
}

// Usage in component
function Dashboard() {
  const token = localStorage.getItem('authToken');
  const { data, loading, error } = useDashboard(token!);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <h2>Users: {data.users.total}</h2>
        <p>Change: {data.users.changePercent}%</p>
      </div>
      <div>
        <h2>Orders: {data.orders.total}</h2>
        <p>Pending: {data.orders.pending}</p>
      </div>
      {/* ... more stats */}
    </div>
  );
}
```

### Vue.js Example

```javascript
import { ref, onMounted } from 'vue';
import axios from 'axios';

export function useDashboard() {
  const dashboardData = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const fetchDashboard = async (token) => {
    try {
      loading.value = true;
      error.value = null;
      
      const response = await axios.get('/api/v1/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        dashboardData.value = response.data.data;
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch dashboard';
    } finally {
      loading.value = false;
    }
  };

  return {
    dashboardData,
    loading,
    error,
    fetchDashboard
  };
}

// Usage in component
export default {
  setup() {
    const { dashboardData, loading, error, fetchDashboard } = useDashboard();
    const token = localStorage.getItem('authToken');

    onMounted(() => {
      fetchDashboard(token);
    });

    return {
      dashboardData,
      loading,
      error
    };
  }
};
```

## UI Recommendations

### Key Metrics Cards

Display the main metrics prominently:

```typescript
// Example metric card structure
interface MetricCard {
  title: string;
  value: number | string;
  change?: number; // percentage change
  subtitle?: string;
  icon?: string;
}

const metrics: MetricCard[] = [
  {
    title: 'Total Users',
    value: dashboardData.users.total,
    change: dashboardData.users.changePercent,
    subtitle: `${dashboardData.users.buyers} buyers, ${dashboardData.users.sellers} sellers`
  },
  {
    title: 'Total Orders',
    value: dashboardData.orders.total,
    subtitle: `${dashboardData.orders.pending} pending`
  },
  {
    title: 'Total Revenue',
    value: formatCurrency(dashboardData.revenue.total),
    change: dashboardData.revenue.changePercent,
    subtitle: `This month: ${formatCurrency(dashboardData.revenue.thisMonth)}`
  },
  {
    title: 'Products',
    value: dashboardData.products.total,
    subtitle: `${dashboardData.products.activeSellers} active sellers`
  }
];
```

### Alert Indicators

Use visual indicators for items requiring attention:

- **Pending Reviews**: Show badge if `reviews.pending > 0`
- **Urgent Tickets**: Highlight if `tickets.urgent > 0`
- **Low Stock**: Alert if `products.lowStock > 0` or `products.outOfStock > 0`
- **Pending Refunds**: Show count if `refunds.pending > 0`

### Status Breakdowns

Display status breakdowns using charts or progress bars:

```typescript
// Order status breakdown
const orderStatusData = [
  { label: 'Delivered', value: dashboardData.orders.delivered, color: '#10b981' },
  { label: 'Shipped', value: dashboardData.orders.shipped, color: '#3b82f6' },
  { label: 'Processing', value: dashboardData.orders.processing, color: '#f59e0b' },
  { label: 'Pending', value: dashboardData.orders.pending, color: '#6b7280' },
  { label: 'Cancelled', value: dashboardData.orders.cancelled, color: '#ef4444' }
];
```

## Performance Considerations

1. **Caching**: Consider caching the dashboard data for 1-2 minutes to reduce server load
2. **Polling**: If implementing auto-refresh, use intervals of 30-60 seconds minimum
3. **Error Handling**: Implement retry logic with exponential backoff
4. **Loading States**: Show skeleton loaders while fetching data

## Rate Limiting

The API has rate limiting enabled:
- **Limit**: 1000 requests per 15 minutes per IP
- If rate limited, you'll receive a `429 Too Many Requests` response

## Notes

- All monetary values are in the base currency (MZM - Mozambican Metical)
- Percentages are rounded to 2 decimal places
- All counts are integers
- The `recentActivity` array is currently empty but reserved for future use
- `blogPosts` currently returns 0 as the blog feature is not yet implemented

## Support

For questions or issues, contact the backend team or refer to the main API documentation.

