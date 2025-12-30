# Admin Product: Create, View & Update Guide

## Overview

Concise guide for implementing product creation, viewing, and updating in the admin panel.

## Endpoints

### Create Product
**POST** `/api/v1/admin/products`

### View Product
**GET** `/api/v1/admin/products/:productId`

### Update Product
**PUT** `/api/v1/admin/products/:productId`

---

## 1. Create Product

### Request

```typescript
POST /api/v1/admin/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Maçãs Orgânicas",
  "description": "Maçãs orgânicas frescas e saborosas...",
  "shortDescription": "Maçãs orgânicas frescas",
  "sellerId": "507f1f77bcf86cd799439014",
  "categoryId": "507f1f77bcf86cd799439012",
  "subcategoryId": "507f1f77bcf86cd799439013", // optional
  "price": 150.00,
  "originalPrice": 180.00, // optional
  "discountPercentage": 16.67, // optional
  "stock": 50,
  "sku": "PROD-APPLE-001", // optional
  "barcode": "1234567890123", // optional
  "status": "draft", // default: "draft"
  "isFeatured": false, // optional
  "isBestSeller": false, // optional
  "primaryImage": "https://example.com/image.jpg", // or base64
  "images": [ // optional
    {
      "url": "https://example.com/image1.jpg",
      "alt": "Product image",
      "isPrimary": true,
      "order": 0
    }
  ],
  "tags": ["orgânico", "fresco", "saudável"], // optional
  "labels": ["organic", "local"], // optional
  "specifications": [ // optional
    {
      "name": "Peso",
      "value": "1kg"
    }
  ],
  "weight": 1.0, // optional
  "shippingClass": "standard", // optional: light, standard, heavy, fragile
  "returnPolicy": "30 dias para devolução", // optional
  "warranty": "Garantia de qualidade", // optional
  "metaTitle": "Maçãs Orgânicas - Txova", // optional
  "metaDescription": "Descrição para SEO", // optional
  "keywords": ["maçã", "orgânico", "fruta"] // optional
}
```

### Required Fields
- `name`: Product name
- `description`: Full description
- `sellerId`: Seller user ID
- `categoryId`: Category ID
- `price`: Product price
- `stock`: Stock quantity
- `primaryImage`: Primary image URL or base64

### Response

```typescript
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    // Full product object (same as GET response)
  }
}
```

---

## 2. View Product

### Request

```typescript
GET /api/v1/admin/products/:productId
Authorization: Bearer <token>
```

### Response Structure

```typescript
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Maçãs Orgânicas",
    "description": "Maçãs orgânicas frescas...",
    "shortDescription": "Maçãs orgânicas frescas",
    "primaryImage": "https://example.com/apple.jpg",
    "images": [
      {
        "url": "https://example.com/apple.jpg",
        "alt": "Maçãs Orgânicas",
        "isPrimary": true,
        "order": 0
      }
    ],
    "price": 150.00,
    "originalPrice": 180.00,
    "discountPercentage": 16.67,
    "discountedPrice": 125.00,
    "stock": 50,
    "sku": "PROD-APPLE-001",
    "barcode": "1234567890123",
    "status": "active",
    "isFeatured": true,
    "isBestSeller": false,
    "isNewArrival": true,
    "inStock": true,
    
    // Seller Information
    "seller": {
      "id": "507f1f77bcf86cd799439014",
      "name": "Fazenda Verde",
      "email": "joao@fazendaverde.com",
      "phone": "+258841234567",
      "storeName": "Fazenda Verde"
    },
    
    // Category Information
    "category": {
      "id": "507f1f77bcf86cd799439012",
      "name": "Frutas",
      "slug": "frutas",
      "description": "Frutas frescas e orgânicas"
    },
    "subcategory": {
      "id": "507f1f77bcf86cd799439013",
      "name": "Frutas Frescas",
      "slug": "frutas-frescas"
    },
    
    // Statistics
    "statistics": {
      "totalReviews": 25,
      "averageRating": 4.8,
      "ratingDistribution": [
        { "rating": 5, "count": 15 },
        { "rating": 4, "count": 8 },
        { "rating": 3, "count": 2 },
        { "rating": 2, "count": 0 },
        { "rating": 1, "count": 0 }
      ],
      "totalOrders": 120,
      "totalQuantitySold": 450,
      "totalRevenue": 6750.00,
      "viewCount": 1250,
      "purchaseCount": 450
    },
    
    // Additional Fields
    "variants": [],
    "specifications": [
      { "name": "Peso", "value": "1kg" }
    ],
    "tags": ["orgânico", "fresco", "saudável"],
    "labels": ["organic", "local"],
    "weight": 1.0,
    "dimensions": {
      "length": 10,
      "width": 10,
      "height": 10
    },
    "shippingClass": "standard",
    "returnPolicy": "30 dias para devolução",
    "warranty": "Garantia de qualidade",
    "metaTitle": "Maçãs Orgânicas - Txova",
    "metaDescription": "Descrição para SEO",
    "keywords": ["maçã", "orgânico"],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-20T14:20:00.000Z"
  }
}
```

---

## 3. Update Product

### Request

