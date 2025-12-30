# Admin Seller: Create, View & Update Guide

## Overview

Concise guide for implementing seller creation, viewing, and updating in the admin panel.

## Endpoints

### Create Seller
**POST** `/api/v1/admin/sellers`

### View Seller
**GET** `/api/v1/admin/sellers/:sellerId`

### Update Seller
**PUT** `/api/v1/admin/sellers/:sellerId`

---

## 1. Create Seller

### Request

```typescript
POST /api/v1/admin/sellers
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "João",
  "lastName": "Silva",
  "email": "joao@fazendaverde.com",
  "phone": "+258841234567",
  "storeName": "Fazenda Verde",
  "storeDescription": "Produtos orgânicos frescos direto da fazenda",
  "address": "Estrada Nacional 1, Km 25",
  "city": "Maputo",
  "province": "Maputo",
  "postalCode": "1100",
  "productTypes": "Frutas e Legumes",
  "businessType": "Frutas e Legumes", // alternative to productTypes
  "experience": "10 anos de experiência",
  "status": "inactive", // Default: inactive (pending approval)
  "password": "SecurePassword123!" // Optional, defaults to temp password
}
```

### Required Fields
- `firstName`: Contact person first name
- `lastName`: Contact person last name
- `email`: Seller email (must be unique)
- `phone`: Phone number
- `storeName` or `businessName`: Business/store name
- `address`: Business address
- `city`: City
- `province`: Province/State
- `postalCode`: Postal code

### Response

```typescript
{
  "success": true,
  "message": "Seller created successfully",
  "data": {
    // Full seller object (same as GET response)
  }
}
```

---

## 2. View Seller

### Request

```typescript
GET /api/v1/admin/sellers/:sellerId
Authorization: Bearer <token>
```

### Response Structure

```typescript
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439014",
    "firstName": "João",
    "lastName": "Silva",
    "email": "joao@fazendaverde.com",
    "phone": "+258841234567",
    "role": "seller",
    "status": "active",
    "company": {
      "name": "Fazenda Verde",
      "description": "Produtos orgânicos frescos direto da fazenda",
      "address": "Estrada Nacional 1, Km 25",
      "city": "Maputo",
      "province": "Maputo",
      "postalCode": "1100",
      "productTypes": "Frutas e Legumes",
      "experience": "10 anos de experiência"
    },
    "contact": {
      "name": "João Silva",
      "firstName": "João",
      "lastName": "Silva",
      "email": "joao@fazendaverde.com",
      "phone": "+258841234567"
    },
    "statistics": {
      "productCount": 15,
      "averageRating": 4.8,
      "totalReviews": 45,
      "totalViews": 1250,
      "totalPurchases": 450,
      "totalOrders": 120,
      "totalSales": 125000.00,
      "totalQuantitySold": 450
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-20T14:20:00.000Z"
  }
}
```

---

## 3. Update Seller

### Request

```typescript
PUT /api/v1/admin/sellers/:sellerId
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "João",
  "lastName": "Silva",
  "email": "joao@fazendaverde.com",
  "phone": "+258841234567",
  "storeName": "Fazenda Verde Premium",
  "storeDescription": "Updated description...",
  "address": "New Address",
  "city": "Maputo",
  "province": "Maputo",
  "postalCode": "1100",
  "productTypes": "Frutas, Legumes e Verduras",
  "status": "active"
  // ... any other fields to update
}
```

**Note:** All fields are optional. Only provided fields will be updated.

### Response

```typescript
{
  "success": true,
  "message": "Seller updated successfully",
  "data": {
    // Full updated seller object
  }
}
```

---

## TypeScript Interfaces

```typescript
interface CreateSellerRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  storeName?: string;
  businessName?: string; // Alternative to storeName
  storeDescription?: string;
  businessDescription?: string; // Alternative to storeDescription
  address: string;
  city: string;
  province: string;
  postalCode: string;
  productTypes?: string;
  businessType?: string; // Alternative to productTypes
  experience?: string;
  status?: 'active' | 'inactive' | 'suspended';
  password?: string;
}

interface SellerDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'seller';
  status: 'active' | 'inactive' | 'suspended';
  company: {
    name: string;
    description?: string;
    address?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    productTypes?: string;
    experience?: string;
  };
  contact: {
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  statistics: {
    productCount: number;
    averageRating: number;
    totalReviews: number;
    totalViews: number;
    totalPurchases: number;
    totalOrders: number;
    totalSales: number;
    totalQuantitySold: number;
  };
  createdAt: string;
  updatedAt: string;
}
```

---

## React Component Examples

### Create Seller Form

```typescript
import { useState } from 'react';

const CreateSellerForm = () => {
  const [formData, setFormData] = useState<CreateSellerRequest>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    storeName: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    status: 'inactive'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/v1/admin/sellers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        // Redirect to seller details
        window.location.href = `/admin/sellers/${data.data.id}`;
      }
    } catch (error) {
      console.error('Failed to create seller:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
```

### View Seller Component

```typescript
import { useEffect, useState } from 'react';

const SellerDetails = ({ sellerId }: { sellerId: string }) => {
  const [seller, setSeller] = useState<SellerDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const response = await fetch(
          `/api/v1/admin/sellers/${sellerId}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        const data = await response.json();
        if (data.success) {
          setSeller(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch seller:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeller();
  }, [sellerId]);

  if (loading) return <div>Loading...</div>;
  if (!seller) return <div>Seller not found</div>;

  return (
    <div>
      <h1>{seller.company.name}</h1>
      <p>Status: {seller.status}</p>
      <p>Contact: {seller.contact.name}</p>
      <p>Email: {seller.contact.email}</p>
      <p>Total Sales: {seller.statistics.totalSales} MTn</p>
      {/* Display other seller details */}
    </div>
  );
};
```

### Update Seller Form

```typescript
const UpdateSellerForm = ({ sellerId }: { sellerId: string }) => {
  const [formData, setFormData] = useState<Partial<CreateSellerRequest>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `/api/v1/admin/sellers/${sellerId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();
      if (data.success) {
        // Show success message or refresh
      }
    } catch (error) {
      console.error('Failed to update seller:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields with current seller values */}
    </form>
  );
};
```

---

## Status Labels (Portuguese)

| Status | Label | Color |
|--------|-------|-------|
| `active` | Aprovado | Green |
| `inactive` | Pendente | Yellow |
| `suspended` | Rejeitado | Red |

---

## Key UI Elements

### Seller Details Page
- **Status Badge**: Color-coded status indicator
- **Company Information**: Store name, description, address, NUIT (if available)
- **Contact Information**: Name, email, phone
- **Statistics Cards**: Rating, reviews, sales, products, orders
- **Products List**: Seller's products with stock and ratings
- **Timeline**: Registration date, approval date, last update

### Create/Edit Form
- **Personal Information**: First name, last name, email, phone
- **Business Information**: Store name, description, business type
- **Address**: Street, city, province, postal code
- **Settings**: Status dropdown, commission rate (if applicable)
- **Summary Sidebar**: Real-time preview of seller details

---

## Error Handling

```typescript
{
  "success": false,
  "message": "Error description"
}
```

**Common Errors:**
- `400`: Email already exists (on create)
- `404`: Seller not found
- `500`: Server error

---

## Notes

- Default status for new sellers is `inactive` (Pendente - pending approval)
- Email must be unique across all users
- Password is optional on create (defaults to temporary password)
- Statistics are calculated in real-time from products, orders, and reviews
- Commission rate is not stored in User model (may be calculated separately)
- NUIT (tax ID) is not currently in the schema but can be added to sellerProfile if needed

