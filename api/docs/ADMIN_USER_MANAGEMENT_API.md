# Admin User Management API Documentation

## Overview

The Admin User Management API provides comprehensive endpoints for managing users in the administrative panel. This includes listing users with filters, viewing user details, creating, updating, and deleting users, as well as managing user statuses.

## Base URL

All endpoints are prefixed with: `/api/v1/admin/users`

## Authentication

**Required:** Admin role only

All endpoints require:
- Valid JWT token in the Authorization header
- User must have `admin` role

### Headers

```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

---

## Endpoints

### 1. Get User Statistics

Get summary statistics about users.

**Endpoint:** `GET /api/v1/admin/users/stats`

**Response:**

```json
{
  "success": true,
  "data": {
    "total": 1250,
    "vendors": 200,
    "clients": 1000,
    "active": 1100
  }
}
```

**Response Fields:**
- `total`: Total number of users
- `vendors`: Number of sellers
- `clients`: Number of buyers
- `active`: Number of active users

---

### 2. Get All Users (with filters)

Get a paginated list of users with optional filtering and search.

**Endpoint:** `GET /api/v1/admin/users`

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `search` | string | Search by name, email, or phone | `?search=joao` |
| `status` | string | Filter by status: `active`, `inactive`, `suspended` | `?status=active` |
| `role` | string | Filter by role: `buyer`, `seller`, `admin`, `support` | `?role=buyer` |
| `page` | number | Page number (default: 1) | `?page=1` |
| `limit` | number | Items per page (default: 10) | `?limit=20` |
| `sortBy` | string | Field to sort by (default: `createdAt`) | `?sortBy=firstName` |
| `sortOrder` | string | Sort order: `asc` or `desc` (default: `desc`) | `?sortOrder=asc` |

**Example Request:**

```
GET /api/v1/admin/users?search=joao&status=active&role=buyer&page=1&limit=10
```

**Response:**

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "id": "507f1f77bcf86cd799439011",
        "firstName": "João",
        "lastName": "Silva",
        "email": "joao.silva@email.com",
        "phone": "+258841234567",
        "role": "buyer",
        "status": "active",
        "emailVerified": true,
        "phoneVerified": true,
        "avatar": "https://example.com/avatar.jpg",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-20T16:25:00.000Z",
        "orderCount": 5,
        "totalSpent": 450.00,
        "lastLogin": "2024-01-20T16:25:00.000Z"
      }
    ],
    "total": 1000,
    "page": 1,
    "limit": 10,
    "totalPages": 100
  }
}
```

**User Object Fields:**
- `id`: User ID (string)
- `firstName`: First name
- `lastName`: Last name
- `email`: Email address
- `phone`: Phone number
- `role`: User role (`buyer`, `seller`, `admin`, `support`)
- `status`: User status (`active`, `inactive`, `suspended`)
- `emailVerified`: Email verification status
- `phoneVerified`: Phone verification status
- `avatar`: Avatar URL (if available)
- `createdAt`: Account creation date
- `updatedAt`: Last update date
- `orderCount`: Total number of orders (excluding cancelled)
- `totalSpent`: Total amount spent (excluding cancelled orders)
- `lastLogin`: Last login date (approximated from last payment)

---

### 3. Get User by ID

Get detailed information about a specific user.

**Endpoint:** `GET /api/v1/admin/users/:userId`

**Path Parameters:**
- `userId`: User ID (MongoDB ObjectId)

**Example Request:**

```
GET /api/v1/admin/users/507f1f77bcf86cd799439011
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "id": "507f1f77bcf86cd799439011",
    "firstName": "João",
    "lastName": "Silva",
    "email": "joao.silva@email.com",
    "phone": "+258841234567",
    "role": "buyer",
    "status": "active",
    "emailVerified": true,
    "phoneVerified": true,
    "avatar": "https://example.com/avatar.jpg",
    "billingAddress": {
      "street": "Rua Example",
      "city": "Maputo",
      "state": "Maputo",
      "postalCode": "1100",
      "country": "Mozambique",
      "isDefault": true
    },
    "shippingAddress": { ... },
    "preferences": {
      "language": "pt",
      "currency": "MZN",
      "notifications": {
        "email": true,
        "sms": true,
        "push": true
      }
    },
    "sellerProfile": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-20T16:25:00.000Z",
    "orderCount": 5,
    "totalSpent": 450.00,
    "lastLogin": "2024-01-20T16:25:00.000Z"
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "message": "User not found"
}
```