```typescript
PUT /api/v1/admin/products/:productId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Maçãs Orgânicas Premium",
  "description": "Updated description...",
  "price": 180.00,
  "stock": 75,
  "status": "active",
  "isFeatured": true,
  "discountPercentage": 10,
  "tags": ["orgânico", "fresco", "premium"]
  // ... any other fields to update
}
```

**Note:** All fields are optional. Only provided fields will be updated.

### Response

```typescript
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    // Full updated product object
  }
}
```

---

## TypeScript Interfaces

```typescript
interface Seller {
  id: string;
  name: string;
  email: string;
  storeName: string | null;
  fullName: string;
}

interface CreateProductRequest {
  name: string;
  description: string;
  shortDescription?: string;
  sellerId: string;
  categoryId: string;
  subcategoryId?: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  stock: number;
  sku?: string;
  barcode?: string;
  status?: 'draft' | 'active' | 'inactive' | 'archived';
  isFeatured?: boolean;
  isBestSeller?: boolean;
  primaryImage: string; // URL or base64
  images?: ProductImage[];
  tags?: string[];
  labels?: string[];
  specifications?: ProductSpecification[];
  weight?: number;
  shippingClass?: 'light' | 'standard' | 'heavy' | 'fragile';
  returnPolicy?: string;
  warranty?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

interface ProductImage {
  url: string;
  alt?: string;
  isPrimary?: boolean;
  order?: number;
}

interface ProductSpecification {
  name: string;
  value: string;
}

interface ProductDetails {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  primaryImage: string;
  images: ProductImage[];
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  discountedPrice: number;
  stock: number;
  sku?: string;
  barcode?: string;
  status: 'draft' | 'active' | 'inactive' | 'archived';
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  inStock: boolean;
  seller: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    storeName?: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
    description?: string;
  };
  subcategory?: {
    id: string;
    name: string;
    slug: string;
  };
  statistics: {
    totalReviews: number;
    averageRating: number;
    ratingDistribution: Array<{ rating: number; count: number }>;
    totalOrders: number;
    totalQuantitySold: number;
    totalRevenue: number;
    viewCount: number;
    purchaseCount: number;
  };
  variants: any[];
  specifications: ProductSpecification[];
  tags: string[];
  labels: string[];
  createdAt: string;
  updatedAt: string;
}
```

---

## React Component Examples

### Create Product Form

```typescript
import { useState } from 'react';

const CreateProductForm = () => {
  const [formData, setFormData] = useState<CreateProductRequest>({
    name: '',
    description: '',
    sellerId: '',
    categoryId: '',
    price: 0,
    stock: 0,
    primaryImage: '',
    status: 'draft'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/v1/admin/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        // Redirect to product details
        window.location.href = `/admin/products/${data.data.id}`;
      }
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
```

### View Product Component

```typescript
import { useEffect, useState } from 'react';

const ProductDetails = ({ productId }: { productId: string }) => {
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `/api/v1/admin/products/${productId}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        const data = await response.json();
        if (data.success) {
          setProduct(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>Status: {product.status}</p>
      <p>Price: {product.price} MTn</p>
      <p>Stock: {product.stock} unidades</p>
      {/* Display other product details */}
    </div>
  );
};
```

### Update Product Form

```typescript
const UpdateProductForm = ({ productId }: { productId: string }) => {
  const [formData, setFormData] = useState<Partial<CreateProductRequest>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `/api/v1/admin/products/${productId}`,
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
      console.error('Failed to update product:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields with current product values */}
    </form>
  );
};
```

---

## Status Labels (Portuguese)

| Status | Label | Color |
|--------|-------|-------|
| `draft` | Pendente | Yellow |
| `active` | Ativo | Green |
| `inactive` | Inativo | Gray |
| `archived` | Rejeitado | Red |

---

## Key UI Elements

### Product Details Page
- **Status Badge**: Color-coded status indicator
- **Product Images**: Gallery with primary image highlighted
- **Seller Info**: Name, email, phone, "View Seller" button
- **Statistics Cards**: Rating, reviews, orders, revenue
- **Timeline**: Created date, approved date, last update
- **Reviews Section**: List of customer reviews with ratings

### Create/Edit Form
- **Basic Information**: Name, description, price, stock
- **Category & Seller**: Dropdowns for selection
- **Status**: Dropdown (default: "Pendente" for new products)
- **Tags**: Input field with add/remove functionality
- **Images**: Drag-and-drop upload area
- **Summary Sidebar**: Real-time preview of product details

---

## Error Handling

```typescript
{
  "success": false,
  "message": "Error description"
}
```

**Common Errors:**
- `404`: Product not found
- `400`: Invalid request data
- `500`: Server error

---

## Notes

- **Sellers List**: Use `GET /api/v1/admin/users/sellers` to get the list of sellers for the dropdown (see Admin User Management API)
- Images can be provided as URLs or base64 strings (will be uploaded to Cloudinary)
- Default status for new products is `draft` (Pendente)
- All prices in MZM (Mozambican Metical)
- Statistics are calculated in real-time from orders and reviews
- Product deletion is soft delete (status set to `archived`)