---

### 4. Create New User

Create a new user account (admin only).

**Endpoint:** `POST /api/v1/admin/users`

**Request Body:**

```json
{
  "firstName": "Maria",
  "lastName": "Santos",
  "email": "maria.santos@email.com",
  "phone": "+258849876543",
  "password": "SecurePassword123!",
  "role": "buyer",
  "status": "active"
}
```

**Required Fields:**
- `firstName`: First name (string, 2-50 characters)
- `lastName`: Last name (string, 2-50 characters)
- `email`: Email address (string, valid email format)
- `phone`: Phone number (string, format: +258XXXXXXXXX)
- `password`: Password (string, minimum 8 characters)

**Optional Fields:**
- `role`: User role (`buyer`, `seller`, `admin`, `support`) - default: `buyer`
- `status`: User status (`active`, `inactive`, `suspended`) - default: `active`

**Response (201):**

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "firstName": "Maria",
    "lastName": "Santos",
    "email": "maria.santos@email.com",
    "phone": "+258849876543",
    "role": "buyer",
    "status": "active",
    "emailVerified": false,
    "phoneVerified": false,
    "createdAt": "2024-01-20T18:00:00.000Z",
    "updatedAt": "2024-01-20T18:00:00.000Z"
  }
}
```

**Error Response (409):**

```json
{
  "success": false,
  "message": "User with this email or phone already exists"
}
```

**Error Response (400):**

```json
{
  "success": false,
  "message": "Missing required fields: firstName, lastName, email, phone, password"
}
```

---

### 5. Update User

Update user information.

**Endpoint:** `PUT /api/v1/admin/users/:userId`

**Path Parameters:**
- `userId`: User ID (MongoDB ObjectId)

**Request Body:**

```json
{
  "firstName": "João",
  "lastName": "Silva Updated",
  "email": "joao.updated@email.com",
  "phone": "+258841234567",
  "role": "seller",
  "status": "active",
  "emailVerified": true,
  "phoneVerified": true
}
```

**All fields are optional** - only include fields you want to update.

**Response (200):**

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "João",
    "lastName": "Silva Updated",
    "email": "joao.updated@email.com",
    "phone": "+258841234567",
    "role": "seller",
    "status": "active",
    "updatedAt": "2024-01-20T19:00:00.000Z"
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "message": "User not found"
}
```

**Error Response (409):**

```json
{
  "success": false,
  "message": "Email already in use"
}
```

---

### 6. Update User Status

Update only the user's status.

**Endpoint:** `PATCH /api/v1/admin/users/:userId/status`

**Path Parameters:**
- `userId`: User ID (MongoDB ObjectId)

**Request Body:**

```json
{
  "status": "suspended"
}
```

**Valid Status Values:**
- `active`: User account is active
- `inactive`: User account is inactive
- `suspended`: User account is suspended

**Response (200):**

```json
{
  "success": true,
  "message": "User status updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "status": "suspended",
    "updatedAt": "2024-01-20T19:30:00.000Z"
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "message": "Invalid status. Must be: active, inactive, or suspended"
}
```

---

### 7. Delete User

Delete a user account.

**Endpoint:** `DELETE /api/v1/admin/users/:userId`

**Path Parameters:**
- `userId`: User ID (MongoDB ObjectId)

**Response (200):**

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Error Response (404):**

```json
{
  "success": false,
  "message": "User not found"
}
```

**Error Response (400):**

```json
{
  "success": false,
  "message": "Cannot delete user with existing orders. Consider suspending instead."
}
```

**Note:** Users with existing orders cannot be deleted. Use status update to suspend them instead.

---

## Integration Examples

### React Hook Example

```typescript
import { useState, useEffect } from 'react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  orderCount: number;
  totalSpent: number;
  lastLogin?: string;
}

interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function useUsers(token: string, filters?: {
  search?: string;
  status?: string;
  role?: string;
  page?: number;
  limit?: number;
}) {
  const [data, setData] = useState<UserListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        
        if (filters?.search) params.append('search', filters.search);
        if (filters?.status) params.append('status', filters.status);
        if (filters?.role) params.append('role', filters.role);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.limit) params.append('limit', filters.limit.toString());

        const response = await fetch(
          `/api/v1/admin/users?${params.toString()}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch users');
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
      fetchUsers();
    }
  }, [token, filters]);

  return { data, loading, error };
}

// Usage in component
function UserManagement() {
  const token = localStorage.getItem('authToken');
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    role: '',
    page: 1,
    limit: 10
  });

  const { data, loading, error } = useUsers(token!, filters);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  return (
    <div>
      <input
        type="text"
        placeholder="Search users..."
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
      />
      
      <select
        value={filters.status}
        onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="suspended">Suspended</option>
      </select>

      <select
        value={filters.role}
        onChange={(e) => setFilters({ ...filters, role: e.target.value, page: 1 })}
      >
        <option value="">All Types</option>
        <option value="buyer">Buyer</option>
        <option value="seller">Seller</option>
        <option value="admin">Admin</option>
      </select>

      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Contact</th>
            <th>Type</th>
            <th>Status</th>
            <th>Orders</th>
            <th>Total Spent</th>
            <th>Last Login</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.users.map((user) => (
            <tr key={user.id}>
              <td>{user.firstName} {user.lastName}</td>
              <td>
                <div>{user.email}</div>
                <div>{user.phone}</div>
              </td>
              <td>{user.role}</td>
              <td>{user.status}</td>
              <td>{user.orderCount}</td>
              <td>{user.totalSpent.toFixed(2)} MTn</td>
              <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</td>
              <td>
                <button onClick={() => viewUser(user.id)}>View</button>
                <button onClick={() => editUser(user.id)}>Edit</button>
                <button onClick={() => deleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button
          disabled={filters.page === 1}
          onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
        >
          Previous
        </button>
        <span>Page {data.page} of {data.totalPages}</span>
        <button
          disabled={filters.page >= data.totalPages}
          onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

### Create User Example

```typescript
async function createUser(userData: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role?: string;
  status?: string;
}) {
  try {
    const response = await fetch('/api/v1/admin/users', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('User created:', result.data);
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}
```

### Update User Status Example

```typescript
async function updateUserStatus(userId: string, status: 'active' | 'inactive' | 'suspended') {
  try {
    const response = await fetch(`/api/v1/admin/users/${userId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Status updated:', result.data);
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Error updating status:', error);
    throw error;
  }
}
```

## UI Recommendations

### Status Badges

Use color-coded badges for user status:

- **Active**: Green badge (`#10b981`)
- **Inactive**: Gray badge (`#6b7280`)
- **Suspended**: Red badge (`#ef4444`)

### Role Badges

Use different styles for roles:

- **Buyer/Client**: White badge with border
- **Seller/Vendor**: Green badge
- **Admin**: Blue badge
- **Support**: Purple badge

### Formatting

- **Currency**: Format `totalSpent` as currency (e.g., `450.00 MTn`)
- **Dates**: Format `lastLogin` and `createdAt` in a readable format (e.g., `20/01/2024, 16:25`)
- **Phone**: Display phone numbers in a readable format

## Error Handling

Always handle these error cases:

1. **401 Unauthorized**: Redirect to login
2. **403 Forbidden**: Show access denied message
3. **404 Not Found**: Show "User not found" message
4. **409 Conflict**: Show "Email/phone already exists" message
5. **400 Bad Request**: Show validation error message
6. **500 Server Error**: Show generic error message

## Rate Limiting

The API has rate limiting enabled:
- **Limit**: 1000 requests per 15 minutes per IP
- If rate limited, you'll receive a `429 Too Many Requests` response

## Notes

- All monetary values are in MZM (Mozambican Metical)
- Phone numbers must follow the format: `+258XXXXXXXXX`
- Passwords are automatically hashed before storage
- User deletion is restricted if the user has existing orders
- `lastLogin` is approximated from the last payment date (not a true login timestamp)

